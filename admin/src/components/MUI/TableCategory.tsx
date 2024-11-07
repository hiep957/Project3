import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Category, deleteCategories } from "../../redux/slice/categorySlice";
import { MdOutlineModeEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { useState } from "react";
import { Modal } from "@mui/material";
import { ModalDeleteCategory } from "../Modal/ModalDeleteCategory";
import { useAppDispatch } from "../../redux/hooks";

function Row({ category, index }: { category: Category; index: number }) {
  const [open, setOpen] = React.useState(false);

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const dispatch = useAppDispatch();
  const handleDelete = (id: string) => {
    dispatch(deleteCategories(id));
    handleCloseModal();
  };

  return (
    <>
      <ModalDeleteCategory
        openModal={openModal}
        setOpenModal={setOpenModal}
        onDelete={() => handleDelete(category._id)}
      />
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell align="center">{index + 1}</TableCell>
          <TableCell align="center">
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row" align="center">
            {category.name}
          </TableCell>
          <TableCell align="center">
            {/* Nút Chỉnh sửa */}
            <div className="w-full flex justify-center p-2">
              <MdOutlineModeEdit className="w-6 h-6 hover:bg-slate-200 rounded transition-all  " />
            </div>
          </TableCell>
          <TableCell align="center">
            {/* Nút Xóa */}
            <div className="w-full flex justify-center">
              <MdDeleteOutline
                className="w-6 h-6 hover:bg-red-500 rounded transition-all "
                onClick={handleOpenModal}
              />
            </div>
          </TableCell>
          <TableCell align="center">
            {/* Nút Thêm SubCategory */}
            <button>Thêm SubCategory</button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="subtitle2" gutterBottom component="div">
                  SubCategory của {category.name}
                </Typography>
                <Table size="small" aria-label="subcategories">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Name</TableCell>
                      <TableCell align="center">Chỉnh sửa</TableCell>
                      <TableCell align="center">Xóa</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {category.subcategories.map((sub) => (
                      <TableRow key={sub._id}>
                        <TableCell align="center">{sub.name}</TableCell>
                        <TableCell align="center">
                          <div className="w-full flex justify-center p-2">
                            <MdOutlineModeEdit className="w-6 h-6 hover:bg-slate-200 rounded transition-all  " />
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          <div className="w-full flex justify-center">
                            <MdDeleteOutline className="w-6 h-6 hover:bg-red-500 rounded transition-all " />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    </>
  );
}

export default function CollapsibleTable({
  categories,
}: {
  categories: Category[];
}) {
  console.log("Categories in CollapsibleTable: ", categories);

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell align="center">STT</TableCell>
              <TableCell align="center">Sub Category</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Chỉnh sửa</TableCell>
              <TableCell align="center">Xóa</TableCell>
              <TableCell align="center">Thêm SubCategory</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category, index) =>
              category && category._id ? (
                <Row key={category._id} category={category} index={index} />
              ) : null
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
