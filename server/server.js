const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory database
let products = [
  { id: 1, name: 'Laptop', price: 1200 },
  { id: 2, name: 'Keyboard', price: 75 },
  { id: 3, name: 'Mouse', price: 25 },
];
let nextId = 4;

// C - Create
app.post('/api/products', (req, res) => {
  try {
    console.log('POST /api/products');
    console.log('Request Body:', req.body);
    const { name, price } = req.body;
    if (!name || price === undefined) { // Check for price being undefined specifically
      return res.status(400).json({ message: 'Name and price are required' });
    }
    const newProduct = { id: nextId++, name, price: parseFloat(price) };
    products.push(newProduct);
    console.log('New Product:', newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    res.status(500).json({ message: 'An unexpected error occurred on the server.' });
  }
});

// R - Read
app.get('/api/products', (req, res) => {
  console.log('GET /api/products');
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    console.log(`GET /api/products/${req.params.id}`);
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
});

// U - Update
app.put('/api/products/:id', (req, res) => {
  try {
    console.log(`PUT /api/products/${req.params.id}`);
    console.log('Request Body:', req.body);
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const { name, price } = req.body;
    if (name) {
      product.name = name;
    }
    if (price !== undefined) {
      product.price = parseFloat(price);
    }
    console.log('Updated Product:', product);
    res.json(product);
  } catch (error) {
    console.error(`Error in PUT /api/products/${req.params.id}:`, error);
    res.status(500).json({ message: 'An unexpected error occurred on the server.' });
  }
});

// P - Patch
app.patch('/api/products/:id', (req, res) => {
  try {
    console.log(`PATCH /api/products/${req.params.id}`);
    console.log('Request Body:', req.body);
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const { name, price } = req.body;
    if (name) {
      product.name = name;
    }
    if (price !== undefined) {
      product.price = parseFloat(price);
    }
    console.log('Patched Product:', product);
    res.json(product);
  } catch (error) {
    console.error(`Error in PATCH /api/products/${req.params.id}:`, error);
    res.status(500).json({ message: 'An unexpected error occurred on the server.' });
  }
});

// D - Delete
app.delete('/api/products/:id', (req, res) => {
  try {
    console.log(`DELETE /api/products/${req.params.id}`);
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }
    products.splice(index, 1);
    console.log('Product deleted');
    res.status(204).send();
  } catch (error) {
    console.error(`Error in DELETE /api/products/${req.params.id}:`, error);
    res.status(500).json({ message: 'An unexpected error occurred on the server.' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});