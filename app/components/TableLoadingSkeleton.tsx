import React from 'react';

interface TableLoadingSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const TableLoadingSkeleton: React.FC<TableLoadingSkeletonProps> = ({ 
  rows = 5, 
  columns = 4, 
  className = '' 
}) => {
  const renderHeaderCells = () => {
    return Array.from({ length: columns }).map((_, index) => (
      <th key={`header-${index}`} className="px-4 py-2">
        <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-3/4 mx-auto"></div>
      </th>
    ));
  };

  const renderRow = (rowIndex: number) => {
    return Array.from({ length: columns }).map((_, colIndex) => (
      <td key={`cell-${rowIndex}-${colIndex}`} className="px-4 py-2">
        <div className="h-3 bg-gray-200 rounded dark:bg-gray-700 w-full"></div>
      </td>
    ));
  };

  const renderRows = () => {
    return Array.from({ length: rows }).map((_, index) => (
      <tr key={`row-${index}`} className="border-b dark:border-gray-700">
        {renderRow(index)}
      </tr>
    ));
  };

  return (
    <div role="status" className={`animate-pulse ${className}`}>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {renderHeaderCells()}
          </tr>
        </thead>
        <tbody>
          {renderRows()}
        </tbody>
      </table>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default TableLoadingSkeleton;