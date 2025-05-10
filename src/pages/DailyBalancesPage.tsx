
import React, { useState } from 'react';
import OpeningBalanceSection from '@/components/OpeningBalanceSection';
import DailySummary from '@/components/DailySummary';
import DistributorAccountDetails from '@/components/DistributorAccountDetails';
import TransactionsHistoryTable from '@/components/TransactionsHistoryTable';
import AddEmployeeDialog from '@/components/AddEmployeeDialog';
import AddTransactionDialog from '@/components/AddTransactionDialog';
import TransactionsFilter from '@/components/TransactionsFilter';
import { BalancesProvider, useBalances } from '@/contexts/BalancesContext';
import { useDailyBalances } from '@/hooks/useDailyBalances';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Plus, FileText, ChevronDown } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEmployeeFilter, setSelectedEmployeeFilter] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<('syriaTel' | 'mtn' | 'cash')[]>([]);
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

  const filteredTransactions = transactions.filter(transaction => {
    // تطبيق فلتر الموظف إذا تم تحديده
    if (selectedEmployeeFilter && transaction.employeeId !== selectedEmployeeFilter) {
      return false;
    }
    
    // تطبيق فلتر التاريخ إذا تم تحديده
    if (selectedDate) {
      const transactionDate = new Date(transaction.date);
      const filterDate = new Date(selectedDate);
      
      if (
        transactionDate.getDate() !== filterDate.getDate() ||
        transactionDate.getMonth() !== filterDate.getMonth() ||
        transactionDate.getFullYear() !== filterDate.getFullYear()
      ) {
        return false;
      }
    }
    
    // تطبيق فلتر الأنواع إذا تم تحديد أنواع
    if (selectedTypes.length > 0 && !selectedTypes.includes(transaction.type)) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="container py-6 mx-auto" dir="rtl">
      <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
        إدارة أرصدة الموزعين اليومية
      </h1>
      
      <Tabs defaultValue="balances" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="balances" className="text-base py-3">
            <FileText className="w-5 h-5 ml-2" /> الرصيد والملخص اليومي
          </TabsTrigger>
          <TabsTrigger value="transactions" className="text-base py-3">
            <ChevronDown className="w-5 h-5 ml-2" /> سجل المعاملات
          </TabsTrigger>
        </TabsList>
        
        {/* تبويب الأرصدة والملخص */}
        <TabsContent value="balances" className="space-y-6">
          <OpeningBalanceSection 
            openingBalance={openingBalance}
            onChange={handleOpeningBalanceChange}
            onSave={handleSaveOpeningBalance}
          />
          
          <DailySummary 
            openingBalance={openingBalance}
            salesByType={salesByType}
            remainingBalances={remainingBalances}
            onSetNextDayBalance={handleSetNextDayBalance}
          />
        </TabsContent>
        
        {/* تبويب سجل المعاملات */}
        <TabsContent value="transactions" className="space-y-6">
          <div className="flex justify-between mb-4 flex-wrap gap-2">
            <div className="space-x-2 flex">
              <Button onClick={() => setIsAddTransactionOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 ml-1" /> إضافة معاملة
              </Button>
              <Button onClick={() => setIsAddEmployeeOpen(true)} variant="outline" className="bg-white">
                <Plus className="w-4 h-4 ml-1" /> إضافة موظف جديد
              </Button>
            </div>
          </div>
          
          <TransactionsFilter 
            employees={employees}
            onDateChange={setSelectedDate}
            onEmployeeChange={setSelectedEmployeeFilter}
            onTypesChange={setSelectedTypes}
            selectedDate={selectedDate}
            selectedEmployee={selectedEmployeeFilter}
            selectedTypes={selectedTypes}
          />
          
          <TransactionsHistoryTable 
            transactions={filteredTransactions}
            employees={employees}
            onAddTransaction={() => setIsAddTransactionOpen(true)}
            onEmployeeSelect={handleEmployeeSelect}
          />
        </TabsContent>
      </Tabs>
      
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
