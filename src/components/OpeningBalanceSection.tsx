
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { OpeningBalance } from '@/contexts/BalancesContext';

interface OpeningBalanceSectionProps {
  openingBalance: OpeningBalance;
  onChange: (balance: OpeningBalance) => void;
  onSave: () => void;
}

const OpeningBalanceSection = ({ 
  openingBalance, 
  onChange,
  onSave
}: OpeningBalanceSectionProps) => {
  const handleSyriaTelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onChange({ ...openingBalance, syriaTel: value });
  };

  const handleMtnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onChange({ ...openingBalance, mtn: value });
  };
  
  return (
    <Card className="animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
        <CardTitle className="text-center text-xl md:text-2xl">رصيد الافتتاح اليومي</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 bg-orange-50 p-4 rounded-lg border-2 border-syriatel">
            <div className="flex items-center justify-center mb-2">
              <div className="w-12 h-12 rounded-full bg-syriatel flex items-center justify-center text-white font-bold text-xl">
                ST
              </div>
            </div>
            <Label htmlFor="syriaTelBalance" className="block text-center font-bold text-syriatel">
              رصيد سيرياتيل
            </Label>
            <Input
              id="syriaTelBalance"
              type="number"
              value={openingBalance.syriaTel}
              onChange={handleSyriaTelChange}
              className="text-center text-lg font-bold border-syriatel"
              min="0"
            />
          </div>

          <div className="space-y-2 bg-yellow-50 p-4 rounded-lg border-2 border-mtn">
            <div className="flex items-center justify-center mb-2">
              <div className="w-12 h-12 rounded-full bg-mtn flex items-center justify-center text-black font-bold text-xl">
                MTN
              </div>
            </div>
            <Label htmlFor="mtnBalance" className="block text-center font-bold text-mtn-dark">
              رصيد ام تي ان
            </Label>
            <Input
              id="mtnBalance"
              type="number"
              value={openingBalance.mtn}
              onChange={handleMtnChange}
              className="text-center text-lg font-bold border-mtn"
              min="0"
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
          <Button 
            onClick={onSave} 
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2"
          >
            حفظ رصيد الافتتاح
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpeningBalanceSection;
