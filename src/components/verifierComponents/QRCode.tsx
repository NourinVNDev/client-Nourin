import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QRCode = () => {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let mounted = true;

    const startScanner = async () => {
      if (!scannerRef.current || !mounted) return;

      const qrCodeScanner = new Html5Qrcode(scannerRef.current.id);
      setScanner(qrCodeScanner);

      try {
        await qrCodeScanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            console.log('QR Code detected:', decodedText);
            alert(`Scanned: ${decodedText}`);
            window.location.href = decodedText;
          },
          (errorMessage) => {
            // Ignore scan errors
          }
        );
        setIsRunning(true);
      } catch (err) {
        console.error('Camera access error:', err);
      }
    };

    startScanner();

    return () => {
      mounted = false;
      if (scanner && isRunning) {
        scanner
          .stop()
          .then(() => scanner.clear())
          .catch((err) => {
            console.warn('Stop error:', err);
          });
      }
    };
  }, []);

  return (
    <div>
      <h2>Scan QR Code</h2>
      <div
        id="qr-reader"
        ref={scannerRef}
        style={{ width: '100%', maxWidth: '500px', margin: 'auto' }}
      ></div>
    </div>
  );
};

export default QRCode;
