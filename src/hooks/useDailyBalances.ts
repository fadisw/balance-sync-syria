
import { useEffect } from 'react';
import { useBalances } from '../contexts/BalancesContext';
import { toast } from '@/hooks/use-toast';
import { Employee, EmployeeTransaction } from '@/contexts/BalancesContext';

export const useDailyBalances = () => {
  const {
    openingBalance,
    salesEntries,
    remainingBalances,
    salesByType,
    employees,
    transactions,
    setOpeningBalance,
    updateSalesEntry,
    calculateTotals,
    saveData,
    loadData,
    setEmployees,
    setTransactions
  } = useBalances();

  // Load data when the hook is first used
  useEffect(() => {
    loadData();
  }, []);

  // Save data whenever important state changes
  useEffect(() => {
    saveData();
  }, [openingBalance, salesEntries, remainingBalances, employees, transactions]);

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

  const addNewEmployee = (name: string) => {
    try {
      const newId = `${Date.now()}`;
      const newEmployee: Employee = { id: newId, name };
      
      setEmployees([...employees, newEmployee]);
      
      // Initialize sales entry for the new employee
      updateSalesEntry(newId, 'syriaTel', 0);
      updateSalesEntry(newId, 'mtn', 0);
      updateSalesEntry(newId, 'cash', 0);
      
      toast({
        title: "تم إضافة الموظف",
        description: `تم إضافة الموظف ${name} بنجاح`,
      });
      
      return newId;
    } catch (error) {
      console.error("Error adding employee:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة الموظف",
        variant: "destructive",
      });
      return null;
    }
  };

  const addNewTransaction = (
    employeeId: string,
    type: 'syriaTel' | 'mtn' | 'cash',
    amount: number,
    description: string
  ) => {
    try {
      const newTransaction: EmployeeTransaction = {
        id: `${Date.now()}`,
        employeeId,
        type,
        amount,
        date: new Date().toISOString().split('T')[0],
        description
      };
      
      setTransactions([newTransaction, ...transactions]);
      
      // Update the sales entry as well
      handleSalesEntryChange(employeeId, type, amount);
      
      toast({
        title: "تم إضافة المعاملة",
        description: `تم تسجيل معاملة جديدة بنجاح`,
      });
      
      return true;
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة المعاملة",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    openingBalance,
    salesEntries,
    remainingBalances,
    salesByType,
    employees,
    transactions,
    setOpeningBalance,
    handleSalesEntryChange,
    setNextDayOpeningBalance,
    saveData,
    loadData,
    addNewEmployee,
    addNewTransaction
  };
};
