import React, { useState } from 'react';
import { Table, Card, Form, Button, Modal } from 'react-bootstrap';
import Select from 'react-select';

function ViewOrders() {
  // Sample data for orders
  const [orders, setOrders] = useState([
    { id: 1, customer: 'John Doe', total: '$150.00', status: 'Shipped', products: [{ name: 'Product 1', variation: 'Red', quantity: 2 }] },
    { id: 2, customer: 'Jane Smith', total: '$200.00', status: 'Pending', products: [{ name: 'Product 3', variation: 'Large', quantity: 1 }] },
    { id: 3, customer: 'Alice Johnson', total: '$250.00', status: 'Delivered', products: [{ name: 'Product 2', variation: 'Small', quantity: 1 }, { name: 'Product 4', variation: 'Medium', quantity: 2 }] },
    { id: 4, customer: 'Bob Brown', total: '$75.00', status: 'Canceled', products: [] },
  ]);

  // Sample data for products with variations
  const productOptions = [
    { value: 'Product 1', label: 'Product 1', variations: ['Red', 'Blue'] },
    { value: 'Product 2', label: 'Product 2', variations: ['Small', 'Medium', 'Large'] },
    { value: 'Product 3', label: 'Product 3', variations: ['Small', 'Large'] },
    { value: 'Product 4', label: 'Product 4', variations: ['Medium', 'Large'] },
  ];

  // State for the new order modal
  const [showModal, setShowModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customer: '',
    total: '',
    status: 'Pending',
    products: [],
  });

  // State for viewing order details
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  // Handle product selection change
  const handleProductChange = (selectedOptions) => {
    const products = selectedOptions.map(option => ({
      name: option.value,
      variation: option.variation,
      quantity: 1, // Default quantity to 1 for each selected product
    }));
    setNewOrder({ ...newOrder, products });
  };

  // Handle variation selection change
  const handleVariationChange = (index, variation) => {
    const updatedProducts = [...newOrder.products];
    updatedProducts[index].variation = variation;
    setNewOrder({ ...newOrder, products: updatedProducts });
  };

  // Handle quantity change
  const handleQuantityChange = (index, value) => {
    const updatedProducts = [...newOrder.products];
    updatedProducts[index].quantity = value;
    setNewOrder({ ...newOrder, products: updatedProducts });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newOrderId = orders.length + 1; // Incremental order ID
    const totalAmount = newOrder.products.reduce((total, product) => total + (product.quantity * 50), 0); // Assume each product costs $50
    const orderToAdd = { id: newOrderId, ...newOrder, total: `$${totalAmount}`, products: newOrder.products }; // Calculate total amount
    setOrders([...orders, orderToAdd]);
    setNewOrder({ customer: '', total: '', status: 'Pending', products: [] }); // Reset form
    setShowModal(false); // Close modal
  };

  // Open the order details modal
  const handleViewProducts = (order) => {
    setSelectedOrder(order);
    setShowOrderDetailsModal(true);
  };

  return (
    <div className="p-3">
      <h1>View Orders</h1>

      {/* Button to open modal */}
      <Button variant="primary" onClick={() => setShowModal(true)}>
        New Order
      </Button>

      {/* Table to Display Orders */}
      <Card className="mt-3">
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.total}</td>
                  <td>{order.status}</td>
                  <td>
                    {/* Button to view products */}
                    <Button variant="info" onClick={() => handleViewProducts(order)}>
                      View Products
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal for Adding New Order */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formCustomer">
              <Form.Label>Customer</Form.Label>
              <Form.Control
                type="text"
                name="customer"
                value={newOrder.customer}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={newOrder.status}
                onChange={handleChange}
              >
                <option>Pending</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Canceled</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formProducts">
              <Form.Label>Select Products</Form.Label>
              <Select
                options={productOptions}
                isMulti
                onChange={(selectedOptions) => handleProductChange(selectedOptions)}
                closeMenuOnSelect={false}
                placeholder="Select products..."
              />
              {newOrder.products.map((product, index) => (
                <div key={index} className="d-flex align-items-center mt-2">
                  <span>{product.name}</span>
                  <Select
                    options={productOptions.find(opt => opt.value === product.name)?.variations.map(variation => ({ value: variation, label: variation }))}
                    onChange={(selectedOption) => handleVariationChange(index, selectedOption.value)}
                    className="mx-2"
                    placeholder="Select Variation"
                  />
                  <Form.Control
                    type="number"
                    value={product.quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    min="1"
                    className="mx-2"
                    style={{ width: '60px' }}
                  />
                </div>
              ))}
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Order
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal for Viewing Order Details */}
      <Modal show={showOrderDetailsModal} onHide={() => setShowOrderDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder ? (
            <div>
              <h5>Order ID: {selectedOrder.id}</h5>
              <p>Customer: {selectedOrder.customer}</p>
              <p>Total Amount: {selectedOrder.total}</p>
              <p>Status: {selectedOrder.status}</p>
              <h6>Products:</h6>
              <ul>
                {selectedOrder.products.length > 0 ? (
                  selectedOrder.products.map((product, index) => (
                    <li key={index}>
                      {product.name} (Variation: {product.variation}) - Quantity: {product.quantity}
                    </li>
                  ))
                ) : (
                  <li>No products associated with this order.</li>
                )}
              </ul>
            </div>
          ) : (
            <p>No order selected.</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ViewOrders;
