import Button from "@mui/material/Button";
import CollapsibleTable from "../components/MUI/TableCategory";
import { useEffect, useState } from "react";
import BasicModal from "../components/Modal/Modal";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getCategories } from "../redux/slice/categorySlice";
import { Container } from "@mui/material";

const Category = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const dispatch = useAppDispatch();
  const { categories, loading, error } = useAppSelector(
    (state) => state.category
  );
  console.log("categories trong Category Page: ", categories);
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  return (
    <Container>
      <div className="p-4 w-full flex flex-col space-y-2">
        <h1>Category</h1>
        <div className="flex justify-end">
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Add Category
          </Button>
        </div>
        <div>
          <CollapsibleTable categories={categories}></CollapsibleTable>
        </div>
        <BasicModal open={open} setOpen={setOpen}></BasicModal>
      </div>
    </Container>
  );
};

export default Category;
