const PrintType = ({ printer, onSelect }) => {
  const [error, setError] = React.useState(null);

  if (!printer) return <p className="text-center text-red-500">Toko belum dipilih</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Pilih Jenis Printing di {printer.name}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {printer.services.map((type) => (
          <div
            key={type}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer"
            onClick={() => onSelect({ name: type })}
          >
            <h2 className="text-xl font-semibold">{type}</h2>
          </div>
        ))}
      </div>
      {error && <p className="text-center text-red-500">{error}</p>}
    </div>
  );
};