import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const DeleteConfirmationModal = ({ onConfirm }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return (
    <>
      <button onClick={handleShow} className="btn btn-link text-danger p-0">
        <FontAwesomeIcon icon={faTrash} />
      </button>

      {show && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Konfirmasi Penghapusan</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                <p>Apakah Anda yakin ingin menghapus task ini?</p>
                <p className="text-muted mb-0">Tindakan ini tidak dapat dibatalkan.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={handleClose}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleConfirm}>
                  Delete
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show"></div>
        </div>
      )}
    </>
  );
};

export default DeleteConfirmationModal;
