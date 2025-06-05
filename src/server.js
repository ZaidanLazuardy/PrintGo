const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Setup storage untuk file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API untuk simpan pesanan
app.post('/api/orders', upload.single('design'), (req, res) => {
  const { size, material, pickup, address } = req.body;
  const design = req.file ? `/uploads/${req.file.filename}` : null;

  // Baca orders.json
  let orders = [];
  try {
    orders = JSON.parse(fs.readFileSync('src/orders.json'));
  } catch (e) {
    orders = [];
  }

  // Tambah pesanan baru
  const newOrder = {
    id: orders.length + 1,
    size,
    material,
    pickup,
    address: pickup === 'Delivery' ? address : 'N/A',
    design,
    createdAt: new Date().toISOString(),
  };
  orders.push(newOrder);

  // Simpan ke orders.json
  fs.writeFileSync('src/orders.json', JSON.stringify(orders, null, 2));

  res.json({ message: 'Pesanan diterima!', order: newOrder });
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server jalan di http://localhost:${port}`);
});