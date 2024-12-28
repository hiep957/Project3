import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";

const API_URL = "http://localhost:5000";

type User = {
  _id: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  address: string;
  role?: string;
};

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 0,
    limit: 6,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchUsers = async (page = 1, limit = 6) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_URL}/api/v1/admin/getAllUser?page=${page}&limit=${limit}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const { data } = await response.json();
        console.log("data trong UserList: ", data);
        setUsers(data.userList);
        setPagination(data.pagination);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch users");
      }
    } catch (err) {
      setError("An error occurred while fetching users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(pagination.page, pagination.limit);
  }, [pagination.page]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPagination((prev) => ({ ...prev, page: value }));
  };

  const handleOpenUserDetails = (user: User) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
  };

  return (
    <Container maxWidth={false} sx={{ maxWidth: "1280px" }}>
      <Box py={4}>
        <Typography variant="h4" gutterBottom>
          User List
        </Typography>

        {isLoading ? (
          <Typography>Loading users...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : users.length === 0 ? (
          <Typography>No users found.</Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>STT</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user,index) => (
                    <TableRow key={user._id}>
                      <TableCell>{index + 1 + (pagination.page - 1) * pagination.limit}</TableCell>
                      <TableCell>{`${user.name} ${user.surname}`}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phoneNumber}</TableCell>
                      <TableCell>{user.address}</TableCell>
                      <TableCell>{user.role || "User"}</TableCell>
                      <TableCell>
                        <Typography
                          color="primary"
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => handleOpenUserDetails(user)}
                        >
                          View Details
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

            <Dialog
              open={openModal}
              onClose={handleCloseModal}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>User Details</DialogTitle>
              <DialogContent>
                {selectedUser && (
                  <Box>
                    <Typography>
                      <strong>Name:</strong>{" "}
                      {`${selectedUser.name} ${selectedUser.surname}`}
                    </Typography>
                    <Typography>
                      <strong>Email:</strong> {selectedUser.email}
                    </Typography>
                    <Typography>
                      <strong>Phone Number:</strong> {selectedUser.phoneNumber}
                    </Typography>
                    <Typography>
                      <strong>Address:</strong> {selectedUser.address}
                    </Typography>
                    <Typography>
                      <strong>Role:</strong> {selectedUser.role || "User"}
                    </Typography>
                  </Box>
                )}
              </DialogContent>
            </Dialog>
          </>
        )}
      </Box>
    </Container>
  );
};

export default UserList;
