const PrintForm = ({ printer, type, onSubmit }) => {
  const [size, setSize] = React.useState(type.name === 'Banner' ? 'Custom' : '');
  const [customSize, setCustomSize] = React.useState({ width: '', height: '' });
  const [material, setMaterial] = React.useState('');
  const [design, setDesign] = React.useState(null);
  const [pickup, setPickup] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [preview, setPreview] = React.useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simulasi respons API
    const mockOrderId = Math.floor(Math.random() * 1000); // Buat ID acak
    const mockResponse = {
      order: {
        id: mockOrderId,
      },
    };

    // Langsung panggil onSubmit tanpa fetch
    onSubmit(mockResponse.order.id);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setDesign(file);
      setPreview(URL.createObjectURL(file));
    } else {
      alert('Harap upload file gambar (PNG/JPG)!');
    }
  };

  // Ukuran default "Custom" buat Banner
  const sizeOptions = type.name === 'Banner' ? [] : [
    { value: 'A4', label: 'A4 (21 x 29.7 cm)' },
    { value: 'A3', label: 'A3 (29.7 x 42 cm)' },
    { value: 'Custom', label: 'Custom' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Pesan di {printer.name} - {type.name}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {type.name !== 'Banner' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Ukuran Cetak</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Pilih Ukuran</option>
              {sizeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}
        {(type.name === 'Banner' || size === 'Custom') && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Lebar (cm)</label>
            <input
              type="number"
              value={customSize.width}
              onChange={(e) => setCustomSize({ ...customSize, width: e.target.value })}
              className="block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Lebar"
              required
            />
            <label className="block text-sm font-medium text-gray-700">Tinggi (cm)</label>
            <input
              type="number"
              value={customSize.height}
              onChange={(e) => setCustomSize({ ...customSize, height: e.target.value })}
              className="block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Tinggi"
              required
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
            {type.materials.map((mat) => (
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
    </div>
  );
};