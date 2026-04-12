'use client';

import { ManagementUnitDetail } from '@/types/managementUnit';
import { createContext, useContext, ReactNode } from 'react';

const ManagementUnitContext = createContext<ManagementUnitDetail | null>(null);

export function ManagementUnitProvider({
  children,
  initialData
}: {
  children: ReactNode;
  initialData: ManagementUnitDetail | null;
}) {
  return (
    <ManagementUnitContext.Provider value={initialData}>
      {children}
    </ManagementUnitContext.Provider>
  );
}

export function useManagementUnit() {
  const context = useContext(ManagementUnitContext);
  return context;
}
