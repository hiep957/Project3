import { Button, Container, Typography } from "@mui/material";
import { AiOutlineCheck } from "react-icons/ai";
import SizeForm from "../components/FormProduct/Size";
import ImageForm from "../components/FormProduct/Image";
import { ProductType } from "../../types";
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppSelector } from "../redux/hooks";
import CategoryForm from "../components/FormProduct/Category";
const AddProduct = () => {
  const methods = useForm<ProductType>();
  const { categories } = useAppSelector((state) => state.category);
  console.log("categories trong AddProduct Page: ", categories);
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data: ProductType) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("brand", data.brand);
    formData.append("price", data.price.toString());

    // formData.append("sizes",  );
    console.log("sizes", data.sizes);
    for (let i = 0; i < data.sizes.length; i++) {
      formData.append(`sizes[${i}][size]`, data.sizes[i].size);
      formData.append(
        `sizes[${i}][quantity]`,
        data.sizes[i].quantity.toString()
      );
    }
    formData.append("category_id", data.category_id);
    // if (data.mainImage) {
    //   formData.append(`mainImage`, data.mainImage); // Append ảnh chính
    // }
    // console.log("mainImage", data.images.length);
    // if (data.images) {
    //   for (let i = 0; i < data.images.length; i++) {
    //     formData.append(`images`, data.images[i]); // Append ảnh phụ
    //   }
    // }

    console.log("Form Data:", data);

    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:3000/api/v1/admin/categories/670364ddc909fd321e2c966e/products/add",
        {
          method: "POST",
          credentials: "include",
          body: formData, // Gửi formData với các tệp
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        toast.error(responseData.message);
        setLoading(false);
      } else {
        toast.success("Product added successfully");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Error uploading product");
      console.error("Error uploading product:", error);
    }
  };

  return (
    <Container maxWidth="lg" className="mt-2">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <Typography variant="h6">Add Product</Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <Button
              variant="outlined"
              startIcon={<AiOutlineCheck />}
              onClick={methods.handleSubmit(onSubmit)}
            >
              Add Product
            </Button>
          )}
        </div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="flex w-full space-x-3 mt-4">
              <div className="w-7/12 flex flex-col">
                <div className="bg-slate-100 rounded-lg p-4 flex flex-col space-y-6">
                  <div className="font-bold text-xl">General Information</div>

                  <div className="flex flex-col space-y-2">
                    <label htmlFor="name">Name Product</label>
                    <input
                      className="border p-2 rounded-lg"
                      placeholder="Please type name product!"
                      {...methods.register("name")}
                    />
                  </div>
                  {/* Description */}
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="description">Description</label>
                    <textarea
                      className="border p-2 rounded-lg"
                      placeholder="Please type description!"
                      rows={4}
                      {...methods.register("description")}
                    />
                  </div>
                  <div className="flex flex-row space-x-2">
                    <div className="w-1/2 flex flex-col">
                      <label htmlFor="brand">Brand</label>
                      <input
                        className="border p-2 rounded-lg"
                        placeholder="Please type brand!"
                        {...methods.register("brand")}
                      />
                    </div>
                  </div>
                  {/* Size Form */}
                  <SizeForm />
                </div>

                <div className="bg-slate-100 rounded-lg p-4 mt-4">
                  <div className="flex flex-row space-x-2">
                    <div className="w-1/2 flex flex-col">
                      <label htmlFor="brand">Price</label>
                      <input
                        type="number"
                        className="border p-2 rounded-lg"
                        placeholder="Please type brand!"
                        {...methods.register("price")}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-5/12  rounded-lg h-fit ">
                {/* Image Form */}
                <ImageForm />
                <div className="bg-slate-100 rounded-lg p-4 mt-4">
                  <CategoryForm />
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
};

export default AddProduct;
