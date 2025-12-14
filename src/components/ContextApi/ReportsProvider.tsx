import {
  RecentTransactionsList,
  TimeIntervalType,
  TopCustomersList,
  TopSellingProductList,
} from "@/core/private/Reports/ReportsTypes";
import React, { createContext, useContext, useState } from "react";

interface ReportContextType {
  globalBranchId: number | null;
  setGlobalBranchId: React.Dispatch<React.SetStateAction<any>>;
  globalTimeInterval: string | undefined;
  setGlobalTimeInterval: React.Dispatch<React.SetStateAction<any>>;
  topSellingProductData: TopSellingProductList[];
  setTopSellingProductData: React.Dispatch<React.SetStateAction<any>>;
  topCustomersData: TopCustomersList[];
  setTopCustomersData: React.Dispatch<React.SetStateAction<any>>;
  recentTransaction: RecentTransactionsList[];
  setRecentTransaction: React.Dispatch<React.SetStateAction<any>>;
}

const ReportContext = createContext<ReportContextType | null>(null);

export const ReportsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [globalBranchId, setGlobalBranchId] = useState<number | null>(null);
  const [globalTimeInterval, setGlobalTimeInterval] = useState<
    string | undefined
  >(TimeIntervalType.Daily);
  const [topSellingProductData, setTopSellingProductData] = useState<
    TopSellingProductList[]
  >([]);
  const [topCustomersData, setTopCustomersData] = useState<TopCustomersList[]>(
    []
  );
  const [recentTransaction, setRecentTransaction] = useState<
    RecentTransactionsList[]
  >([]);

  return (
    <ReportContext.Provider
      value={{
        globalBranchId,
        setGlobalBranchId,
        globalTimeInterval,
        setGlobalTimeInterval,
        topSellingProductData,
        setTopSellingProductData,
        topCustomersData,
        setTopCustomersData,
        recentTransaction,
        setRecentTransaction,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReportsContext = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReportsContext must be used within a ReportsProvider");
  }
  return context;
};
