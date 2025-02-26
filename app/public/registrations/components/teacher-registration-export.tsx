'use client';

import React, { useState } from 'react';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';

// Define TypeScript interfaces
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

interface FilterOptions {
  registrationType?: string;
  endorsementStatus?: string;
  regStatus?: string;
  practiceCategory?: string;
}

export const ExportButton = ({ data }: { data: Teacher[] }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx'>('xlsx');

  // Get unique values for filter dropdowns
  const getUniqueValues = (field: keyof Teacher) => {
    return Array.from(new Set(data.map(item => item[field])))
      .filter(Boolean)
      .sort();
  };

  const registrationTypes = getUniqueValues('registration_type');
  const endorsementStatuses = getUniqueValues('endorsement_status');
  const regStatuses = getUniqueValues('reg_status');
  const practiceCategories = getUniqueValues('practice_category');

  // Apply filters to data
  const getFilteredData = () => {
    return data.filter(teacher => {
      return (
        (!filters.registrationType || teacher.registration_type === filters.registrationType) &&
        (!filters.endorsementStatus || teacher.endorsement_status === filters.endorsementStatus) &&
        (!filters.regStatus || teacher.reg_status === filters.regStatus) &&
        (!filters.practiceCategory || teacher.practice_category === filters.practiceCategory)
      );
    });
  };

  const exportToCSV = (filteredData: Teacher[]) => {
    setIsExporting(true);
    
    try {
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      
      // Convert data to array format for XLSX
      const dataArray = [
        [
          'Registration Type',
          'Endorsement Status',
          'Registration Status',
          'Surname',
          'Forenames',
          'Practice Category',
          'Sub Category',
          'National ID',
          'Created At',
          'Payment Amount'
        ],
        ...filteredData.map(row => [
          row.registration_type,
          row.endorsement_status,
          row.reg_status,
          row.surname,
          row.forenames,
          row.practice_category,
          row.sub_category,
          row.national_id,
          row.created_at,
          row.payment_amount || ''
        ])
      ];
      
      const ws = XLSX.utils.aoa_to_sheet(dataArray);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Teacher Registrations');
      
      // Generate filename
      const fileName = `teacher_registrations_${new Date().toISOString().slice(0, 10)}`;
      
      if (exportFormat === 'xlsx') {
        // Write XLSX file and trigger download
        XLSX.writeFile(wb, `${fileName}.xlsx`);
      } else {
        // For CSV format
        const csvContent = XLSX.utils.sheet_to_csv(ws);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('There was an error exporting the data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex space-x-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center justify-center rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 transition-colors"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
        
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => setExportFormat('xlsx')}
            className={`inline-flex items-center rounded-l-md px-3 py-2 text-sm font-medium ${
              exportFormat === 'xlsx' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Excel
          </button>
          <button
            type="button"
            onClick={() => setExportFormat('csv')}
            className={`inline-flex items-center rounded-r-md px-3 py-2 text-sm font-medium ${
              exportFormat === 'csv' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            CSV
          </button>
        </div>
        
        <button
          onClick={() => exportToCSV(getFilteredData())}
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
              Export {exportFormat.toUpperCase()}
            </>
          )}
        </button>
      </div>
      
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-md shadow-sm mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registration Type
            </label>
            <select
              value={filters.registrationType || ''}
              onChange={(e) => setFilters({...filters, registrationType: e.target.value || undefined})}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Types</option>
              {registrationTypes.map((type) => (
                <option key={type as string} value={type as string}>
                  {type as string}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endorsement Status
            </label>
            <select
              value={filters.endorsementStatus || ''}
              onChange={(e) => setFilters({...filters, endorsementStatus: e.target.value || undefined})}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Statuses</option>
              {endorsementStatuses.map((status) => (
                <option key={status as string} value={status as string}>
                  {status as string}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registration Status
            </label>
            <select
              value={filters.regStatus || ''}
              onChange={(e) => setFilters({...filters, regStatus: e.target.value || undefined})}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Statuses</option>
              {regStatuses.map((status) => (
                <option key={status as string} value={status as string}>
                  {status as string}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Practice Category
            </label>
            <select
              value={filters.practiceCategory || ''}
              onChange={(e) => setFilters({...filters, practiceCategory: e.target.value || undefined})}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Categories</option>
              {practiceCategories.map((category) => (
                <option key={category as string} value={category as string}>
                  {category as string}
                </option>
              ))}
            </select>
          </div>
          
          <div className="col-span-1 md:col-span-2 lg:col-span-4 flex justify-end">
            <button
              onClick={() => setFilters({})}
              className="inline-flex items-center justify-center rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};