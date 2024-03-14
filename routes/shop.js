const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  ourId: { type: String, required: true },
  anArray: { type: Array, required: false },
  anObject: { type: Object, required: false }
})

const Product = mongoose.model('Product', productSchema) // 'Product' refers to the collection, so maps products collection to productSchema; see lecture notes

let nextProductId = 0;
router.get('/addProduct', (req, res, next) => {
  res.send(`
    <form action="/addProduct" method="POST">
      <input type="text" name="name" placeholder="Product Name"><br>
      <input type="number" name="price" placeholder="Product Price"><br>
      <input type="text" name="ourId" placeholder="Product ID"><br>
      <button type="submit">Add Product</button>
    </form>
  `);
});

router.post('/addProduct', (req, res, next) => {
  const { name, price, ourId } = req.body;

  // Create a new product instance with user-provided data
  const newProduct = new Product({
    name: name,
    price: price,
    ourId: ourId
  });

  // Save the new product to the database
  newProduct.save()
    .then(() => {
      console.log('Saved new product to database');
      res.redirect('/');
    })
    .catch(err => {
      console.log('Failed to add new product: ' + err);
      res.status(500).send('Failed to add new product');
    });
});

router.get('/', (req, res, next) => {
  Product.find() // Always returns an array
    .then(products => {
      res.send('Products: ' + JSON.stringify(products))
    })
    .catch(err => {
      console.log('Failed to find: ' + err)
      res.send('No products')
    })
})

// Route to display the form to get a specific product
router.get('/getSpecificProduct', (req, res, next) => {
  res.send(`
    <div>
      <h2>Get Specific Product</h2>
      <form action="/getSpecificProduct" method="POST">
        <label for="productName">Product Name:</label>
        <input type="text" id="productName" name="name" required><br>
        <button type="submit">Get Product</button>
      </form>
    </div>
  `);
});

// Route to handle getting a specific product by name
router.post('/getSpecificProduct', (req, res, next) => {
  const productName = req.body.name;
  Product.findOne({ name: productName })
    .then(product => {
      if (product) {
        res.send(`
          <h2>Specific Product</h2>
          <p>Name: ${product.name}</p>
          <p>Price: ${product.price}</p>
          <p>Our ID: ${product.ourId}</p>
          <p>Array: ${product.anArray ? product.anArray.join(', ') : 'N/A'}</p>
          <p>Object: ${product.anObject ? JSON.stringify(product.anObject) : 'N/A'}</p>
        `);
      } else {
        res.send('Product not found');
      }
    })
    .catch(err => {
      console.log('Error finding product: ' + err);
      res.send('Error finding product');
    });
});

// Route to update a specific product by ourId
router.get('/updateSpecificProduct', (req, res, next) => {
  res.send(`
    <div>
      <h2>Update Specific Product</h2>
      <form action="/updateSpecificProduct" method="POST">
        <label for="productOurId">Enter Product OurId:</label>
        <input type="text" id="productOurId" name="ourId" required><br>
        <button type="submit">Search</button>
      </form>
    </div>
  `);
});

// Route to handle updating a specific product by ourId
router.post('/updateSpecificProduct', (req, res, next) => {
  const ourId = req.body.ourId;

  Product.findOne({ ourId: ourId })
    .then(product => {
      if (!product) {
        return res.send('Product not found');
      }
      res.send(`
        <div>
          <h2>Product Details</h2>
          <p>OurId: ${product.ourId}</p>
          <p>Name: ${product.name}</p>
          <p>Price: ${product.price}</p>
          <h3>Update Product</h3>
          <form action="/updateProductDetails/${product._id}" method="POST">
            <label for="productName">New Name:</label>
            <input type="text" id="productName" name="name" required><br>
            <label for="productPrice">New Price:</label>
            <input type="number" id="productPrice" name="price" required><br>
            <button type="submit">Update</button>
          </form>
        </div>
      `);
    })
    .catch(err => {
      console.log('Error updating product: ' + err);
      res.status(500).send('Error updating product');
    });
});

// Route to handle updating product details
router.post('/updateProductDetails/:productId', (req, res, next) => {
  const productId = req.params.productId;
  const newName = req.body.name;
  const newPrice = req.body.price;

  Product.findByIdAndUpdate(productId, { name: newName, price: newPrice }, { new: true })
    .then(updatedProduct => {
      if (!updatedProduct) {
        return res.send('Product not found');
      }
      console.log('Product updated successfully');
      res.redirect('/');
    })
    .catch(err => {
      console.log('Error updating product: ' + err);
      res.status(500).send('Error updating product');
    });
});

// Route to handle updating a specific product by ourId
router.post('/updateSpecificProduct', (req, res, next) => {
  const ourId = req.body.ourId;
  const newName = req.body.name;
  const newPrice = req.body.price;

  Product.findOneAndUpdate({ ourId: ourId }, { name: newName, price: newPrice }, { new: true })
    .then(updatedProduct => {
      if (!updatedProduct) {
        return res.send('Product not found');
      }
      console.log('Product updated successfully');
      res.redirect('/');
    })
    .catch(err => {
      console.log('Error updating product: ' + err);
      res.status(500).send('Error updating product');
    });
});

// Route to handle deleting a specific product by ourId
router.post('/deleteSpecificProduct', (req, res, next) => {
  const ourId = req.body.ourId;

  Product.findOneAndRemove({ ourId: ourId })
    .then(deletedProduct => {
      if (!deletedProduct) {
        return res.send('Product not found');
      }
      console.log('Product deleted successfully');
      res.redirect('/');
    })
    .catch(err => {
      console.log('Error deleting product: ' + err);
      res.status(500).send('Error deleting product');
    });
});

exports.routes = router
