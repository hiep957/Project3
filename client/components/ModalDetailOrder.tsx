import React from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';

export type OrderProps = {
  _id: string;
  userId: string;
  orderCode: number;
  items: any[];
  totalAmount: number;
  status: string;
  buyerName: string;
  buyerEmail: string;
  buyerAddress: string;
  buyerPhone: string;
  paymentMode: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
};

interface OrderDetailModalProps {
  open: boolean;
  onClose: () => void;
  order: OrderProps | null;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ 
  open, 
  onClose, 
  order 
}) => {
  if (!order) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Chi Tiết Đơn Hàng</DialogTitle>
      <DialogContent>
        <Box>
          <Typography>Mã đơn hàng: {order.orderCode}</Typography>
          <Typography>Tổng tiền: {order.totalAmount.toLocaleString()} VNĐ</Typography>
          
          <Box mt={2}>
            <Typography variant="h6">Sản Phẩm</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên sản phẩm</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Giá</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.price.toLocaleString()} VNĐ</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          <Box mt={2}>
            <Typography variant="h6">Thông Tin Khách Hàng</Typography>
            <Typography>Tên: {order.buyerName}</Typography>
            <Typography>Email: {order.buyerEmail}</Typography>
            <Typography>Địa chỉ: {order.buyerAddress}</Typography>
            <Typography>Số điện thoại: {order.buyerPhone}</Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;