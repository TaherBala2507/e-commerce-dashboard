import React, { useState } from 'react';
import { Form, Button, Card, Alert, ListGroup, Modal } from 'react-bootstrap';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [isChildCategory, setIsChildCategory] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleParentChange = (e) => {
    setParentCategory(e.target.value);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    const newCategory = {
      name: categoryName,
      thumbnail: thumbnail,
      children: [],
    };

    if (editingIndex !== null) {
      const updatedCategories = [...categories];
      updatedCategories[editingIndex] = newCategory;
      setCategories(updatedCategories);
      setSuccessMessage(`Category "${categoryName}" updated successfully!`);
      setEditingIndex(null);
    } else {
      if (parentCategory) {
        const updatedCategories = categories.map((cat) => {
          if (cat.name === parentCategory) {
            cat.children.push(newCategory);
          }
          return cat;
        });
        setCategories(updatedCategories);
      } else {
        setCategories([...categories, newCategory]);
      }
      setSuccessMessage(`Category "${categoryName}" added successfully!`);
    }
    setCategoryName('');
    setParentCategory('');
    setThumbnail(null);
    setIsChildCategory(false);
  };

  const handleEditCategory = (index, isChild = false) => {
    if (isChild) {
      const parentIndex = categories.findIndex((cat) => cat.children.some((child) => child.name === categories[index].name));
      const childCategory = categories[parentIndex].children[index];
      setCategoryName(childCategory.name);
      setParentCategory(categories[parentIndex].name);
      setThumbnail(childCategory.thumbnail);
      setEditingIndex(index);
      setIsChildCategory(true);
    } else {
      setCategoryName(categories[index].name);
      setThumbnail(categories[index].thumbnail);
      setEditingIndex(index);
      setIsChildCategory(false);
    }
    setShowModal(true);
  };

  const handleDeleteCategory = (index, isChild = false) => {
    if (isChild) {
      const parentIndex = categories.findIndex((cat) => cat.children.some((child) => child.name === categories[index].name));
      const updatedCategories = [...categories];
      updatedCategories[parentIndex].children = updatedCategories[parentIndex].children.filter((_, i) => i !== index);
      setCategories(updatedCategories);
      setSuccessMessage(`Child category deleted successfully!`);
    } else {
      const updatedCategories = categories.filter((_, i) => i !== index);
      setCategories(updatedCategories);
      setSuccessMessage(`Parent category deleted successfully!`);
    }
  };

  const toggleIsChildCategory = () => {
    setIsChildCategory(!isChildCategory);
    setParentCategory(isChildCategory ? '' : parentCategory);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCategoryName('');
    setParentCategory('');
    setThumbnail(null);
    setEditingIndex(null);
    setIsChildCategory(false);
  };

  return (
    <div className="p-3">
      <h1>Categories</h1>

      {/* Success Message */}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      {/* Form to Add Category */}
      <Card className="mt-3">
        <Card.Body>
          <Form onSubmit={handleAddCategory}>
            <Form.Group controlId="formCategoryName">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                value={categoryName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formThumbnail">
              <Form.Label>Category Thumbnail</Form.Label>
              <div 
                onDrop={handleDrop} 
                onDragOver={handleDragOver} 
                style={{ 
                  border: '2px dashed #007bff', 
                  borderRadius: '5px', 
                  padding: '20px', 
                  textAlign: 'center',
                  marginBottom: '10px'
                }}
              >
                {thumbnail ? (
                  <img src={thumbnail} alt="Thumbnail Preview" style={{ width: '100px', height: '100px' }} />
                ) : (
                  <p>Drag & drop your image here or click to select</p>
                )}
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  style={{ display: 'none' }} // Hide default file input
                />
              </div>
            </Form.Group>
            <Form.Group controlId="formParentCategory">
              <Form.Label>
                <Form.Check
                  type="checkbox"
                  label="Add as child category"
                  checked={isChildCategory}
                  onChange={toggleIsChildCategory}
                />
              </Form.Label>
              {isChildCategory && (
                <Form.Control as="select" value={parentCategory} onChange={handleParentChange} required>
                  <option value="">Select Parent Category</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat.name}>{cat.name}</option>
                  ))}
                </Form.Control>
              )}
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Category
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Categories List */}
      <Card className="mt-3">
        <Card.Body>
          <h5>Existing Categories</h5>
          <ListGroup>
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <ListGroup.Item key={index}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      {category.thumbnail && (
                        <img src={category.thumbnail} alt="Category Thumbnail" style={{ width: '30px', height: '30px', marginRight: '10px' }} />
                      )}
                      <strong>{category.name}</strong>
                    </div>
                    <div>
                      <Button variant="warning" size="sm" onClick={() => handleEditCategory(index)} className="me-2">
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteCategory(index)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                  {/* Display child categories */}
                  {category.children.length > 0 && (
                    <ListGroup className="mt-2">
                      {category.children.map((child, childIndex) => (
                        <ListGroup.Item key={childIndex} className="d-flex justify-content-between align-items-center">
                          {child.thumbnail && (
                            <img src={child.thumbnail} alt="Child Category Thumbnail" style={{ width: '30px', height: '30px', marginRight: '10px' }} />
                          )}
                          {child.name}
                          <div>
                            <Button variant="warning" size="sm" onClick={() => handleEditCategory(childIndex, true)} className="me-2">
                              Edit
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteCategory(childIndex, true)}>
                              Delete
                            </Button>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No categories added yet.</ListGroup.Item>
            )}
          </ListGroup>
        </Card.Body>
      </Card>

      {/* Edit Category Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isChildCategory ? 'Edit Child Category' : 'Edit Category'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddCategory}>
            <Form.Group controlId="formEditCategoryName">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                value={categoryName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEditThumbnail">
              <Form.Label>Category Thumbnail</Form.Label>
              <div 
                onDrop={handleDrop} 
                onDragOver={handleDragOver} 
                style={{ 
                  border: '2px dashed #007bff', 
                  borderRadius: '5px', 
                  padding: '20px', 
                  textAlign: 'center',
                  marginBottom: '10px'
                }}
              >
                {thumbnail ? (
                  <img src={thumbnail} alt="Thumbnail Preview" style={{ width: '100px', height: '100px' }} />
                ) : (
                  <p>Drag & drop your image here or click to select</p>
                )}
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  style={{ display: 'none' }} // Hide default file input
                />
              </div>
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Categories;
