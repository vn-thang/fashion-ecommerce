import React from 'react';
import Modal from '../../../../shared/components/Modal';
import Button from '../../../../shared/components/Button';

const DeleteBannerModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xóa Banner"
      footer={
        <>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Hủy
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            isLoading={loading}
          >
            Xóa Banner
          </Button>
        </>
      }
    >
      <div className="space-y-4">

        <div className="text-5xl text-center">
          🗑️
        </div>

        <p className="text-center text-gray-600">

          Bạn có chắc muốn xóa banner này?

        </p>

        <p className="text-center text-sm text-rose-500">

          Hành động này không thể hoàn tác.

        </p>

      </div>
    </Modal>
  );
};

export default DeleteBannerModal;