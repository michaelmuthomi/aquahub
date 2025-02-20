import React, { useState } from "react";
import { supabase } from "../../backend/client.js";
// Import your Supabase client

// Dropdown menu for selecting roles
function DropDownMenu({ setRole }) {
  return (
    <select
      id="role"
      onChange={(e) => setRole(e.target.value)}
      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
    >
      <option value="service_managers">Service Manager</option>
      <option value="technicians">Technician</option>
      <option value="drivers">Driver</option>
      <option value="supervisors">Supervisor</option>
      <option value="finance_managers">Finance Manager</option>
      <option value="stock_managers">Stock Manager</option>
    </select>
  );
}

export default function AddStaff() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("service_managers"); // Default role

  // Function to add user to the correct table
  const addUserToDatabase = async (e) => {
    e.preventDefault();
  
    // Step 1: Fetch the maximum staff_id and get the next available one
    const { data: staffMaxData, error: staffMaxError } = await supabase
      .from("staff")
      .select("staff_id")
      .order("staff_id", { ascending: false })
      .limit(1);
  
    if (staffMaxError) {
      console.error("Error fetching max staff_id:", staffMaxError);
      return;
    }
  
    // Calculate the next available staff_id
    const nextStaffId = staffMaxData.length > 0 ? staffMaxData[0].staff_id + 1 : 1;
  
    // Step 2: Prepare the user data with the next available staff_id
    const roles = [
      { role: "Service Manager", prefix: "service_managers", idField: "service_manager_id" },
      { role: "Technician", prefix: "technicians", idField: "technician_id" },
      { role: "Stock Manager", prefix: "stock_managers", idField: "stock_manager_id" },
      { role: "Drivers", prefix: "drivers", idField: "driver_id" },
      { role: "Supervisor", prefix: "supervisors", idField: "supervisor_id" },
      { role: "Finance Manager", prefix: "finance_managers", idField: "finance_manager_id" },
      // Add more roles here as needed...
    ];
  
    const roleData = roles.find((r) => r.role === role); // Find the matching role
  
    if (roleData) {
      const userData = {
        staff_id: nextStaffId, // Use the calculated next staff_id
        role: roleData.role, // Use the idField from the found role
      };
  
      // Step 3: Insert the user into the 'staff' table
      const { error: staffInsertError } = await supabase
        .from("staff")
        .insert([userData]);
  
      if (staffInsertError) {
        console.error("Error adding user to staff:", staffInsertError);
        return;
      }
  
      // Step 4: Insert the user into the role-specific table using staff_id
      const roleUserData = {
        [roleData.idField]: nextStaffId, // Dynamically create the role-specific ID field
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: "1234567890", // Use actual phone number if available
        hire_date: new Date().toISOString().split("T")[0], // Use the current date as hire date
        status: "Active",
      };
  
      const { error: roleInsertError } = await supabase
        .from(roleData.prefix) // Insert into the correct role-specific table
        .insert([roleUserData]);
  
      if (roleInsertError) {
        console.error(`Error adding user to ${roleData.prefix} table:`, roleInsertError);
      } else {
        console.log(`User added successfully to staff and ${roleData.prefix} table with staff_id ${nextStaffId}!`);
        // Reset the form after successful addition
        setFirstName("");
        setLastName("");
        setEmail("");
      }
    } else {
      console.error(`Role "${role}" not found in roles array`);
    }
  };
  

  return (
    <form onSubmit={addUserToDatabase} className="flex gap-2 align-center">
      <div>
        <label
          htmlFor="first_name"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          First Name
        </label>
        <div className="mt-2">
          <input
            id="first_name"
            name="first_name"
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="last_name"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Last Name
        </label>
        <div className="mt-2">
          <input
            id="last_name"
            name="last_name"
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Email
        </label>
        <div className="mt-2">
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Role
        </label>
        <div className="mt-2">
          <DropDownMenu setRole={setRole} /> {/* Pass the setRole function */}
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add User
        </button>
      </div>
    </form>
  );
}
