import React from "react";
import { useForm, useFieldArray, Controller, get } from "react-hook-form";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

import { useAppDispatch } from "../../redux/hooks";
import { getCategories } from "../../redux/slice/categorySlice";
import { toast } from "react-toastify";

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

interface ModalUpdateCategoryProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  category: { _id: string; name: string; subcategories: { name: string }[] };
}

type CategoryFormData = {
  _id: string;
  name: string;
  subcategories: { name: string }[];
};

const ModalUpdateCategory: React.FC<ModalUpdateCategoryProps> = ({
  open,
  setOpen,
  category,
}) => {
  const dispatch = useAppDispatch();
  console.log("category trong ModalUpdateCategory: ", category);
  const { control, handleSubmit, reset } = useForm<CategoryFormData>({
    defaultValues: {
      name: category?.name || "",
      subcategories: category?.subcategories || [{ name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subcategories",
  });

  const onSubmit = async (data: CategoryFormData) => {
    console.log("data trong ModalUpdateCategory: ", data);
    const response = await fetch(
      `http://localhost:5000/api/v1/admin/categories/update/${category._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      }
    );
    if (response.ok) {
      const data = await response.json();
      toast.success("Category updated successfully");
      getCategories();
      return data;
    } else {
      const error = await response.json();
      toast.error(error.message);
      throw new Error(error.message);
    }
  };

  const handleClose = () => {
    reset(); // Reset form khi modal đóng
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-update-category"
      aria-describedby="modal-update-category-description"
    >
      <Box sx={style}>
        <Typography id="modal-update-category" variant="h6" component="h2">
          Update Category
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Category name is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Category Name"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Subcategories
          </Typography>

          {fields.map((item, index) => (
            <Box
              key={item.id}
              sx={{ display: "flex", alignItems: "center", mt: 1 }}
            >
              <Controller
                name={`subcategories.${index}.name` as const}
                control={control}
                rules={{ required: "Subcategory name is required" }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={`Subcategory ${index + 1}`}
                    fullWidth
                    margin="normal"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Button onClick={() => remove(index)} color="secondary">
                Remove
              </Button>
            </Box>
          ))}

          <Button
            type="button"
            onClick={() => append({ name: "" })}
            color="primary"
            sx={{ mt: 2 }}
          >
            Add Subcategory
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Update Category
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalUpdateCategory;
