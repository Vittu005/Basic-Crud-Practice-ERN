import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/api/products';

function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setProducts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price) return;

        const method = editingId ? 'PATCH' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price }),
    });

    if (response.ok) {
      fetchProducts();
      setName('');
      setPrice('');
      setEditingId(null);
    }
  };

  const handleEdit = (product) => {
    setName(product.name);
    setPrice(product.price);
    setEditingId(product.id);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (response.ok) {
      fetchProducts();
    }
  };

  return (
    <div className="App">
      <h1>E-commerce Product Management</h1>

      <form onSubmit={handleSubmit} className="product-form">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Product Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <button type="submit">{editingId ? 'Update' : 'Add'} Product</button>
      </form>

      <ul className="product-list">
        {products.map((product) => (
          <li key={product.id} className="product-card">
            <div>
              <h2>{product.name}</h2>
              <p>${product.price}</p>
            </div>
            <div className="product-actions">
              <button onClick={() => handleEdit(product)} className="edit-btn">Edit</button>
              <button onClick={() => handleDelete(product.id)} className="delete-btn">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
