import React, { useEffect, useState,useMemo } from 'react';
import { Modal, Button, Table, Input, Select, DatePicker,Descriptions,Divider, message, Checkbox, Row, Col } from 'antd';
import { SearchOutlined, FilterOutlined, EditOutlined, DeleteOutlined, SaveOutlined, DownloadOutlined } from '@ant-design/icons';
import { PlusOutlined } from '@ant-design/icons';

import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';
import Header from '../components/Header';
import Loader from '../components/Loader';
import ExportModal from './Export';
import 'react-resizable/css/styles.css';
import { Resizable } from 'react-resizable';
import { handleApiError } from "../helpers/errorHandler";

const { Option } = Select;
const { TextArea } = Input;



// Resizable Header Cell Component
const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            right: -5,
            bottom: 0,
            top: 0,
            width: 10,
            cursor: 'col-resize',
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};



export default function Home() {

  

   // Add state for editing
   const [editingKey, setEditingKey] = useState('');
   const [editingField, setEditingField] = useState('');

  const [exportModal, setExportModal] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 1, pageSize: 10 });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState({ id: null, billNo: null });
  const [deleteAll, setDeleteAll] = useState(false);
  const [editData, setEditdata] = useState({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [rows, setRows] = useState([]);
  const [chequeEdit, setChequeEdit] = useState(null);
  const [BillsHistory, setBillsHistory] = useState([]);
  const [addBill, setAddbill] = useState({ receivedAmount: 0, comments: "", date: "" });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [filterModal, setFilterModal] = useState(false);
  const [filterData, setFilterData] = useState({
    salespersonNames: [],
    retailerNames: [],
    beats: [],
    brandNames: [],
    days: [],
  });
  const [filterConst, setFiterConst] = useState({
    salespersonNames: ["Mohan", "Naveen", "Murali"],
    retailerNames: ["ABC Stores", "GHI Stores", "DEF Stores"],
    beats: ["Beat 2", "Beat 3", "Beat 1"],
    brandNames: ["Mango Bite", "Diary Milk", "Coffee Bite"],
  });
  const [editPayload, setEditPayload] = useState([]);
  const [errors, setErrors] = useState({ receivedAmount: '', date: "", paymentMethod: '' });
  const [chequeErrors, setChequeErrors] = useState({ bankName: "", chequeNumber: "", chequeDate: "", chequeAmount: "" });
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [chequeModal, setChequeModal] = useState(false);

/// At the beginning of your component, add this state for the delete modal
const [deleteModalVisible, setDeleteModalVisible] = useState(false);

// Update these functions for the delete functionality

// Single delete
const handleDeleteClick = (id) => {
  const rowToDelete = rows.find(row => row.id === id);
  if (rowToDelete) {
    setSelectedRowId({
      id,
      billNo: rowToDelete.billno
    });
    setDeleteAll(false);
    setDeleteModalVisible(true);
  }
};

// Bulk delete
const handleBulkDelete = () => {
  if (rowSelectionModel.length === 0) return;
  setDeleteAll(true);
  setDeleteModalVisible(true);
};

// Confirm dialog handler
const handleDialogConfirm = () => {
  if (deleteAll) {
    deleteBillApi(rowSelectionModel);
  } else {
    deleteBillApi([selectedRowId.id]);
  }
  setDeleteModalVisible(false);
};

// Cancel dialog handler
const handleDialogClose = () => {
  setDeleteModalVisible(false);
};

// Confirm dialog handler


  // Update the ChequeModal component with enhanced validation and features


  const ChequeModal = () => {
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
  
    useEffect(() => {
      if (chequeModal) {
        setHasAttemptedSubmit(false);
        setChequeErrors({});
        setChequeData({
          bankName: "",
          chequeNumber: "",
          chequeDate: "",
          chequeAmount: "",
          isCleared: false,
          isBounced: false,
          bounceAmt: 0
        });
      }
    }, [chequeModal]);
  
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
  
   // Inside the ChequeModal component, modify the handleChequeAdd function:

   const handleChequeAdd = () => {
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
    rowObj[chequeEdit].chequeHistory = [
      ...rowObj[chequeEdit].chequeHistory,
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
  
    // Reset form and close modal
    setChequeData(initialChequeState);
    setChequeModal(false);
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
  
    return (
      <Modal
        title="Cheque Details"
        open={chequeModal}
        onCancel={() => setChequeModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setChequeModal(false)}>
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
        {rows[chequeEdit]?.chequeHistory?.length > 0 && (
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
  
  const [chequeData, setChequeData] = useState({
    bankName: "",
    chequeNumber: "",
    chequeDate: "",
    chequeAmount: "",
    isCleared: false,
    isBounced: false,
    bounceAmt: 0,
  });
  const [savePayload, setSavePayload] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [totalrows, settotalrows] = useState(0);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const getRowClassName = (record) => {
    if (record.deliveryStatus === "Pending") {
      return 'bg-darkRed';
    } else if (record.deliveryStatus === "Partially Delivered") {
      return 'bg-gold';
    } else if (record.deliveryStatus === "Delivered") {
      return 'bg-forestGreen';
    } else {
      return 'bg-deepViolet';
    }
  };

  // Add new state for column widths
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

// Add custom styles for the resizable functionality
const components = {
  header: {
    cell: ResizableTitle,
  },
};

  
  const handleCellClick = (key, field) => {
    if (editingKey !== '') {
      // If already editing, save the current edit before starting a new one
      handleSave();
    }
    setEditingKey(key);
    setEditingField(field);
  };

  const handleCellChange = (value, key, field) => {
    const row = rows.find(row => row.id === key);
    if (!row || row[field] === value) return; // Skip if no change
  
    // Update UI state
    setRows(prevRows => 
      prevRows.map(row => 
        row.id === key ? { ...row, [field]: value } : row
      )
    );
  
    // Update savePayload
    const invoiceId = row.invoiceId;
    setSavePayload(prev => ({
      ...prev,
      [invoiceId]: {
        ...prev[invoiceId],
        [field]: value,
      },
    }));
  };
  const handleSave = () => {


    setEditingKey('');
    setEditingField('');
  };

  
  

 
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
  


  const columns = [
    {
      title: 'Actions',
      dataIndex: 'actions',
      fixed: 'left',
      width: 100,
      render: (_, record) => (
        <>
          <Button icon={<EditOutlined />} onClick={handleEditClick(record.id)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDeleteClick(record.id)} />
        </>
      ),
    },
    { title: 'Brand', dataIndex: 'brand', width: 120 },
    { title: 'Salesperson', dataIndex: 'salespersonName', width: 150 },
    { title: 'Beat', dataIndex: 'beat', width: 100 },
    { title: 'Bill No', dataIndex: 'billno', width: 100 },
    { 
      title: 'Bill Date', 
      dataIndex: 'billdate', 
      width: 120, 
      render: (text) => moment(text).format('DD/MM/YYYY') 
    },
    { 
      title: 'Due Days', 
      width: 100,
      render: (text, record) => {
        const billDate = moment(record.billdate);
        const currentDate = moment();
        const diff = billDate.diff(currentDate, 'days');
        return diff >= 0 ? diff : Math.abs(diff);
      }
    },
    { title: 'Retailer', dataIndex: 'retailerName', width: 150 },
    { title: 'Invoice Amt', dataIndex: 'updatedInvoiceAmount', width: 120 },
    { title: 'Balance', dataIndex: 'balance', width: 100 },
    { title: 'Amt Received', dataIndex: 'amountReceived', width: 120 },
    {
      title: 'Cheque',
      dataIndex: 'cheque',
      width: 160, // Increased width to accommodate amount
      render: (_, record, index) => {
        // Calculate total cheque amount
        const totalChequeAmount = record.chequeHistory?.reduce(
          (sum, cheque) => sum + (cheque.chequeAmount || 0),
          0
        ) || 0;
    
        return (
          <div className="flex items-center space-x-2">
            <Button 
              icon={<EditOutlined />} 
              type="link"
              onClick={() => {
                setChequeEdit(index);
                setChequeModal(true);
                // Initialize cheque data if needed
                if (record.chequeHistory?.length > 0) {
                  const latestCheque = record.chequeHistory[record.chequeHistory.length - 1];
                  setChequeData({
                    bankName: latestCheque.bankName || "",
                    chequeNumber: latestCheque.chequeNumber || "",
                    chequeDate: latestCheque.chequeDate || "",
                    chequeAmount: latestCheque.chequeAmount || "",
                    isCleared: latestCheque.isCleared || false,
                    isBounced: latestCheque.isBounced || false,
                    bounceAmt: latestCheque.bounceAmt || 0
                  });
                }
              }}
            />
            <div className="flex flex-col">
              <span className="font-medium text-base">
                ₹{totalChequeAmount.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500">
                {record.chequeHistory?.length || 0} Cheques
              </span>
            </div>
          </div>
        );
      }
    },

    {
      title: 'Cash Discount',
      dataIndex: 'cashDiscount',
      width: 130,
      render: (text, record) => (
        <EditableCell
          record={record}
          dataIndex="cashDiscount"
          editingKey={editingKey}
          editingField={editingField}
          onCellClick={handleCellClick}
          onCellChange={handleCellChange}
          onSave={handleSave}
        />
      )
    },
    {
      title: 'Damage',
      dataIndex: 'damage',
      width: 120,
      render: (text, record) => (
        <EditableCell
          record={record}
          dataIndex="damage"
          editingKey={editingKey}
          editingField={editingField}
          onCellClick={handleCellClick}
          onCellChange={handleCellChange}
          onSave={handleSave}
        />
      )
    },
    {
      title: 'Claim',
      dataIndex: 'claim',
      width: 120,
      render: (text, record) => (
        <EditableCell
          record={record}
          dataIndex="claim"
          editingKey={editingKey}
          editingField={editingField}
          onCellClick={handleCellClick}
          onCellChange={handleCellChange}
          onSave={handleSave}
        />
      )
    },
    {
      title: 'Credit Note',
      dataIndex: 'creditNote',
      width: 130,
      render: (text, record) => (
        <EditableCell
          record={record}
          dataIndex="creditNote"
          editingKey={editingKey}
          editingField={editingField}
          onCellClick={handleCellClick}
          onCellChange={handleCellChange}
          onSave={handleSave}
        />
      )
    },
    {
      title: 'GPay',
      dataIndex: 'gpay',
      width: 120,
      render: (text, record) => (
        <EditableCell
          record={record}
          dataIndex="gpay"
          editingKey={editingKey}
          editingField={editingField}
          onCellClick={handleCellClick}
          onCellChange={handleCellChange}
          onSave={handleSave}
        />
      )
    },
    { 
      title: 'Cash', 
      dataIndex: 'cash', 
      width: 100,
      render: (text, record) => (
        <EditableCell
          record={record}
          dataIndex="cash"
          editingKey={editingKey}
          editingField={editingField}
          onCellClick={handleCellClick}
          onCellChange={handleCellChange}
          onSave={handleSave}
        />
      )
    },
    { title: 'Delivery Person', dataIndex: 'deliveryPerson', width: 150,

      render: (text, record) => (
        <EditableCell
          record={record}
          dataIndex="deliveryPerson"
          editingKey={editingKey}
          editingField={editingField}
          onCellClick={handleCellClick}
          onCellChange={handleCellChange}
          onSave={handleSave}
        />
      )




     },
   // In the Delivery Status column render function

  {
    title: 'Delivery Status',
    dataIndex: 'deliveryStatus',
    width: 150,
    render: (text, record) => (
      <Select
        className="delivery-status-select"
        value={text}
        onChange={value => {
          handleCellChange(value, record.id, 'deliveryStatus');
          handleSave();
        }}
        style={{ width: '100%' }}
      >
        <Option value="Delivered" className="delivered">Delivered</Option>
        <Option value="Partially Delivered" className="partially-delivered">Partially Delivered</Option>
        <Option value="Pending" className="pending">Pending</Option>
        <Option value="Cancelled" className="cancelled">Cancelled</Option>
      </Select>
    ),
  },
    { title: 'Remarks', dataIndex: 'remarks', width: 180,

      render: (text, record) => (
        <EditableCell
          record={record}
          dataIndex="remarks"
          editingKey={editingKey}
          editingField={editingField}
          onCellClick={handleCellClick}
          onCellChange={handleCellChange}
          onSave={handleSave}
        />
      )



     },
    { title: 'Created At', 
      dataIndex: 'createdAt', 
      width: 150,
      render: (text) => moment(text).format('DD/MM/YYYY hh:mm a') 
    },
    { title: 'Created By', 
      dataIndex: 'createdBy', 
      width: 120 
    },
    { title: 'Updated By', dataIndex: 'updatedBy', width: 120 },
    { 
      title: 'Updated At', 
      dataIndex: 'updatedAt', 
      width: 150, 
      render: (text) => moment(text).format('DD/MM/YYYY hh:mm a') 
    },
    { title: 'Tally Status', dataIndex: 'tallyStatus', width: 120 ,
      render: (text, record) => (
        <EditableCell
          record={record}
          dataIndex="tallyStatus"
          editingKey={editingKey}
          editingField={editingField}
          onCellClick={handleCellClick}
          onCellChange={handleCellChange}
          onSave={handleSave}
        />
      )



    },
  ];

  const toggleExport = () => {
    setExportModal(!exportModal);
  };

  const handleDialogOpen = (id) => {
    if (deleteAll) {
      setOpenDialog(true);
    } else {
      const rowToDelete = rows.find(row => row.id === id);
      if (rowToDelete) {
        setSelectedRowId({
          id,
          billNo: rowToDelete.billno
        });
        setOpenDialog(true);
      }
    }
  };




  const toggle = () => {
    setModal(!modal);
    setAddbill({
      receivedAmount: 0,
      comments: "",
      date: ""
    });
    setPaymentMethod("");
    setEditPayload([]);
    setErrors({
      receivedAmount: '',
      date: "",
      paymentMethod: ''
    });
  };

  const toggleFilter = () => {
    setFilterModal(!filterModal);
  };

  
  const toggleCheque = () => {
    if (chequeModal === true) {
      if (validateCheque()) {
        setChequeModal(!chequeModal)
      }
      else {
        toast.error("Please fill cheque bounce amount")
      }
    }
    else {
      setChequeModal(!chequeModal)
    }
  }

  
  const handleAddbill = (e) => {
    setAddbill({ ...addBill, [e.target.id]: e.target.value });
  };

  const validateCheque = () => {
    let arr = rows[chequeEdit].chequeHistory
    let valid = true

    arr.map((item) => {
      if (item.isBounced && !item.bounceAmt) {
        valid = false
      }
    })


    return valid
  }

  const handlePaymentMethod = (value) => {
    setPaymentMethod(value);
  };

  // In handleEditClick, ensure billsHistory is properly initialized
const handleEditClick = (id) => () => {
  const rowToEdit = rows.find((row) => row.id === id);
  if (rowToEdit) {
    setEditdata(rowToEdit);
    // Initialize with existing bills history from row data
    setBillsHistory(rowToEdit.billsHistory || []);
    setModal(true);
  }
};

  const deleteBillApi = async (invoiceId) => {
    try {
      const response = await axios.delete("http://localhost:8081/api/bill/delete", {
        data: { invoiceIds: invoiceId },
        withCredentials: true,
      });
      message.success("Deleted successfully");
      fetchBills();
      setRowSelectionModel([]);
    } catch (error) {
      console.error('Error deleting bill:', error);
      message.error('Error deleting bill');
    }
  };





  const validateForm = () => {
    const newErrors = {};
    if (!addBill.receivedAmount || addBill.receivedAmount <= 0) {
      newErrors.receivedAmount = 'Valid amount is required';
    }
    if (!addBill.date) {
      newErrors.date = 'Date is required';
    }
    if (!paymentMethod) {
      newErrors.paymentMethod = "Payment Method is required";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateChequeForm = () => {
    const newErrors = {};
    if (!chequeData.bankName) {
      newErrors.bankName = 'Bank name is required';
    }

    if (!chequeData.chequeNumber) {
      newErrors.chequeNumber = 'Cheque number is required';
    }

    if (!chequeData.chequeDate) {
      newErrors.chequeDate = "Cheque date is required"
    }

    if (!chequeData.chequeAmount) {
      newErrors.chequeAmount = "Cheque Date is required"
    }

    setChequeErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
const handleAddClick = () => {
  if (!validateForm()) {
    message.error("Please fill all mandatory fields"); // Changed from toast
      return;
  }

  let username = sessionStorage.getItem("user");

  // Format the date to yyyy-MM-dd before sending
  let formattedDate = moment(addBill.date, "DD/MM/YYYY").format("YYYY-MM-DD");

  let newBill = {
      ...addBill,
      date: formattedDate, 
      paymentMethod: paymentMethod,
      createdBy: username
  };

  let arr = _.cloneDeep(BillsHistory);
  arr.push(newBill);
  setBillsHistory(arr);

  let payloadArr = _.cloneDeep(editPayload);
  payloadArr.push(newBill);
  setEditPayload(payloadArr);

  setAddbill({
      receivedAmount: 0,
      comments: "",
      date: ""
  });

  message.success("Payment added successfully"); // Changed from toast
};

// 1. Fix the saveEdit function to properly handle state updates and data refreshing
const saveEdit = async () => {
  try {
    // Send the edit payload
    await axios.post(
      `http://localhost:8081/api/bill/edit/${editData.invoiceId}`,
      editPayload,
      { withCredentials: true }
    );

    // Show success message
    message.success("Saved successfully");
    
    // Refresh bills data
    await fetchBills();
    
    // Reset edit payload to prevent duplicate submissions
    setEditPayload([]);
    
    // Close the modal
    toggle();
  } catch (error) {
    handleApiError(error);
    console.error('Save error:', error);
  }
};

  const fetchBills = async (checkfilter) => {
    setLoading(true);
    let payload;
    if (checkfilter) {
      payload = {
        ...{
          salespersonNames: [],
          retailerNames: [],
          beats: [],
          brandNames: [],
          days: [],
        }, ...{ page: paginationModel.page, size: paginationModel.pageSize }
      };
    } else {
      payload = {
        ...filterData, ...{ page: paginationModel.page, size: paginationModel.pageSize }
      };
    }

    
  try {
    const response = await axios.post(
      `http://localhost:8081/api/bill`,
      payload,
      { withCredentials: true }
    );

    // Process and set rows
   // In fetchBills function, change:
const billsData = response.data.Bills.map((bill) => ({
  id: bill.invoiceId,  // Use actual invoice ID as row ID
  ...bill,
}));
    
    setRows(billsData);
    settotalrows(response.data.pagination.totalItems);
    
    // Return the processed data
    return billsData;
  } catch (error) {
    console.error('Error fetching bills:', error);
    throw error;
  } finally {
    setLoading(false);
  }
};

  const fetchFilterData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8081/api/bill/filter")
      setFiterConst(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bills:', error);
      setLoading(false);
      handleApiError(error)
    }
  }


  const fetchQuery = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8081/api/bill/search', {
        params: { query: searchQuery },
      });

      setRows(response.data.Bills.map((bill, index) => ({
        id: index,
        ...bill,
      })));
    } catch (error) {
      console.error('Error searching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    if (searchQuery.trim().length === 4) {
      let timer = setTimeout(() => {
        fetchQuery();
      }, 1000);
      setDebounceTimeout(timer);
    }

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  useEffect(() => {
    fetchFilterData();
  }, []);

  useEffect(() => {
    fetchBills();
  }, [paginationModel]);

 
  const saveCall = async () => {
    const username = sessionStorage.getItem("user"); // Get current user
    const payload = Object.entries(savePayload).map(([invoiceId, fields]) => ({
      invoiceId,
      ...fields,
      updatedBy: username, // Add updatedBy with current user
    }));
  
    if (payload.length === 0) {
      message.info("No changes to save");
      return;
    }
  
    try {
      await axios.post("http://localhost:8081/api/bill/update", payload, {
        withCredentials: true,
      });
      message.success("Saved successfully");
      await fetchBills();
      setSavePayload({});
    } catch (error) {
      message.error("Error saving changes");
      console.error('Save error:', error);
    }
  };

 

  

  

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim().length === 0) {
      fetchBills();
      return;
    }
  };

  const handleFilterSelectChange = (value, name) => {
    setFilterData((prevState) => ({
      ...prevState,
      [name]: value, // Update the specific filter field
    }));
  };

  const clearFilter = () => {
    setFilterData({
      salespersonNames: [],
      retailerNames: [],
      beats: [],
      brandNames: [],
      days: [],
    });
    fetchBills(true);
    toggleFilter();
  };

  const isFormValid = useMemo(() => validateChequeForm(), [chequeData]);
  

 



  

  const renderFilterModal = () => (
    <Modal
      title="Filter Bills"
      visible={filterModal}
      onCancel={toggleFilter}
      footer={[
        <Button key="clear" onClick={clearFilter}>
          Clear Filters
        </Button>,
        <Button key="apply" type="primary" onClick={() => { fetchBills(); toggleFilter(); }}>
          Apply Filters
        </Button>,
      ]}
      width={800} // Increase modal width
    >
      <Row gutter={[16, 24]}> {/* Increase vertical spacing between rows */}
        <Col span={24}>
          <label style={{ fontSize: '16px', fontWeight: '500' }}>Salesperson Names</label>
          <Select
            mode="multiple"
            placeholder="Select Salesperson"
            value={filterData.salespersonNames}
            onChange={(value) => handleFilterSelectChange(value, 'salespersonNames')} // Pass name directly
            options={filterConst.salespersonNames.map((name) => ({ label: name, value: name }))}
            style={{ width: '100%', fontSize: '14px' }} // Full width and larger font size
            dropdownStyle={{ fontSize: '14px' }} // Larger font size in dropdown
          />
        </Col>
        <Col span={24}>
          <label style={{ fontSize: '16px', fontWeight: '500' }}>Retailer Names</label>
          <Select
            mode="multiple"
            placeholder="Select Retailer"
            value={filterData.retailerNames}
            onChange={(value) => handleFilterSelectChange(value, 'retailerNames')} // Pass name directly
            options={filterConst.retailerNames.map((name) => ({ label: name, value: name }))}
            style={{ width: '100%', fontSize: '14px' }} // Full width and larger font size
            dropdownStyle={{ fontSize: '14px' }} // Larger font size in dropdown
          />
        </Col>
        <Col span={24}>
          <label style={{ fontSize: '16px', fontWeight: '500' }}>Beats</label>
          <Select
            mode="multiple"
            placeholder="Select Beat"
            value={filterData.beats}
            onChange={(value) => handleFilterSelectChange(value, 'beats')} // Pass name directly
            options={filterConst.beats.map((beat) => ({ label: beat, value: beat }))}
            style={{ width: '100%', fontSize: '14px' }} // Full width and larger font size
            dropdownStyle={{ fontSize: '14px' }} // Larger font size in dropdown
          />
        </Col>
        <Col span={24}>
          <label style={{ fontSize: '16px', fontWeight: '500' }}>Brand Names</label>
          <Select
            mode="multiple"
            placeholder="Select Brand"
            value={filterData.brandNames}
            onChange={(value) => handleFilterSelectChange(value, 'brandNames')} // Pass name directly
            options={filterConst.brandNames.map((brand) => ({ label: brand, value: brand }))}
            style={{ width: '100%', fontSize: '14px' }} // Full width and larger font size
            dropdownStyle={{ fontSize: '14px' }} // Larger font size in dropdown
          />
        </Col>
        <Col span={24}>
          <label style={{ fontSize: '16px', fontWeight: '500' }}>Days</label>
          <Select
            mode="multiple"
            placeholder="Select Day"
            value={filterData.days}
            onChange={(value) => handleFilterSelectChange(value, 'days')} // Pass name directly
            options={days.map((day) => ({ label: day, value: day }))}
            style={{ width: '100%', fontSize: '14px' }} // Full width and larger font size
            dropdownStyle={{ fontSize: '14px' }} // Larger font size in dropdown
          />
        </Col>
      </Row>
    </Modal>
  );
  return (
    <>
   <Modal
  title="Edit Bill"
  visible={modal}
  onCancel={toggle}
  footer={[
    <Button key="cancel" onClick={toggle}>
      Cancel
    </Button>,
    <Button key="save" type="primary" onClick={saveEdit}>
      Save Changes
    </Button>
  ]}
  width={800} // Increased width
  styles={{ body: { padding: '24px' }}}  // Changed to styles.body
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
          value={addBill.receivedAmount}
          onChange={handleAddbill}
          status={errors.receivedAmount ? 'error' : ''}
          style={{ width: '100%' }}
          prefix="₹"
        />
      </Col>
      <Col span={8}>
      <DatePicker
  id="date"
  onChange={(date, dateString) => setAddbill(prev => ({
    ...prev, 
    date: dateString
  }))}
  status={errors.date ? 'error' : ''}
  style={{ width: '100%' }}
  format="DD/MM/YYYY"
/>
      </Col>
      <Col span={8}>
      <Select
  placeholder="Payment Method"
  value={paymentMethod}
  onChange={handlePaymentMethod}
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
          value={addBill.comments}
          onChange={handleAddbill}
          autoSize={{ minRows: 2, maxRows: 4 }}
          style={{ width: '100%' }}
        />
      </Col>
    </Row>

    <Row justify="end">
      <Col>
        <Button 
          type="primary" 
          onClick={handleAddClick}
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
    // Filter out any entries that might be cheque entries
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
      {loading ? (
        <Loader />
      ) : (
        <>
         <Header />
          <div className="flex justify-between my-4 mr-10">
            <div className="flex space-x-2 mx-6">
              <Button icon={<FilterOutlined />} onClick={toggleFilter} className="bg-white border border-gray-300 rounded-lg" />
              <Input
                placeholder="Search..."
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-48"
              />
            </div>
            <div className="flex space-x-2 mx-6">
              {rowSelectionModel.length > 0 && (
               <Button type="primary" danger icon={<DeleteOutlined />} onClick={handleBulkDelete}>
               Delete
             </Button>
              )}
              <Button type="primary" icon={<SaveOutlined />} onClick={saveCall}>
                Save
              </Button>
              <Button type="primary" icon={<DownloadOutlined />} onClick={toggleExport}>
                Export
              </Button>
              <ExportModal isOpen={exportModal} toggle={toggleExport} />
            </div>
          </div>
          <div className="m-4 bg-white rounded-lg shadow table-container">
            <Table
             components={components}
              columns={getResizableColumns()}
              dataSource={rows}
              loading={loading}
              pagination={{
                current: paginationModel.page,
                pageSize: paginationModel.pageSize,
                total: totalrows,
                onChange: (page, pageSize) => setPaginationModel({ page, pageSize }),
              }}
              rowSelection={{
                selectedRowKeys: rowSelectionModel,
                onChange: (newRowSelectionModel) => setRowSelectionModel(newRowSelectionModel),
              }}
              rowClassName={getRowClassName}
              rowKey="id"
              scroll={{ x: 2000, y: 500 }} // Enable horizontal and vertical scrolling
              size="small" // Make the table more compact
              onRow={(record) => ({
              
              })
            }
            />
          </div>
          <ChequeModal />
          {renderFilterModal()}
          {/* Delete Confirmation Modal */}
<Modal
  title="Confirm Deletion"
  open={deleteModalVisible}
  onCancel={handleDialogClose}
  footer={[
    <Button key="cancel" onClick={handleDialogClose}>
      Cancel
    </Button>,
    <Button key="delete" type="primary" danger onClick={handleDialogConfirm}>
      Delete
    </Button>
  ]}
>
  <p>
    Are you sure you want to delete {deleteAll ? "the selected bills" : `bill number ${selectedRowId.billNo}`}?
  </p>
</Modal>
        </>
      )}
    </>
  );
}