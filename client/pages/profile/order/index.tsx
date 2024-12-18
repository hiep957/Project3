import React, { useState, useEffect } from 'react';
import { Layout } from "@/components/Layout";
import { 
  Container, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Pagination, 
  Typography, 
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import { format } from 'date-fns';

const API_URL = process.env.SV_HOST || "http://localhost:5000";

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

const MyOrder = () => {
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderProps | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 0,
    limit: 6
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const getUserOrder = async (page = 1, limit = 6) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/v1/payment/getUserOrders?page=${page}&limit=${limit}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const { data } = await response.json();
        setOrders(data.orders);
        setPagination(data.pagination);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch orders");
      }
    } catch (err) {
      setError('An error occurred while fetching orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserOrder();
  }, []);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    getUserOrder(value, pagination.limit);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'warning';
      case 'Completed': return 'success';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const handleOpenProductDetails = (order: OrderProps) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOrder(null);
  };

  return (
    <Layout>
      <Container maxWidth={false} sx={{ maxWidth: "1280px" }}>
        <Box className="py-10">
          <Typography variant="h4" component="h1" gutterBottom>
            Đơn hàng của tôi
          </Typography>

          {isLoading ? (
            <Typography>Đang tải đơn hàng...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : orders.length === 0 ? (
            <Typography>Không tìm thấy đơn hàng.</Typography>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Mã đơn hàng</TableCell>
                      <TableCell>Tổng tiền</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell>Ngày đặt</TableCell>
                      <TableCell>Chi tiết sản phẩm</TableCell>   
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>{order.orderCode}</TableCell>
                        <TableCell>
                          {order.totalAmount.toLocaleString()} VNĐ
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={order.status} 
                            color={getStatusColor(order.status)} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>{format(new Date(order.createdAt), 'dd MMM yyyy')}</TableCell>
                        <TableCell>
                          <Typography 
                            color="primary" 
                            onClick={() => handleOpenProductDetails(order)}
                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                          >
                            Xem chi tiết
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                  count={pagination.pages}
                  page={pagination.page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>

              {/* Modal Chi Tiết Sản Phẩm */}
              <Dialog 
                open={openModal} 
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
              >
                <DialogTitle>Chi Tiết Đơn Hàng</DialogTitle>
                <DialogContent>
                  {selectedOrder && (
                    <Box>
                      <Typography>Mã đơn hàng: {selectedOrder.orderCode}</Typography>
                      <Typography>Tổng tiền: {selectedOrder.totalAmount.toLocaleString()} VNĐ</Typography>
                      
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
                            {selectedOrder.items.map((item, index) => (
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
                        <Typography>Tên: {selectedOrder.buyerName}</Typography>
                        <Typography>Email: {selectedOrder.buyerEmail}</Typography>
                        <Typography>Địa chỉ: {selectedOrder.buyerAddress}</Typography>
                        <Typography>Số điện thoại: {selectedOrder.buyerPhone}</Typography>
                      </Box>
                    </Box>
                  )}
                </DialogContent>
              </Dialog>
            </>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default MyOrder;