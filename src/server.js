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
  // 1. Tambahkan 'type' ke dalam daftar variabel yang diambil dari body
  const { size, material, pickup, address, storeId, type } = req.body;
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
    type: type, // 2. Simpan 'type' ke dalam objek pesanan baru
    size,
    material,
    pickup,
    address: pickup === 'Delivery' ? address : 'N/A',
    design,
    status: 'Diproses', // 3. Tambahkan status default
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);
  fs.writeFileSync('src/orders.json', JSON.stringify(orders, null, 2));
  res.json({ message: 'Pesanan diterima!', order: newOrder });
});

// API BARU: Ambil satu pesanan berdasarkan ID
app.get('/api/orders/:id', (req, res) => {
  try {
    // 1. Baca kedua file: orders.json dan stores.json
    const orders = JSON.parse(fs.readFileSync('src/orders.json'));
    const stores = JSON.parse(fs.readFileSync('src/stores.json'));

    // 2. Ambil ID dari parameter URL dan ubah ke integer
    const orderId = parseInt(req.params.id);

    // 3. Cari pesanan yang cocok di dalam array orders
    const order = orders.find(o => o.id === orderId);

    // 4. Jika pesanan TIDAK ditemukan, kirim status 404
    if (!order) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }
    
    // 5. Jika DITEMUKAN, cari data percetakan berdasarkan storeId dari pesanan
    const store = stores.find(s => s.id === order.storeId);
    
    // 6. Gabungkan data pesanan dengan nama percetakan (jika ditemukan)
    const orderDetails = {
      ...order,
      printerName: store ? store.name : 'Nama Percetakan Tidak Ditemukan'
    };
    
    // 7. Kirim data yang sudah digabungkan sebagai response
    res.json(orderDetails);
    
  } catch (error) {
    // Jika terjadi error saat membaca file
    console.error(error); // Log error untuk debugging
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