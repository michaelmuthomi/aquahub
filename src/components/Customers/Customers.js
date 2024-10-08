// src/components/Customers/Customer.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../../backend/client.js';
import './Customers.css';

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [loading, setLoading] = useState(true); // Loading state

  console.log(selectedStatus)

  const fetchCustomers = async () => {
    setLoading(true); // Set loading to true before fetching
    const { data, error } = await supabase.from('customers').select();
    setLoading(false); // Set loading to false after fetching

    if (error) {
      console.log('Error fetching customers:', error);
    } else {
      setCustomers(data);
      setFilteredCustomers(data);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    // Filter customers based on selected status
    if (selectedStatus === 'All') {
      setFilteredCustomers(customers);
    } else {
      setFilteredCustomers(customers.filter(customer => customer.status === selectedStatus));
    }
  }, [selectedStatus, customers]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'active':
        return { backgroundColor: '#d4edda' }; // Light green for active
      case 'pending':
        return { backgroundColor: '#f8caa6' }; // Light orange for pending
      case 'inactive':
        return { backgroundColor: '#f8d7da' }; // Light red for inactive
      default:
        return {};
    }
  };

  const toggleCustomerStatus = async (customerId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    // Log the toggle action for debugging
    console.log(`Toggling customer ID: ${customerId} to status: ${newStatus}`);

    // Update customer status in Supabase
    const { error } = await supabase
      .from('customers')
      .update({ status: newStatus })
      .eq('customer_id', customerId);

    if (error) {
      console.error('Error updating customer status:', error);
    } else {
      // Update local state to reflect changes
      setCustomers(customers.map(customer =>
        customer.id === customerId ? { ...customer, status: newStatus } : customer
      ));
      console.log('Customer status updated successfully');
    }
  };

  return (
    <div className="dashboard">
      {loading ? (
        <div>Loading...</div> // Loading message
      ) : (
        <>
          <div className="status-buttons">
            <button
              className={selectedStatus === "All" ? "active" : ""}
              onClick={() => setSelectedStatus("All")}
            >
              All
            </button>
            <button
              className={selectedStatus === "pending" ? "active" : ""}
              onClick={() => setSelectedStatus("pending")}
            >
              Pending
            </button>
            <button
              className={selectedStatus === "active" ? "active" : ""}
              onClick={() => setSelectedStatus("active")}
            >
              Active
            </button>
            <button
              className={selectedStatus === "inactive" ? "active" : ""}
              onClick={() => setSelectedStatus("inactive")}
            >
              Inactive
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <td>First Name</td>
                <td>Last Name</td>
                <td>Email</td>
                <td>Phone Number</td>
                <td>Address</td>
                <td>Status</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} style={getStatusStyle(customer.status)}>
                  <td>{customer.first_name}</td>
                  <td>{customer.last_name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone_number}</td>
                  <td>{customer.address}</td>
                  <td>{customer.status}</td>
                  <td>
                    <button
                      style={{
                        background: customer.status === "active" ? "rgb(123 0 0)" : "green",
                        borderRadius: "5px",
                        color: "#ffffff",
                        padding: ".5rem .8rem",
                        width: "max-content",
                        fontWeight: "500",
                      }}
                      onClick={() =>
                        toggleCustomerStatus(
                          customer.customer_id,
                          customer.status
                        )
                      }
                    >
                      {customer.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Customer;
