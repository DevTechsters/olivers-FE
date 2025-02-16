import React from 'react';
import { Modal, Button, Select, Row, Col } from 'antd';

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

  return (
    <Modal
      title="Filter Bills"
      visible={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="clear" onClick={onClear}>
          Clear Filters
        </Button>,
        <Button key="apply" type="primary" onClick={onApply}>
          Apply Filters
        </Button>,
      ]}
      width={800}
    >
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <label style={{ fontSize: '16px', fontWeight: '500' }}>Salesperson Names</label>
          <Select
            mode="multiple"
            placeholder="Select Salesperson"
            value={filterData.salespersonNames}
            onChange={(value) => handleFilterSelectChange(value, 'salespersonNames')}
            options={filterConst.salespersonNames.map((name) => ({ label: name, value: name }))}
            style={{ width: '100%', fontSize: '14px' }}
            dropdownStyle={{ fontSize: '14px' }}
          />
        </Col>
        <Col span={24}>
          <label style={{ fontSize: '16px', fontWeight: '500' }}>Retailer Names</label>
          <Select
            mode="multiple"
            placeholder="Select Retailer"
            value={filterData.retailerNames}
            onChange={(value) => handleFilterSelectChange(value, 'retailerNames')}
            options={filterConst.retailerNames.map((name) => ({ label: name, value: name }))}
            style={{ width: '100%', fontSize: '14px' }}
            dropdownStyle={{ fontSize: '14px' }}
          />
        </Col>
        <Col span={24}>
          <label style={{ fontSize: '16px', fontWeight: '500' }}>Beats</label>
          <Select
            mode="multiple"
            placeholder="Select Beat"
            value={filterData.beats}
            onChange={(value) => handleFilterSelectChange(value, 'beats')}
            options={filterConst.beats.map((beat) => ({ label: beat, value: beat }))}
            style={{ width: '100%', fontSize: '14px' }}
            dropdownStyle={{ fontSize: '14px' }}
          />
        </Col>
        <Col span={24}>
          <label style={{ fontSize: '16px', fontWeight: '500' }}>Brand Names</label>
          <Select
            mode="multiple"
            placeholder="Select Brand"
            value={filterData.brandNames}
            onChange={(value) => handleFilterSelectChange(value, 'brandNames')}
            options={filterConst.brandNames.map((brand) => ({ label: brand, value: brand }))}
            style={{ width: '100%', fontSize: '14px' }}
            dropdownStyle={{ fontSize: '14px' }}
          />
        </Col>
        <Col span={24}>
          <label style={{ fontSize: '16px', fontWeight: '500' }}>Days</label>
          <Select
            mode="multiple"
            placeholder="Select Day"
            value={filterData.days}
            onChange={(value) => handleFilterSelectChange(value, 'days')}
            options={days.map((day) => ({ label: day, value: day }))}
            style={{ width: '100%', fontSize: '14px' }}
            dropdownStyle={{ fontSize: '14px' }}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default FilterModal;