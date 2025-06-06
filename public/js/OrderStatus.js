const OrderStatus = ({ orderId }) => {
  const [order, setOrder] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Pesanan tidak ditemukan atau terjadi kesalahan server');
        }
        return res.json();
      })
      .then((data) => {
        setOrder(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orderId]);

  if (loading) return <p className="text-center">Memuat detail pesanan...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!order) return <p className="text-center text-red-500">Data pesanan tidak dapat dimuat.</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Status Pemesanan</h1>
      <div className="space-y-3">
        <p><strong>ID Pesanan:</strong> #{order.id}</p>
        <p><strong>Percetakan:</strong> {order.printerName}</p>
        <p><strong>Jenis Printing:</strong> {order.type}</p>
        <p><strong>Ukuran:</strong> {order.size}</p>
        <p><strong>Bahan:</strong> {order.material}</p>
        <p><strong>Jumlah:</strong> {order.quantity || 1}</p> {/* Tampilin jumlah, default 1 kalau gak ada */}
        <p><strong>Pengambilan:</strong> {order.pickup}</p>
        {order.pickup === 'Delivery' && <p><strong>Alamat:</strong> {order.address}</p>}
        <p><strong>File Desain:</strong> {order.design ? <a href={order.design} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat File</a> : 'N/A'}</p>
        <p><strong>Harga Total:</strong> {order.price ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(order.price) : 'N/A'}</p> {/* Tampilin harga */}
        <p><strong>Status:</strong> <span className="font-semibold text-green-600">{order.status}</span></p>
        <p><strong>Waktu Pemesanan:</strong> {new Date(order.createdAt).toLocaleString('id-ID')}</p>
      </div>
    </div>
  );
};