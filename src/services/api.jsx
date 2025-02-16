import axios from 'axios';
import { message } from 'antd';
import { handleApiError } from "../helpers/errorHandler";

// Base URL for all API calls
const BASE_URL = 'http://localhost:8081/api';

// Create axios instance with common configuration
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Bill API services
export const billService = {
  // Fetch bills with optional filters
  fetchBills: async (paginationModel, filterData, checkfilter = false) => {
    try {
      let payload;
      if (checkfilter) {
        payload = {
          salespersonNames: [],
          retailerNames: [],
          beats: [],
          brandNames: [],
          days: [],
          page: paginationModel.page,
          size: paginationModel.pageSize
        };
      } else {
        payload = {
          ...filterData,
          page: paginationModel.page,
          size: paginationModel.pageSize
        };
      }

      const response = await api.post('/bill', payload);
      
      const billsData = response.data.Bills.map((bill) => ({
        id: bill.invoiceId,
        ...bill,
      }));
      
      return {
        bills: billsData,
        totalItems: response.data.pagination.totalItems
      };
    } catch (error) {
      console.error('Error fetching bills:', error);
      handleApiError(error);
      throw error;
    }
  },

  // Delete bills (single or multiple)
  deleteBills: async (invoiceIds) => {
    try {
      await api.delete('/bill/delete', {
        data: { invoiceIds },
      });
      message.success("Deleted successfully");
      return true;
    } catch (error) {
      console.error('Error deleting bill(s):', error);
      message.error('Error deleting bill(s)');
      handleApiError(error);
      return false;
    }
  },

  // Save/update bills
  saveChanges: async (savePayload) => {
    const username = sessionStorage.getItem("user");
    const payload = Object.entries(savePayload).map(([invoiceId, fields]) => ({
      invoiceId,
      ...fields,
      updatedBy: username,
    }));
  
    if (payload.length === 0) {
      message.info("No changes to save");
      return false;
    }
  
    try {
      await api.post("/bill/update", payload);
      message.success("Saved successfully");
      return true;
    } catch (error) {
      message.error("Error saving changes");
      console.error('Save error:', error);
      handleApiError(error);
      return false;
    }
  },

  // Edit bill history
  editBill: async (invoiceId, editPayload) => {
    try {
      await api.post(`/bill/edit/${invoiceId}`, editPayload);
      message.success("Saved successfully");
      return true;
    } catch (error) {
      console.error('Save error:', error);
      handleApiError(error);
      return false;
    }
  },

  // Search bills
  searchBills: async (query) => {
    try {
      const response = await api.get('/bill/search', {
        params: { query }
      });
      
      return response.data.Bills.map((bill, index) => ({
        id: bill.invoiceId || index,
        ...bill,
      }));
    } catch (error) {
      console.error('Error searching data:', error);
      handleApiError(error);
      throw error;
    }
  },

  // Get filter data
  getFilterData: async () => {
    try {
      const response = await api.get("/bill/filter");
      return response.data;
    } catch (error) {
      console.error('Error fetching filter data:', error);
      handleApiError(error);
      throw error;
    }
  }
};

export default billService;