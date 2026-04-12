import { useMemo } from 'react';
import { ReservationDetail, OperatingHoursDetail } from '@/types';
import { formatApiDate, getEnumDayOfWeek } from '@/lib/date';

export function useGridData(operatingHours: OperatingHoursDetail[], reservations: ReservationDetail[]) {
    const { minHour, maxHour, HOURS } = useMemo(() => {
        if (!operatingHours || operatingHours.length === 0) {
            const defaultMin = 9, defaultMax = 21;
            return {
                minHour: defaultMin,
                maxHour: defaultMax,
                HOURS: Array.from({ length: defaultMax - defaultMin + 1 }, (_, i) => `${String(defaultMin + i).padStart(2, '0')}:00`)
            };
        }

        let min = 24, max = 0;
        operatingHours.forEach(oh => {
            const openH = parseInt(oh.openTime.split(':')[0]);
            const [closeH, closeM] = oh.closeTime.split(':').map(Number);
            if (openH < min) min = openH;
            const lastSelectableHour = closeM > 0 ? closeH : closeH - 1;
            if (lastSelectableHour > max) max = lastSelectableHour;
        });

        if (min > max) { min = 9; max = 21; }

        return {
            minHour: min,
            maxHour: max,
            HOURS: Array.from({ length: max - min + 1 }, (_, i) => `${String(min + i).padStart(2, '0')}:00`)
        };
    }, [operatingHours]);

    const reservedSlotsSet = useMemo(() => {
        const set = new Set<string>();
        reservations.forEach(res => {
            const start = new Date(res.startTime);
            const end = new Date(res.endTime);
            const dateStr = formatApiDate(start);

            let currentH = start.getHours();
            const endH = end.getMinutes() > 0 ? end.getHours() : end.getHours() - 1;

            for (let h = currentH; h <= endH; h++) {
                set.add(`${dateStr}-${String(h).padStart(2, '0')}:00`);
            }
        });
        return set;
    }, [reservations]);

    const isSlotReserved = (day: Date, hour: string) => {
        const dateStr = formatApiDate(day);
        return reservedSlotsSet.has(`${dateStr}-${hour}`);
    };

    const getSlotStatus = (day: Date, hourStr: string) => {
        const dayEnum = getEnumDayOfWeek(day);
        const oh = operatingHours.find(h => h.dayOfWeek === dayEnum);
        if (!oh) return { isOpen: false, closedStartMin: 60, closedEndMin: 0 };

        const currentH = parseInt(hourStr.split(':')[0]);
        const [openH, openM] = oh.openTime.split(':').map(Number);
        const [closeH, closeM] = oh.closeTime.split(':').map(Number);

        let closedStartMin = 0;
        let closedEndMin = 0;

        if (currentH < openH) {
            closedStartMin = 60;
        } else if (currentH === openH) {
            closedStartMin = openM;
        }

        if (currentH > closeH || (currentH === closeH && closeM === 0)) {
            closedEndMin = 60;
        } else if (currentH === closeH) {
            closedEndMin = 60 - closeM;
        }

        const isFullyClosed = closedStartMin >= 60 || closedEndMin >= 60;

        return {
            isOpen: !isFullyClosed,
            closedStartMin: Math.min(60, closedStartMin),
            closedEndMin: Math.min(60, closedEndMin)
        };
    };

    const isOperatingHour = (day: Date, hour: string) => {
        return getSlotStatus(day, hour).isOpen;
    };

    return { minHour, maxHour, HOURS, isSlotReserved, isOperatingHour, getSlotStatus };
}