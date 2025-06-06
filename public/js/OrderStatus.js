const OrderStatus = ({ orderId }) => {
  const [order, setOrder] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Pesanan tidak ditemukan');
        return res.json();
      })
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        // Dummy data kalau API belum ada
        setOrder({
          id: orderId,
          printer: 'PrintGo Jakarta',
          type: 'Banner',
          size: 'A3',
          material: 'Vinyl',
          pickup: 'Delivery',
          address: 'Jl. Sudirman No. 1',
          design: '/uploads/dummy.jpg',
          status: 'Diproses',
          createdAt: new Date().toISOString(),
        });
        setLoading(false);
      });
  }, [orderId]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error || !order) return <p className="text-center text-red-500">Error: {error || 'Data pesanan tidak ada'}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Status Pemesanan</h1>
      <div className="space-y-2">
        <p><strong>ID Pesanan:</strong> {order.id}</p>
        <p><strong>Percetakan:</strong> {order.printer || 'PrintGo Jakarta'}</p>
        <p><strong>Jenis Printing:</strong> {order.type}</p>
        <p><strong>Ukuran:</strong> {order.size}</p>
        <p><strong>Bahan:</strong> {order.material}</p>
        <p><strong>Pengambilan:</strong> {order.pickup}</p>
        <p><strong>Alamat:</strong> {order.address}</p>
        <p><strong>File Desain:</strong> {order.design ? <a href={order.design} className="text-blue-600">Lihat</a> : 'N/A'}</p>
        <p><strong>Status:</strong> {order.status || 'Diproses'}</p>
        <p><strong>Waktu Pemesanan:</strong> {new Date(order.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};