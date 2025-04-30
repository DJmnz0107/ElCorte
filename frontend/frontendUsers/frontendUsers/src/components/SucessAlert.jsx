import React, { useState, useEffect } from 'react';

const SuccessAlert = ({ show, onClose }) => {
  const [animation, setAnimation] = useState('');
  const [showElCorte, setShowElCorte] = useState(false);
  
  useEffect(() => {
    if (show) {
      setAnimation('alert-enter');
      // Mostrar el mensaje inicial
      setShowElCorte(false);
      
      // Después de 2.5 segundos, mostrar "El Corte"
      const elCorteTimer = setTimeout(() => {
        setShowElCorte(true);
      }, 2500);
      
      // Después de 3.5 segundos, iniciar la salida
      const exitTimer = setTimeout(() => {
        setAnimation('alert-exit');
        setTimeout(() => {
          if (onClose) onClose();
        }, 500);
      }, 3500);
      
      return () => {
        clearTimeout(elCorteTimer);
        clearTimeout(exitTimer);
      };
    }
  }, [show, onClose]);
  
  if (!show) return null;
  
  return (
    <div className={`success-alert-overlay ${animation}`}>
      <div className="success-alert">
        <div className="success-icon">
          <svg viewBox="0 0 24 24" className="checkmark">
            <path 
              className="checkmark-path"
              fill="none" 
              stroke="#fff" 
              strokeWidth="3" 
              d="M5 12l5 5L19 7"
            />
          </svg>
        </div>
        <p className="success-message">Gracias por su compra</p>
        {showElCorte && <p className="el-corte">El Corte</p>}
      </div>
      <style jsx>{`
        .success-alert-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          opacity: 0;
        }
        
        .alert-enter {
          animation: fadeIn 0.5s forwards;
        }
        
        .alert-exit {
          animation: fadeOut 0.5s forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        .success-alert {
          background-color: white;
          border-radius: 8px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          max-width: 320px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: scaleUp 0.3s forwards;
        }
        
        @keyframes scaleUp {
          from { transform: scale(0.8); }
          to { transform: scale(1); }
        }
        
        .success-icon {
          background-color: #4CAF50;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          position: relative;
        }
        
        .checkmark {
          width: 60%;
          height: 60%;
        }
        
        .checkmark-path {
          stroke-dasharray: 30;
          stroke-dashoffset: 30;
          animation: drawCheck 0.8s 0.3s forwards;
        }
        
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
        
        .success-message {
          font-size: 18px;
          color: #333;
          margin: 0 0 10px;
          font-weight: 500;
          transition: all 0.3s ease;
          opacity: ${showElCorte ? 0.3 : 1};
          transform: ${showElCorte ? 'scale(0.9)' : 'scale(1)'};
        }
        
        .el-corte {
          font-size: 24px;
          color: #ff0000;
          font-weight: 700;
          margin: 5px 0 0;
          animation: pulseText 0.8s infinite alternate;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        
        @keyframes pulseText {
          from { transform: scale(1); }
          to { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default SuccessAlert;