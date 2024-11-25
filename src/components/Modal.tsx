import React from "react";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string; // Заголовок модального вікна
    children: React.ReactNode; // Контент, який буде передано
  };

  const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
          <h2>{title}</h2>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    );
  };
  
  export default Modal;