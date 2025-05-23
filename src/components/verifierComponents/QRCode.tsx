import  { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { FiCameraOff, FiCamera, FiRotateCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Footer from "../../components/verifierComponents/Footer";
import Header from "../../components/verifierComponents/Header";
interface QRCodeData {
  BookedID: string;
  User: string;
  Seats: string;
  Date: string;
  Event: string;
}

const QRCodeScanner = () => {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookedUser, setBookedUser] = useState<QRCodeData | null>(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    if (bookedUser?.BookedID && bookedUser?.User) {
      console.log("Mallu");
    (async () => {
      console.log("Mallu");
      await stopScanner(); 
      navigate(`/fetchSingleBookedUser/${bookedUser.BookedID}/${bookedUser.User}`);
    })();
    }
  }, [bookedUser]);

  const parseQRCodeText = (text: string): QRCodeData | null => {
    const lines = text.split('\n');
    const data: Partial<QRCodeData> = {};

    lines.forEach((line) => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        const trimmedKey = key.trim() as keyof QRCodeData;
        const trimmedValue = valueParts.join(':').trim();

        if (['BookedID', 'User', 'Seats', 'Date', 'Event'].includes(trimmedKey)) {
          data[trimmedKey] = trimmedValue;
        }
      }
    });

    if (data.BookedID && data.User && data.Seats && data.Date && data.Event) {
      return data as QRCodeData;
    }

    return null;
  };

  const startScanner = async () => {
    if (!scannerRef.current) {
      setCameraError('Scanner container not ready');
      setIsLoading(false);
      return;
    }

    try {
      if (scanner) {
        await scanner.stop();
        await scanner.clear();
      }

      const newScanner = new Html5Qrcode("qr-reader");
      setScanner(newScanner);

      const cameras = await Html5Qrcode.getCameras();
      if (!cameras.length) {
        setCameraError("No cameras found");
        setIsLoading(false);
        return;
      }

      await newScanner.start(
        { deviceId: { exact: cameras[0].id } },
        {
          fps: 10,
          qrbox: { width: 300, height: 300 },
          aspectRatio: 1.0,
        },
        async (decodedText) => {
          console.log("Scanned QR text:", decodedText);
          const parsedData = parseQRCodeText(decodedText);
          console.log("ParsedData",parsedData);
          
          if (parsedData) {
            setBookedUser(parsedData);
            await newScanner.stop(); // stop scanning once valid data is captured
            setIsRunning(false);
          } else {
            console.warn("QR code data missing required fields");
          }
        },
        () => { }
      );

      setIsRunning(true);
    } catch (error) {
      console.error("Start scanner error:", error);
      setCameraError("Failed to start scanner. Check permissions.");
    } finally {
      setIsLoading(false);
    }
  };

  const stopScanner = async () => {
    if (scanner && isRunning) {
      try {
        await scanner.stop();
        await scanner.clear();
      } catch (err) {
        console.warn('Stop error:', err);
      } finally {
        setIsRunning(false);
      }
    }
  };

  const toggleScanner = () => {
    isRunning ? stopScanner() : startScanner();
  };

  const switchCamera = async () => {
    if (scanner && isRunning) {
      await stopScanner();
      await startScanner();
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      startScanner();
    }, 300);

    return () => {
      clearTimeout(timeout);
      stopScanner();
    };
  }, []);

  return (
  <div className="flex flex-col min-h-screen bg-gray-100">
    <Header/>
      <div className="w-full px-6 py-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          QR Code Scanner
        </h2>

        <div className="relative">
          <div id="qr-reader" ref={scannerRef} style={{ width: '300px', height: '300px' }} />
          {(isLoading || !isRunning) && (
            <div className="absolute inset-0 bg-gray-900/80 flex flex-col items-center justify-center">
              {isLoading ? (
                <div className="text-center">
                  <FiRotateCw className="mx-auto text-4xl text-white mb-2 animate-spin" />
                  <p className="text-white">Initializing scanner...</p>
                </div>
              ) : (
                <div className="text-center">
                  <FiCameraOff className="mx-auto text-4xl text-white mb-2" />
                  <p className="text-white">Scanner inactive</p>
                </div>
              )}
            </div>
          )}

          {cameraError && (
            <div className="absolute inset-0 bg-red-50/90 flex flex-col items-center justify-center p-4">
              <p className="text-red-600 text-center mb-4">{cameraError}</p>
              <button
                onClick={startScanner}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        {/* Frame overlay */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex items-center justify-center">
          <div className="border-4 border-white border-dashed rounded-lg" style={{ width: '300px', height: '300px' }}></div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={toggleScanner}
            disabled={isLoading}
            className={`flex items-center px-6 py-3 rounded-full shadow-lg ${isRunning
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-indigo-600 hover:bg-indigo-700'
              } text-white font-medium transition-colors disabled:opacity-50`}
          >
            {isRunning ? (
              <>
                <FiCameraOff className="mr-2" />
                Stop Scanner
              </>
            ) : (
              <>
                <FiCamera className="mr-2" />
                Start Scanner
              </>
            )}
          </button>

          {isRunning && (
            <button
              onClick={switchCamera}
              className="flex items-center px-4 py-3 rounded-full shadow-lg bg-gray-600 hover:bg-gray-700 text-white font-medium transition-colors"
            >
              <FiRotateCw className="mr-2" />
              Switch Camera
            </button>
          )}
        </div>

        <p className="mt-4 text-center text-gray-500 text-sm">
          Point your camera at a QR code to scan it
        </p>
      </div>
      </div>
      <Footer/>
    </div>
  );
};

export default QRCodeScanner;
