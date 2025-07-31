const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let customers = [];
let inventory = [];
let prices = {};

app.get('/', (req, res) => {
    res.send('Yadak Market App is running!');
});

// Upload inventory Excel file
app.post('/upload/inventory', upload.single('file'), (req, res) => {
    res.send('Inventory uploaded');
});

// Search item
app.get('/search', (req, res) => {
    const query = req.query.q.toLowerCase();
    const results = inventory.filter(item =>
        item.name.toLowerCase().includes(query) || item.code.toLowerCase().includes(query)
    );
    if (results.length > 0) {
        res.json({ status: 'available', items: results });
    } else {
        res.json({ status: 'not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
