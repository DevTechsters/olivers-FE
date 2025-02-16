import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Input, Select, DatePicker, Descriptions, Divider, message, Checkbox, Row, Col } from 'antd';
import { SearchOutlined, FilterOutlined, EditOutlined, DeleteOutlined, SaveOutlined, DownloadOutlined } from '@ant-design/icons';
import { PlusOutlined } from '@ant-design/icons';
import EditModal from '../modals/EditModal';
import ChequeModal from '../modals/ChequeModal';
import FilterModal from '../modals/FilterModal';
import EditableCell from '../components/EditableCell';
import ResizableTitle from '../components/ResizableTitle';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';

import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';
import Header from '../components/Header';
import Loader from '../components/Loader';
import ExportModal from './Export';
import 'react-resizable/css/styles.css';
import { Resizable } from 'react-resizable';
import { handleApiError } from "../helpers/errorHandler";
import billService from '../services/api';

const { Option } = Select;
const { TextArea } = Input;

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
    salespersonNames: [],
    retailerNames: [],
    beats: [],
    brandNames: []
  });
  const [editPayload, setEditPayload] = useState([]);
  const [errors, setErrors] = useState({ receivedAmount: '', date: "", paymentMethod: '' });
  const [chequeErrors, setChequeErrors] = useState({ bankName: "", chequeNumber: "", chequeDate: "", chequeAmount: "" });
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [chequeModal, setChequeModal] = useState(false);
  
  // At the beginning of your component, add this state for the delete modal
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  
  const [savePayload, setSavePayload] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [totalrows, settotalrows] = useState(0);
  
  // Add new state for column widths
  const [columnWidths, setColumnWidths] = useState({});

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
      width: 160,
      render: (_, record, index) => {
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
                setChequeEdit(index);  // Set current row index
                setChequeModal(true);  // Show modal
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
    {
      title: 'Delivery Person',
      dataIndex: 'deliveryPerson',
      width: 150,
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
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      width: 180,
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
    {
      title: 'Created At', 
      dataIndex: 'createdAt', 
      width: 150,
      render: (text) => moment(text).format('DD/MM/YYYY hh:mm a') 
    },
    {
      title: 'Created By', 
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
    {
      title: 'Tally Status',
      dataIndex: 'tallyStatus',
      width: 120,
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
        message.error("Please fill cheque bounce amount")
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

  const deleteBillApi = async (invoiceIds) => {
    const success = await billService.deleteBills(invoiceIds);
    if (success) {
      fetchBills();
      setRowSelectionModel([]);
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
  
  const handleAddClick = () => {
    if (!validateForm()) {
      message.error("Please fill all mandatory fields");
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

    message.success("Payment added successfully");
  };

  // Fix the saveEdit function to properly handle state updates and data refreshing
  const saveEdit = async () => {
    const success = await billService.editBill(editData.invoiceId, editPayload);
    if (success) {
      await fetchBills();
      setEditPayload([]);
      toggle();
    }
  };

  // Fetch bills
  const fetchBills = async (checkfilter) => {
    setLoading(true);
    try {
      const result = await billService.fetchBills(paginationModel, filterData, checkfilter);
      setRows(result.bills);
      settotalrows(result.totalItems);
      return result.bills;
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch filter data
  const fetchFilterData = async () => {
    setLoading(true);
    try {
      const data = await billService.getFilterData();
      setFiterConst(data);
    } catch (error) {
      console.error('Error fetching filter data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch by search query
  const fetchQuery = async () => {
    try {
      setLoading(true);
      const bills = await billService.searchBills(searchQuery);
      setRows(bills);
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
    const success = await billService.saveChanges(savePayload);
    if (success) {
      await fetchBills();
      setSavePayload({});
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

  const handleFilterSelectChange = (name, value) => {
    setFilterData(prev => ({...prev, [name]: value}));
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

  return (
    <>
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
                // Empty onRow handler
              })}
            />
          </div>
          <EditModal
            isOpen={modal}
            onClose={toggle}
            editData={editData}
            BillsHistory={BillsHistory}
            addBill={addBill}
            paymentMethod={paymentMethod}
            errors={errors}
            onSave={saveEdit}
            onAddPayment={handleAddClick}
            onAddBillChange={handleAddbill}
            onPaymentMethodChange={handlePaymentMethod}
          />
          <ChequeModal 
            isOpen={chequeModal}
            onClose={() => setChequeModal(false)}
            chequeEdit={chequeEdit}
            rows={rows}
            setRows={setRows}
            setSavePayload={setSavePayload}
          />
          <FilterModal 
            isOpen={filterModal}
            onClose={toggleFilter}
            filterData={filterData}
            filterConst={filterConst}
            onFilterChange={(name, value) => setFilterData(prev => ({...prev, [name]: value}))}
            onApply={() => { fetchBills(); toggleFilter(); }}
            onClear={clearFilter}
          />
          <DeleteConfirmationModal 
            visible={deleteModalVisible}
            onCancel={handleDialogClose}
            onConfirm={handleDialogConfirm}
            isBulkDelete={deleteAll}
            billNo={selectedRowId.billNo}
          />
        </>
      )}
    </>
  );
}