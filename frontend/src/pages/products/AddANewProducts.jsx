import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Container,
  ProgressBar,
  Card,
  Alert,
} from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import { useDropzone } from "react-dropzone";
import { FaTimes } from "react-icons/fa";

// GalleryUploader Component
const GalleryUploader = ({ onDrop, files, removeFile }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  const handleRemoveFile = (index, event) => {
    event.stopPropagation();
    removeFile(index);
  };

  return (
    <Card className="shadow-sm p-3 mb-4">
      <div
        {...getRootProps()}
        className="p-4 text-center border-dashed rounded"
        style={{ border: "2px dashed #ccc", cursor: "pointer" }}
      >
        <input {...getInputProps()} />
        <p className="mb-0 text-muted">
          Drag & drop images here, or click to select files
        </p>
      </div>
      <div className="d-flex flex-wrap mt-3">
        {files.map((file, index) => (
          <div key={index} className="position-relative me-3 mb-3">
            <img
              src={URL.createObjectURL(file)}
              alt={`Preview ${index + 1}`}
              className="img-thumbnail"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
            <Button
              onClick={(event) => handleRemoveFile(index, event)}
              className="position-absolute top-0 start-100 translate-middle btn-close btn-sm"
              variant="light"
            >
              <FaTimes color="red" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};

// AddANewProduct Component
const AddANewProduct = () => {
  const [product, setProduct] = useState({
    productName: "",
    parentCategory: "",
    childCategory: "",
    description: "",
    gallery: [],
    hasVariations: false,
    attributes: [],
    variations: [],
  });
  const [currentStep, setCurrentStep] = useState(0); // State for current step
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({}); // State for form errors

  const stockStatuses = [
    { label: "In Stock", value: "inStock" },
    { label: "Out of Stock", value: "outOfStock" },
    { label: "Preorder", value: "preorder" },
  ];

  const categories = {
    Electronics: ["Mobiles", "Laptops", "Cameras"],
    Clothing: ["Men", "Women", "Kids"],
    "Home & Kitchen": ["Furniture", "Kitchen Appliances", "Home Decor"],
    Books: ["Fiction", "Non-Fiction", "Comics"],
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === "checkbox" ? checked : value,
    });
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
      attributes: [...product.attributes, { name: "", values: [] }],
    });
  };

  const removeAttribute = (index) => {
    const newAttributes = product.attributes.filter((_, i) => i !== index);
    setProduct({ ...product, attributes: newAttributes });
  };

  const handleAttributeChange = (index, name, value) => {
    const newAttributes = [...product.attributes];
    if (name === "name") {
      newAttributes[index].name = value;
    } else if (name === "values") {
      newAttributes[index].values = value;
    }
    setProduct({ ...product, attributes: newAttributes });
  };

  // Function to generate variations based on attributes
  const generateVariations = () => {
    const { attributes } = product;
    const attributeValues = attributes.map((attr) => attr.values);
    const variations = [];

    // Recursive function to create combinations
    const createCombinations = (current, index) => {
      if (index === attributeValues.length) {
        variations.push(current);
        return;
      }
      attributeValues[index].forEach((value) => {
        createCombinations([...current, value], index + 1);
      });
    };

    createCombinations([], 0);
    const newVariations = variations.map((variation) => ({
      values: variation,
      price: "",
      stockStatus: "",
      image: null,
      gallery: [],
    }));
    setProduct((prevProduct) => ({
      ...prevProduct,
      variations: newVariations,
    }));
  };

  // Effect to generate variations whenever attributes change
  useEffect(() => {
    if (product.hasVariations && product.attributes.length > 0) {
      generateVariations();
    } else {
      setProduct((prevProduct) => ({ ...prevProduct, variations: [] }));
    }
  }, [product.attributes, product.hasVariations]);

  const handleVariationInputChange = (index, field, value) => {
    const newVariations = [...product.variations];
    newVariations[index][field] = value;
    setProduct((prevProduct) => ({
      ...prevProduct,
      variations: newVariations,
    }));
  };

  const handleVariationImageUpload = (index, files) => {
    if (files.length > 0) {
      handleVariationInputChange(index, "image", files[0]);
    }
  };

  const handleVariationGalleryDrop = (index, acceptedFiles) => {
    const newVariations = [...product.variations];
    newVariations[index].gallery = [
      ...newVariations[index].gallery,
      ...acceptedFiles,
    ];
    setProduct((prevProduct) => ({
      ...prevProduct,
      variations: newVariations,
    }));
  };

  const removeVariationGalleryFile = (index, galleryIndex) => {
    const newVariations = [...product.variations];
    newVariations[index].gallery = newVariations[index].gallery.filter(
      (_, i) => i !== galleryIndex
    );
    setProduct((prevProduct) => ({
      ...prevProduct,
      variations: newVariations,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!product.productName) {
      newErrors.productName = "Product name is required";
    }
    if (!product.parentCategory) {
      newErrors.parentCategory = "Parent category is required";
    }
    if (!product.childCategory) {
      newErrors.childCategory = "Child category is required";
    }
    if (!product.description) {
      newErrors.description = "Description is required";
    }
    if (product.hasVariations && product.attributes.length === 0) {
      newErrors.attributes = "At least one attribute is required";
    }
    if (product.hasVariations && product.variations.length === 0) {
      newErrors.variations = "At least one variation is required";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch("/api/products/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        });
        const data = await response.json();
        if (response.ok) {
          setSubmitted(true);
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const nextStep = () => {
    const newErrors = {};
    if (currentStep === 0) {
      if (!product.productName) {
        newErrors.productName = "Product name is required";
      }
      if (!product.parentCategory) {
        newErrors.parentCategory = "Parent category is required";
      }
      if (!product.childCategory) {
        newErrors.childCategory = "Child category is required";
      }
      if (!product.description) {
        newErrors.description = "Description is required";
      }
    } else if (currentStep === 1) {
      if (product.hasVariations && product.attributes.length === 0) {
        newErrors.attributes = "At least one attribute is required";
      }
      if (product.hasVariations && product.variations.length === 0) {
        newErrors.variations = "At least one variation is required";
      }
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };
  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <Container className="my-5">
      {submitted ? (
        <Alert variant="success" className="text-center">
          <h4>Product added successfully!</h4>
        </Alert>
      ) : (
        <Card className="shadow-sm p-4">
          <Form onSubmit={handleSubmit}>
            <h3 className="text-center mb-4">Add a New Product</h3>

            {/* Step Navigation */}
            <ProgressBar now={((currentStep + 1) / 3) * 100} className="mb-4" />

            {/* Step 1: Basic Product Information */}
            {currentStep === 0 && (
              <>
                {/* Product Name */}
                <Form.Group controlId="formProductName" className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product name"
                    name="productName"
                    value={product.productName}
                    onChange={handleInputChange}
                    className="shadow-sm"
                    isInvalid={errors.productName}
                  />
                  {errors.productName && (
                    <Form.Control.Feedback type="invalid">
                      {errors.productName}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                {/* Parent Category */}
                <Form.Group controlId="formParentCategory" className="mb-3">
                  <Form.Label>Parent Category</Form.Label>
                  <Form.Control
                    as="select"
                    name="parentCategory"
                    value={product.parentCategory}
                    onChange={handleInputChange}
                    className="shadow-sm"
                    isInvalid={errors.parentCategory}
                  >
                    <option value="">Select a parent category</option>
                    {Object.keys(categories).map((parent) => (
                      <option key={parent} value={parent}>
                        {parent}
                      </option>
                    ))}
                  </Form.Control>
                  {errors.parentCategory && (
                    <Form.Control.Feedback type="invalid">
                      {errors.parentCategory}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                {/* Child Category */}
                <Form.Group controlId="formChildCategory" className="mb-3">
                  <Form.Label>Child Category</Form.Label>
                  <Form.Control
                    as="select"
                    name="childCategory"
                    value={product.childCategory}
                    onChange={handleInputChange}
                    disabled={!product.parentCategory}
                    className="shadow-sm"
                    isInvalid={errors.childCategory}
                  >
                    <option value="">Select a child category</option>
                    {product.parentCategory &&
                      categories[product.parentCategory].map((child) => (
                        <option key={child} value={child}>
                          {child}
                        </option>
                      ))}
                  </Form.Control>
                  {errors.childCategory && (
                    <Form.Control.Feedback type="invalid">
                      {errors.childCategory}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                {/* Product Description */}
                <Form.Group controlId="formProductDescription" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter product description"
                    name="description"
                    value={product.description}
                    onChange={handleInputChange}
                    className="shadow-sm"
                    isInvalid={errors.description}
                  />
                  {errors.description && (
                    <Form.Control.Feedback type="invalid">
                      {errors.description}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                {/* Main Gallery Uploader */}
                <Form.Group controlId="formGallery" className="mb-3">
                  <Form.Label>Gallery</Form.Label>
                  <GalleryUploader
                    onDrop={handleGalleryDrop}
                    files={product.gallery}
                    removeFile={removeFile}
                  />
                </Form.Group>
              </>
            )}

            {/* Step 2: Variations */}
            {currentStep === 1 && (
              <>
                {/* Checkbox to show/hide variations */}
                <Form.Group controlId="formHasVariations" className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="This product has variations"
                    name="hasVariations"
                    checked={product.hasVariations}
                    onChange={handleInputChange}
                    className="shadow-sm"
                  />
                </Form.Group>

                {/* Attribute List */}
                {product.hasVariations && (
                  <>
                    <h5>Product Attributes</h5>
                    {product.attributes.map((attribute, index) => (
                      <div key={index} className="mb-3">
                        <Form.Group
                          controlId={`formAttributeName-${index}`}
                          className="mb-2"
                        >
                          <Form.Label>Attribute Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="e.g. Color, Size"
                            value={attribute.name}
                            onChange={(e) =>
                              handleAttributeChange(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            className="shadow-sm"
                            isInvalid={errors.attributes}
                          />
                          {errors.attributes && (
                            <Form.Control.Feedback type="invalid">
                              {errors.attributes}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                        <Form.Group
                          controlId={`formAttributeValues-${index}`}
                          className="mb-3"
                        >
                          <Form.Label>Attribute Values</Form.Label>
                          <CreatableSelect
                            isMulti
                            value={attribute.values.map((value) => ({
                              label: value,
                              value,
                            }))}
                            onChange={(selected) =>
                              handleAttributeChange(
                                index,
                                "values",
                                selected.map((opt) => opt.value)
                              )
                            }
                            className="shadow-sm"
                          />
                        </Form.Group>
                        <Button
                          variant="danger"
                          onClick={() => removeAttribute(index)}
                          className="mb-3"
                        >
                          Remove Attribute
                        </Button>
                      </div>
                    ))}
                    <Button variant="primary" onClick={addAttribute}>
                      Add Attribute
                    </Button>
                  </>
                )}

                {/* Variation Details */}
                {product.hasVariations && product.variations.length > 0 && (
                  <>
                    <h5 className="mt-4">Variations</h5>
                    {product.variations.map((variation, index) => (
                      <Card key={index} className="mb-3 p-3 shadow-sm">
                        <strong>Variation {index + 1}:</strong>{" "}
                        {variation.values.join(", ")}
                        <Row>
                          <Col md={4}>
                            <Form.Group
                              controlId={`formPrice-${index}`}
                              className="mb-3"
                            >
                              <Form.Label>Price</Form.Label>
                              <Form.Control
                                type="number"
                                placeholder="Enter price"
                                value={variation.price}
                                onChange={(e) =>
                                  handleVariationInputChange(
                                    index,
                                    "price",
                                    e.target.value
                                  )
                                }
                                className="shadow-sm"
                                isInvalid={errors.variations}
                              />
                              {errors.variations && (
                                <Form.Control.Feedback type="invalid">
                                  {errors.variations}
                                </Form.Control.Feedback>
                              )}
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group
                              controlId={`formStockStatus-${index}`}
                              className="mb-3"
                            >
                              <Form.Label>Stock Status</Form.Label>
                              <Form.Control
                                as="select"
                                value={variation.stockStatus}
                                onChange={(e) =>
                                  handleVariationInputChange(
                                    index,
                                    "stockStatus",
                                    e.target.value
                                  )
                                }
                                className="shadow-sm"
                              >
                                <option value="">Select Stock Status</option>
                                {stockStatuses.map((status) => (
                                  <option
                                    key={status.value}
                                    value={status.value}
                                  >
                                    {status.label}
                                  </option>
                                ))}
                              </Form.Control>
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group
                              controlId={`formImage-${index}`}
                              className="mb-3"
                            >
                              <Form.Label>Upload Variation Image</Form.Label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleVariationImageUpload(
                                    index,
                                    e.target.files
                                  )
                                }
                                className="form-control shadow-sm"
                              />
                            </Form.Group>
                            {variation.image && (
                              <img
                                src={URL.createObjectURL(variation.image)}
                                alt={`Variation Image ${index + 1}`}
                                className="img-thumbnail"
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  objectFit: "cover",
                                }}
                              />
                            )}
                            <Form.Group
                              controlId={`formGallery-${index}`}
                              className="mb-3"
                            >
                              <Form.Label>Upload Variation Gallery</Form.Label>
                              <GalleryUploader
                                onDrop={(acceptedFiles) =>
                                  handleVariationGalleryDrop(
                                    index,
                                    acceptedFiles
                                  )
                                }
                                files={variation.gallery}
                                removeFile={(galleryIndex) =>
                                  removeVariationGalleryFile(
                                    index,
                                    galleryIndex
                                  )
                                }
                              />
                            </Form.Group>
                            {variation.gallery.length > 0 && (
                              <div className="d-flex flex-wrap mb-3">
                                {variation.gallery.map((file, galleryIndex) => (
                                  <img
                                    key={galleryIndex}
                                    src={URL.createObjectURL(file)}
                                    alt={`Gallery Preview ${galleryIndex + 1}`}
                                    className="img-thumbnail me-3 mb-3"
                                    style={{
                                      width: "100px",
                                      height: "100px",
                                      objectFit: "cover",
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          </Col>
                        </Row>
                      </Card>
                    ))}
                  </>
                )}
              </>
            )}

            {/* Step 3: Final Summary and Submit */}
            {currentStep === 2 && (
              <>
                <Container>
                  <Row>
                    <Col lg={12}>
                      <h4 className="mb-4">Review Product</h4>
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Field</th>
                            <th>Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Name</td>
                            <td>{product.productName}</td>
                          </tr>
                          <tr>
                            <td>Parent Category</td>
                            <td>{product.parentCategory}</td>
                          </tr>
                          <tr>
                            <td>Child Category</td>
                            <td>{product.childCategory}</td>
                          </tr>
                          <tr>
                            <td>Description</td>
                            <td>{product.description}</td>
                          </tr>
                          <tr>
                            <td>Has Variations</td>
                            <td>{product.hasVariations ? "Yes" : "No"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      {/* Display the main gallery images */}
                      {product.gallery.length > 0 && (
                        <>
                          <h5>Gallery Images:</h5>
                          <div className="d-flex flex-wrap mb-3">
                            {product.gallery.map((file, index) => (
                              <img
                                key={index}
                                src={URL.createObjectURL(file)}
                                alt={`Gallery Preview ${index + 1}`}
                                className="img-thumbnail me-3 mb-3"
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  objectFit: "cover",
                                }}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      {/* Display variation details with images */}
                      {product.hasVariations &&
                        product.variations.length > 0 && (
                          <>
                            <h5>Variations:</h5>
                            <table className="table table-striped">
                              <thead>
                                <tr>
                                  <th>Variation</th>
                                  <th>Price</th>
                                  <th>Stock Status</th>
                                  <th>Image</th>
                                  <th>Gallery</th>
                                </tr>
                              </thead>
                              <tbody>
                                {product.variations.map((variation, index) => (
                                  <tr key={index}>
                                    <td>
                                      <strong>Variation {index + 1}:</strong>{" "}
                                      {variation.values.join(", ")}
                                    </td>
                                    <td>${variation.price}</td>
                                    <td>{variation.stockStatus}</td>
                                    <td>
                                      {variation.image && (
                                        <img
                                          src={URL.createObjectURL(
                                            variation.image
                                          )}
                                          alt={`Variation Image ${index + 1}`}
                                          className="img-thumbnail me-3 mb-3"
                                          style={{
                                            width: "100px",
                                            height: "100px",
                                            objectFit: "cover",
                                          }}
                                        />
                                      )}
                                    </td>
                                    <td>
                                      {variation.gallery.length > 0 && (
                                        <div className="d-flex flex-wrap mb-3">
                                          {variation.gallery.map(
                                            (file, galleryIndex) => (
                                              <img
                                                key={galleryIndex}
                                                src={URL.createObjectURL(file)}
                                                alt={`Gallery Preview ${
                                                  galleryIndex + 1
                                                }`}
                                                className="img-thumbnail me-3 mb-3"
                                                style={{
                                                  width: "100px",
                                                  height: "100px",
                                                  objectFit: "cover",
                                                }}
                                              />
                                            )
                                          )}
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </>
                        )}
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <div className="btn text-center d-flex justify-content-center">
                        <Button
                          type="submit"
                          variant="success"
                          className="w-25"
                        >
                          Submit Product
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Container>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="d-flex justify-content-between mt-4">
              {currentStep > 0 && (
                <Button onClick={prevStep} variant="secondary">
                  Previous
                </Button>
              )}
              {currentStep < 2 && (
                <Button onClick={nextStep} variant="primary">
                  Next
                </Button>
              )}
            </div>
          </Form>
        </Card>
      )}
    </Container>
  );
};

export default AddANewProduct;
