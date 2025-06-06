const PrinterList = ({ onSelect }) => {
  const [printers, setPrinters] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetch('/api/stores')
      .then((res) => {
        if (!res.ok) throw new Error('Gagal ambil data toko');
        return res.json();
      })
      .then((data) => {
        setPrinters(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Pilih Percetakan</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {printers.map((printer) => (
          <div
            key={printer.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer"
            onClick={() => onSelect(printer)}
          >
            <h2 className="text-xl font-semibold">{printer.name}</h2>
            <p className="text-gray-600">{printer.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};