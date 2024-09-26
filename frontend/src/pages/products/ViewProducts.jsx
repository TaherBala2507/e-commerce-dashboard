import React, { useState, useEffect } from 'react';
import { Table, Card, Form, Button, Modal } from 'react-bootstrap';

function ViewProducts() {
  // State for products
  const [products, setProducts] = useState([]);

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

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

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
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.productName}</td>
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
              <h5>{selectedProduct.productName}</h5>
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