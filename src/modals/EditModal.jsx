import React, { useState } from 'react';
import { Modal, Button, Descriptions, Divider, Input, DatePicker, Select, Table, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

const { TextArea } = Input;

const EditModal = ({
  isOpen,
  onClose,
  editData,
  BillsHistory,
  addBill,
  paymentMethod,
  errors,
  onSave,
  onAddPayment,
  onAddBillChange,
  onPaymentMethodChange,
}) => {
  const [localAddBill, setLocalAddBill] = useState(addBill);

  const handleAddBillChange = (e) => {
    const { id, value } = e.target;
    setLocalAddBill(prev => ({ ...prev, [id]: value }));
    onAddBillChange(e);
  };

  const handleDateChange = (date, dateString) => {
    setLocalAddBill(prev => ({ ...prev, date: dateString }));
    onAddBillChange({ target: { id: 'date', value: dateString } });
  };

  return (
    <Modal
      title="Edit Bill"
      visible={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={onSave}>
          Save Changes
        </Button>
      ]}
      width={800}
      destroyOnClose
    >
      <div className="space-y-6">
        <Row gutter={24}>
          <Col span={12}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Invoice Details</h3>
              <Descriptions column={1}>
                <Descriptions.Item label="Invoice ID">{editData.invoiceId}</Descriptions.Item>
                <Descriptions.Item label="Current Balance" className="font-bold">
                  ₹{editData.balance}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Col>
        </Row>

        <Divider orientation="left" className="text-lg font-semibold">Add New Payment</Divider>

        <Row gutter={24}>
          <Col span={8}>
            <Input
              type="number"
              id="receivedAmount"
              placeholder="Received Amount"
              value={localAddBill.receivedAmount}
              onChange={handleAddBillChange}
              status={errors.receivedAmount ? 'error' : ''}
              style={{ width: '100%' }}
              prefix="₹"
            />
          </Col>
          <Col span={8}>
            <DatePicker
              id="date"
              onChange={handleDateChange}
              status={errors.date ? 'error' : ''}
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
            />
          </Col>
          <Col span={8}>
            <Select
              placeholder="Payment Method"
              value={paymentMethod}
              onChange={onPaymentMethodChange}
              options={[
                { value: 'CASH_DISCOUNT', label: 'Cash Discount' },
                { value: 'DAMAGE', label: 'Damage' },
                { value: 'CLAIM', label: 'Claim' },
                { value: 'CREDIT_NOTE', label: 'Credit Note' },
                { value: 'GPAY', label: 'GPay' },
                { value: 'CASH', label: 'Cash' },
                { value: 'DELIVERY_PERSON', label: 'Delivery Person' },
              ]}
              status={errors.paymentMethod ? 'error' : ''}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={24}>
            <TextArea
              id="comments"
              placeholder="Comments"
              value={localAddBill.comments}
              onChange={handleAddBillChange}
              autoSize={{ minRows: 2, maxRows: 4 }}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>

        <Row justify="end">
          <Col>
            <Button 
              type="primary" 
              onClick={onAddPayment}
              icon={<PlusOutlined />}
              style={{ marginTop: '16px' }}
            >
              Add Payment
            </Button>
          </Col>
        </Row>

        <Divider orientation="left" className="text-lg font-semibold">Payment History</Divider>

        <Table
          dataSource={BillsHistory.filter(bill => 
            !bill.hasOwnProperty('chequeNumber') && 
            !bill.hasOwnProperty('bankName')
          )}
          columns={[
            { title: 'Date', dataIndex: 'date', render: (text) => moment(text).format('DD/MM/YYYY'), width: 120 },
            { title: 'Amount', dataIndex: 'receivedAmount', width: 120, render: (value) => `₹${value}` },
            { title: 'Method', dataIndex: 'paymentMethod', width: 120 },
            { title: 'Comments', dataIndex: 'comments', ellipsis: true },
            { title: 'Created By', dataIndex: 'createdBy', width: 150 }
          ]}
          pagination={false}
          scroll={{ y: 300 }}
          size="middle"
          bordered
        />
      </div>
    </Modal>
  );
};

export default EditModal;