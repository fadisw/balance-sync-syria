
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { OpeningBalance, RemainingBalance, SalesByType } from '@/contexts/BalancesContext';
import { Button } from '@/components/ui/button';

interface DailySummaryProps {
  openingBalance: OpeningBalance;
  salesByType: SalesByType;
  remainingBalances: RemainingBalance;
  onSetNextDayBalance: () => void;
}

const DailySummary: React.FC<DailySummaryProps> = ({
  openingBalance,
  salesByType,
  remainingBalances,
  onSetNextDayBalance
}) => {
  const totalSales = salesByType.syriaTel + salesByType.mtn + salesByType.cash;
  
  return (
    <Card className="animate-fade-in mt-6">
      <CardHeader className="bg-gradient-to-r from-blue-700 to-purple-700 text-white rounded-t-lg">
        <CardTitle className="text-center text-xl md:text-2xl">ملخص اليوم والأرصدة المتبقية</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SyriaTel Card */}
          <Card className="border-2 border-syriatel overflow-hidden">
            <CardHeader className="bg-syriatel p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">سيرياتيل</CardTitle>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <span className="text-syriatel font-bold">ST</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-bold">الرصيد الافتتاحي:</span>
                <span className="text-lg font-semibold">{openingBalance.syriaTel.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-bold">المبيعات:</span>
                <span className="text-lg font-semibold text-red-600">- {salesByType.syriaTel.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-bold">الرصيد المتبقي:</span>
                <span className={`text-lg font-bold ${remainingBalances.syriaTel < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {remainingBalances.syriaTel.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* MTN Card */}
          <Card className="border-2 border-mtn overflow-hidden">
            <CardHeader className="bg-mtn p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-black">ام تي ان</CardTitle>
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                  <span className="text-mtn font-bold">MTN</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-bold">الرصيد الافتتاحي:</span>
                <span className="text-lg font-semibold">{openingBalance.mtn.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-bold">المبيعات:</span>
                <span className="text-lg font-semibold text-red-600">- {salesByType.mtn.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-bold">الرصيد المتبقي:</span>
                <span className={`text-lg font-bold ${remainingBalances.mtn < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {remainingBalances.mtn.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Total Sales Card */}
          <Card className="border-2 border-green-500 overflow-hidden">
            <CardHeader className="bg-green-500 p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">إجمالي المبيعات</CardTitle>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <span className="text-green-500 font-bold">$</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-bold">مبيعات سيرياتيل:</span>
                <span className="text-lg font-semibold">{salesByType.syriaTel.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-bold">مبيعات ام تي ان:</span>
                <span className="text-lg font-semibold">{salesByType.mtn.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-bold">مبيعات نقدية:</span>
                <span className="text-lg font-semibold">{salesByType.cash.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded border border-blue-200">
                <span className="font-bold text-lg">الإجمالي:</span>
                <span className="text-xl font-bold text-blue-700">{totalSales.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={onSetNextDayBalance}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 text-lg"
          >
            تعيين كرصيد افتتاحي لليوم التالي
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailySummary;
