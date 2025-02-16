import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Input, DatePicker, Checkbox, message, Divider, Tag, Tooltip, Space } from 'antd';
import { EditOutlined, CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import _ from 'lodash';

const ChequeModal = ({
  isOpen,
  onClose,
  chequeEdit,
  rows,
  setRows,
  setSavePayload
}) => {
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [editingChequeIndex, setEditingChequeIndex] = useState(null);
  
  const initialChequeState = {
    bankName: "",
    chequeNumber: "",
    chequeDate: null,
    chequeAmount: "",
    isCleared: false,
    isBounced: false,
    bounceAmt: 0,
  };
  
  const [chequeData, setChequeData] = useState(initialChequeState);
  const [chequeErrors, setChequeErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setHasAttemptedSubmit(false);
      setChequeErrors({});
      setChequeData(initialChequeState);
      setEditingChequeIndex(null);
    }
  }, [isOpen]);

  const validateChequeForm = () => {
    const newErrors = {};
    
    if (!chequeData.bankName?.trim()) {
      newErrors.bankName = 'Bank name is required';
    }
    
    if (!chequeData.chequeNumber?.trim()) {
      newErrors.chequeNumber = 'Cheque number is required';
    }
    
    if (!chequeData.chequeDate) {
      newErrors.chequeDate = 'Cheque date is required';
    }
    
    if (!chequeData.chequeAmount || chequeData.chequeAmount <= 0) {
      newErrors.chequeAmount = 'Valid cheque amount is required';
    }
    
    if (chequeData.isBounced && (!chequeData.bounceAmt || chequeData.bounceAmt <= 0)) {
      newErrors.bounceAmt = 'Bounce amount is required when cheque is marked as bounced';
    }

    setChequeErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChequeAction = () => {
    setHasAttemptedSubmit(true);
    
    if (!validateChequeForm()) {
      message.error("Please fill all mandatory fields");
      return;
    }

    const newCheque = {
      bankName: chequeData.bankName,
      chequeNumber: chequeData.chequeNumber,
      chequeDate: chequeData.chequeDate,
      chequeAmount: parseFloat(chequeData.chequeAmount),
      isCleared: chequeData.isCleared,
      isBounced: chequeData.isBounced,
      bounceAmt: parseFloat(chequeData.bounceAmt || 0)
    };

    // Update local state
    let rowObj = _.cloneDeep(rows);
    if (chequeEdit !== undefined && rowObj[chequeEdit]) {
      if (editingChequeIndex !== null) {
        // Update existing cheque
        rowObj[chequeEdit].chequeHistory[editingChequeIndex] = newCheque;
        message.success("Cheque updated successfully");
      } else {
        // Add new cheque
        if (!rowObj[chequeEdit].chequeHistory) {
          rowObj[chequeEdit].chequeHistory = [];
        }
        rowObj[chequeEdit].chequeHistory.push(newCheque);
        message.success("Cheque added successfully");
      }
      
      setRows(rowObj);

      // Update save payload
      const invoiceId = rowObj[chequeEdit].invoiceId;
      setSavePayload(prev => ({
        ...prev,
        [invoiceId]: {
          ...prev[invoiceId],
          cheques: rowObj[chequeEdit].chequeHistory
        }
      }));
    } else {
      message.error("Cannot process cheque: invalid row selected");
      return;
    }

    // Reset form and states
    setChequeData(initialChequeState);
    setEditingChequeIndex(null);
  };

  const handleInputChange = (field, value) => {
    setChequeData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (hasAttemptedSubmit) {
      setChequeErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const startEdit = (cheque, index) => {
    setChequeData({
      bankName: cheque.bankName,
      chequeNumber: cheque.chequeNumber,
      chequeDate: cheque.chequeDate,
      chequeAmount: cheque.chequeAmount.toString(),
      isCleared: cheque.isCleared,
      isBounced: cheque.isBounced,
      bounceAmt: cheque.bounceAmt ? cheque.bounceAmt.toString() : "0"
    });
    setEditingChequeIndex(index);
    setHasAttemptedSubmit(false);
    setChequeErrors({});
  };

  const cancelEdit = () => {
    setChequeData(initialChequeState);
    setEditingChequeIndex(null);
    setHasAttemptedSubmit(false);
    setChequeErrors({});
  };

  // Check if chequeEdit is valid and rows exists
  const hasValidChequeHistory = 
    typeof chequeEdit !== 'undefined' && 
    rows && 
    rows[chequeEdit] && 
    rows[chequeEdit].chequeHistory && 
    rows[chequeEdit].chequeHistory.length > 0;

  return (
    <Modal
      title={
        <div className="flex items-center justify-between">
          <span>Cheque Management</span>
          {editingChequeIndex !== null && (
            <Tag color="blue">Editing Cheque #{rows[chequeEdit]?.chequeHistory[editingChequeIndex]?.chequeNumber}</Tag>
          )}
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={editingChequeIndex !== null ? cancelEdit : onClose}>
          {editingChequeIndex !== null ? "Cancel Edit" : "Close"}
        </Button>,
        <Button 
          key="action" 
          type="primary" 
          onClick={handleChequeAction}
        >
          {editingChequeIndex !== null ? "Update Cheque" : "Add Cheque"}
        </Button>,
      ]}
      width={900}
    >
      <div className="space-y-4">
        {/* Cheque Form Section */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-4">{editingChequeIndex !== null ? "Edit Cheque" : "Add New Cheque"}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <Input
                placeholder="Enter bank name"
                value={chequeData.bankName}
                onChange={e => handleInputChange('bankName', e.target.value)}
                status={hasAttemptedSubmit && chequeErrors.bankName ? "error" : ""}
              />
              {hasAttemptedSubmit && chequeErrors.bankName && (
                <div className="text-red-500 text-sm mt-1">{chequeErrors.bankName}</div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cheque Number</label>
              <Input
                placeholder="Enter cheque number"
                value={chequeData.chequeNumber}
                onChange={e => handleInputChange('chequeNumber', e.target.value)}
                status={hasAttemptedSubmit && chequeErrors.chequeNumber ? "error" : ""}
              />
              {hasAttemptedSubmit && chequeErrors.chequeNumber && (
                <div className="text-red-500 text-sm mt-1">{chequeErrors.chequeNumber}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cheque Date</label>
              <DatePicker
                placeholder="Select date"
                value={chequeData.chequeDate ? moment(chequeData.chequeDate) : null}
                onChange={date => handleInputChange('chequeDate', date)}
                status={hasAttemptedSubmit && chequeErrors.chequeDate ? "error" : ""}
                style={{ width: '100%' }}
              />
              {hasAttemptedSubmit && chequeErrors.chequeDate && (
                <div className="text-red-500 text-sm mt-1">{chequeErrors.chequeDate}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cheque Amount (₹)</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={chequeData.chequeAmount}
                onChange={e => handleInputChange('chequeAmount', e.target.value)}
                status={hasAttemptedSubmit && chequeErrors.chequeAmount ? "error" : ""}
                prefix="₹"
              />
              {hasAttemptedSubmit && chequeErrors.chequeAmount && (
                <div className="text-red-500 text-sm mt-1">{chequeErrors.chequeAmount}</div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cheque Status</label>
            <div className="flex flex-wrap gap-6">
              <Checkbox
                checked={chequeData.isCleared}
                onChange={e => {
                  handleInputChange('isCleared', e.target.checked);
                  if (e.target.checked) {
                    handleInputChange('isBounced', false);
                    handleInputChange('bounceAmt', 0);
                  }
                }}
              >
                <span className="flex items-center">
                  <CheckCircleOutlined className="mr-1 text-green-600" />
                  Cleared
                </span>
              </Checkbox>
              
              <Checkbox
                checked={chequeData.isBounced}
                onChange={e => {
                  handleInputChange('isBounced', e.target.checked);
                  if (e.target.checked) {
                    handleInputChange('isCleared', false);
                  }
                }}
              >
                <span className="flex items-center">
                  <CloseCircleOutlined className="mr-1 text-red-600" />
                  Bounced
                </span>
              </Checkbox>
              
              {!chequeData.isCleared && !chequeData.isBounced && (
                <span className="flex items-center text-gray-500">
                  <QuestionCircleOutlined className="mr-1 text-yellow-600" />
                  Pending
                </span>
              )}
            </div>
          </div>

          {chequeData.isBounced && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bounce Amount (₹)</label>
              <Input
                type="number"
                placeholder="Enter bounce amount"
                value={chequeData.bounceAmt}
                onChange={e => handleInputChange('bounceAmt', e.target.value)}
                status={hasAttemptedSubmit && chequeErrors.bounceAmt ? "error" : ""}
                prefix="₹"
                style={{ maxWidth: '300px' }}
              />
              {hasAttemptedSubmit && chequeErrors.bounceAmt && (
                <div className="text-red-500 text-sm mt-1">{chequeErrors.bounceAmt}</div>
              )}
            </div>
          )}
        </div>

        {/* Cheque History Section */}
        {hasValidChequeHistory && (
          <div className="mt-6">
            <Divider orientation="left">
              <span className="text-gray-700">Cheque History</span>
            </Divider>
            <Table
              dataSource={rows[chequeEdit].chequeHistory.map((cheque, index) => ({
                ...cheque,
                key: index
              }))}
              columns={[
                { 
                  title: 'Bank',
                  dataIndex: 'bankName',
                  width: 120,
                  ellipsis: true
                },
                { 
                  title: 'Cheque No',
                  dataIndex: 'chequeNumber',
                  width: 120
                },
                { 
                  title: 'Date', 
                  dataIndex: 'chequeDate',
                  width: 120,
                  render: (date) => moment(date).format('DD/MM/YYYY')
                },
                { 
                  title: 'Amount', 
                  dataIndex: 'chequeAmount',
                  width: 120,
                  render: (amount) => `₹${parseFloat(amount).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`
                },
                {
                  title: 'Status',
                  width: 150,
                  render: (_, record) => (
                    <div>
                      {record.isCleared && (
                        <Tag color="success" icon={<CheckCircleOutlined />}>
                          Cleared
                        </Tag>
                      )}
                      {record.isBounced && (
                        <div>
                          <Tag color="error" icon={<CloseCircleOutlined />}>
                            Bounced
                          </Tag>
                          {record.bounceAmt > 0 && (
                            <div className="text-sm text-gray-500 mt-1">
                              Bounce: ₹{parseFloat(record.bounceAmt).toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </div>
                          )}
                        </div>
                      )}
                      {!record.isCleared && !record.isBounced && (
                        <Tag color="warning" icon={<QuestionCircleOutlined />}>
                          Pending
                        </Tag>
                      )}
                    </div>
                  )
                },
                {
                  title: 'Action',
                  width: 100,
                  render: (_, record, index) => (
                    <Tooltip title="Edit cheque">
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => startEdit(record, index)}
                        disabled={editingChequeIndex !== null}
                      />
                    </Tooltip>
                  )
                }
              ]}
              pagination={false}
              size="small"
              bordered
              className="cheque-history-table"
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ChequeModal;