import { useNavigate} from 'react-router-dom';
import Header from '../../components/userComponents/Headers';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useSocket from '../../utils/SocketContext';

const PaymentSuccess = () => {
  const naavigate = useNavigate(); 
  const managerId=useParams().managerId;
  const {socket}=useSocket();



  const handleGoHome = () => {
    naavigate('/home'); // Redirect to the home page
  };

  useEffect(()=>{
    console.log("HAI",managerId);


  },[]);

  return (
    <div>
      <Header/>
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
    </div>
  );
};

export default PaymentSuccess;
