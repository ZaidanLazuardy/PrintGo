const OrderStatus = ({ orderId }) => {
  const [order, setOrder] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    // Hanya ada satu tujuan: fetch data.
    fetch(`/api/orders/${orderId}`)
      .then((res) => {
        if (!res.ok) {
          // Jika respons tidak OK, lempar error untuk ditangkap oleh .catch
          throw new Error('Pesanan tidak ditemukan atau terjadi kesalahan server');
        }
        return res.json();
      })
      .then((data) => {
        // Data dari API (yang sudah lengkap) disimpan di state
        setOrder(data);
      })
      .catch((err) => {
        // Jika ada error, simpan pesan errornya
        setError(err.message);
      })
      .finally(() => {
        // Apapun hasilnya, loading selesai
        setLoading(false);
      });
  }, [orderId]);

  // Tampilan saat loading
  if (loading) return <p className="text-center">Memuat detail pesanan...</p>;
  
  // Tampilan jika ada error
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  
  // Tampilan jika data tidak ada (sebagai pengaman)
  if (!order) return <p className="text-center text-red-500">Data pesanan tidak dapat dimuat.</p>;

  // Tampilan utama dengan data asli dari API
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Status Pemesanan</h1>
      <div className="space-y-3">
        <p><strong>ID Pesanan:</strong> #{order.id}</p>
        <p><strong>Percetakan:</strong> {order.printerName}</p> {/* Menggunakan printerName dari API */}
        <p><strong>Jenis Printing:</strong> {order.type}</p> {/* Menggunakan type dari API */}
        <p><strong>Ukuran:</strong> {order.size}</p>
        <p><strong>Bahan:</strong> {order.material}</p>
        <p><strong>Pengambilan:</strong> {order.pickup}</p>
        {order.pickup === 'Delivery' && <p><strong>Alamat:</strong> {order.address}</p>}
        <p><strong>File Desain:</strong> {order.design ? <a href={order.design} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat File</a> : 'N/A'}</p>
        <p><strong>Status:</strong> <span className="font-semibold text-green-600">{order.status}</span></p> {/* Menggunakan status dari API */}
        <p><strong>Waktu Pemesanan:</strong> {new Date(order.createdAt).toLocaleString('id-ID')}</p>
      </div>
    </div>
  );
};