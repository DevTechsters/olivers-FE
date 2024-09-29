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
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Label, Col, Input, Button, Table,FormFeedback } from 'reactstrap';
import axios from 'axios';
import Checkbox from '@mui/material/Checkbox';
import Select from 'react-select';
import moment from 'moment';
import { comment } from 'postcss';
import { toast } from 'react-toastify';
import _ from 'lodash';



export default function Home() {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,  // Changed this to 5 to match API request size
  });
  const [selectedRows, setSelectedRows] = useState({});
  const [editData, setEditdata] = useState({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [rows, setRows] = useState([]);  // Set state for rows (Bills)
  const [deliveryStatuses, setDeliveryStatuses] = useState({});


  const handleRowSelection = (id) => (event) => {
    setSelectedRows(prev => ({
      ...prev,
      [id]: event.target.checked
    }));
  };

  
  

  
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



  const [BillsHistory, setBillsHistory] = useState([]);
  const [addBill,setAddbill]=useState({
    receivedAmount:0,
    comments:"",
    date:""
  })
  const [paymentMethod,setPaymentMethod]=useState("")
  const [filterModal,setFilterModal]=useState(false)
  const [filterData, setFilterData] = useState({
    option1: null,
    option2: null,
    option3: null,
  });
  const [editPayload,setEditPayload]=useState([])
  const [errors, setErrors] = useState({
    receivedAmount:'',
    date:"",
    paymentMethod:''
  });

  const toggle = () =>{
    setModal(!modal);
    setAddbill({
      receivedAmount:0,
    comments:"",
    date:""
    })
    setPaymentMethod("")
    setEditPayload([])
    setErrors({
      receivedAmount:'',
      date:"",
      paymentMethod:''
    })
  }

  const toggleFilter =()=>{
    setFilterModal(!filterModal)
  }


  const handleAddbill=(e)=>{
    setAddbill({...addBill,[e.target.id]:e.target.value})
  }

  const handlePaymentMethod=(e)=>{
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

    if(!paymentMethod)
    {
      newErrors.paymentMethod="Payment Method is required"
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddClick=()=>{  
    if(!validateForm())
    {
      toast.error("Fill mandatory fields")
        return;
    }  
    let username=sessionStorage.getItem("user")
    let arr=_.cloneDeep(BillsHistory)
    arr.push({...addBill,paymentMethod:paymentMethod,createdBy:username})
    setBillsHistory(arr)
    let payloadArr=_.cloneDeep(editPayload)
    payloadArr.push({...addBill,paymentMethod:paymentMethod,createdBy:username})
    setEditPayload(payloadArr)
    setAddbill({
      receivedAmount:0,
      comments:"",
      date:""
    })
    toast.info("Added Succesfully")
    
  }

  const saveEdit=async()=>{
    console.log(editPayload);
    
    try{
      await axios.post(`/api/bill/edit/${editData.invoiceId}`,editPayload)
      toast.info("Saved successfully")
      await fetchBills(); // Fetch the updated data directly
      toggle(); 
    }
    catch(error){
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
          icon={<Checkbox 
            checked={!!selectedRows[id]}
            onChange={handleRowSelection(id)}
          />}
          label="Select"
          className="textPrimary"
          onClick={() => {}}
        />,
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
    { field: 'invoiceAmount', headerName: 'Invoice Amount', width: 130 },
    { field: 'balance', headerName: 'Balance', width: 100 },
    { field: 'amountReceived', headerName: 'Amount Received', width: 130 },
    { field: 'cheque', headerName: 'Cheque', width: 120 },
    { field: 'cashDiscount', headerName: 'Cash Discount', width: 130 },
    { field: 'damage', headerName: 'Damage', width: 120 },
    { field: 'claim', headerName: 'Claim', width: 120 },
    { field: 'creditNote', headerName: 'Credit Note', width: 130 },
    { field: 'gpay', headerName: 'GPay', width: 120 },
    { field: 'partPayment', headerName: 'Part Payment', width: 130 },
    { field: 'delivery', headerName: 'Delivery', width: 130 },
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
    
    { field: 'remarks', headerName: 'Remarks', width: 180 },
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
  

  // const rows = [
  //   {
  //     id: 0,
  //     BillId: 1,
  //     Brand: "Chocalate",
  //     SalespersonName: "Hariii",
  //     Beat: "PaperMill",
  //     Day: "Thursday",
  //     Bill_Number: "FR09876545678",
  //     Billdate: "24/9/2024",
  //     day_count: 14,
  //     RetailerName: "Pandian Stores Super Market",
  //     Balance: 1000,
  //     Rec: 100,
  //     InvoiceAmount: 500,
  //     amount_received: 100,
  //     Cheque: 0,
  //     CashDiscount: 40,
  //     Damage: 0,
  //     Claim: 100,
  //     CreditNote: 100,
  //     Gpay: 100,
  //     part_payment: 100,
  //     delivery: 100,
  //     Cancel: 100,
  //     createdBy: "Admin",
  //     createdAt: "2024-04-26T10:30:00",
  //     updatedBy: null,
  //     updatedAt: null,
  //     tally_status: "completed",
  //     BillsHistory: [{
  //       date: "26/4/2024",
  //       paymentMethod: "Cash, Credit Note",
  //       receivedAmoun: 200,
  //       comments: "Paid cash and used credit note",
  //       createdBy: "Admin",
  //       createdAt: "2024-04-26T10:30:00",
  //       updatedBy: null,
  //       updatedAt: null
  //     },
  //     {
  //       date: "27/4/2024",
  //       paymentMethod: "Gpay, Part Payment",
  //       receivedAmount: 150,
  //       comments: "Part payment through Gpay",
  //       createdBy: "Admin",
  //       createdAt: "2024-04-27T11:00:00",
  //       updatedBy: null,
  //       updatedAt: null
  //     },
  //     {
  //       date: "27/4/2024",
  //       paymentMethod: "Gpay, Part Payment",
  //       receivedAmount: 150,
  //       comments: "Part payment through Gpay",
  //       createdBy: "Admin",
  //       createdAt: "2024-04-27T11:00:00",
  //       updatedBy: null,
  //       updatedAt: null
  //     },
  //     {
  //       date: "27/4/2024",
  //       paymentMethod: "Gpay, Part Payment",
  //       receivedAmount: 150,
  //       comments: "Part payment through Gpay",
  //       createdBy: "Admin",
  //       createdAt: "2024-04-27T11:00:00",
  //       updatedBy: null,
  //       updatedAt: null
  //     },
  //     {
  //       date: "27/4/2024",
  //       paymentMethod: "Gpay, Part Payment",
  //       receivedAmount: 150,
  //       comments: "Part payment through Gpay",
  //       createdBy: "Admin",
  //       createdAt: "2024-04-27T11:00:00",
  //       updatedBy: null,
  //       updatedAt: null
  //     },
  //   ]
  //   },
  //   {
  //     id: 1,
  //     BillId: 1,
  //     Brand: "Chocalate",
  //     SalespersonName: "Hari",
  //     Beat: "PaperMill",
  //     Day: "Thursday",
  //     Bill_Number: "IO09876545678",
  //     Billdate: "24/9/2024",
  //     day_count: 14,
  //     RetailerName: "Pandian Stores Super Market",
  //     Balance: 1000,
  //     Rec: 100,
  //     InvoiceAmount: 500,
  //     amount_received: 100,
  //     Cheque: 0,
  //     CashDiscount: 40,
  //     Damage: 0,
  //     Claim: 100,
  //     CreditNote: 100,
  //     Gpay: 100,
  //     part_payment: 100,
  //     delivery: 100,
  //     Cancel: 100,
  //     createdBy: "Admin",
  //     createdAt: "2024-04-26T10:30:00",
  //     updatedBy: null,
  //     updatedAt: null,
  //     tally_status: "completed"
  //   },
  //   {
  //     id: 2,
  //     BillId: 1,
  //     Brand: "Chocalate",
  //     SalespersonName: "Hari",
  //     Beat: "PaperMill",
  //     Day: "Thursday",
  //     Bill_Number: "FR09876545678",
  //     Billdate: "24/9/2024",
  //     day_count: 14,
  //     RetailerName: "Pandian Stores Super Market",
  //     Balance: 1000,
  //     Rec: 100,
  //     InvoiceAmount: 500,
  //     amount_received: 100,
  //     Cheque: 0,
  //     CashDiscount: 40,
  //     Damage: 0,
  //     Claim: 100,
  //     CreditNote: 100,
  //     Gpay: 100,
  //     part_payment: 100,
  //     delivery: 100,
  //     Cancel: 100,
  //     createdBy: "Admin",
  //     createdAt: "2024-04-26T10:30:00",
  //     updatedBy: null,
  //     updatedAt: null,
  //     tally_status: "completed"
  //   },
  //   {
  //     id: 3,
  //     BillId: 1,
  //     Brand: "Chocalate",
  //     SalespersonName: "Hari",
  //     Beat: "PaperMill",
  //     Day: "Thursday",
  //     Bill_Number: "FR09876545678",
  //     Billdate: "24/9/2024",
  //     day_count: 14,
  //     RetailerName: "Pandian Stores Super Market",
  //     Balance: 1000,
  //     Rec: 100,
  //     InvoiceAmount: 500,
  //     amount_received: 100,
  //     Cheque: 0,
  //     CashDiscount: 40,
  //     Damage: 0,
  //     Claim: 100,
  //     CreditNote: 100,
  //     Gpay: 100,
  //     part_payment: 100,
  //     delivery: 100,
  //     Cancel: 100,
  //     createdBy: "Admin",
  //     createdAt: "2024-04-26T10:30:00",
  //     updatedBy: null,
  //     updatedAt: null,
  //     tally_status: "completed"
  //   },
  //   {
  //     id: 4,
  //     BillId: 1,
  //     Brand: "Chocalate",
  //     SalespersonName: "Hari",
  //     Beat: "PaperMill",
  //     Day: "Thursday",
  //     Bill_Number: "FR09876545678",
  //     Billdate: "24/9/2024",
  //     day_count: 14,
  //     RetailerName: "Pandian Stores Super Market",
  //     Balance: 1000,
  //     Rec: 100,
  //     InvoiceAmount: 500,
  //     amount_received: 100,
  //     Cheque: 0,
  //     CashDiscount: 40,
  //     Damage: 0,
  //     Claim: 100,
  //     CreditNote: 100,
  //     Gpay: 100,
  //     part_payment: 100,
  //     delivery: 100,
  //     Cancel: 100,
  //     createdBy: "Admin",
  //     createdAt: "2024-04-26T10:30:00",
  //     updatedBy: null,
  //     updatedAt: null,
  //     tally_status: "completed"
  //   }
  // ]

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
            <button className="bg-blue-500 text-white px-4 rounded">
              <FileDownloadIcon /> Export
            </button>
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
  onCellEditCommit={(params) => {
    const updatedRows = rows.map((row) => 
      row.id === params.id ? { ...row, [params.field]: params.value } : row
    );
    setRows(updatedRows);
  }}
  getRowClassName={(params) => 
    selectedRows[params.id] ? 'highlighted-row' : ''
  }
  disableAutoFocus={true}
  keepNonExistentRowsSelected={true}
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
                    <Input id='receivedAmount' value={addBill.receivedAmount} type="number" min="1" onChange={handleAddbill}  invalid={!!errors.receivedAmount}/>
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

        </>
      )}
    </>
  );
}
