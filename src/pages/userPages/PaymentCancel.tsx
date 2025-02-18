import { useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate(); // For navigating to the home page

  const handleGoHome = () => {
    navigate('/home'); // Redirect to the home page
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-red-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm w-full">
        <h1 className="text-3xl font-semibold text-red-600 mb-4">Payment Cancelled</h1>
        <p className="text-gray-700 mb-6">
          Your payment has been cancelled. If you have any questions, please contact support.
        </p>
        <button
          onClick={handleGoHome}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentCancel;
