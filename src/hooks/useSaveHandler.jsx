import React, { useEffect } from 'react';
import { Input, Select } from 'antd';

const EditableCell = ({ 
  record, 
  dataIndex, 
  editingKey, 
  editingField, 
  onCellClick, 
  onCellChange, 
  onSave,
  inputType = 'text'
}) => {
  const editable = record.id === editingKey && dataIndex === editingField;
  
  useEffect(() => {
    // Debug log
    if (editable) {
      console.log('Rendering editable cell for:', record.id, dataIndex);
      console.log('Current value:', record[dataIndex]);
    }
  }, [editable, record.id, dataIndex]);
  
  const handleChange = (value) => {
    // Handle both direct value (for Select) and event target value (for Input)
    const newValue = value?.target ? value.target.value : value;
    onCellChange(newValue, record.id, dataIndex);
  };
  
  const renderEditInput = () => {
    if (inputType === 'select') {
      return (
        <Select
          value={record[dataIndex]}
          onChange={handleChange}
          onBlur={() => onSave()}
          style={{ width: '100%' }}
          autoFocus
        >
          <Select.Option value="Delivered">Delivered</Select.Option>
          <Select.Option value="Partially Delivered">Partially Delivered</Select.Option>
          <Select.Option value="Pending">Pending</Select.Option>
          <Select.Option value="Cancelled">Cancelled</Select.Option>
        </Select>
      );
    }
    
    return (
      <Input
        value={record[dataIndex] !== undefined ? record[dataIndex] : ''}
        onChange={handleChange}
        onBlur={() => onSave()}
        onPressEnter={() => onSave()}
        autoFocus
        placeholder="Enter value"
      />
    );
  };

  return editable ? (
    <div className="editable-cell-value-wrapper" style={{ background: '#fffbe6', padding: '5px' }}>
      {renderEditInput()}
    </div>
  ) : (
    <div 
      className="editable-cell-value-wrapper"
      onClick={(e) => {
        e.stopPropagation();
        onCellClick(record.id, dataIndex);
      }}
      style={{ cursor: 'pointer', padding: '5px' }}
    >
      {record[dataIndex] !== undefined && record[dataIndex] !== null && record[dataIndex] !== '' 
        ? record[dataIndex] 
        : <span style={{ color: '#ccc' }}>Click to edit</span>}
    </div>
  );
};

export default React.memo(EditableCell);