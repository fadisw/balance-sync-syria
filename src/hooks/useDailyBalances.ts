
import { useEffect } from 'react';
import { useBalances } from '../contexts/BalancesContext';

export const useDailyBalances = () => {
  const {
    openingBalance,
    salesEntries,
    remainingBalances,
    salesByType,
    setOpeningBalance,
    updateSalesEntry,
    calculateTotals,
    saveData,
    loadData,
  } = useBalances();

  // Load data when the hook is first used
  useEffect(() => {
    loadData();
  }, []);

  // Save data whenever important state changes
  useEffect(() => {
    saveData();
  }, [openingBalance, salesEntries, remainingBalances]);

  const setNextDayOpeningBalance = () => {
    // The remaining balances become the next day's opening balances
    setOpeningBalance({
      syriaTel: remainingBalances.syriaTel,
      mtn: remainingBalances.mtn
    });
  };

  const validateSalesEntry = (employeeId: string, type: 'syriaTel' | 'mtn', value: number) => {
    // Calculate the current total for this type excluding the current employee
    const currentEmployeeValue = salesEntries.find(entry => entry.employeeId === employeeId)?.[type] || 0;
    
    const totalForType = salesByType[type] - currentEmployeeValue;
    
    // Check if adding this value would exceed the opening balance
    return totalForType + value <= openingBalance[type];
  };

  const handleSalesEntryChange = (
    employeeId: string, 
    field: 'syriaTel' | 'mtn' | 'cash', 
    value: number
  ) => {
    // For syriaTel and mtn, validate that we don't exceed opening balance
    if ((field === 'syriaTel' || field === 'mtn') && !validateSalesEntry(employeeId, field, value)) {
      console.error(`المبيعات تتجاوز الرصيد المتاح في ${field === 'syriaTel' ? 'سيرياتيل' : 'ام تي ان'}`);
      return false;
    }
    
    updateSalesEntry(employeeId, field, value);
    return true;
  };

  return {
    openingBalance,
    salesEntries,
    remainingBalances,
    salesByType,
    setOpeningBalance,
    handleSalesEntryChange,
    setNextDayOpeningBalance,
    saveData,
    loadData
  };
};
