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
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Label, Col, Input, Button, Table } from 'reactstrap';
import axios from 'axios';
import Select from 'react-select';
import moment from 'moment';
import { comment } from 'postcss';


export default function Home() {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,  // Changed this to 5 to match API request size
  });
  const [editData, setEditdata] = useState({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [rows, setRows] = useState([]);  // Set state for rows (Bills)
  const [BillsHistory, setBillsHistory] = useState([]);
  const [addBill,setAddbill]=useState({
    amount:0,
    comment:"",
    date:""
  })
  const [paymentMethod,setPaymentMethod]=useState("")

  console.log(addBill,paymentMethod);
  

  const toggle = () =>{
    setModal(!modal);
    setAddbill({
      amount:0,
    comment:"",
    date:""
    })
    setPaymentMethod("")
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
    setBillsHistory(rows[id].BillsHistory);
  };

  const handleDeleteClick = (id) => () => {
    // Handle delete action
  };

  const columns = [
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
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
    { field: 'invoiceAmount', headerName: 'Invoice Amount', width: 130 },
    { field: 'balance', headerName: 'Balance', width: 100 },
    { field: 'rec', headerName: 'REC', width: 100 },
    { field: 'amountReceived', headerName: 'Amount Received', width: 130 },
    { field: 'cheque', headerName: 'Cheque', width: 120 },
    { field: 'cashDiscount', headerName: 'Cash Discount', width: 130 },
    { field: 'damage', headerName: 'Damage', width: 120 },
    { field: 'claim', headerName: 'Claim', width: 120 },
    { field: 'creditNote', headerName: 'Credit Note', width: 130 },
    { field: 'gpay', headerName: 'GPay', width: 120 },
    { field: 'partPayment', headerName: 'Part Payment', width: 130 },
    { field: 'delivery', headerName: 'Delivery', width: 120 },
    { field: 'cancel', headerName: 'Cancel', width: 120 },
    { field: 'remarks', headerName: 'Remarks', width: 180 },
    { field: 'createdBy', headerName: 'Created By', width: 130 },
    { field: 'createdAt', headerName: 'Created At', width: 100 },
    { field: 'updatedBy', headerName: 'Updated By', width: 100 },
    { field: 'updatedAt', headerName: 'Updated At', width: 130 },
    { field: 'tallyStatus', headerName: 'Tally Status', width: 130 },
  ];

  useEffect(() => {
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

    fetchBills();
  }, [paginationModel]);

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
                <IconButton aria-label="filter">
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
                    <Label>Amount</Label>
                    <Input id='amount' type="number" min="1" onChange={handleAddbill} />
                  </Col>
                  <Col>
                    <Label>Comments</Label>
                    <Input id='comment' type="textarea" onChange={handleAddbill} />
                  </Col>
                  <Col>
                    <Label>Payment Method</Label>
                    <Select
                      options={[
                        { value: 'Gpay', label: 'Gpay' },
                        { value: 'Cash', label: 'Cash' },
                        { value: 'Cheque', label: 'Cheque' },
                      ]}
                      onChange={handlePaymentMethod}
                    />
                  </Col>
                  <Col>
                    <Label>Date</Label>
                    <Input id='date' type="date" onChange={handleAddbill} />
                  </Col>
                  <Col>
                    <Button color="primary">Add</Button>
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
              <Button color="primary">Save</Button>
              <Button onClick={toggle}>Cancel</Button>
            </ModalFooter>
          </Modal>
        </>
      )}
    </>
  );
}
