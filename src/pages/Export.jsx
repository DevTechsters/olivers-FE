import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Label, Input, Button, FormGroup } from 'reactstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';
import { handleApiError } from "../helpers/errorHandler";

const ExportModal = ({ isOpen, toggle }) => {
  const [exportType, setExportType] = useState('daily');
  const [dateRange, setDateRange] = useState({
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment().format('YYYY-MM-DD')
  });
  const [loading, setLoading] = useState(false);

  // Reset date range when the modal opens
  useEffect(() => {
    if (isOpen && exportType === 'range') {
      setDateRange({
        fromDate: moment().format('YYYY-MM-DD'),
        toDate: moment().format('YYYY-MM-DD')
      });
    }
  }, [isOpen, exportType]);

  const handleExportTypeChange = (e) => {
    setExportType(e.target.value);
  };



  const handleDateRangeChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  const validateDateRange = () => {
    if (exportType === 'range') {
      if (!dateRange.fromDate || !dateRange.toDate) {
        toast.error('Please select both From and To dates');
        return false;
      }

      const fromDate = moment(dateRange.fromDate);
      const toDate = moment(dateRange.toDate);

      if (toDate.isBefore(fromDate)) {
        toast.error('To date cannot be before From date');
        return false;
      }
    }
    return true;
  };

  const handleDailyExport = async () => {
    setLoading(true);
    try {
      // Get the current day using moment.js
      const currentDay = moment().format('dddd');  // 'dddd' gives the full day name (e.g., 'Monday', 'Tuesday')

      const response = await axios({
        method: 'POST',  // Use POST instead of GET
        url: 'http://localhost:8081/api/bill/download',
        data: {
          reportType: 1,
          day: [currentDay],  // Pass the current day dynamically
        },
        headers: {
          'Content-Type': 'application/json',
        }      });

        if (response.status === 200 && response.data) {
          toast.success('Your report has been successfully exported. Check your Downloads folder.');
          toggle();
      }
     
    } catch (error) {
      handleApiError(error)
      console.error('Export error:', error);
    } finally {
      setLoading(false);
    }
};


const handleRangeExport = async () => {
    if (!validateDateRange()) {
      return;
    }
  
    setLoading(true);
    try {
      const endpoint = 'http://localhost:8081/api/bill/download';
      
      const payload = {
        reportType: 2,
        dateFrom: dateRange.fromDate,
        dateTo: dateRange.toDate
      };
  
      const response = await axios.post(endpoint, payload, {
        // responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      if (response.status === 200 && response.data) {
        toast.success('Your report has been successfully exported. Check your Downloads folder.');
        toggle();
    }
    
    } catch (error) {
    //  console.error('Export failed:', error);
      handleApiError(error)
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        Export Bills
      </ModalHeader>
      <ModalBody>
        <FormGroup className="mb-4">
          <Label className="mb-2 font-medium">Export Type</Label>
          <div>
            <div className="flex items-center mb-2">
              <Input
                type="radio"
                id="daily"
                name="exportType"
                value="daily"
                checked={exportType === 'daily'}
                onChange={handleExportTypeChange}
                className="mr-2"
              />
              <Label for="daily" className="mb-0">Daily Export</Label>
            </div>
            <div className="flex items-center">
              <Input
                type="radio"
                id="range"
                name="exportType"
                value="range"
                checked={exportType === 'range'}
                onChange={handleExportTypeChange}
                className="mr-2"
              />
              <Label for="range" className="mb-0">Date Range Export</Label>
            </div>
          </div>
        </FormGroup>

        {exportType === 'range' && (
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label className="font-medium">From Date</Label>
                <Input
                  type="date"
                  name="fromDate"
                  value={dateRange.fromDate}
                  onChange={handleDateRangeChange}
                  className="w-full"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className="font-medium">To Date</Label>
                <Input
                  type="date"
                  name="toDate"
                  value={dateRange.toDate}
                  onChange={handleDateRangeChange}
                  className="w-full"
                />
              </FormGroup>
            </Col>
          </Row>
        )}
      </ModalBody>
      <ModalFooter>
        {exportType === 'daily' ? (
          <Button 
            color="primary" 
            onClick={handleDailyExport} 
            disabled={loading}
            className="mr-2"
          >
            {loading ? 'Exporting...' : 'Export'}
          </Button>
        ) : (
          <Button 
            color="primary" 
            onClick={handleRangeExport} 
            disabled={loading}
            className="mr-2"
          >
            {loading ? 'Exporting...' : 'Export'}
          </Button>
        )}
        <Button onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ExportModal;