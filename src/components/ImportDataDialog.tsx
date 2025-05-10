import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImportDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportData: (file: File) => Promise<boolean>;
}

const ImportDataDialog: React.FC<ImportDataDialogProps> = ({
  open,
  onOpenChange,
  onImportData,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check if the file is a JSON file
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        setError('يرجى اختيار ملف بتنسيق JSON');
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
        setError(null);
      }
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setError('يرجى اختيار ملف أولاً');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await onImportData(selectedFile);
      if (success) {
        // Reset the form and close the dialog on success
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onOpenChange(false);
      } else {
        setError('فشل استيراد البيانات. تأكد من أن الملف يحتوي على بيانات صالحة');
      }
    } catch (error) {
      console.error('Error during import:', error);
      setError('حدث خطأ أثناء استيراد البيانات');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">استيراد البيانات</DialogTitle>
          <DialogDescription>
            استيراد بيانات سابقة من ملف JSON. سيتم استبدال البيانات الحالية بالبيانات المستوردة.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={triggerFileInput}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".json,application/json"
              onChange={handleFileChange}
            />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2 text-sm text-gray-600">
              {selectedFile ? (
                <p className="font-semibold text-blue-600">{selectedFile.name}</p>
              ) : (
                <>
                  <p className="font-semibold">انقر لاختيار ملف</p>
                  <p className="text-xs mt-1">أو اسحب وأفلت الملف هنا</p>
                </>
              )}
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button 
            onClick={() => onOpenChange(false)} 
            variant="outline" 
            className="ml-2"
          >
            إلغاء
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={!selectedFile || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'جاري الاستيراد...' : 'استيراد البيانات'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDataDialog; 