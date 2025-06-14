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

// Validasi tipe file
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file JPG, PNG, atau PDF yang diizinkan!'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API untuk simpan pesanan
app.post('/api/orders', upload.single('design'), (req, res) => {
  const { size, material, pickup, address, storeId, type, quantity, price } = req.body; // Tambah quantity dan price
  const design = req.file ? `/uploads/${req.file.filename}` : null;

  let orders = [];
  try {
    orders = JSON.parse(fs.readFileSync('src/orders.json'));
  } catch (e) {
    orders = [];
  }

  const newOrder = {
    id: orders.length + 1,
    storeId: parseInt(storeId),
    type,
    size,
    material,
    pickup,
    address: pickup === 'Delivery' ? address : 'N/A',
    design,
    quantity: parseInt(quantity), // Simpan quantity
    price: parseInt(price), // Simpan price
    status: 'Diproses',
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);
  fs.writeFileSync('src/orders.json', JSON.stringify(orders, null, 2));
  res.json({ message: 'Pesanan diterima!', order: newOrder });
});

// API BARU: Ambil satu pesanan berdasarkan ID
app.get('/api/orders/:id', (req, res) => {
  try {
    const orders = JSON.parse(fs.readFileSync('src/orders.json'));
    const stores = JSON.parse(fs.readFileSync('src/stores.json'));

    const orderId = parseInt(req.params.id);
    const order = orders.find(o => o.id === orderId);

    if (!order) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }
    
    const store = stores.find(s => s.id === order.storeId);
    const orderDetails = {
      ...order,
      printerName: store ? store.name : 'Nama Percetakan Tidak Ditemukan'
    };
    
    res.json(orderDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal membaca data pesanan' });
  }
});

// API untuk ambil semua toko
app.get('/api/stores', (req, res) => {
  try {
    const stores = JSON.parse(fs.readFileSync('src/stores.json'));
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membaca data toko' });
  }
});

// API untuk ambil detail satu toko berdasarkan ID
app.get('/api/stores/:id', (req, res) => {
  try {
    const stores = JSON.parse(fs.readFileSync('src/stores.json'));
    const store = stores.find(s => s.id === parseInt(req.params.id));
    if (!store) {
      return res.status(404).json({ message: 'Toko tidak ditemukan' });
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membaca data toko' });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server jalan di http://localhost:${port}`);
});