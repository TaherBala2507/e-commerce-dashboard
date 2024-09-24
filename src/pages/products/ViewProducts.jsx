import React, { useState } from 'react';
import { Table, Card, Form, Button, Modal } from 'react-bootstrap';

function ViewProducts() {
  // Sample data for products
  const [products, setProducts] = useState([
    { id: 1, name: 'Product 1', price: '$50.00', stock: 100, description: 'Description of Product 1' },
    { id: 2, name: 'Product 2', price: '$75.00', stock: 50, description: 'Description of Product 2' },
    { id: 3, name: 'Product 3', price: '$100.00', stock: 30, description: 'Description of Product 3' },
    { id: 4, name: 'Product 4', price: '$25.00', stock: 200, description: 'Description of Product 4' },
  ]);

  // State for product details modal
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Open product details modal
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // Close product details modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="p-3">
      <h1>View Products</h1>

      {/* Table to display products */}
      <Card className="mt-3">
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <Button variant="info" onClick={() => handleViewProduct(product)}>
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal for product details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct ? (
            <div>
              <h5>{selectedProduct.name}</h5>
              <p><strong>Price:</strong> {selectedProduct.price}</p>
              <p><strong>Stock:</strong> {selectedProduct.stock}</p>
              <p><strong>Description:</strong> {selectedProduct.description}</p>
            </div>
          ) : (
            <p>No product selected.</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ViewProducts;
