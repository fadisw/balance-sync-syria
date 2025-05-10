
import React, { useState } from 'react';
import OpeningBalanceSection from '@/components/OpeningBalanceSection';
import SalesEntryTable from '@/components/SalesEntryTable';
import DailySummary from '@/components/DailySummary';
import DistributorAccountDetails from '@/components/DistributorAccountDetails';
import { BalancesProvider, useBalances } from '@/contexts/BalancesContext';
import { useDailyBalances } from '@/hooks/useDailyBalances';
import { useToast } from '@/hooks/use-toast';

const DailyBalancesContent = () => {
  const {
    employees,
    openingBalance,
    salesEntries,
    remainingBalances,
    salesByType,
    transactions,
    setOpeningBalance,
    calculateTotals,
    saveData
  } = useBalances();
  
  const {
    handleSalesEntryChange,
    setNextDayOpeningBalance
  } = useDailyBalances();
  
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
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
      
      <DistributorAccountDetails 
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        employeeId={selectedEmployeeId}
        employees={employees}
        transactions={transactions}
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
