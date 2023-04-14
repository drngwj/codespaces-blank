import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './UserList.module.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch users data from JSON API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users data:', error);
      }
    };

    fetchUsers();
  }, []);

  // Sort users by field and direction
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter users by search term
  const handleFilter = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Sort users by selected field and direction
  const sortedUsers = sortField
    ? [...currentUsers].sort((a, b) => {
        if (sortDirection === 'asc') {
          return a[sortField].localeCompare(b[sortField]);
        } else {
          return b[sortField].localeCompare(a[sortField]);
        }
      })
    : currentUsers;

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={styles.userListContainer}>
      <h1 className={styles.heading}>User List</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={handleFilter}
        className={styles.searchInput}
        placeholder="Search by name, email, or phone number"
      />
    </div>
  )}