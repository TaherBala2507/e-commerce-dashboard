import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import CreatableSelect from 'react-select/creatable';
import { useDropzone } from 'react-dropzone';
import { FaTimes } from 'react-icons/fa';

// GalleryUploader Component
const GalleryUploader = ({ onDrop, files, removeFile }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  const handleRemoveFile = (index, event) => {
    event.stopPropagation();
    removeFile(index);
  };

  return (
    <div {...getRootProps()} className="border border-light p-3">
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
      <div className="d-flex flex-wrap mt-3">
        {files.map((file, index) => (
          <div key={index} className="position-relative me-2">
            <img
              src={URL.createObjectURL(file)}
              alt={`Preview ${index + 1}`}
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
            <button
              onClick={(event) => handleRemoveFile(index, event)}
              className="position-absolute top-0 end-0 btn btn-light btn-sm rounded-circle"
              style={{ zIndex: 1 }}
            >
              <FaTimes color="red" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// AddANewProduct Component
const AddANewProduct = () => {
  const [product, setProduct] = useState({
    productName: '',
    parentCategory: '',
    childCategory: '',
    description: '',
    gallery: [],
    hasVariations: false,
    attributes: [],
    variations: [],
  });
  const [currentStep, setCurrentStep] = useState(0); // State for current step

  const stockStatuses = [
    { label: 'In Stock', value: 'inStock' },
    { label: 'Out of Stock', value: 'outOfStock' },
    { label: 'Preorder', value: 'preorder' },
  ];

  const categories = {
    Electronics: ['Mobiles', 'Laptops', 'Cameras'],
    Clothing: ['Men', 'Women', 'Kids'],
    'Home & Kitchen': ['Furniture', 'Kitchen Appliances', 'Home Decor'],
    Books: ['Fiction', 'Non-Fiction', 'Comics'],
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === 'checkbox' ? checked : value,
    });

    if (name === 'parentCategory') {
      setProduct({ ...product, parentCategory: value, childCategory: '' });
    }
  };

  const handleGalleryDrop = (acceptedFiles) => {
    setProduct({ ...product, gallery: [...product.gallery, ...acceptedFiles] });
  };

  const removeFile = (index) => {
    const newGallery = product.gallery.filter((_, i) => i !== index);
    setProduct({ ...product, gallery: newGallery });
  };

  const addAttribute = () => {
    setProduct({
      ...product,
      attributes: [...product.attributes, { name: '', values: [] }],
    });
  };

  const removeAttribute = (index) => {
    const newAttributes = product.attributes.filter((_, i) => i !== index);
    setProduct({ ...product, attributes: newAttributes });
  };

  const handleAttributeChange = (index, name, value) => {
    const newAttributes = [...product.attributes];
    if (name === 'name') {
      newAttributes[index].name = value;
    } else if (name === 'values') {
      newAttributes[index].values = value;
    }
    setProduct({ ...product, attributes: newAttributes });
  };

  // Function to generate variations based on attributes
  const generateVariations = () => {
    const { attributes } = product;
    const attributeValues = attributes.map(attr => attr.values);
    const variations = [];

    // Recursive function to create combinations
    const createCombinations = (current, index) => {
      if (index === attributeValues.length) {
        variations.push(current);
        return;
      }
      attributeValues[index].forEach(value => {
        createCombinations([...current, value], index + 1);
      });
    };

    createCombinations([], 0);
    const newVariations = variations.map(variation => ({
      values: variation,
      price: '',
      stockStatus: '',
      image: null,
    }));
    setProduct(prevProduct => ({ ...prevProduct, variations: newVariations }));
  };

  // Effect to generate variations whenever attributes change
  useEffect(() => {
    if (product.hasVariations && product.attributes.length > 0) {
      generateVariations();
    } else {
      setProduct(prevProduct => ({ ...prevProduct, variations: [] }));
    }
  }, [product.attributes, product.hasVariations]);

  const handleVariationInputChange = (index, field, value) => {
    const newVariations = [...product.variations];
    newVariations[index][field] = value;
    setProduct(prevProduct => ({ ...prevProduct, variations: newVariations }));
  };

  const handleVariationImageUpload = (index, files) => {
    if (files.length > 0) {
      handleVariationInputChange(index, 'image', files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Product:', product);
  };

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* Step Navigation */}
      <h3>Step {currentStep + 1}</h3>

      {/* Step 1: Basic Product Information */}
      {currentStep === 0 && (
        <>
          {/* Product Name */}
          <Form.Group controlId="formProductName">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter product name"
              name="productName"
              value={product.productName}
              onChange={handleInputChange}
            />
          </Form.Group>

          {/* Parent Category */}
          <Form.Group controlId="formParentCategory" className="mt-3">
            <Form.Label>Parent Category</Form.Label>
            <Form.Control
              as="select"
              name="parentCategory"
              value={product.parentCategory}
              onChange={handleInputChange}
            >
              <option value="">Select a parent category</option>
              {Object.keys(categories).map((parent) => (
                <option key={parent} value={parent}>
                  {parent}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {/* Child Category */}
          <Form.Group controlId="formChildCategory" className="mt-3">
            <Form.Label>Child Category</Form.Label>
            <Form.Control
              as="select"
              name="childCategory"
              value={product.childCategory}
              onChange={handleInputChange}
              disabled={!product.parentCategory}
            >
              <option value="">Select a child category</option>
              {product.parentCategory &&
                categories[product.parentCategory].map((child) => (
                  <option key={child} value={child}>
                    {child}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>

          {/* Product Description */}
          <Form.Group controlId="formProductDescription" className="mt-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter product description"
              name="description"
              value={product.description}
              onChange={handleInputChange}
            />
          </Form.Group>

          {/* Main Gallery Uploader */}
          <Form.Group controlId="formGallery" className="mt-3">
            <Form.Label>Gallery</Form.Label>
            <GalleryUploader onDrop={handleGalleryDrop} files={product.gallery} removeFile={removeFile} />
          </Form.Group>
        </>
      )}

      {/* Step 2: Variations */}
      {currentStep === 1 && (
        <>
          {/* Checkbox to show/hide variations */}
          <Form.Group controlId="formHasVariations" className="mt-4">
            <Form.Check
              type="checkbox"
              label="Does this product have variations?"
              name="hasVariations"
              checked={product.hasVariations}
              onChange={handleInputChange}
            />
          </Form.Group>

          {/* Variations section */}
          {product.hasVariations && (
            <>
              <h4 className="mt-4">Attributes</h4>
              {product.attributes.map((attribute, index) => (
                <Row key={index} className="mt-3">
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="Attribute Name"
                      value={attribute.name}
                      onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                    />
                  </Col>
                  <Col>
                    <CreatableSelect
                      isMulti
                      onChange={(selectedOptions) =>
                        handleAttributeChange(index, 'values', selectedOptions.map(option => option.value))
                      }
                      options={[]}
                      placeholder="Attribute Values"
                    />
                  </Col>
                  <Col>
                    <Button variant="danger" onClick={() => removeAttribute(index)}>
                      Remove
                    </Button>
                  </Col>
                </Row>
              ))}
              <Button variant="primary" onClick={addAttribute} className="mt-2">
                Add Attribute
              </Button>
            </>
          )}
        </>
      )}

      {/* Step 3: Variations Inputs */}
      {currentStep === 2 && product.hasVariations && (
        <>
          <h4 className="mt-4">Variations</h4>
          {product.variations.map((variation, index) => (
            <Row key={index} className="mt-3">
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Variation Price"
                  value={variation.price}
                  onChange={(e) => handleVariationInputChange(index, 'price', e.target.value)}
                />
              </Col>
              <Col>
                <Form.Control
                  as="select"
                  value={variation.stockStatus}
                  onChange={(e) => handleVariationInputChange(index, 'stockStatus', e.target.value)}
                >
                  <option value="">Select Stock Status</option>
                  {stockStatuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </Form.Control>
              </Col>
              <Col>
                <GalleryUploader
                  onDrop={(files) => handleVariationImageUpload(index, files)}
                  files={variation.image ? [variation.image] : []}
                  removeFile={() => handleVariationInputChange(index, 'image', null)}
                />
              </Col>
            </Row>
          ))}
        </>
      )}

      {/* Navigation Buttons */}
      <div className="mt-4">
        {currentStep > 0 && (
          <Button variant="secondary" onClick={prevStep}>
            Previous
          </Button>
        )}
        {currentStep < 2 && (
          <Button variant="primary" onClick={nextStep} className="ms-2">
            Next
          </Button>
        )}
        {currentStep === 2 && (
          <Button variant="success" type="submit" className="ms-2">
            Submit
          </Button>
        )}
      </div>
    </Form>
  );
};

export default AddANewProduct;
