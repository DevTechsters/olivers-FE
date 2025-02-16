import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Input, DatePicker, message, Space, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import '../css/auditLogs.css';
import Header from '../components/Header';

const { RangePicker } = DatePicker;
const { Option } = Select;

const AuditLogs = () => {
  // States for managing audit log data and loading state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);

  // Pagination state
  const [paginationModel, setPaginationModel] = useState({ page: 1, pageSize: 10 });

  // Filter states
  const [filters, setFilters] = useState({
    user: '',
    operationType: '',
    billNo: '',
    dateFrom: null,
    dateTo: null,
  });

  // Fetch Audit Logs Function
  const fetchAuditLogs = async (resetPagination = false) => {
    setLoading(true);

    // Reset pagination if needed
    const updatedPagination = resetPagination ? { page: 1, pageSize: 10 } : paginationModel;

    const requestPayload = { 
      ...filters, 
      page: updatedPagination.page, 
      size: updatedPagination.pageSize 
    };

    try {
      const response = await axios.post('http://localhost:8081/api/audit', requestPayload, { withCredentials: true });

      setData(response.data.logs);
      setTotalRows(response.data.pagination.totalItems);

      // Reset pagination state only if needed
      if (resetPagination) {
        setPaginationModel((prev) => (prev.page !== 1 || prev.pageSize !== 10 ? { page: 1, pageSize: 10 } : prev));
      }

      message.success('Audit logs fetched successfully!');
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      message.error('Failed to fetch audit logs.');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter input changes
  const handleFilterChange = (value, field) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Handle date range selection
  const handleDateChange = (dates) => {
    setFilters((prev) => ({
      ...prev,
      dateFrom: dates?.[0]?.format('YYYY-MM-DD') || null,
      dateTo: dates?.[1]?.format('YYYY-MM-DD') || null,
    }));
  };

  // Ensure useEffect runs only when pagination changes
  useEffect(() => {
    fetchAuditLogs(); 
  }, [paginationModel]);

  return (
    <>
      <Header title="Audit Logs" />
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
            <Select
              placeholder="Operation Type"
              value={filters.operationType}
              onChange={(value) => handleFilterChange(value, 'operationType')}
              style={{ width: 200 }}
              allowClear
            >
              <Option value="">All</Option>
              <Option value="UPDATE">UPDATE</Option>
              <Option value="DELETE">DELETE</Option>
            </Select>
            <RangePicker
              format="YYYY-MM-DD"
              onChange={handleDateChange}
              style={{ width: 400 }}
            />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => fetchAuditLogs(true)} // Pass function reference
              style={{ marginTop: 4 }}
            >
              Filter
            </Button>
          </Space>
        </div>

        <Table
          dataSource={data}
          columns={[
            { title: 'Bill Number', dataIndex: 'billNumber', key: 'billNumber', align: 'left' },
            { title: 'Operation Type', dataIndex: 'operationType', key: 'operationType', align: 'left' },
            { title: 'Modified By', dataIndex: 'modifiedBy', key: 'modifiedBy', align: 'left' },
            { title: 'Modified At', dataIndex: 'modifiedAt', key: 'modifiedAt', align: 'left' },
            { title: 'Details', dataIndex: 'details', key: 'details', align: 'left' },
          ]}
          loading={loading}
          rowKey="id"
          pagination={{
            current: paginationModel.page,
            pageSize: paginationModel.pageSize,
            total: totalRows,
            onChange: (page, pageSize) => setPaginationModel({ page, pageSize }),
          }}
          className="audit-table"
        />
      </div>
    </>
  );
};

export default AuditLogs;
