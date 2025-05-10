
import React, { useState } from 'react';
import OpeningBalanceSection from '@/components/OpeningBalanceSection';
import SalesEntryTable from '@/components/SalesEntryTable';
import DailySummary from '@/components/DailySummary';
import DistributorAccountDetails from '@/components/DistributorAccountDetails';
import TransactionsHistoryTable from '@/components/TransactionsHistoryTable';
import AddEmployeeDialog from '@/components/AddEmployeeDialog';
import AddTransactionDialog from '@/components/AddTransactionDialog';
import { BalancesProvider, useBalances } from '@/contexts/BalancesContext';
import { useDailyBalances } from '@/hooks/useDailyBalances';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const DailyBalancesContent = () => {
  const {
    employees,
    openingBalance,
    salesEntries,
    remainingBalances,
    salesByType,
    transactions,
  } = useBalances();
  
  const {
    handleSalesEntryChange,
    setNextDayOpeningBalance,
    setOpeningBalance,
    saveData,
    addNewEmployee,
    addNewTransaction
  } = useDailyBalances();
  
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const { toast } = useToast();
  
  const handleOpeningBalanceChange = (newBalance: typeof openingBalance) => {
    setOpeningBalance(newBalance);
  };
  
  const handleSaveOpeningBalance = () => {
    saveData();
    toast({
      title: "تم الحفظ",
      description: "تم حفظ رصيد الافتتاح بنجاح",
    });
  };
  
  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setIsDetailsOpen(true);
  };
  
  const handleSetNextDayBalance = () => {
    setNextDayOpeningBalance();
    toast({
      title: "تم تعيين الرصيد",
      description: "تم تعيين الأرصدة المتبقية كرصيد افتتاحي لليوم التالي",
    });
  };
  
  const handleAddEmployee = (name: string) => {
    addNewEmployee(name);
  };
  
  const handleAddTransaction = (
    employeeId: string,
    type: 'syriaTel' | 'mtn' | 'cash',
    amount: number,
    description: string
  ) => {
    addNewTransaction(employeeId, type, amount, description);
  };

  return (
    <div className="container py-6 mx-auto" dir="rtl">
      <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
        إدارة أرصدة الموزعين اليومية
      </h1>
      
      <OpeningBalanceSection 
        openingBalance={openingBalance}
        onChange={handleOpeningBalanceChange}
        onSave={handleSaveOpeningBalance}
      />
      
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsAddEmployeeOpen(true)} variant="outline" className="bg-white">
          <Plus className="w-4 h-4 ml-1" /> إضافة موظف جديد
        </Button>
      </div>
      
      <SalesEntryTable 
        employees={employees}
        salesEntries={salesEntries}
        onSalesChange={handleSalesEntryChange}
        onEmployeeSelect={handleEmployeeSelect}
      />
      
      <DailySummary 
        openingBalance={openingBalance}
        salesByType={salesByType}
        remainingBalances={remainingBalances}
        onSetNextDayBalance={handleSetNextDayBalance}
      />
      
      <TransactionsHistoryTable 
        transactions={transactions}
        employees={employees}
        onAddTransaction={() => setIsAddTransactionOpen(true)}
      />
      
      <DistributorAccountDetails 
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        employeeId={selectedEmployeeId}
        employees={employees}
        transactions={transactions}
      />
      
      <AddEmployeeDialog
        open={isAddEmployeeOpen}
        onOpenChange={setIsAddEmployeeOpen}
        onAddEmployee={handleAddEmployee}
      />
      
      <AddTransactionDialog
        open={isAddTransactionOpen}
        onOpenChange={setIsAddTransactionOpen}
        employees={employees}
        onAddTransaction={handleAddTransaction}
      />
    </div>
  );
};

const DailyBalancesPage = () => {
  return (
    <BalancesProvider>
      <DailyBalancesContent />
    </BalancesProvider>
  );
};

export default DailyBalancesPage;
