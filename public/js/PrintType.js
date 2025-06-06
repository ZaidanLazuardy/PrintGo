const PrintType = ({ onSelect }) => {
  const printTypes = [
    { id: 1, name: 'Banner', materials: ['Vinyl', 'Flexi'] },
    { id: 2, name: 'Poster', materials: ['Art Paper', 'Glossy'] },
    { id: 3, name: 'Printing File', materials: ['HVS', 'Art Paper', 'Glossy'] },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Pilih Jenis Printing</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {printTypes.map((type) => (
          <div
            key={type.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer"
            onClick={() => onSelect(type)}
          >
            <h2 className="text-xl font-semibold">{type.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};