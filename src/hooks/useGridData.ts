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

    const isOperatingHour = (day: Date, hour: string) => {
        const dayEnum = getEnumDayOfWeek(day);
        const oh = operatingHours.find(h => h.dayOfWeek === dayEnum);
        if (!oh) return false;

        const currentH = parseInt(hour.split(':')[0]);
        const openH = parseInt(oh.openTime.split(':')[0]);
        const [closeH, closeM] = oh.closeTime.split(':').map(Number);

        return currentH >= openH && (closeM > 0 ? currentH <= closeH : currentH < closeH);
    };

    return { minHour, maxHour, HOURS, isSlotReserved, isOperatingHour };
}