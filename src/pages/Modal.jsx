import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1050,
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-4 p-4"
        style={{
          maxWidth: '400px',
          width: '90%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="position-absolute top-0 end-0 p-3 border-0 bg-transparent"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faXmark} className="text-secondary" />
        </button>

        <h5 className="mb-2 pe-4">Konfirmasi Penghapusan Task</h5>
        <p className="text-secondary mb-4 fs-6">
          Apakah Anda yakin ingin menghapus task ini? Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-light px-3" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-danger px-3" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const DeleteConfirmationModal = ({ onConfirm }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn btn-link text-danger p-0">
        <FontAwesomeIcon icon={faTrash} />
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={handleConfirm} />
    </>
  );
};

export default DeleteConfirmationModal;
