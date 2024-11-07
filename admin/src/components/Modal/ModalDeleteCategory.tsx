import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface BasicModalProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  onDelete: () => void; // Function to handle delete action
}

export const ModalDeleteCategory: React.FC<BasicModalProps> = ({
  openModal,
  setOpenModal,
  onDelete,
}) => {
  const handleClose = () => setOpenModal(false);
  const handleDelete = () => {
    onDelete();
    handleClose();
  };

  return (
    <div>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Bạn có chắc chắn muốn xóa danh mục này không?
          </Typography>
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button onClick={handleClose} color="secondary" sx={{ mr: 1 }}>
              Hủy
            </Button>
            <Button onClick={handleDelete} color="error">
              Xóa
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};
