import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Input, DatePicker, message, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import '../css/auditLogs.css';

const { RangePicker } = DatePicker;

const AuditLogs = () => {
  // States for managing audit log data and loading state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // States for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0); // Total number of records

  // Filter states (can be controlled by user input or default values)
  const [filters, setFilters] = useState({
    user: '',
    operationType: '',
    billNo: '',
    dateFrom: null,
    dateTo: null,
  });

  // Fetch audit logs on component mount or when filters change
  useEffect(() => {
    fetchAuditLogs();
  }, [filters, currentPage, pageSize]); // Depend on filters, currentPage, pageSize to refetch on changes

  const fetchAuditLogs = async () => {
    setLoading(true);

    // Prepare the filters for the API request, sending only those that are not empty
    const requestPayload = { ...filters, page: currentPage, pageSize };

    try {
      // Make a POST request to fetch the audit logs
      const response = await axios.post('http://localhost:8081/api/audit', requestPayload, { withCredentials: true });

      // Set the fetched data to the state
      setData(response.data); // Assuming `response.data.logs` contains the actual logs
     // setTotal(response.data); // Assuming `response.data.total` contains the total number of records
      message.success('Audit logs fetched successfully!');
    } catch (error) {
      // Handle errors if API call fails
      console.error('Error fetching audit logs:', error);
      message.error('Failed to fetch audit logs.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleFilterChange = (value, field) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleDateChange = (dates) => {
    const [dateFrom, dateTo] = dates || [];
    setFilters({
      ...filters,
      dateFrom: dateFrom ? dateFrom.toISOString() : null,
      dateTo: dateTo ? dateTo.toISOString() : null,
    });
  };

  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const columns = [
    {
      title: 'Bill Number',
      dataIndex: 'billNumber',
      key: 'billNumber',
    },
    {
      title: 'Operation Type',
      dataIndex: 'operationType',
      key: 'operationType',
    },
    {
      title: 'Modified By',
      dataIndex: 'modifiedBy',
      key: 'modifiedBy',
    },
    {
      title: 'Modified At',
      dataIndex: 'modifiedAt',
      key: 'modifiedAt',
      render: (text) => new Date(text).toLocaleString(), // Format date
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
    },
  ];

  return (
    <div className="audit-logs-container">
      <h1 className="page-title">Audit Logs</h1>
      <div className="filters-container">
        <Space size="large" className="filters">
          <Input
            placeholder="User"
            value={filters.user}
            onChange={(e) => handleFilterChange(e.target.value, 'user')}
            style={{ width: 200 }}
          />
          <Input
            placeholder="Bill Number"
            value={filters.billNo}
            onChange={(e) => handleFilterChange(e.target.value, 'billNo')}
            style={{ width: 200 }}
          />
          <Input
            placeholder="Operation Type"
            value={filters.operationType}
            onChange={(e) => handleFilterChange(e.target.value, 'operationType')}
            style={{ width: 200 }}
          />
          <RangePicker
            format="YYYY-MM-DD"
            onChange={handleDateChange}
            style={{ width: 400 }}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={fetchAuditLogs}
            style={{ marginTop: 4 }}
          >
            Filter
          </Button>
        </Space>
      </div>

      <Table
        dataSource={data}
        columns={columns}
        loading={loading}
        rowKey="id" // assuming 'id' is the unique key in the data
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: handlePaginationChange,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
        }} // Pagination with total count and page change handler
        className="audit-table"
      />
    </div>
  );
};

export default AuditLogs;
