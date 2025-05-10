
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Employee {
  id: string;
  name: string;
}

export interface SalesEntry {
  employeeId: string;
  syriaTel: number;
  mtn: number;
  cash: number;
}

export interface OpeningBalance {
  syriaTel: number;
  mtn: number;
}

export interface SalesByType {
  syriaTel: number;
  mtn: number;
  cash: number;
}

export interface RemainingBalance {
  syriaTel: number;
  mtn: number;
}

export interface EmployeeTransaction {
  id: string;
  employeeId: string;
  type: 'syriaTel' | 'mtn' | 'cash';
  amount: number;
  date: string;
  description: string;
}

interface BalancesContextType {
  employees: Employee[];
  openingBalance: OpeningBalance;
  salesEntries: SalesEntry[];
  remainingBalances: RemainingBalance;
  salesByType: SalesByType;
  transactions: EmployeeTransaction[];
  setOpeningBalance: (balance: OpeningBalance) => void;
  updateSalesEntry: (employeeId: string, field: keyof SalesEntry, value: number) => void;
  calculateTotals: () => void;
  saveData: () => void;
  loadData: () => void;
}

const DEFAULT_EMPLOYEES: Employee[] = [
  { id: '1', name: 'أحمد عبد الله' },
  { id: '2', name: 'سارة خالد' },
  { id: '3', name: 'محمد علي' },
  { id: '4', name: 'ليلى عمر' },
];

const DEFAULT_TRANSACTIONS: EmployeeTransaction[] = [
  { id: '1', employeeId: '1', type: 'syriaTel', amount: 5000, date: '2023-05-01', description: 'طلب رصيد سيرياتيل' },
  { id: '2', employeeId: '1', type: 'mtn', amount: 3000, date: '2023-05-01', description: 'طلب رصيد ام تي ان' },
  { id: '3', employeeId: '1', type: 'cash', amount: 8000, date: '2023-05-01', description: 'دفعة نقدية' },
  { id: '4', employeeId: '2', type: 'syriaTel', amount: 4000, date: '2023-05-02', description: 'طلب رصيد سيرياتيل' },
  { id: '5', employeeId: '3', type: 'mtn', amount: 6000, date: '2023-05-02', description: 'طلب رصيد ام تي ان' },
];

const BalancesContext = createContext<BalancesContextType | undefined>(undefined);

export const BalancesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(DEFAULT_EMPLOYEES);
  const [openingBalance, setOpeningBalance] = useState<OpeningBalance>({ syriaTel: 100000, mtn: 100000 });
  const [salesEntries, setSalesEntries] = useState<SalesEntry[]>([]);
  const [remainingBalances, setRemainingBalances] = useState<RemainingBalance>({ syriaTel: 0, mtn: 0 });
  const [salesByType, setSalesByType] = useState<SalesByType>({ syriaTel: 0, mtn: 0, cash: 0 });
  const [transactions, setTransactions] = useState<EmployeeTransaction[]>(DEFAULT_TRANSACTIONS);

  // Initialize sales entries for each employee
  useEffect(() => {
    if (employees.length > 0 && salesEntries.length === 0) {
      const initialEntries = employees.map(emp => ({
        employeeId: emp.id,
        syriaTel: 0,
        mtn: 0,
        cash: 0
      }));
      setSalesEntries(initialEntries);
    }
  }, [employees, salesEntries.length]);

  // Calculate totals and remaining balances whenever sales entries or opening balance changes
  useEffect(() => {
    calculateTotals();
  }, [salesEntries, openingBalance]);

  const calculateTotals = () => {
    const totals = salesEntries.reduce(
      (acc, entry) => {
        return {
          syriaTel: acc.syriaTel + (entry.syriaTel || 0),
          mtn: acc.mtn + (entry.mtn || 0),
          cash: acc.cash + (entry.cash || 0)
        };
      },
      { syriaTel: 0, mtn: 0, cash: 0 }
    );

    setSalesByType(totals);
    
    setRemainingBalances({
      syriaTel: openingBalance.syriaTel - totals.syriaTel,
      mtn: openingBalance.mtn - totals.mtn
    });
  };

  const updateSalesEntry = (employeeId: string, field: keyof SalesEntry, value: number) => {
    setSalesEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.employeeId === employeeId
          ? { ...entry, [field]: value }
          : entry
      )
    );
  };

  const saveData = () => {
    try {
      const dataToSave = {
        openingBalance,
        salesEntries,
        remainingBalances,
        transactions
      };
      localStorage.setItem('dailyBalancesData', JSON.stringify(dataToSave));
      console.log('Data saved successfully');
    } catch (error) {
      console.error('Error saving data', error);
    }
  };

  const loadData = () => {
    try {
      const savedData = localStorage.getItem('dailyBalancesData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setOpeningBalance(parsedData.openingBalance);
        setSalesEntries(parsedData.salesEntries);
        setRemainingBalances(parsedData.remainingBalances);
        setTransactions(parsedData.transactions);
        console.log('Data loaded successfully');
      }
    } catch (error) {
      console.error('Error loading data', error);
    }
  };

  return (
    <BalancesContext.Provider
      value={{
        employees,
        openingBalance,
        salesEntries,
        remainingBalances,
        salesByType,
        transactions,
        setOpeningBalance,
        updateSalesEntry,
        calculateTotals,
        saveData,
        loadData
      }}
    >
      {children}
    </BalancesContext.Provider>
  );
};

export const useBalances = (): BalancesContextType => {
  const context = useContext(BalancesContext);
  if (context === undefined) {
    throw new Error('useBalances must be used within a BalancesProvider');
  }
  return context;
};
