const { useState, useEffect } = React;
const { createRoot } = ReactDOM;

const App = () => {
  const [page, setPage] = useState('printer-list');
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const goToPrintType = (printer) => {
    setSelectedPrinter(printer);
    setPage('print-type');
  };

  const goToPrintForm = (type) => {
    setSelectedType(type);
    setPage('print-form');
  };

  const goToOrderStatus = (id) => {
    setOrderId(id);
    setPage('order-status');
  };

  const goBack = () => {
    if (page === 'order-status') setPage('print-form');
    else if (page === 'print-form') setPage('print-type');
    else if (page === 'print-type') setPage('printer-list');
  };

  return (
    <div>
      {page !== 'printer-list' && (
        <button
          onClick={goBack}
          className="mb-4 bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
        >
          Kembali
        </button>
      )}
      {page === 'printer-list' && <PrinterList onSelect={goToPrintType} />}
      {page === 'print-type' && (
        <PrintType printer={selectedPrinter} onSelect={goToPrintForm} />
      )}
      {page === 'print-form' && (
        <PrintForm
          printer={selectedPrinter}
          type={selectedType}
          onSubmit={goToOrderStatus}
        />
      )}
      {page === 'order-status' && <OrderStatus orderId={orderId} />}
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);