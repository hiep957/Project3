import * as React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { addCategory } from "../../redux/api";
import { useAppDispatch } from "../../redux/hooks";
import { useEffect } from "react";
import { addCategories, getCategories } from "../../redux/slice/categorySlice";

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
  open: boolean;
  setOpen: (open: boolean) => void;
}

type CategoryFormData = {
  name: string;
  subcategories: { name: string }[];
};

const BasicModal: React.FC<BasicModalProps> = ({ open, setOpen }) => {
  const dispatch = useAppDispatch();
  const { control, handleSubmit, reset } = useForm<CategoryFormData>({
    defaultValues: {
      name: "",
      subcategories: [{ name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subcategories",
  });

  const onSubmit = (data: CategoryFormData) => {
    dispatch(
      addCategories({ name: data.name, subcategories: data.subcategories })
    ).then(() => dispatch(getCategories()));
    reset(); // Reset form sau khi submit
    setOpen(false); // Đóng modal
  };

  const handleClose = () => {
    reset(); // Reset form khi modal đóng
    setOpen(false);
  };

  // useEffect(() => {
  //   dispatch(getCategories());
  // }, [dispatch]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add New Category
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
            Add Category
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default BasicModal;
