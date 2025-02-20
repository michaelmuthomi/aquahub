import React, { useState, useEffect } from 'react';
import './Suppliers.css';
import { supabase } from '../../backend/client.js';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showAddSupplierForm, setShowAddSupplierForm] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone_number: '',
    items_ordered: [],
    status: 'active',
  });
  const [searchQuery, setSearchQuery] = useState(''); // State for search input

  // Fetch suppliers from the database
  const fetchSuppliers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("suppliers").select();
    setLoading(false);

    if (error) {
      console.error('Error fetching suppliers:', error);
    } else {
      console.log('Fetched suppliers:', data); // Log fetched data
      setSuppliers(data);
      setFilteredSuppliers(data);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    const filterSuppliersByStatusAndSearch = () => {
      let updatedSuppliers = suppliers;

      // Filter by selected status
      if (selectedStatus !== 'All') {
        updatedSuppliers = updatedSuppliers.filter(supplier => supplier.status === selectedStatus);
      }

      // Filter by search query
      if (searchQuery) {
        updatedSuppliers = updatedSuppliers.filter(supplier =>
          supplier.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          supplier.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          supplier.phone_number.includes(searchQuery)
        );
      }

      setFilteredSuppliers(updatedSuppliers);
    };

    filterSuppliersByStatusAndSearch();
  }, [selectedStatus, suppliers, searchQuery]); // Add searchQuery to the dependency array

  // Get styling based on item status
  const getStatusStyle = (status) => {
    switch (status) {
      case 'delivered':
        return { backgroundColor: '#c3e6cb' };
      case 'pending':
        return { backgroundColor: '#ffeeba' };
      case 'returned':
        return { backgroundColor: '#f8d7da' };
      default:
        return {};
    }
  };

  // Toggle supplier status
  const toggleSupplierStatus = async (supplierId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const { error } = await supabase
      .from('suppliers')
      .update({ status: newStatus })
      .eq('supplier_id', supplierId);

    if (error) {
      console.error('Error updating supplier status:', error);
    } else {
      const updatedSuppliers = suppliers.map(supplier =>
        supplier.supplier_id === supplierId ? { ...supplier, status: newStatus } : supplier
      );

      setSuppliers(updatedSuppliers);
      setFilteredSuppliers(updatedSuppliers);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle adding a new supplier
  const handleAddSupplier = async (e) => {
    e.preventDefault(); // Prevent page refresh

    // Create a new supplier object, removing empty fields
    const supplierWithFilledFields = Object.fromEntries(
      Object.entries(newSupplier).filter(([_, value]) => value !== '')
    );

    const { error } = await supabase.from('suppliers').insert([supplierWithFilledFields]);

    if (error) {
      console.error('Error adding supplier:', error);
    } else {
      console.log('Supplier added successfully:', supplierWithFilledFields); // Debug log

      // Reset form
      setNewSupplier({
        company_name: '',
        contact_name: '',
        email: '',
        phone_number: '',
        items_ordered: [],
        status: 'active',
      });
      
      // Fetch updated suppliers after adding a new one
      await fetchSuppliers(); // Ensure this call is made after insertion

      setShowAddSupplierForm(false); // Hide the form after submission
    }
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <input
            type="text"
            placeholder="Search Suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: '20px', padding: '10px', width: '200px' }}
          />

          <div className="status-buttons">
            {['All', 'active', 'inactive'].map(status => (
              <button
                key={status}
                style={{ backgroundColor: 'green', color: 'white', margin: '0 5px', padding: '10px' }}
                onClick={() => setSelectedStatus(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <button
            style={{ backgroundColor: 'blue', color: 'white', margin: '10px', padding: '10px' }}
            onClick={() => setShowAddSupplierForm(!showAddSupplierForm)}
          >
            {showAddSupplierForm ? 'Cancel' : 'Add Supplier'}
          </button>

          {showAddSupplierForm && (
            <form onSubmit={handleAddSupplier} className="add-supplier-form">
              {['company_name', 'contact_name', 'email', 'phone_number'].map(field => (
                <input
                  key={field}
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  placeholder={field.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase())}
                  value={newSupplier[field]}
                  onChange={handleInputChange}
                  required
                />
              ))}
              <button type="submit" style={{ backgroundColor: 'green', color: 'white', padding: '10px', marginTop: '10px' }}>
                Add Supplier
              </button>
            </form>
          )}

          <table>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Contact Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Item Status</th>
                <th>Supplier Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map(supplier =>
                supplier.items_ordered.map((item, index) => (
                  <tr key={`${supplier.supplier_id}-${index}`}>
                    {index === 0 && (
                      <>
                        <td rowSpan={supplier.items_ordered.length}>{supplier.company_name}</td>
                        <td rowSpan={supplier.items_ordered.length}>{supplier.contact_name}</td>
                        <td rowSpan={supplier.items_ordered.length}>{supplier.email}</td>
                        <td rowSpan={supplier.items_ordered.length}>{supplier.phone_number}</td>
                      </>
                    )}
                    <td style={getStatusStyle(item.status)}>{item.name}</td>
                    <td style={getStatusStyle(item.status)}>{item.quantity}</td>
                    <td style={getStatusStyle(item.status)}>{item.status === 'supplied' ? 'delivered' : item.status}</td>
                    {index === 0 && (
                      <td rowSpan={supplier.items_ordered.length}>
                        {supplier.status}
                      </td>
                    )}

                    {index === 0 && (
                      <td rowSpan={supplier.items_ordered.length}>
                        <button
                          style={{
                            background: supplier.status === 'active' ? 'red' : 'green',
                            borderRadius: '10px',
                            color: 'white',
                            padding: '5px 10px',
                          }}
                          onClick={() => toggleSupplierStatus(supplier.supplier_id, supplier.status)}
                        >
                          {supplier.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Suppliers;
