
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
import { Input } from '@/components/ui/input';
import { Employee, SalesEntry } from '@/contexts/BalancesContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface SalesEntryTableProps {
  employees: Employee[];
  salesEntries: SalesEntry[];
  onSalesChange: (employeeId: string, field: 'syriaTel' | 'mtn' | 'cash', value: number) => boolean;
  onEmployeeSelect: (employeeId: string) => void;
}

const SalesEntryTable: React.FC<SalesEntryTableProps> = ({
  employees,
  salesEntries,
  onSalesChange,
  onEmployeeSelect
}) => {
  const [editingCell, setEditingCell] = useState<{ employeeId: string; field: string } | null>(null);
  const { toast } = useToast();

  const handleCellClick = (employeeId: string, field: string) => {
    setEditingCell({ employeeId, field });
  };

  const handleInputChange = (employeeId: string, field: 'syriaTel' | 'mtn' | 'cash', value: string) => {
    const numValue = parseFloat(value) || 0;
    const success = onSalesChange(employeeId, field, numValue);
    
    if (!success) {
      toast({
        title: "خطأ في المبيعات",
        description: `المبيعات تتجاوز الرصيد المتاح في ${field === 'syriaTel' ? 'سيرياتيل' : 'ام تي ان'}`,
        variant: "destructive",
      });
    }
  };

  const handleInputBlur = () => {
    setEditingCell(null);
  };

  const getSalesEntry = (employeeId: string) => {
    return salesEntries.find(entry => entry.employeeId === employeeId) || {
      employeeId,
      syriaTel: 0,
      mtn: 0,
      cash: 0
    };
  };

  return (
    <Card className="animate-fade-in mt-6">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-center text-xl md:text-2xl">إدخال مبيعات الموظفين</CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-auto">
        <Table dir="rtl">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-right font-bold">اسم الموظف</TableHead>
              <TableHead className="text-center font-bold bg-orange-50">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-syriatel flex items-center justify-center text-white text-xs">ST</span>
                  سيرياتيل
                </div>
              </TableHead>
              <TableHead className="text-center font-bold bg-yellow-50">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-mtn flex items-center justify-center text-black text-xs">MTN</span>
                  ام تي ان
                </div>
              </TableHead>
              <TableHead className="text-center font-bold bg-green-50">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">$</span>
                  نقدي
                </div>
              </TableHead>
              <TableHead className="text-center font-bold">التفاصيل</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => {
              const entry = getSalesEntry(employee.id);
              return (
                <TableRow key={employee.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  
                  <TableCell
                    className="text-center cursor-pointer bg-orange-50 hover:bg-orange-100"
                    onClick={() => handleCellClick(employee.id, 'syriaTel')}
                  >
                    {editingCell?.employeeId === employee.id && editingCell?.field === 'syriaTel' ? (
                      <Input
                        type="number"
                        value={entry.syriaTel}
                        onChange={(e) => handleInputChange(employee.id, 'syriaTel', e.target.value)}
                        onBlur={handleInputBlur}
                        autoFocus
                        className="text-center"
                        min="0"
                      />
                    ) : (
                      <span className="font-semibold">{entry.syriaTel.toLocaleString()}</span>
                    )}
                  </TableCell>

                  <TableCell 
                    className="text-center cursor-pointer bg-yellow-50 hover:bg-yellow-100"
                    onClick={() => handleCellClick(employee.id, 'mtn')}
                  >
                    {editingCell?.employeeId === employee.id && editingCell?.field === 'mtn' ? (
                      <Input
                        type="number"
                        value={entry.mtn}
                        onChange={(e) => handleInputChange(employee.id, 'mtn', e.target.value)}
                        onBlur={handleInputBlur}
                        autoFocus
                        className="text-center"
                        min="0"
                      />
                    ) : (
                      <span className="font-semibold">{entry.mtn.toLocaleString()}</span>
                    )}
                  </TableCell>

                  <TableCell 
                    className="text-center cursor-pointer bg-green-50 hover:bg-green-100"
                    onClick={() => handleCellClick(employee.id, 'cash')}
                  >
                    {editingCell?.employeeId === employee.id && editingCell?.field === 'cash' ? (
                      <Input
                        type="number"
                        value={entry.cash}
                        onChange={(e) => handleInputChange(employee.id, 'cash', e.target.value)}
                        onBlur={handleInputBlur}
                        autoFocus
                        className="text-center"
                        min="0"
                      />
                    ) : (
                      <span className="font-semibold">{entry.cash.toLocaleString()}</span>
                    )}
                  </TableCell>

                  <TableCell className="text-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEmployeeSelect(employee.id)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700"
                    >
                      عرض التفاصيل
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SalesEntryTable;
