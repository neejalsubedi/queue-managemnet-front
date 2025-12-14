import React, { createContext, useContext, useState } from "react";

interface DashboardContextType {
  lowStock: number | null;
  setLowStock: React.Dispatch<React.SetStateAction<number | null>>;
  outOfStock: number | null;
  setOutOfStock: React.Dispatch<React.SetStateAction<number | null>>;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const DashboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [lowStock, setLowStock] = useState<number | null>(null);
  const [outOfStock, setOutOfStock] = useState<number | null>(null);

  return (
    <DashboardContext.Provider
      value={{
        lowStock,
        setLowStock,
        outOfStock,
        setOutOfStock,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error(
      "useDashboardContext must be used within a DashboardProvider"
    );
  }
  return context;
};
