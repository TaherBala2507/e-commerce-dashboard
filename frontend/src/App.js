import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { DndProvider } from "react-dnd"; // Use DndProvider instead of DragDropContext
import { HTML5Backend } from "react-dnd-html5-backend"; // Import HTML5Backend correctly
import SideBar from "./components/SideBar";
import TopBar from "./components/TopBar";
import Dashboard from "./pages/Dashboard";
import ViewOrders from "./pages/orders/ViewOrders";
import ManageReturns from "./pages/orders/ManageReturns";
import ViewProducts from "./pages/products/ViewProducts";
import AddANewProduct from "./pages/products/AddANewProducts";
import Categories from "./pages/products/Categories";
import CustomerList from "./pages/users/CustomerList";
import AdminList from "./pages/users/AdminList";
import SalesReport from "./pages/reports/SalesReport";
import UserActivity from "./pages/reports/UserActivity";
import Setting from "./pages/Setting";
import Support from "./pages/Support";


function App() {
  const handleDrop = (item) => {
    // Handle the drop if needed
    console.log("Dropped item:", item);
  };

  return (
    <Router>
      <TopBar />
      <div className="d-flex">
        <SideBar />
        <div className="flex-grow-1 p-3">
          {/* Use DndProvider to wrap the Routes */}
          <DndProvider backend={HTML5Backend}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/orders/view" element={<ViewOrders />} />
              <Route path="/orders/manage-return" element={<ManageReturns />} />
              <Route path="/products/view" element={<ViewProducts />} />
              <Route path="/products/add" element={<AddANewProduct />} />
              <Route path="/products/categories" element={<Categories />} />
              <Route path="/users/customers" element={<CustomerList />} />
              <Route path="/users/admins" element={<AdminList />} />
              <Route path="/reports/sales" element={<SalesReport />} />
              <Route path="/reports/activity" element={<UserActivity />} />
              <Route path="/settings" element={<Setting />} />
              <Route path="/support" element={<Support />} />

            </Routes>
          </DndProvider>
        </div>
      </div>
    </Router>
  );
}

export default App;
