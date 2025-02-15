import React from 'react';
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
    
    const renderEditInput = () => {
      if (inputType === 'select') {
        return (
          <Select
            value={record[dataIndex]}
            onChange={(value) => onCellChange({ target: { value } }, record.id, dataIndex)}
            onBlur={onSave}
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
        onBlur={onSave}
        onPressEnter={onSave}
        autoFocus
      />
        
      );
    };
  
    return editable ? (
      <div className="editable-cell-value-wrapper">
        {renderEditInput()}
      </div>
    ) : (
      <div 
        className="editable-cell-value-wrapper"
        onClick={() => onCellClick(record.id, dataIndex)}
        style={{ cursor: 'pointer' }}
      >
        {record[dataIndex] ?? 'Click to edit'}
      </div>
    );
  };

  export default EditableCell;