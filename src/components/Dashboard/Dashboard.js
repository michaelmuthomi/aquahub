import React from 'react';
import './Dashboard.css';
import ChartComponent from "../ChartComponent.js"

function Dashboard() {
  return (
    <div className="dashboard">
      {}
      <div className="dashboard-section">
        <h3>Overview of Activities</h3>
        <div className="dashboard-content">
          <div className="dashboard-box current-orders-box">
            <h4>Current Orders</h4>
            <p>10</p>
          </div>
          <div className="dashboard-box installation-box">
            <h4>Installations in Progress</h4>
            <p>5</p>
          </div>
          <div className="dashboard-box completed-box">
            <h4>Completed Projects</h4>
            <p>20</p>
          </div>
          <div className="dashboard-box pending-box">
            <h4>Pending Tasks</h4>
            <p>3</p>
          </div>
        </div>
      </div>

      {}
      <div className="dashboard-section">
        <h3>Analytics & Reports</h3>
        <div className="dashboard-content">
          <div className="dashboard-box">
            <h4>Graph 1</h4>
            {}
            <ChartComponent />
          </div>
          <div className="dashboard-box">
            <h4>Graph 2</h4>
            {}
          </div>
        </div>
      </div>

      {}
      <div className="dashboard-section">
        <h3>Notifications</h3>
        <div className="dashboard-content">
          <div className="dashboard-box">
            <h4>New service booking received.</h4>
          </div>
          <div className="dashboard-box">
            <h4>Customer inquiry pending response.</h4>
          </div>
          <div className="dashboard-box">
            <h4>System update available.</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
