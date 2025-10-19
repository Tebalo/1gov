'use client';

import React, { useState } from 'react';
import { Download } from 'lucide-react';
import ExcelJS from 'exceljs';

interface Teacher {
  registration_type: string;
  endorsement_status: string;
  reg_status: string;
  surname: string;
  forenames: string;
  practice_category: string;
  sub_category: string;
  national_id: string;
  created_at: string;
  payment_amount: string | null;
  license_link: string | null;
}

export const ExportButton = ({ data }: { data: Teacher[] }) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToExcel = async () => {
    setIsExporting(true);
    
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Teacher Registrations');

      worksheet.columns = [
        { header: 'Registration Type', key: 'registration_type', width: 20 },
        { header: 'Endorsement Status', key: 'endorsement_status', width: 18 },
        { header: 'Registration Status', key: 'reg_status', width: 18 },
        { header: 'Surname', key: 'surname', width: 15 },
        { header: 'Forenames', key: 'forenames', width: 20 },
        { header: 'Practice Category', key: 'practice_category', width: 20 },
        { header: 'Sub Category', key: 'sub_category', width: 15 },
        { header: 'National ID', key: 'national_id', width: 15 },
        { header: 'Created At', key: 'created_at', width: 15 },
        { header: 'Payment Amount', key: 'payment_amount', width: 15 }
      ];

      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6F2FF' }
      };

      data.forEach(teacher => {
        worksheet.addRow({
          registration_type: teacher.registration_type,
          endorsement_status: teacher.endorsement_status,
          reg_status: teacher.reg_status,
          surname: teacher.surname,
          forenames: teacher.forenames,
          practice_category: teacher.practice_category,
          sub_category: teacher.sub_category,
          national_id: teacher.national_id,
          created_at: teacher.created_at,
          payment_amount: teacher.payment_amount || ''
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `teacher_registrations_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('There was an error exporting the data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={exportToExcel}
      disabled={isExporting}
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors ${
        isExporting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {isExporting ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Exporting...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Export Excel
        </>
      )}
    </button>
  );
};