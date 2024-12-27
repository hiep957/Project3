import { replace, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Button, Typography, CircularProgress } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { ProductType } from "../../types";
import { toast } from "react-toastify";
import SizeForm from "../components/FormProduct/Size";
import ImageForm from "../components/FormProduct/Image";
import CategoryForm from "../components/FormProduct/Category";
import { useNavigate } from "react-router-dom";
import { set } from "date-fns";
import ReactQuill from "react-quill";
const API_URL = import.meta.env.VITE_API_URL;

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const formats = [
  "header", "font", "size", "bold", "italic", "underline", "strike",
  "color", "background", "list", "bullet", "align",
  "link", "image", "video",
];

const EditProduct = () => {
  const { productId } = useParams();
  const methods = useForm<ProductType>({
    defaultValues:{
      textEditor: "",
    }
  });
  const { setValue,watch } = methods;
  const textEditor = watch("textEditor");
  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addBaseUrlToImage = (imagePath: string) => {
    return `http://localhost:3000${imagePath}`;
  };
  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/v1/product/${productId}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch product");
        }

        const data = await response.json();

        methods.reset(data.data); // Populate form with fetched product data
        console.log("methods: ", methods.getValues("name"));
        console.log("data: ", data.data);

        setValue("mainImage", data.data.product_Image || "");
        setValue("images", data.data.product_Images || []);
        setValue("category", data.data.category || "");
        setValue("subcategory", data.data.subcategory || "");
        setValue("textEditor", data.data.textEditor || "");
        setProduct(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, setValue, methods]);
  const handleEditorChange = (newContent: string) => {
    setValue("textEditor", newContent, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = async (data: ProductType) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("brand", data.brand);
    formData.append("price", data.price.toString());

    data.sizes.forEach((size, index) => {
      formData.append(`sizes[${index}][size]`, size.size);
      formData.append(`sizes[${index}][quantity]`, size.quantity.toString());
    });

    formData.append("category", data.category);
    formData.append("subcategory", data.subcategory);
    formData.append("textEditor", data.textEditor);

    if (data.mainImage instanceof File) {
      formData.append("mainImage", data.mainImage);
      formData.append("isUpdateImg", "true");
    }
    if(data.images) { 
      console.log("data.images: ", data.images);
      formData.append("isUpdateImg", "true");
      Array.from(data.images).forEach((file) => {
        formData.append("images", file);
      });
    }
    console.log("formData: ", formData);

    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/api/v1/admin/products/update/${productId}`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        toast.error(responseData.message || "Failed to update product");
      } else {
        const productId = responseData.data._id;
        toast.success("Product updated successfully");
        setTimeout(() => {
          window.location.reload();
        }, 2000); // Delay 2 giây để người dùng có thể đọc thông báo
      }
    } catch (err) {
      toast.error("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  console.log("product: ", product);

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container maxWidth="lg" className="mt-4">
      <div className="flex flex-col">
        <Typography variant="h5" className="mb-4">
          Edit Product
        </Typography>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="flex w-full space-x-3">
              {/* Left section */}
              <div className="w-7/12">
                <div className="bg-white p-4 rounded-lg space-y-4">
                  <div>
                    <label>Name</label>
                    <input
                      className="border p-2 w-full rounded-lg"
                      {...methods.register("name")}
                    />
                  </div>
                  <div>
                    <label>Description</label>
                    <textarea
                      className="border p-2 w-full rounded-lg"
                      rows={4}
                      {...methods.register("description")}
                    />
                  </div>
                  <div>
                    <label>Brand</label>
                    <input
                      className="border p-2 w-full rounded-lg"
                      {...methods.register("brand")}
                    />
                  </div>
                  <SizeForm />
                </div>

                <div className="bg-white p-4 rounded-lg mt-4">
                  <label>Price</label>
                  <input
                    type="number"
                    className="border p-2 w-full rounded-lg"
                    {...methods.register("price")}
                  />
                </div>
                <div className="bg-white p-4 rounded-lg mt-4">
                <div className="flex flex-col space-y-2">
                  <label className="font-semibold">Content</label>
                  <div className="min-h-[400px] bg-white rounded-lg">
                    <ReactQuill
                      theme="snow"
                      value={textEditor}
                      onChange={handleEditorChange}
                      modules={modules}
                      formats={formats}
                      className="h-96 [&>.ql-container]:font-normal
                  [&>.ql-toolbar]:bg-gray-50 
                  [&>.ql-toolbar]:border-0 
                  [&>.ql-toolbar]:border-b 
                  [&>.ql-toolbar]:border-gray-200
                  [&>.ql-container]:border-0
                  [&>.ql-container]:rounded-b-lg"
                    />
                  </div>
                  {methods.formState.errors.textEditor && (
                    <span className="text-red-500 text-sm">
                      {typeof methods.formState.errors.textEditor?.message ===
                        "string" && methods.formState.errors.textEditor.message}
                    </span>
                  )}
                </div>
              </div>
              </div>

              {/* Right section */}
              <div className="w-5/12  rounded-lg h-fit ">
                {/* Image Form */}
                <ImageForm
                  mainImage={product?.product_Image || null}
                  productImages={product?.product_Images || []}
                />
                <div className="bg-white rounded-lg p-4 mt-4">
                  <CategoryForm />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
};

export default EditProduct;
