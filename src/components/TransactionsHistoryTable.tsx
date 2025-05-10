
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Employee, EmployeeTransaction } from '@/contexts/BalancesContext';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Plus } from 'lucide-react';

interface TransactionsHistoryTableProps {
  transactions: EmployeeTransaction[];
  employees: Employee[];
  onAddTransaction: () => void;
}

const TransactionsHistoryTable: React.FC<TransactionsHistoryTableProps> = ({
  transactions,
  employees,
  onAddTransaction,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get employee name by ID
  const getEmployeeName = (id: string) => {
    return employees.find(emp => emp.id === id)?.name || 'غير معروف';
  };

  // Get transaction type display name
  const getTypeDisplayName = (type: 'syriaTel' | 'mtn' | 'cash') => {
    switch (type) {
      case 'syriaTel':
        return 'سيرياتيل';
      case 'mtn':
        return 'ام تي ان';
      case 'cash':
        return 'نقدي';
      default:
        return type;
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = transactions.slice(startIndex, startIndex + itemsPerPage);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at edges
      if (currentPage <= 2) {
        endPage = Math.min(totalPages - 1, 4);
      } else if (currentPage >= totalPages - 1) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      // Add ellipsis if needed before middle pages
      if (startPage > 2) {
        pages.push('ellipsis-start');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed after middle pages
      if (endPage < totalPages - 1) {
        pages.push('ellipsis-end');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <Card className="animate-fade-in mt-6">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg flex justify-between items-center flex-row">
        <CardTitle className="text-xl md:text-2xl">سجل المعاملات</CardTitle>
        <Button onClick={onAddTransaction} size="sm" className="bg-white text-purple-700 hover:bg-gray-100">
          <Plus className="w-4 h-4 ml-1" /> إضافة معاملة
        </Button>
      </CardHeader>
      <CardContent className="p-0 overflow-auto">
        <Table dir="rtl">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-right font-bold">التاريخ</TableHead>
              <TableHead className="text-right font-bold">اسم الموظف</TableHead>
              <TableHead className="text-right font-bold">النوع</TableHead>
              <TableHead className="text-right font-bold">المبلغ</TableHead>
              <TableHead className="text-right font-bold">الوصف</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-gray-50">
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{getEmployeeName(transaction.employeeId)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.type === 'syriaTel' 
                        ? 'bg-orange-100 text-orange-800' 
                        : transaction.type === 'mtn'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                    }`}>
                      {getTypeDisplayName(transaction.type)}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{transaction.amount.toLocaleString()}</TableCell>
                  <TableCell>{transaction.description || '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  لا توجد معاملات مسجلة
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {totalPages > 1 && (
          <div className="py-4 px-2">
            <Pagination>
              <PaginationContent dir="ltr">
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {getPageNumbers().map((page, index) => (
                  page === 'ellipsis-start' || page === 'ellipsis-end' ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <span className="flex h-9 w-9 items-center justify-center">...</span>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={`page-${page}`}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => setCurrentPage(Number(page))}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                ))}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionsHistoryTable;
