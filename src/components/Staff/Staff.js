import React, { useState, useEffect } from 'react';
import './Staff.css';
import { supabase } from '../../backend/client.js';
import AddStaff from "./AddStaff.js"

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [showForm, setShowForm] = useState(false);

  // Function to toggle showForm value
  const toggleShowForm = () => {
    setShowForm(prevState => !prevState); // Inverts the current value
  };

  // Fetch staff data when component mounts
  useEffect(() => {
    const fetchStaff = async () => {
      const { data, error } = await supabase
        .from('staff') // Ensure this matches your Supabase table name
        .select('staff_id, role, service_managers(first_name, last_name, email, status), technicians(first_name, last_name, email, status), stock_managers(first_name, last_name, email, status), finance_managers(first_name, last_name, email, status), drivers(first_name, last_name, email, status), supervisors(first_name, last_name, email, status)');

      if (error) {
        console.error('Error fetching staff data:', error);
      } else {
        console.log(data);
        setStaff(data.map(member => ({
          ...member,
          isActive: member.service_managers?.status === 'Active' || 
                    member.technicians?.status === 'Active' ||
                    member.stock_managers?.status === 'Active' ||
                    member.finance_managers?.status === 'Active' ||
                    member.drivers?.status === 'Active' ||
                    member.supervisors?.status === 'Active'
        })));
      }
    };

    fetchStaff();
  }, []);

  // Search handling
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  // Filter staff based on role and search term
  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  // Filter the staff based on search and selected role
  const filteredStaff = staff.filter(member => {
    const roleMatch = selectedRole === 'All' || member.role === selectedRole;

    const firstName = member.service_managers?.first_name || ''; // Access nested object
    const lastName = member.service_managers?.last_name || '';
    const searchMatch = (
      firstName.toLowerCase().includes(search.toLowerCase()) || 
      lastName.toLowerCase().includes(search.toLowerCase())
    );

    return roleMatch && searchMatch;
  });

  // Add new staff (functionality can be added)
  const handleAddStaff = () => {
    console.log('Add staff logic here');
  };

  const handleToggleStaffStatus = async (id, currentStatus, role) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active'; // Toggle the status

    // Find the role object to get the corresponding table name and ID field
    const roleObject = roles.find(r => r.role === role);
    
    if (!roleObject) {
        console.error('Role not found:', role);
        return;
    }
    
    const tableName = roleObject.prefix; // Get the corresponding table name
    const idField = roleObject.idField; // Get the corresponding ID field
    const staffUpdateData = { status: newStatus }; // Data to update
  
    console.log(`Updating ${tableName} where ${idField} = ${id} to status: ${newStatus}`);
  
    // Perform the update in the correct table
    const { error } = await supabase
        .from(tableName)
        .update(staffUpdateData)
        .match({ [idField]: id }); // Use the correct ID field

    if (error) {
        console.error('Error updating staff status:', error);
    } else {
        // Update the local state without refreshing the page
        setStaff(prevStaff => {
            const updatedStaff = prevStaff.map(member => {
                // Log the member being updated
                console.log('Current Member:', member);
                // Only update the matching member
                if (member.staff_id === id) {
                    // Log before returning the updated member
                    console.log(`Updating member ID: ${id} to new status: ${newStatus}`);
                    return { ...member, status: newStatus, isActive: newStatus === 'Active' };
                }
                return member; // Return unmodified member
            });

            console.log('Updated Staff:', updatedStaff); // Log updated staff array
            return updatedStaff; // Return the updated staff array
        });
    }
};

  // Remove staff member
  const handleRemoveStaff = async (id) => {
    const { error } = await supabase
      .from('staff')
      .delete()
      .match({ staff_id: id });

    if (error) {
      console.error('Error removing staff member:', error);
    } else {
      setStaff(staff.filter(member => member.staff_id !== id));
    }
  };

  // Define an array of roles and their corresponding fields
  const roles = [
    { role: 'Service Manager', prefix: 'service_managers', idField: 'service_manager_id' },
    { role: 'Technician', prefix: 'technicians', idField: 'technician_id' },
    { role: 'Stock Manager', prefix: 'stock_managers', idField: 'stock_manager_id' },
    { role: 'Drivers', prefix: 'drivers', idField: 'driver_id' },
    { role: 'Supervisor', prefix: 'supervisors', idField: 'supervisor_id' },
    { role: 'Finance Manager', prefix: 'finance_managers', idField: 'finance_manager_id' },
    // Add more roles here as needed...
  ];

  const getStaffDetails = (member) => {
    const details = {
      firstName: 'N/A',
      lastName: 'N/A',
      email: 'N/A',
      status: 'N/A'
    };

    // Find the role object that matches the member's role
    const currentRole = roles.find(r => r.role === member.role);
  
    if (currentRole) {
      const { prefix } = currentRole;
      details.firstName = member[prefix]?.first_name || 'N/A';
      details.lastName = member[prefix]?.last_name || 'N/A';
      details.email = member[prefix]?.email || 'N/A';
      details.status = member[prefix]?.status || 'N/A';
    }
  
    return details;
  };

  return (
    <div>
      <h1>Staff Management</h1>
      <input
        type="text"
        placeholder="Search staff..."
        value={search}
        onChange={handleSearch}
      />
      <div className="role-buttons">
        <button onClick={() => handleRoleChange('All')}>All</button>
        <button onClick={() => handleRoleChange('Technician')}>Technician</button>
        <button onClick={() => handleRoleChange('Supervisor')}>Supervisor</button>
        <button onClick={() => handleRoleChange('Service Manager')}>Service Manager</button>
        <button onClick={() => handleRoleChange('Finance Manager')}>Finance Manager</button>
        <button onClick={() => handleRoleChange('Stock Manager')}>Stock Manager</button>
        <button onClick={() => handleRoleChange('Drivers')}>Drivers</button>
      <button className="add" onClick={toggleShowForm}>Add Staff</button>
      </div>

      {showForm && <AddStaff />}

      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaff.map(member => {
            const { firstName, lastName, email, status } = getStaffDetails(member);
            const isActive = member.isActive;  // Use isActive from the updated state

            return (
              <tr key={member.staff_id}>
                <td>{firstName}</td>
                <td>{lastName}</td>
                <td>{email}</td>
                <td>{member.role}</td>
                <td>{isActive ? "Active" : "Inactive"}</td>
                <td>
                  <button
                    className={isActive ? "deactivate" : "activate"}
                    onClick={() => handleToggleStaffStatus(member.staff_id, isActive ? 'Active' : 'Inactive', member.role)}
                  >
                    {isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    className="remove"
                    onClick={() => handleRemoveStaff(member.staff_id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Staff;
