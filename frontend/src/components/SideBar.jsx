import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { FaTachometerAlt, FaBox, FaUser, FaClipboardList, FaCogs, FaQuestionCircle, FaChartPie, FaBars, FaAngleDoubleLeft } from 'react-icons/fa'; // Import icons

function SideBar() {
  const [collapsed, setCollapsed] = useState(false); // Collapsed state

  return (
    <>
      <Sidebar collapsed={collapsed} style={{ height: '100vh' }}>
        {/* Logo and Collapse Icon Section */}
        <div className="d-flex justify-content-between align-items-center p-3">
          <img 
            src="https://via.placeholder.com/150" // Replace with your logo URL
            alt="Logo"
            className={`img-fluid ${collapsed ? "w-50" : "w-75"}`} // Adjust logo size based on collapsed state
          />
          
          <button
            className="btn btn-light"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <FaBars /> : <FaAngleDoubleLeft />}
          </button>
        </div>

        {/* Menu Items */}
        <Menu iconShape="square">
          <MenuItem icon={<FaTachometerAlt />} component={<Link to="/dashboard" />}> Dashboard </MenuItem>

          <SubMenu label="Orders" icon={<FaClipboardList />}>
            <MenuItem component={<Link to="/orders/view" />}> View Orders </MenuItem>
            <MenuItem component={<Link to="/orders/manage-return" />}> Manage Returns </MenuItem>
          </SubMenu>

          <SubMenu label="Products" icon={<FaBox />}>
            <MenuItem component={<Link to="/products/view" />}> View Products </MenuItem>
            <MenuItem component={<Link to="/products/add" />}> Add New Product </MenuItem>
            <MenuItem component={<Link to="/products/categories" />}> Categories </MenuItem>
          </SubMenu>

          <SubMenu label="Users" icon={<FaUser />}>
            <MenuItem component={<Link to="/users/customers" />}> Customer List </MenuItem>
            <MenuItem component={<Link to="/users/admins" />}> Admin List </MenuItem>
          </SubMenu>

          <SubMenu label="Reports" icon={<FaChartPie />}>
            <MenuItem component={<Link to="/reports/sales" />}> Sales Report </MenuItem>
            <MenuItem component={<Link to="/reports/activity" />}> User Activity </MenuItem>
          </SubMenu>

          <MenuItem icon={<FaCogs />} component={<Link to="/settings" />}> Settings </MenuItem>
          <MenuItem icon={<FaQuestionCircle />} component={<Link to="/support" />}> Support </MenuItem>
        </Menu>
      </Sidebar>
    </>
  );
}

export default SideBar;
