import React, { useState, useEffect } from 'react';
import { Table, Card, Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';

function ManageReturns() {
  // State for return requests
  const [returns, setReturns] = useState([]);

  // State for the new return modal
  const [showModal, setShowModal] = useState(false);
  const [newReturn, setNewReturn] = useState({
    orderId: '',
    customer: '',
    reason: '',
    status: 'Pending',
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewReturn({ ...newReturn, [name]: value });
  };

  // Handle form submission for new return
  const handleSubmit = (e) => {
    e.preventDefault();
    createReturn(newReturn);
    setNewReturn({ orderId: '', customer: '', reason: '', status: 'Pending' }); // Reset form
    setShowModal(false); // Close modal
  };

  // Handle return status change
  const handleStatusChange = (id, newStatus) => {
    updateReturn(id, newStatus);
  };

  // Fetch returns from API
  const fetchReturns = async () => {
    try {
      const response = await axios.get('/api/returns');
      setReturns(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Create a new return
  const createReturn = async (newReturn) => {
    try {
      const response = await axios.post('/api/returns', newReturn);
      setReturns([...returns, response.data]);
    } catch (err) {
      console.error(err);
    }
  };

  // Update a return
  const updateReturn = async (id, newStatus) => {
    try {
      const response = await axios.put(`/api/returns/${id}`, { status: newStatus });
      setReturns(returns.map(returnRequest => 
        returnRequest.id === id ? { ...returnRequest, status: newStatus } : returnRequest
      ));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

 return (
    <div className="p-3">
      <h1>Manage Returns</h1>

      {/* Button to open modal for new return */}
      <Button variant="primary" onClick={() => setShowModal(true)}>
        New Return Request
      </Button>

      {/* Table to display return requests */}
      <Card className="mt-3">
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Return ID</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {returns.map(returnRequest => (
                <tr key={returnRequest.id}>
                  <td>{returnRequest.id}</td>
                  <td>{returnRequest.orderId}</td>
                  <td>{returnRequest.customer}</td>
                  <td>{returnRequest.reason}</td>
                  <td>{returnRequest.status}</td>
                  <td>
                    {returnRequest.status === 'Pending' && (
                      <>
                        <Button variant="success" onClick={() => handleStatusChange(returnRequest.id, 'Approved')}>
                          Approve
                        </Button>
                        <Button variant="danger" onClick={() => handleStatusChange(returnRequest.id, 'Rejected')}>
                          Reject
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal for adding new return request */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New Return Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formOrderId">
              <Form.Label>Order ID</Form.Label>
              <Form.Control
                type="text"
                name="orderId"
                value={newReturn.orderId}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCustomer">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                type="text"
                name="customer"
                value={newReturn.customer}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formReason">
              <Form.Label>Reason for Return</Form.Label>
              <Form.Control
                type="text"
                name="reason"
                value={newReturn.reason}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit Return Request
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ManageReturns;