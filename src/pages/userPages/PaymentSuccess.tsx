import { useNavigate} from 'react-router-dom';

const PaymentSuccess = () => {
  const naavigate = useNavigate(); // For navigating to the home page

  const handleGoHome = () => {
    naavigate('/home'); // Redirect to the home page
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-green-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm w-full">
        <h1 className="text-3xl font-semibold text-green-600 mb-4">Payment Successful</h1>
        <p className="text-gray-700 mb-6">Thank you for your payment! Your transaction has been processed successfully.</p>
        <button
          onClick={handleGoHome}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
