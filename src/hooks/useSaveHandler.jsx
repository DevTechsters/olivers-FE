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
    }
  }, [editable, record.id, dataIndex]);
  
  const renderEditInput = () => {
    if (inputType === 'select') {
      return (
        <Select
          value={record[dataIndex]}
          onChange={(value) => onCellChange(value, record.id, dataIndex)}
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
        value={record[dataIndex]}
        onChange={(e) => onCellChange(e.target.value, record.id, dataIndex)}
        onBlur={() => onSave()}
        onPressEnter={() => onSave()}
        autoFocus
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
      {record[dataIndex] !== undefined && record[dataIndex] !== null 
        ? record[dataIndex] 
        : <span style={{ color: '#ccc' }}>Click to edit</span>}
    </div>
  );
};

export default React.memo(EditableCell);