import { useState, useEffect } from 'react';
import billService from '../services/api';

export const useFetchBills = () => {
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 1, pageSize: 10 });
  const [filterData, setFilterData] = useState({
    salespersonNames: [],
    retailerNames: [],
    beats: [],
    brandNames: [],
    days: [],
  });
  const [filterConst, setFilterConst] = useState({
    salespersonNames: ["Mohan", "Naveen", "Murali"],
    retailerNames: ["ABC Stores", "GHI Stores", "DEF Stores"],
    beats: ["Beat 2", "Beat 3", "Beat 1"],
    brandNames: ["Mango Bite", "Diary Milk", "Coffee Bite"],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  // Fetch bills based on pagination and filters
  const fetchBills = async (checkFilter) => {
    setLoading(true);
    try {
      const result = await billService.fetchBills(paginationModel, filterData, checkFilter);
      setRows(result.bills);
      setTotalRows(result.totalItems);
      return result.bills;
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch filter data options
  const fetchFilterData = async () => {
    setLoading(true);
    try {
      const data = await billService.getFilterData();
      setFilterConst(data);
    } catch (error) {
      console.error('Error fetching filter data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search bills by query
  const fetchQuery = async () => {
    try {
      setLoading(true);
      const bills = await billService.searchBills(searchQuery);
      setRows(bills);
    } catch (error) {
      console.error('Error searching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim().length === 0) {
      fetchBills();
      return;
    }
  };

  // Handle filter changes
  const handleFilterSelectChange = (name, value) => {
    setFilterData(prev => ({...prev, [name]: value}));
  };

  // Clear all filters
  const clearFilter = async () => {
    setFilterData({
      salespersonNames: [],
      retailerNames: [],
      beats: [],
      brandNames: [],
      days: [],
    });
    await fetchBills(true);
  };

  // Load filter data on mount
  useEffect(() => {
    fetchFilterData();
  }, []);

  // Fetch bills when pagination changes
  useEffect(() => {
    fetchBills();
  }, [paginationModel]);

  // Handle search with debounce
  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    if (searchQuery.trim().length === 4) {
      let timer = setTimeout(() => {
        fetchQuery();
      }, 1000);
      setDebounceTimeout(timer);
    }

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  return {
    rows,
    setRows,
    totalRows,
    loading,
    paginationModel,
    setPaginationModel,
    filterData,
    filterConst,
    searchQuery,
    fetchBills,
    handleSearchChange,
    handleFilterSelectChange,
    clearFilter
  };
};