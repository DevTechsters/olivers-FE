import React from 'react'
import Header from '../components/Header'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

export default function Home() {

  const handleEditClick = (id) => () => {
  };



  const handleDeleteClick = (id) => () => {
  };

  const columns = [
    { field: 'id', headerName: 'INVOICE', width: 90 },
    {
      field: 'firstName',
      headerName: 'CUSTOMER',
    },
    {
      field: 'lastName',
      headerName: 'STATUS',
    },
    {
      field: 'age',
      headerName: 'AMOUNT',
      type: 'number',
    },
    {
      field: 'fullName',
      headerName: 'PAYMENT TYPE',
    },
    {
      field: 'fullName',
      headerName: 'UPDATED BY',
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
      <Header />
      <div class="flex justify-end my-5 mr-10">
        <button class="bg-blue-500 text-white py-2 px-4 rounded">
          <FileDownloadIcon></FileDownloadIcon> Export
        </button>
      </div>
      <div className='m-4 bg-white'>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
          className='p-4'
        />
      </Box>
      </div>
    </>
  )
}
