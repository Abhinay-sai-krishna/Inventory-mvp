const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../client')));

// Auth Routes
app.post('/api/signup', (req, res) => {
    const { email, password, orgName } = req.body;
    if (!email || !password || !orgName) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    db.run(`INSERT INTO users (email, password, org_name) VALUES (?, ?, ?)`, 
        [email, password, orgName], 
        function(err) {
            if (err) {
                return res.status(400).json({ error: 'Email already exists' });
            }
            res.json({ id: this.lastID, email, orgName });
        });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT id, email, org_name FROM users WHERE email = ? AND password = ?`, 
        [email, password], 
        (err, row) => {
            if (err || !row) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            res.json(row);
        });
});

// Product Routes
app.use((req, res, next) => {
    const userId = req.headers['user-id'];
    if (userId) {
        req.userId = userId;
    }
    next();
});

const requireAuth = (req, res, next) => {
    if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

app.post('/api/products', requireAuth, (req, res) => {
    const { name, sku, quantity, price } = req.body;
    db.run(`INSERT INTO products (user_id, name, sku, quantity, price) VALUES (?, ?, ?, ?, ?)`,
        [req.userId, name, sku, quantity, price],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});

app.get('/api/products', requireAuth, (req, res) => {
    db.all(`SELECT * FROM products WHERE user_id = ?`, [req.userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.put('/api/products/:id', requireAuth, (req, res) => {
    const { name, sku, quantity, price } = req.body;
    db.run(`UPDATE products SET name = ?, sku = ?, quantity = ?, price = ? WHERE id = ? AND user_id = ?`,
        [name, sku, quantity, price, req.params.id, req.userId],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ updated: this.changes });
        }
    );
});

app.delete('/api/products/:id', requireAuth, (req, res) => {
    db.run(`DELETE FROM products WHERE id = ? AND user_id = ?`, [req.params.id, req.userId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

app.get('/api/dashboard', requireAuth, (req, res) => {
    db.all(`SELECT quantity FROM products WHERE user_id = ?`, [req.userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const totalProducts = rows.length;
        const totalQuantity = rows.reduce((acc, row) => acc + row.quantity, 0);
        const lowStockItems = rows.filter(row => row.quantity <= 10).length; // Low stock threshold
        
        res.json({ totalProducts, totalQuantity, lowStockItems });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
