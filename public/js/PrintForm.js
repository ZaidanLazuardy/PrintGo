const PrintForm = ({ printer, type, onSubmit }) => {
  const [size, setSize] = React.useState('');
  const [customSize, setCustomSize] = React.useState({ width: '', height: '' });
  const [material, setMaterial] = React.useState('');
  const [design, setDesign] = React.useState(null);
  const [pickup, setPickup] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [preview, setPreview] = React.useState(null);
  const [error, setError] = React.useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!size || !material || !pickup || (pickup === 'Delivery' && !address) || !design) {
      setError('Semua field wajib diisi!');
      return;
    }

    const formData = new FormData();
    formData.append('storeId', printer.id);
    formData.append('size', size === 'Custom' ? `${customSize.width}x${customSize.height} cm` : size);
    formData.append('material', material);
    formData.append('pickup', pickup);
    formData.append('address', address);
    if (design) formData.append('design', design);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Gagal submit pesanan');
      const result = await response.json();
      onSubmit(result.order.id);
      setError(null);
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setDesign(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setError('Harap upload file gambar (PNG/JPG)!');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Pesan di {printer.name} - {type.name}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        {size === 'Custom' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Lebar (cm)</label>
            <input
              type="number"
              value={customSize.width}
              onChange={(e) => setCustomSize({ ...customSize, width: e.target.value })}
              className="block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Lebar"
            />
            <label className="block text-sm font-medium text-gray-700">Tinggi (cm)</label>
            <input
              type="number"
              value={customSize.height}
              onChange={(e) => setCustomSize({ ...customSize, height: e.target.value })}
              className="block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Tinggi"
            />
          </div>
        )}
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
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Desain</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
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
              placeholder="Masukkan alamat"
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
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
      {error && <p className="text-center text-red-500 mt-2">{error}</p>}
    </div>
  );
};