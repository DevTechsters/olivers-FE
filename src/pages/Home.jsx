import React, { useState } from 'react'
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

export default function Home() {
  const [loading, setloading] = useState(false)
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  const handleEditClick = (id) => () => {
  };



  const handleDeleteClick = (id) => () => {
  };

  const columns = [
    { field: 'brand', headerName: 'Brand' },
    {
      field: 'firstName',
      headerName: 'SO',
    },
    {
      field: 'lastName',
      headerName: 'BEAT',
    },
    {
      field: 'age',
      headerName: 'Bill No',
    },
    {
      field: 'fullName',
      headerName: 'Bill Date',
    },
    {
      field: 'fullName',
      headerName: 'Retailer Name',
    },
    {
      field: '',
      headerName: 'Invoice Amount',
    },
    {
      field: '',
      headerName: 'Received (CHQ+ GPAY)',
    },
    {
      field: '',
      headerName: 'Cash Discount',
    },
    {
      field: '',
      headerName: 'Damage',
    },
    {
      field: '',
      headerName: 'Claim',
    },
    {
      field: '',
      headerName: 'CR Note',
    },
    {
      field: '',
      headerName: 'Delivery Status',
    },
    {
      field: '',
      headerName: 'Tally Status',
    },
    {
      field: '',
      headerName: 'Balance',
    },
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
  ];

  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  ]


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
              <SearchIcon className='m-2'/>
              <input className='h-full focus:outline-none' type='text' placeholder='Search...'/>
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
              pageSizeOptions={[10, 100, 1000]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pagination
              checkboxSelection
              disableRowSelectionOnClick
            />
          </Box>
        </div></>}
    </>
  )
}
