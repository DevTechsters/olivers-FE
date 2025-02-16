import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Input, DatePicker, Checkbox, message, Divider } from 'antd';
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
  
  const [chequeData, setChequeData] = useState({
    bankName: "",
    chequeNumber: "",
    chequeDate: "",
    chequeAmount: "",
    isCleared: false,
    isBounced: false,
    bounceAmt: 0,
  });

  const [chequeErrors, setChequeErrors] = useState({});

  const initialChequeState = {
    bankName: "",
    chequeNumber: "",
    chequeDate: "",
    chequeAmount: "",
    isCleared: false,
    isBounced: false,
    bounceAmt: 0,
  };

  useEffect(() => {
    if (isOpen) {
      setHasAttemptedSubmit(false);
      setChequeErrors({});
      setChequeData(initialChequeState);
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

  const handleChequeAdd = () => {
    setHasAttemptedSubmit(true);
    
    if (!validateChequeForm()) {
      message.error("Please fill all mandatory fields");
      return;
    }

    const newCheque = {
      bankName: chequeData.bankName,
      chequeNumber: chequeData.chequeNumber,
      chequeDate: chequeData.chequeDate,
      chequeAmount: chequeData.chequeAmount,
      isCleared: chequeData.isCleared,
      isBounced: chequeData.isBounced,
      bounceAmt: chequeData.bounceAmt
    };

    // Update local state
    let rowObj = _.cloneDeep(rows);
    if (chequeEdit !== undefined && rowObj[chequeEdit]) {
      rowObj[chequeEdit].chequeHistory = [
        ...rowObj[chequeEdit].chequeHistory || [],
        newCheque
      ];
      setRows(rowObj);

      // Update save payload - ONLY add the new cheque
      const invoiceId = rowObj[chequeEdit].invoiceId;
      setSavePayload(prev => ({
        ...prev,
        [invoiceId]: {
          ...prev[invoiceId],
          cheques: [
            ...(prev[invoiceId]?.cheques || []),
            newCheque
          ]
        }
      }));
    } else {
      message.error("Cannot add cheque: invalid row selected");
      return;
    }

    // Reset form and close modal
    setChequeData(initialChequeState);
    onClose();
    message.success("Cheque added successfully");
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

  // Check if chequeEdit is valid and rows exists
  const hasValidChequeHistory = 
    typeof chequeEdit !== 'undefined' && 
    rows && 
    rows[chequeEdit] && 
    rows[chequeEdit].chequeHistory && 
    rows[chequeEdit].chequeHistory.length > 0;

  return (
    <Modal
      title="Cheque Details"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="add" type="primary" onClick={handleChequeAdd}>
          Add Cheque
        </Button>,
      ]}
      width={1000}
    >
      <div className="space-y-6">
        {/* Cheque Form Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Add New Cheque</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Bank Name"
                value={chequeData.bankName}
                onChange={e => handleInputChange('bankName', e.target.value)}
                status={hasAttemptedSubmit && chequeErrors.bankName ? "error" : ""}
              />
              {hasAttemptedSubmit && chequeErrors.bankName && (
                <div className="text-red-500 text-sm mt-1">{chequeErrors.bankName}</div>
              )}
            </div>
            
            <div>
              <Input
                placeholder="Cheque Number"
                value={chequeData.chequeNumber}
                onChange={e => handleInputChange('chequeNumber', e.target.value)}
                status={hasAttemptedSubmit && chequeErrors.chequeNumber ? "error" : ""}
              />
              {hasAttemptedSubmit && chequeErrors.chequeNumber && (
                <div className="text-red-500 text-sm mt-1">{chequeErrors.chequeNumber}</div>
              )}
            </div>

            <div>
              <DatePicker
                placeholder="Cheque Date"
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
              <Input
                type="number"
                placeholder="Cheque Amount"
                value={chequeData.chequeAmount}
                onChange={e => handleInputChange('chequeAmount', Number(e.target.value))}
                status={hasAttemptedSubmit && chequeErrors.chequeAmount ? "error" : ""}
              />
              {hasAttemptedSubmit && chequeErrors.chequeAmount && (
                <div className="text-red-500 text-sm mt-1">{chequeErrors.chequeAmount}</div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex space-x-4">
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
                Cleared
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
                Bounced
              </Checkbox>
            </div>

            {chequeData.isBounced && (
              <div>
                <Input
                  type="number"
                  placeholder="Bounce Amount"
                  value={chequeData.bounceAmt}
                  onChange={e => handleInputChange('bounceAmt', Number(e.target.value))}
                  status={hasAttemptedSubmit && chequeErrors.bounceAmt ? "error" : ""}
                />
                {hasAttemptedSubmit && chequeErrors.bounceAmt && (
                  <div className="text-red-500 text-sm mt-1">{chequeErrors.bounceAmt}</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cheque History Section (if needed) */}
        {hasValidChequeHistory && (
          <>
            <Divider orientation="left">Cheque History</Divider>
            <Table
              dataSource={rows[chequeEdit].chequeHistory}
              columns={[
                { title: 'Bank', dataIndex: 'bankName', width: 120 },
                { title: 'Cheque No', dataIndex: 'chequeNumber', width: 120 },
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
                  render: (amount) => `₹${amount.toLocaleString()}`
                },
                {
                  title: 'Status',
                  width: 150,
                  render: (_, record) => (
                    <div>
                      {record.isCleared && <span className="text-green-600">Cleared</span>}
                      {record.isBounced && (
                        <div>
                          <span className="text-red-600">Bounced</span>
                          {record.bounceAmt > 0 && (
                            <div className="text-sm text-gray-500">
                              Bounce Amount: ₹{record.bounceAmt.toLocaleString()}
                            </div>
                          )}
                        </div>
                      )}
                      {!record.isCleared && !record.isBounced && <span className="text-yellow-600">Pending</span>}
                    </div>
                  )
                }
              ]}
              pagination={false}
              size="small"
              bordered
            />
          </>
        )}
      </div>
    </Modal>
  );
};

export default ChequeModal;