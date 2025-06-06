const PrintForm = ({ printer, type, onSubmit }) => {
  const [size, setSize] = React.useState('');
  const [customSize, setCustomSize] = React.useState({ width: '', height: '' });
  const [material, setMaterial] = React.useState('');
  const [design, setDesign] = React.useState(null);
  const [pickup, setPickup] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [preview, setPreview] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [price, setPrice] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1); // State baru buat jumlah pembelian

  // useEffect untuk menghitung harga secara dinamis
  React.useEffect(() => {
    let basePrice = 0;

    // 1. Logika untuk ukuran kustom (Custom)
    if (size === 'Custom' && material) {
      const width = parseFloat(customSize.width) || 0;
      const height = parseFloat(customSize.height) || 0;
      const pricePerCm2 = printer.customPricePerCm2?.[material] || 0;

      if (width > 0 && height > 0 && pricePerCm2 > 0) {
        // Kalkulasi: Lebar x Tinggi x Harga per cm²
        basePrice = width * height * pricePerCm2;
      }
    } 
    // 2. Logika untuk ukuran standar
    else if (size && material) {
      if (printer.prices?.[size]?.[material]) {
        basePrice = printer.prices[size][material];
      }
    }

    let finalPrice = basePrice * quantity; // Kalikan dengan jumlah pembelian

    // 3. Tambahkan biaya pengiriman jika pesanan valid dan opsi delivery dipilih
    if (basePrice > 0 && pickup === 'Delivery') {
      finalPrice += printer.deliveryFee || 0;
    }
    
    // Bulatkan ke angka bulat terdekat untuk menghindari desimal
    setPrice(Math.round(finalPrice));

  }, [size, material, pickup, printer, customSize, quantity]); // Tambah quantity ke dependency array

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!size || !material || !pickup || !design || quantity < 1) {
      setError('Semua field wajib diisi dan jumlah harus lebih dari 0!');
      return;
    }
    if (pickup === 'Delivery' && !address) {
      setError('Alamat pengantaran wajib diisi untuk opsi Delivery!');
      return;
    }
    if (size === 'Custom' && (!customSize.width || !customSize.height || customSize.width <= 0 || customSize.height <= 0)) {
        setError('Lebar dan Tinggi untuk ukuran Custom harus diisi dan lebih dari 0!');
        return;
    }
    if (price === 0) {
      setError('Kombinasi tidak valid atau harga belum terhitung. Periksa kembali pilihan Anda.');
      return;
    }

    setError(null);
    const formData = new FormData();
    formData.append('storeId', printer.id);
    formData.append('type', type.name); // Mengirim nama dari jenis printing
    formData.append('size', size === 'Custom' ? `${customSize.width}x${customSize.height} cm` : size);
    formData.append('material', material);
    formData.append('pickup', pickup);
    formData.append('address', address);
    formData.append('design', design);
    formData.append('quantity', quantity); // Kirim jumlah pembelian ke backend
    // Anda bisa menambahkan harga ke form data jika ingin menyimpannya di backend
    formData.append('price', price);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Gagal submit pesanan');
      const result = await response.json();
      onSubmit(result.order.id);
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        setDesign(file);
        setPreview(file.type.startsWith('image/') ? URL.createObjectURL(file) : null);
      } else {
        setError('Harap upload file gambar (PNG/JPG) atau PDF!');
      }
    }
  };
  
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Pesan di {printer.name} - {type.name}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* UKURAN */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Ukuran Cetak</label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Pilih Ukuran</option>
            {printer.sizes.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
            <option value="Custom">Custom</option>
          </select>
        </div>

        {/* INPUT CUSTOM SIZE */}
        {size === 'Custom' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Lebar (cm)</label>
                <input
                type="number"
                value={customSize.width}
                onChange={(e) => setCustomSize({ ...customSize, width: e.target.value })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                placeholder="cth: 50"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Tinggi (cm)</label>
                <input
                type="number"
                value={customSize.height}
                onChange={(e) => setCustomSize({ ...customSize, height: e.target.value })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                placeholder="cth: 70"
                />
            </div>
          </div>
        )}

        {/* BAHAN */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Bahan</label>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Pilih Bahan</option>
            {printer.materials.map((mat) => (
              <option key={mat} value={mat}>{mat}</option>
            ))}
          </select>
        </div>

        {/* JUMLAH PEMBELIAN */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Jumlah Pembelian</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            min="1"
            required
          />
        </div>

        {/* UPLOAD DESAIN */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Desain</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*,application/pdf"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Opsi Pengambilan</label>
          <select
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Pilih Opsi</option>
            <option value="Ambil di Tempat">Ambil di Tempat</option>
            <option value="Delivery">Delivery</option>
          </select>
        </div>
        {pickup === 'Delivery' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Alamat Pengantaran</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Masukkan alamat lengkap"
            />
          </div>
        )}

        {/* TAMPILAN HARGA */}
        <div className="mt-6 pt-4 border-t">
          <h3 className="text-xl font-semibold text-right text-gray-800">Estimasi Harga:</h3>
          <p className="text-3xl font-bold text-right text-blue-600">
            {price > 0 ? formatRupiah(price) : 'Lengkapi pilihan Anda'}
          </p>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 font-semibold text-lg"
        >
          Pesan Sekarang
        </button>
      </form>
      {preview && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Preview Desain</h3>
          <img src={preview} alt="Design Preview" className="w-full h-auto border rounded-md" />
        </div>
      )}
      {error && <p className="text-center text-red-500 mt-4 p-2 bg-red-100 rounded-md">{error}</p>}
    </div>
  );
};