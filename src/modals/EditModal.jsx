import React, { useState, useEffect } from 'react';
import { Modal, Button, Descriptions, Divider, Input, DatePicker, Select, Table, Row, Col, Form, Typography, Tag, Tooltip, message } from 'antd';
import { PlusOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const { TextArea } = Input;
const { Title, Text } = Typography;

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
  const [form] = Form.useForm();
  const [localAddBill, setLocalAddBill] = useState(addBill);
  
  // Reset form when modal opens with new data
  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({
        receivedAmount: addBill.receivedAmount,
        date: addBill.date ? moment(addBill.date, 'DD/MM/YYYY') : null,
        comments: addBill.comments
      });
      setLocalAddBill(addBill);
    }
  }, [isOpen, addBill, form]);

  const handleAddBillChange = (e) => {
    const { id, value } = e.target;
    setLocalAddBill(prev => ({ ...prev, [id]: value }));
    onAddBillChange(e);
  };

  const handleDateChange = (date, dateString) => {
    setLocalAddBill(prev => ({ ...prev, date: dateString }));
    onAddBillChange({ target: { id: 'date', value: dateString } });
  };
  
  const getPaymentMethodColor = (method) => {
    const colors = {
      'CASH_DISCOUNT': 'gold',
      'DAMAGE': 'volcano',
      'CLAIM': 'orange',
      'CREDIT_NOTE': 'geekblue',
      'GPAY': 'green',
      'CASH': 'cyan',
      'DELIVERY_PERSON': 'purple'
    };
    return colors[method] || 'default';
  };
  
  const handleAddPaymentClick = () => {
    form.validateFields().then(() => {
      onAddPayment();
      message.success('Payment added successfully');
      form.resetFields();
    }).catch(err => {
      console.log('Validation failed:', err);
    });
  };

  // Helper function to extract username from "username":xxx format
  const extractUsername = (createdByField) => {
    if (!createdByField) return '';
    
    // Try to parse if it's a string in JSON format
    if (typeof createdByField === 'string') {
      try {
        // Check if it matches the pattern "username":xxx
        const match = createdByField.match(/"username":\s*"([^"]+)"/);
        if (match && match[1]) {
          return match[1];
        }
        
        // Try parsing as JSON if it's a complete JSON object
        const parsed = JSON.parse(createdByField);
        if (parsed && parsed.username) {
          return parsed.username;
        }
      } catch (e) {
        // If parsing fails, return the original string
        return createdByField;
      }
    }
    
    // If it's already an object with username property
    if (typeof createdByField === 'object' && createdByField.username) {
      return createdByField.username;
    }
    
    // Fallback to the original value
    return String(createdByField);
  };

  return (
    <Modal
      title={<Title level={4}><span style={{ color: '#1890ff' }}>Edit Bill</span></Title>}
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={onSave}>
          Save Changes
        </Button>
      ]}
      width={720}
      destroyOnClose
      bodyStyle={{ padding: '16px 24px', maxHeight: '70vh', overflowY: 'auto' }}
    >
      <Form form={form} layout="vertical">
        <Row gutter={[16, 0]}>
          <Col span={12}>
            <Descriptions 
              size="small" 
              column={1} 
              bordered 
              title={<Text strong>Invoice Summary</Text>}
              style={{ backgroundColor: '#f5f5f5', borderRadius: '8px', padding: '12px' }}
            >
              <Descriptions.Item 
                label={<Text type="secondary">Invoice ID</Text>}
                labelStyle={{ width: '120px' }}
              >
                {editData.invoiceId}
              </Descriptions.Item>
              <Descriptions.Item 
                label={<Text type="secondary">Current Balance</Text>}
                labelStyle={{ width: '120px' }}
              >
                <Text strong style={{ color: '#f5222d', fontSize: '16px' }}>
                  ₹{editData.balance}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>

        <Divider orientation="left" orientationMargin="0" style={{ margin: '16px 0 12px' }}>
          <Text strong style={{ fontSize: '14px' }}>
            <PlusOutlined style={{ marginRight: 8 }} />
            Add New Payment
          </Text>
        </Divider>

        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Form.Item
              name="receivedAmount"
              rules={[{ required: true, message: 'Please enter amount' }]}
              validateStatus={errors.receivedAmount ? 'error' : ''}
              help={errors.receivedAmount}
            >
              <Input
                type="number"
                id="receivedAmount"
                placeholder="Amount"
                value={localAddBill.receivedAmount}
                onChange={handleAddBillChange}
                prefix="₹"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="date"
              rules={[{ required: true, message: 'Please select date' }]}
              validateStatus={errors.date ? 'error' : ''}
              help={errors.date}
            >
              <DatePicker
                id="date"
                onChange={handleDateChange}
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                placeholder="Select date"
              />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="paymentMethod"
              rules={[{ required: true, message: 'Please select method' }]}
              validateStatus={errors.paymentMethod ? 'error' : ''}
              help={errors.paymentMethod}
            >
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
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item name="comments">
              <TextArea
                id="comments"
                placeholder="Add comments or notes about this payment"
                value={localAddBill.comments}
                onChange={handleAddBillChange}
                autoSize={{ minRows: 2, maxRows: 3 }}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="end">
          <Col>
            <Button 
              type="primary" 
              onClick={handleAddPaymentClick}
              icon={<PlusOutlined />}
            >
              Add Payment
            </Button>
          </Col>
        </Row>

        <Divider orientation="left" orientationMargin="0" style={{ margin: '16px 0 12px' }}>
          <Text strong style={{ fontSize: '14px' }}>
            Payment History
            <Tooltip title="Shows all non-cheque payments">
              <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
            </Tooltip>
          </Text>
        </Divider>

        <Table
          dataSource={BillsHistory.filter(bill => 
            !bill.hasOwnProperty('chequeNumber') && 
            !bill.hasOwnProperty('bankName')
          )}
          columns={[
            { 
              title: 'Date', 
              dataIndex: 'date', 
              render: (text) => moment(text).format('DD/MM/YYYY'), 
              width: 100 
            },
            { 
              title: 'Amount', 
              dataIndex: 'receivedAmount', 
              width: 90, 
              render: (value) => <Text strong>₹{value}</Text> 
            },
            { 
              title: 'Method', 
              dataIndex: 'paymentMethod', 
              width: 120,
              render: (method) => (
                <Tag color={getPaymentMethodColor(method)}>
                  {method.replace(/_/g, ' ')}
                </Tag>
              )
            },
            { 
              title: 'Comments', 
              dataIndex: 'comments', 
              ellipsis: true 
            },
            { 
              title: 'Created By', 
              dataIndex: 'createdBy', 
              width: 120,
              ellipsis: true,
              render: (createdBy) => extractUsername(createdBy)
            }
          ]}
          pagination={false}
          scroll={{ y: 200 }}
          size="small"
          bordered
          rowKey={(record) => `${record.date}-${record.receivedAmount}`}
        />
      </Form>
    </Modal>
  );
};

export default EditModal;