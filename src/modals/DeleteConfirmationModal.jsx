// modals/DeleteConfirmationModal.jsx
import { Modal, Button } from 'antd';

const DeleteConfirmationModal = ({
  visible,
  onCancel,
  onConfirm,
  isBulkDelete,
  billNo
}) => (
  <Modal
    title="Confirm Deletion"
    visible={visible}
    onCancel={onCancel}
    footer={[
      <Button key="cancel" onClick={onCancel}>Cancel</Button>,
      <Button key="delete" type="primary" danger onClick={onConfirm}>Delete</Button>
    ]}
  >
    <p>Are you sure you want to delete {isBulkDelete ? "the selected bills" : `bill number ${billNo}`}?</p>
  </Modal>
);

export default DeleteConfirmationModal;