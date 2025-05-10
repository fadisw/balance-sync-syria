
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Employee } from '@/contexts/BalancesContext';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Calendar as CalendarIcon, User, X, Filter } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface TransactionsFilterProps {
  employees: Employee[];
  onDateChange: (date: Date | null) => void;
  onEmployeeChange: (employeeId: string | null) => void;
  onTypesChange: (types: ('syriaTel' | 'mtn' | 'cash')[]) => void;
  selectedDate: Date | null;
  selectedEmployee: string | null;
  selectedTypes: ('syriaTel' | 'mtn' | 'cash')[];
}

const TransactionsFilter: React.FC<TransactionsFilterProps> = ({
  employees,
  onDateChange,
  onEmployeeChange,
  onTypesChange,
  selectedDate,
  selectedEmployee,
  selectedTypes,
}) => {
  const toggleTypeSelection = (type: 'syriaTel' | 'mtn' | 'cash') => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter(t => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  const clearFilters = () => {
    onDateChange(null);
    onEmployeeChange(null);
    onTypesChange([]);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center">
            <Filter className="w-5 h-5 ml-2" />
            <span className="font-semibold">تصفية المعاملات:</span>
          </div>
          
          {/* فلتر التاريخ */}
          <div className="flex items-center">
            <Label className="ml-2">التاريخ:</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline"
                  className={`w-[180px] justify-start ${selectedDate ? 'bg-blue-50' : ''}`}
                >
                  <CalendarIcon className="w-4 h-4 ml-2" />
                  {selectedDate ? (
                    format(selectedDate, 'yyyy/MM/dd', { locale: ar })
                  ) : (
                    'اختر تاريخ'
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate || undefined}
                  onSelect={(date) => onDateChange(date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {selectedDate && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => onDateChange(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* فلتر الموظف */}
          <div className="flex items-center">
            <Label className="ml-2">الموظف:</Label>
            <Select
              value={selectedEmployee || ''}
              onValueChange={(value) => onEmployeeChange(value || null)}
            >
              <SelectTrigger className={`w-[180px] ${selectedEmployee ? 'bg-blue-50' : ''}`}>
                <SelectValue placeholder="جميع الموظفين" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">الكل</SelectItem>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedEmployee && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => onEmployeeChange(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* فلتر النوع */}
          <div className="flex items-center gap-2">
            <Label className="ml-2">النوع:</Label>
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="syriaTel" 
                  checked={selectedTypes.includes('syriaTel')}
                  onCheckedChange={() => toggleTypeSelection('syriaTel')}
                />
                <label htmlFor="syriaTel" className="text-sm cursor-pointer">
                  سيرياتيل
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="mtn" 
                  checked={selectedTypes.includes('mtn')}
                  onCheckedChange={() => toggleTypeSelection('mtn')}
                />
                <label htmlFor="mtn" className="text-sm cursor-pointer">
                  ام تي ان
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="cash" 
                  checked={selectedTypes.includes('cash')}
                  onCheckedChange={() => toggleTypeSelection('cash')}
                />
                <label htmlFor="cash" className="text-sm cursor-pointer">
                  نقدي
                </label>
              </div>
            </div>
          </div>
          
          {/* زر مسح الفلاتر */}
          {(selectedDate || selectedEmployee || selectedTypes.length > 0) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="ml-auto"
            >
              <X className="h-4 w-4 ml-1" />
              مسح الفلاتر
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsFilter;
