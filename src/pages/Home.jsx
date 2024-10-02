import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Loader from '../components/Loader';
import { styled } from '@mui/material/styles';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Label, Col, Input, Button, Table, FormFeedback } from 'reactstrap';
import axios from 'axios';
import Select from 'react-select';
import { toast } from 'react-toastify';
import _ from 'lodash';
import SaveIcon from '@mui/icons-material/Save';



export default function Home() {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,  // Changed this to 5 to match API request size
  });
  const [editData, setEditdata] = useState({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [rows, setRows] = useState([{
    id: 0,
    invoiceId: 35,
    brand: "Mango Bite",
    salespersonName: "Murali",
    beat: "Beat 1",
    billno: "1001.0",
    billdate: "2024-08-31T18:30:00.000+00:00",
    retailerName: "ABC Stores",
    updatedInvoiceAmount: 500,
    balance: 300,
    amountReceived: 200,
    cheque: 100,
    cashDiscount: 0,
    damage: 0,
    claim: 0,
    creditNote: 0,
    gpay: 100,
    cash: 0,
    deliveryPerson: 0,
    deliveryStatus: "Pending",
    createdBy: null,
    createdAt: null,
    updatedBy: null,
    updatedAt: null,
    tallyStatus: null,
    remarks: "123",
    originalInvoiceAmount: 500,
    chequeHistory: [
      {
        chequeId: 15,
        bankName: "IOB",
        chequeNumber: "1234",
        chequeDate: "2024-08-31T18:30:00.000+00:00",
        chequeAmount: 100,
        isCleared: false,
        isBounced: true,
        bounceAmt: 100
      }

    ],
    billsHistory: [
      {
        id: 79,
        billId: 35,
        paymentMethod: "Cheque",
        receivedAmount: "100.0",
        comments: "Updated in Bills directly Cheque Number 1234 and it is Not Cleared",
        createdBy: null,
        createdAt: null,
        updatedBy: null,
        updatedAt: null
      },
      {
        id: 80,
        billId: 35,
        paymentMethod: "Gpay",
        receivedAmount: "100.0",
        comments: "Updated in Bills directly",
        createdBy: null,
        createdAt: null,
        updatedBy: null,
        updatedAt: null
      },
      {
        id: 81,
        billId: 35,
        paymentMethod: "Cheque",
        receivedAmount: "100.0",
        comments: "Updated in Bills directly Cheque Number 1234 and it is cleared",
        createdBy: null,
        createdAt: null,
        updatedBy: null,
        updatedAt: null
      }
    ]
  },
  {
    id: 1,
    invoiceId: 38,
    brand: "Mango Bite",
    salespersonName: "Murali",
    beat: "Beat 1",
    billno: "1001.0",
    billdate: "2024-08-31T18:30:00.000+00:00",
    retailerName: "ABC Stores",
    updatedInvoiceAmount: 500,
    balance: 300,
    amountReceived: 200,
    cheque: 100,
    cashDiscount: 0,
    damage: 0,
    claim: 0,
    creditNote: 0,
    gpay: 100,
    cash: 0,
    deliveryPerson: 0,
    deliveryStatus: "Pending",
    createdBy: null,
    createdAt: null,
    updatedBy: null,
    updatedAt: null,
    tallyStatus: null,
    remarks: "123",
    originalInvoiceAmount: 500,
    chequeHistory: [],
    billsHistory: [
      {
        id: 79,
        billId: 35,
        paymentMethod: "Cheque",
        receivedAmount: "100.0",
        comments: "Updated in Bills directly Cheque Number 1234 and it is Not Cleared",
        createdBy: null,
        createdAt: null,
        updatedBy: null,
        updatedAt: null
      },
      {
        id: 80,
        billId: 35,
        paymentMethod: "Gpay",
        receivedAmount: "100.0",
        comments: "Updated in Bills directly",
        createdBy: null,
        createdAt: null,
        updatedBy: null,
        updatedAt: null
      },
      {
        id: 81,
        billId: 35,
        paymentMethod: "Cheque",
        receivedAmount: "100.0",
        comments: "Updated in Bills directly Cheque Number 1234 and it is cleared",
        createdBy: null,
        createdAt: null,
        updatedBy: null,
        updatedAt: null
      }
    ]
  }
  ]);  // Set state for rows (Bills)
  const [chequeEdit, setChequeEdit] = useState(null);
  const [BillsHistory, setBillsHistory] = useState([]);
  const [addBill, setAddbill] = useState({
    receivedAmount: 0,
    comments: "",
    date: ""
  })
  const [paymentMethod, setPaymentMethod] = useState("")
  const [filterModal, setFilterModal] = useState(false)
  const [filterData, setFilterData] = useState({
    option1: null,
    option2: null,
    option3: null,
  });
  const [editPayload, setEditPayload] = useState([])
  const [errors, setErrors] = useState({
    receivedAmount: '',
    date: "",
    paymentMethod: ''
  });
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [chequeModal, setChequeModal] = useState(false)
  const [chequeData,setChequeData]=useState({
    bankName: "",
    chequeNumber: "",
    chequeDate: "",
    chequeAmount: "",
    isCleared: false,
    isBounced: false,
    bounceAmt: 0
  })

  const [savePayload,setSavePayload]=useState({})

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
      outline: 'none',
    },
    '& .MuiDataGrid-cell:hover': {
      backgroundColor: 'transparent',
    },
    '& .actions': {
      color: theme.palette.text.primary,
      '&:hover': {
        backgroundColor: 'transparent',
      },
      '& .MuiIconButton-root': {
        padding: 0,
      },
    },
  }));
  const deliveryStatusOptions = [
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Partially Delivered', label: 'Partially Delivered' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Cancelled', label: 'Cancelled' },
  ];
  // Handle delivery status change
  // Handle delivery status change
  const handleDeliveryStatusChange = async (selectedOption, id) => {
    // Update local state
    setRows(prevRows =>
      prevRows.map(row =>
        row.id === id ? { ...row, deliveryStatus: selectedOption.value } : row
      )
    );

    // Send update to backend
    try {
      await axios.patch(`/api/bill/${id}`, { deliveryStatus: selectedOption.value });
    } catch (error) {
      console.error('Error updating delivery status:', error);
      // Optionally, revert the local state change if the API call fails
    }
  };

  // Tailwind inspired custom styles for react-select
  // Tailwind inspired custom styles for react-select
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'transparent',
      border: 'none',
      boxShadow: 'none',
      '&:hover': {
        border: 'none',
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0',
    }),
    singleValue: (provided) => ({
      ...provided,
      marginLeft: '0',
    }),
    input: (provided) => ({
      ...provided,
      margin: '0',
      padding: '0',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: state.isFocused ? '#4f46e5' : '#6b7280',
      padding: '0',
      ':hover': {
        color: '#4f46e5',
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'white',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: 'none',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#4f46e5'
        : state.isFocused
          ? '#e0e7ff'
          : 'white',
      color: state.isSelected ? 'white' : '#111827',
      padding: '8px 12px',
    }),
  };

  const toggle = () => {
    setModal(!modal);
    setAddbill({
      receivedAmount: 0,
      comments: "",
      date: ""
    })
    setPaymentMethod("")
    setEditPayload([])
    setErrors({
      receivedAmount: '',
      date: "",
      paymentMethod: ''
    })
  }

  const toggleFilter = () => {
    setFilterModal(!filterModal)
  }

  const toggleCheque = () => {
    setChequeModal(!chequeModal)
  }


  const handleAddbill = (e) => {
    setAddbill({ ...addBill, [e.target.id]: e.target.value })
  }

  const handlePaymentMethod = (e) => {
    setPaymentMethod(e.label)
  }

  const handleEditClick = (id) => () => {
    setModal(true);
    setEditdata(rows[id]);
    setBillsHistory(rows[id].billsHistory);
  };

  const handleDeleteClick = (id) => () => {
    // Handle delete action
  };

  const validateForm = () => {
    const newErrors = {};
    if (!addBill.receivedAmount) {
      newErrors.receivedAmount = 'Amount is required';
    }

    if (!addBill.date) {
      newErrors.date = 'Date is required';
    }

    if (!paymentMethod) {
      newErrors.paymentMethod = "Payment Method is required"
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddClick = () => {
    if (!validateForm()) {
      toast.error("Fill mandatory fields")
      return;
    }
    let username = sessionStorage.getItem("user")
    let arr = _.cloneDeep(BillsHistory)
    arr.push({ ...addBill, paymentMethod: paymentMethod, createdBy: username })
    setBillsHistory(arr)
    let payloadArr = _.cloneDeep(editPayload)
    payloadArr.push({ ...addBill, paymentMethod: paymentMethod, createdBy: username })
    setEditPayload(payloadArr)
    setAddbill({
      receivedAmount: 0,
      comments: "",
      date: ""
    })
    toast.info("Added Succesfully")

  }

  const saveEdit = async () => {
    console.log(editPayload);

    try {
      await axios.post(`/api/bill/edit/${editData.invoiceId}`, editPayload)
      toast.info("Saved successfully")
      await fetchBills(); // Fetch the updated data directly
      toggle();
    }
    catch (error) {
      toast.error(error.response)
    }
  }



  const columns = [
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      cellClassName: 'actions',
      getActions: ({ id }) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          className="textPrimary"
          onClick={handleEditClick(id)}
          color="inherit"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleDeleteClick(id)}
          color="inherit"
        />,
      ],
    },
    { field: 'brand', headerName: 'Brand', width: 120 },
    { field: 'salespersonName', headerName: 'Salesperson Name', width: 150 },
    { field: 'beat', headerName: 'Beat', width: 120 },
    { field: 'billno', headerName: 'Bill No', width: 100 },
    { field: 'billdate', headerName: 'Bill Date', width: 100 },
    { field: 'retailerName', headerName: 'Retailer Name', width: 150 },
    { field: 'updatedInvoiceAmount', headerName: 'Invoice Amount', width: 130 },
    { field: 'balance', headerName: 'Balance', width: 100 },
    { field: 'amountReceived', headerName: 'Amount Received', width: 130 },
    {
      field: 'cheque', headerName: 'Cheque', width: 120, editable: true,
      renderCell: (params,row) => {
        return (
          <>
            <p>{params.value} <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={(e)=>{
                setChequeEdit(params.id)
                toggleCheque()
              }}
              color="inherit"
            /></p>
          </>
        )
      },
    },
    { field: 'cashDiscount', headerName: 'Cash Discount', width: 130, editable: true },
    { field: 'damage', headerName: 'Damage', width: 120, editable: true },
    { field: 'claim', headerName: 'Claim', width: 120, editable: true },
    { field: 'creditNote', headerName: 'Credit Note', width: 130, editable: true },
    { field: 'gpay', headerName: 'GPay', width: 120, editable: true },
    { field: 'cash', headerName: 'Cash', width: 130, editable: true },
    { field: 'deliveryPerson', headerName: 'Delivery Person', width: 130, editable: true },
    {

      field: 'deliveryStatus',
      headerName: 'Delivery Status',
      width: 200,
      editable: true,
      renderCell: (params) => {
        const status = deliveryStatusOptions.find(option => option.value === params.value);
        return (
          <Select
            value={status}
            onChange={(selectedOption) => handleDeliveryStatusChange(selectedOption, params.id)}
            options={deliveryStatusOptions}
            styles={customSelectStyles}
            placeholder="Select status"
            isClearable={false}
            menuPortalTarget={document.body}
            components={{
              IndicatorSeparator: () => null
            }}
          />
        );
      },
    },

    { field: 'remarks', headerName: 'Remarks', width: 180, editable: true },
    { field: 'createdBy', headerName: 'Created By', width: 130 },
    { field: 'createdAt', headerName: 'Created At', width: 100 },
    { field: 'updatedBy', headerName: 'Updated By', width: 100 },
    { field: 'updatedAt', headerName: 'Updated At', width: 130 },
    { field: 'tallyStatus', headerName: 'Tally Status', width: 130 },
  ];

  const fetchBills = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8081/api/bill?page=${paginationModel.page + 1}&size=${paginationModel.pageSize}`
      );
      const billsData = response.data.Bills.map((bill, index) => ({
        id: index,  // Assign an ID for each row
        ...bill,
      }));
      setRows(billsData);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBills(); // Initial data fetch
  }, [paginationModel]); // Dependency array keeps it responsive to pagination changes


  const handleCelleditCommit = (newRow,oldRow) => {
    const updatedFields = {};
    Object.keys(newRow).forEach((field) => {
      if (newRow[field] !== oldRow[field]) {
        updatedFields[field] = newRow[field];
      }
    });

    const save=_.cloneDeep(savePayload)
    if(newRow.invoiceId in save){
      save[newRow.invoiceId]={...save[newRow.invoiceId],...updatedFields}
    }
    else
    {
      save[newRow.invoiceId]=updatedFields
    }
    setSavePayload(save)

    setRows((prevRows) =>
      prevRows.map((row) => (row.id === newRow.id ? newRow : row))
    );
    return newRow;
  }

  const saveCall = () => {
    console.log(rowSelectionModel);
    const payload = []
    rowSelectionModel.map((id) => {
      let invoiceId=rows[id]?.invoiceId

      payload.push({...savePayload[invoiceId],invoiceId})
    })

    console.log(payload);

    

    axios.post("http://localhost:8081/api/bill/update",payload).then(()=>{

    }).catch(()=>{

    })


  }
  console.log(rows);
  console.log(savePayload);
  

  const handleChequeAdd=()=>{
    let rowObj=_.cloneDeep(rows)
    rowObj[chequeEdit].chequeHistory.push(chequeData)
    setRows(rowObj)
    let invoiceId=rowObj[chequeEdit].invoiceId
    const save=_.cloneDeep(savePayload)
    if(invoiceId in save){
      save[invoiceId]={...save[invoiceId],cheques:rowObj[chequeEdit].chequeHistory}
    }
    else
    {

      save[invoiceId]={...save[invoiceId],cheques:rowObj[chequeEdit].chequeHistory}
    }
    setSavePayload(save)
    
  }

  const handleCheque=(e)=>{
    setChequeData({...chequeData,[e.target.id]:e.target.value})
  }


  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Header />
          <div className="flex justify-between my-4 mr-10">
            <div className="flex space-x-2 mx-6">
              <div className="bg-white border rounded-lg border-gray-300">
                <IconButton aria-label="filter" onClick={toggleFilter}>
                  <FilterAltIcon />
                </IconButton>
              </div>
              <div className="flex space-x-1 bg-white border rounded-lg border-gray-300">
                <SearchIcon className="m-2" />
                <input className="h-full focus:outline-none" type="text" placeholder="Search..." />
              </div>
            </div>
            <div className="flex space-x-2 mx-6">
              <button className="bg-blue-500 text-white px-4 rounded" onClick={saveCall}>
                <SaveIcon /> Save
              </button>
              <button className="bg-blue-500 text-white px-4 rounded">
                <FileDownloadIcon /> Export
              </button>
            </div>
          </div>
          <div className="m-4 bg-white">
            <Box sx={{ height: '77vh', width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                rowCount={rows.length}
                pageSizeOptions={[5, 10, 50]}
                paginationModel={paginationModel}
                paginationMode="server"
                onPaginationModelChange={setPaginationModel}
                disableRowSelectionOnClick
                processRowUpdate={handleCelleditCommit}
                disableAutoFocus={true}
                keepNonExistentRowsSelected={true}
                checkboxSelection={true}
                onRowSelectionModelChange={(newRowSelectionModel) => {
                  setRowSelectionModel(newRowSelectionModel);
                }}
                rowSelectionModel={rowSelectionModel}
                editMode='cell'
              />
            </Box>
          </div>
          {/* Modal for edit functionality */}
          <Modal isOpen={modal} toggle={toggle} centered={true} size="xl">
            <ModalHeader toggle={toggle}>{editData.billno}</ModalHeader>
            <ModalBody>
              <div className="m-2 p-2">
                <Row>
                  {/* Modal content for editing */}
                  <Col>
                    <Label>Date *</Label>
                    <Input id='date' value={addBill.date} type="date" onChange={handleAddbill} invalid={!!errors.date} />
                    {errors.date && <FormFeedback>{errors.date}</FormFeedback>}
                  </Col>
                  <Col>
                    <Label>Comments</Label>
                    <Input id='comments' type="textarea" value={addBill.comments} onChange={handleAddbill} />
                  </Col>
                  <Col>
                    <Label>Payment Method *</Label>
                    <Select
                      options={[
                        { value: 'Gpay', label: 'Gpay' },
                        { value: 'Cash', label: 'Cash' },
                        { value: 'Cheque', label: 'Cheque' },
                      ]}
                      onChange={handlePaymentMethod}
                    />
                    {errors.paymentMethod && <FormFeedback>{errors.paymentMethod}</FormFeedback>}
                  </Col>
                  <Col>
                    <Label>Amount *</Label>
                    <Input id='receivedAmount' value={addBill.receivedAmount} type="number" min="1" onChange={handleAddbill} invalid={!!errors.receivedAmount} />
                    {errors.receivedAmount && <FormFeedback>{errors.receivedAmount}</FormFeedback>}
                  </Col>
                  <Col>
                    <Button color="primary" onClick={handleAddClick}>Add</Button>
                  </Col>
                </Row>
              </div>
              <div className="m-2 p-2">
                <Table bordered hover responsive striped>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Payment Method</th>
                      <th>Received Amount</th>
                      <th>Comments</th>
                      <th>Created by</th>
                      <th>Created At</th>
                      <th>Updated by</th>
                      <th>Updated At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BillsHistory &&
                      BillsHistory.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.date}</td>
                          <td>{item.paymentMethod}</td>
                          <td>{item.receivedAmount}</td>
                          <td>{item.comments}</td>
                          <td>{item.createdBy}</td>
                          <td>{item.createdAt}</td>
                          <td>{item.updatedBy}</td>
                          <td>{item.updatedAt}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={saveEdit}>Save</Button>
              <Button onClick={toggle}>Cancel</Button>
            </ModalFooter>
          </Modal>
          <Modal isOpen={filterModal} toggle={toggleFilter} centered={true} size="xl">
            <ModalHeader toggle={toggleFilter}>Filter</ModalHeader>
            <ModalBody>
              <div className="m-2 p-2">
                <Row>
                  <Label>Salesperson Name</Label>
                  <Select />
                </Row>
                <Row>
                  <Label>Retailer Name</Label>
                  <Select />
                </Row>
                <Row>
                  <Col>
                    <Label>From</Label>
                    <Input type='date' />
                  </Col>
                  <Col>
                    <Label>To</Label>
                    <Input type='date' />
                  </Col>
                </Row>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary">Filter</Button>
              <Button onClick={toggleFilter}>Cancel</Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={chequeModal} toggle={toggleCheque} centered={true} size="xl">
            <ModalHeader toggle={toggleCheque}>Cheque Details</ModalHeader>
            <ModalBody>
              <Row>
                <Col>
                  <Label>Bank Name</Label>
                  <Input type='text' id='bankName' onChange={handleCheque}/>
                </Col>
                <Col>
                  <Label>Cheque Number</Label>
                  <Input type='text' id="chequeNumber"  onChange={handleCheque} />
                </Col>
                <Col>
                  <Label>Cheque Date</Label>
                  <Input type='date' id='chequeDate' onChange={handleCheque}/>
                </Col>
                <Col>
                  <Label>Amount</Label>
                  <Input type='number' id="chequeAmount" onChange={handleCheque} />
                </Col>
                <Col>
                  <Button color="primary" onClick={handleChequeAdd}>Add</Button>
                </Col>
              </Row>
              <div className="m-2 p-2">
                <Table bordered hover responsive striped>
                  <thead>
                    <tr>
                      <th>Bank Name</th>
                      <th>Cheque Number</th>
                      <th>Cheque Date</th>
                      <th>Amount</th>
                      <th>Cleared</th>
                      <th>Bounced</th>
                      <th>Bounced Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows[chequeEdit]?.chequeHistory ?
                      rows[chequeEdit].chequeHistory.map((item) => (
                        <tr key={item.chequeId}>
                          <td>{item.bankName}</td>
                          <td>{item.chequeNumber}</td>
                          <td>{item.chequeDate}</td>
                          <td>{item.chequeAmount}</td>
                          <td><input type='checkbox' value={item.isCleared} /></td>
                          <td><input type='checkbox' value={item.isBounced}/></td>
                          <td><input type='number' value={item.bounceAmt} /></td>
                        </tr>
                      )):null}
                  </tbody>
                </Table>
              </div>
              
            </ModalBody>
            <ModalFooter>
              <Button onClick={toggleCheque}>Back</Button>
            </ModalFooter>
          </Modal>



        </>
      )}
    </>
  );
}
