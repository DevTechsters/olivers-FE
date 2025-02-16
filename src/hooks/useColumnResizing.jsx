import { useState, useEffect } from 'react';

export const useColumnResizing = (initialColumns) => {
  const [columns, setColumns] = useState(initialColumns);
  const [columnWidths, setColumnWidths] = useState({});

  // Save widths when changed
  useEffect(() => {
    localStorage.setItem('columnWidths', JSON.stringify(columnWidths));
  }, [columnWidths]);

  // Load saved widths on component mount
  useEffect(() => {
    const savedWidths = localStorage.getItem('columnWidths');
    if (savedWidths) {
      setColumnWidths(JSON.parse(savedWidths));
    }
  }, []);

  // Handle column resize
  const handleResize = (index) => (e, { size }) => {
    const newColumns = [...columns];
    newColumns[index] = {
      ...newColumns[index],
      width: size.width,
    };
    
    // Update column widths state
    setColumnWidths(prev => ({
      ...prev,
      [newColumns[index].dataIndex]: size.width,
    }));
  };

  // Merge the column definitions with resize functionality
  const getResizableColumns = () => {
    return columns.map((col, index) => ({
      ...col,
      width: columnWidths[col.dataIndex] || col.width,
      onHeaderCell: (column) => ({
        width: column.width,
        onResize: handleResize(index),
      }),
    }));
  };

  return {
    columns,
    setColumns,
    columnWidths,
    getResizableColumns
  };
};