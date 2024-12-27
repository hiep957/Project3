import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Rating,
  Box,
} from "@mui/material";

const EditReviewDialog = ({ open, onClose, onSubmit, defaultData }: any) => {
  const [rating, setRating] = useState<number | null>(null);
  const [desc, setDesc] = useState("");

  // Đồng bộ giá trị từ defaultData khi dialog mở hoặc khi defaultData thay đổi
  useEffect(() => {
    if (defaultData) {
      setRating(defaultData.rating || 0);
      setDesc(defaultData.comment || "");
    }
  }, [defaultData, open]);

  const handleSubmit = () => {
    if (rating && desc) {
      onSubmit(rating, desc);
      console.log("data review: ", rating, desc);
      setRating(0);
      setDesc("");
    } else {
      alert("Vui lòng nhập đầy đủ thông tin!");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Sửa Bình Luận</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <Box>
            <label>Đánh giá (1 - 5 sao):</label>
            <Rating
              name="rating"
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
            />
          </Box>
          <TextField
            label="Mô tả"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditReviewDialog;
