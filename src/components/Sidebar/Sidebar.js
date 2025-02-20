import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUser, faBox, faUsers, faCog, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Sidebar = ({ className }) => {
  return (
    <nav className={`sidebar ${className}`}>
      <div className="sidebar-content">
        <h2>Menu</h2>
        <ul>
          <li>
            <a href="/dashboard">
              <FontAwesomeIcon icon={faTachometerAlt} />
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="/customers">
              <FontAwesomeIcon icon={faUser} />
              <span>Customer</span>
            </a>
          </li>
          <li>
            <a href="/suppliers">
              <FontAwesomeIcon icon={faBox} />
              <span>Supplier</span>
            </a>
          </li>
          <li>
            <a href="/staff">
              <FontAwesomeIcon icon={faUsers} />
              <span>Staff</span>
            </a>
          </li>
          
          <li>
            <a href="/reports">
              <FontAwesomeIcon icon={faFileAlt} />
              <span>Reports</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
