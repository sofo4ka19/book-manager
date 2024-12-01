import React from "react";
import { createPortal } from "react-dom";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string; // Заголовок модального вікна
    children: React.ReactNode; // Контент, який буде передано
  };

  const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen){
      document.body.style.overflow="";
      return null;
    } 
    document.body.style.overflow="hidden";
  
    return createPortal(
      <div className="modal-overlay">
        <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{title}</h2>
        <div className="modal-body">{children}</div>
        </div>
      </div>,
      document.body
    );
  };
  
  export default Modal;