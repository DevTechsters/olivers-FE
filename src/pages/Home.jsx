import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Loader from '../components/Loader';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Label, Col, Input } from 'reactstrap';
import axios from 'axios';

export default function Home() {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [editData, setEditdata] = useState({})
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
  const handleEditClick = (id) => () => {
    setModal(true)
    setEditdata(rows[id])
  };



  const handleDeleteClick = (id) => () => {
  };

  const columns = [
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
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
        ];
      },
    },
    { field: 'Brand', headerName: 'Brand' },
    {
      field: 'SalespersonName',
      headerName: 'Salesperson Name',
    },
    {
      field: 'Beat',
      headerName: 'BEAT',
    },
    {
      field: "Day",
      headerName: "Day"
    },
    {
      field: "day_count",
      headerName: "Day count"
    },
    {
      field: 'Bill_Number',
      headerName: 'Bill No',
    },
    {
      field: 'Billdate',
      headerName: 'Bill Date',
    },
    {
      field: 'RetailerName',
      headerName: 'Retailer Name',
    },
    {
      field: "Rec",
      headerName: "Rec"
    },
    {
      field: 'InvoicedAmount',
      headerName: 'Invoice Amount',
    },
    {
      field: 'Amount Received',
      headerName: 'amount_received',
    },
    {
      field: "Cheque",
      headerName: "Cheque"
    },
    {
      field: 'CashDiscount',
      headerName: 'Cash Discount',
    },
    {
      field: 'Damage',
      headerName: 'Damage',
    },
    {
      field: 'Claim',
      headerName: 'Claim',
    },
    {
      field: 'CreditNote',
      headerName: 'CR Note',
    },
    {
      field: "Gpay",
      headerName: "Gpay"
    },
    {
      field: "part_payment",
      headerName: "Part Payment"
    },
    {
      field: 'delivery',
      headerName: 'Delivery Status',
    },
    {
      field: "Cancel",
      headerName: "Cancel"
    },
    {
      field: "createdBy",
      headerName: "Created By"
    },
    {
      field: "createdAt",
      headerName: "Created At"
    },
    {
      field: "Updated By",
      headerName: "updatedBy"
    },
    {
      field: "updatedAt",
      headerName: "Updated At"
    },
    {
      field: 'tally_status',
      headerName: 'Tally Status',
    },
    {
      field: 'Balance',
      headerName: 'Balance',
    },
  ];

  const rows = [
    {
      id: 1,
      BillId: 1,
      Brand: "Chocalate",
      SalespersonName: "Hari",
      Beat: "PaperMill",
      Day: "Thursday",
      Bill_Number: "FR09876545678",
      Billdate: "24/9/2024",
      day_count: 14,
      RetailerName: "Pandian Stores Super Market",
      Balance: 1000,
      Rec: 100,
      InvoiceAmount: 500,
      amount_received: 100,
      Cheque: 0,
      CashDiscount: 40,
      Damage: 0,
      Claim: 100,
      CreditNote: 100,
      Gpay: 100,
      part_payment: 100,
      delivery: 100,
      Cancel: 100,
      createdBy: "Admin",
      createdAt: "2024-04-26T10:30:00",
      updatedBy: null,
      updatedAt: null,
      tally_status: "completed"
    },
    {
      id: 2,
      BillId: 1,
      Brand: "Chocalate",
      SalespersonName: "Hari",
      Beat: "PaperMill",
      Day: "Thursday",
      Bill_Number: "IO09876545678",
      Billdate: "24/9/2024",
      day_count: 14,
      RetailerName: "Pandian Stores Super Market",
      Balance: 1000,
      Rec: 100,
      InvoiceAmount: 500,
      amount_received: 100,
      Cheque: 0,
      CashDiscount: 40,
      Damage: 0,
      Claim: 100,
      CreditNote: 100,
      Gpay: 100,
      part_payment: 100,
      delivery: 100,
      Cancel: 100,
      createdBy: "Admin",
      createdAt: "2024-04-26T10:30:00",
      updatedBy: null,
      updatedAt: null,
      tally_status: "completed"
    },
    {
      id: 3,
      BillId: 1,
      Brand: "Chocalate",
      SalespersonName: "Hari",
      Beat: "PaperMill",
      Day: "Thursday",
      Bill_Number: "FR09876545678",
      Billdate: "24/9/2024",
      day_count: 14,
      RetailerName: "Pandian Stores Super Market",
      Balance: 1000,
      Rec: 100,
      InvoiceAmount: 500,
      amount_received: 100,
      Cheque: 0,
      CashDiscount: 40,
      Damage: 0,
      Claim: 100,
      CreditNote: 100,
      Gpay: 100,
      part_payment: 100,
      delivery: 100,
      Cancel: 100,
      createdBy: "Admin",
      createdAt: "2024-04-26T10:30:00",
      updatedBy: null,
      updatedAt: null,
      tally_status: "completed"
    },
    {
      id: 4,
      BillId: 1,
      Brand: "Chocalate",
      SalespersonName: "Hari",
      Beat: "PaperMill",
      Day: "Thursday",
      Bill_Number: "FR09876545678",
      Billdate: "24/9/2024",
      day_count: 14,
      RetailerName: "Pandian Stores Super Market",
      Balance: 1000,
      Rec: 100,
      InvoiceAmount: 500,
      amount_received: 100,
      Cheque: 0,
      CashDiscount: 40,
      Damage: 0,
      Claim: 100,
      CreditNote: 100,
      Gpay: 100,
      part_payment: 100,
      delivery: 100,
      Cancel: 100,
      createdBy: "Admin",
      createdAt: "2024-04-26T10:30:00",
      updatedBy: null,
      updatedAt: null,
      tally_status: "completed"
    },
    {
      id: 5,
      BillId: 1,
      Brand: "Chocalate",
      SalespersonName: "Hari",
      Beat: "PaperMill",
      Day: "Thursday",
      Bill_Number: "FR09876545678",
      Billdate: "24/9/2024",
      day_count: 14,
      RetailerName: "Pandian Stores Super Market",
      Balance: 1000,
      Rec: 100,
      InvoiceAmount: 500,
      amount_received: 100,
      Cheque: 0,
      CashDiscount: 40,
      Damage: 0,
      Claim: 100,
      CreditNote: 100,
      Gpay: 100,
      part_payment: 100,
      delivery: 100,
      Cancel: 100,
      createdBy: "Admin",
      createdAt: "2024-04-26T10:30:00",
      updatedBy: null,
      updatedAt: null,
      tally_status: "completed"
    }
  ]


  useEffect(() => {
    const response = axios.get()


  }, [paginationModel])

  return (
    <>
      {loading ? <Loader /> : <><Header />
        <div class="flex justify-between my-4 mr-10">
          <div className='flex space-x-2 mx-6'>
            <div className=' bg-white border rounded-lg border-gray-300 '>
              <IconButton aria-label="filter">
                <FilterAltIcon />
              </IconButton>
            </div>
            <div className='flex space-x-1  bg-white border rounded-lg border-gray-300 '>
              <SearchIcon className='m-2' />
              <input className='h-full focus:outline-none' type='text' placeholder='Search...' />
            </div>

          </div>
          <button class="bg-blue-500 text-white  px-4 rounded">
            <FileDownloadIcon></FileDownloadIcon> Export
          </button>
        </div>
        <div className='m-4 bg-white'>
          <Box sx={{ height: '77vh', width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}

              loading={loading}
              rowCount={1000}
              pageSizeOptions={[10, 50, 100]}
              paginationModel={paginationModel}
              paginationMode="server"
              onPaginationModelChange={setPaginationModel}
              disableRowSelectionOnClick
            />
          </Box>
        </div>
        <Modal isOpen={modal} toggle={toggle} centered={true} size='lg'>
          <ModalHeader toggle={toggle}>{editData.Bill_Number}</ModalHeader>
          <ModalBody>
            <Row>
              <Col>
                <Label>Amount</Label>
                <Input type='number' min='1' />
              </Col>
              <Col>
                <Label>Comments</Label>
                <Input type='textarea' min='1' />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>

          </ModalFooter>
        </Modal>
      </>}
    </>
  )
}
