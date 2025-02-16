import React from 'react';
import { Modal, Button, Select, Row, Col, Typography, Divider } from 'antd';
import { FilterOutlined, ClearOutlined, CheckOutlined } from '@ant-design/icons';

const { Title } = Typography;

const FilterModal = ({
  isOpen,
  onClose,
  filterData,
  filterConst,
  onFilterChange,
  onApply,
  onClear
}) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleFilterSelectChange = (value, name) => {
    onFilterChange(name, value);
  };

  // Count total applied filters
  const totalFiltersApplied = Object.values(filterData).reduce(
    (count, filters) => count + (Array.isArray(filters) ? filters.length : 0),
    0
  );

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FilterOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          <span>Filter Bills</span>
          {totalFiltersApplied > 0 && (
            <span style={{ 
              marginLeft: 8, 
              fontSize: '14px', 
              background: '#e6f7ff', 
              color: '#1890ff',
              padding: '2px 8px',
              borderRadius: '10px'
            }}>
              {totalFiltersApplied} applied
            </span>
          )}
        </div>
      }
      visible={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="clear" icon={<ClearOutlined />} onClick={onClear}>
          Clear All
        </Button>,
        <Button 
          key="apply" 
          type="primary" 
          icon={<CheckOutlined />} 
          onClick={onApply}
        >
          Apply Filters
        </Button>,
      ]}
      width={700}
      bodyStyle={{ maxHeight: '70vh', overflow: 'auto', padding: '20px 24px' }}
      maskClosable={false}
      centered
    >
      <Row gutter={[16, 20]}>
        <FilterSection 
          title="Salesperson Names" 
          placeholder="Select Salesperson"
          value={filterData.salespersonNames}
          options={filterConst.salespersonNames}
          onChange={(value) => handleFilterSelectChange(value, 'salespersonNames')}
        />
        
        <FilterSection 
          title="Retailer Names" 
          placeholder="Select Retailer"
          value={filterData.retailerNames}
          options={filterConst.retailerNames}
          onChange={(value) => handleFilterSelectChange(value, 'retailerNames')}
        />
        
        <FilterSection 
          title="Beats" 
          placeholder="Select Beat"
          value={filterData.beats}
          options={filterConst.beats}
          onChange={(value) => handleFilterSelectChange(value, 'beats')}
        />
        
        <FilterSection 
          title="Brand Names" 
          placeholder="Select Brand"
          value={filterData.brandNames}
          options={filterConst.brandNames}
          onChange={(value) => handleFilterSelectChange(value, 'brandNames')}
        />
        
        <FilterSection 
          title="Days" 
          placeholder="Select Day"
          value={filterData.days}
          options={days}
          onChange={(value) => handleFilterSelectChange(value, 'days')}
        />
      </Row>
    </Modal>
  );
};

// Reusable filter section component
const FilterSection = ({ title, placeholder, value, options, onChange }) => (
  <Col span={24}>
    <div style={{ marginBottom: 6 }}>
      <Typography.Text strong style={{ fontSize: '15px' }}>
        {title}
      </Typography.Text>
      {value && value.length > 0 && (
        <Typography.Text type="secondary" style={{ marginLeft: 8, fontSize: '13px' }}>
          {value.length} selected
        </Typography.Text>
      )}
    </div>
    <Select
      mode="multiple"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      options={options.map((item) => ({ label: item, value: item }))}
      style={{ width: '100%' }}
      maxTagCount={3}
      maxTagTextLength={12}
      optionFilterProp="label"
      showSearch
      listHeight={250}
      dropdownMatchSelectWidth={false}
      dropdownStyle={{ 
        padding: '6px 0',
        borderRadius: '6px',
        boxShadow: '0 3px 6px -4px rgba(0,0,0,.12), 0 6px 16px 0 rgba(0,0,0,.08)'
      }}
    />
  </Col>
);

export default FilterModal;