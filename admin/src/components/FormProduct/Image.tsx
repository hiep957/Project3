import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

interface ImageFormProps {
  mainImage?: any; // URL of the main image
  productImages?: any; // List of additional product image URLs
}

const API_URL = import.meta.env.VITE_API_URL;

const ImageForm: React.FC<ImageFormProps> = ({ mainImage, productImages }) => {
  const { setValue, getValues } = useFormContext();
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [productImagePreviews, setProductImagePreviews] = useState<string[]>([]);
  console.log("mainImage: ", mainImagePreview);
  // Helper function to format image URLs
  const formatImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "";
    // If it's already a full URL, return as is
    if (imageUrl.startsWith("http")) return imageUrl;
    // Otherwise, add base URL
    return `${API_URL}${imageUrl}`;
  };

  // Effect to handle initial image setup
  useEffect(() => {
    // Handle main image
    if (mainImage) {
      const formattedMainImage = formatImageUrl(mainImage);
      setMainImagePreview(formattedMainImage);
      setValue("mainImage", mainImage); // Store original path in form
    }

    // Handle product images
    if (productImages && productImages.length > 0) {
      const formattedProductImages = productImages.map(formatImageUrl);
      setProductImagePreviews(formattedProductImages);
      setValue("images", productImages); // Store original paths in form
    }
  }, [mainImage, productImages, setValue]);

  // Handle main image upload
  const handleMainImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setMainImagePreview(previewUrl);
      setValue("mainImage", file);
    }
  };

  // Handle product image uploads (multiple images)
  const handleProductImagesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Create preview URLs for new files
      const newPreviews = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );

      // Combine existing previews with new previews
      setProductImagePreviews((prevPreviews) => [
        ...prevPreviews,
        ...newPreviews,
      ]);

      // Get current files from form and add new files
      const currentFiles = getValues("images") || [];
      const updatedFiles = [...currentFiles, ...Array.from(files)];
      setValue("images", updatedFiles);
    }
  };

  // Handle removing an image
  const handleRemoveImage = (index: number) => {
    setProductImagePreviews((prevPreviews) => {
      // Remove the preview at the specified index
      const updatedPreviews = prevPreviews.filter((_, i) => i !== index);

      // Update form values
      const currentFiles = getValues("images") || [];
      let updatedFiles;

      // Handle both string URLs and File objects
      if (Array.isArray(currentFiles)) {
        updatedFiles = currentFiles.filter((_, i) => i !== index);
      } else {
        const filesArray = Array.from(currentFiles as FileList);
        updatedFiles = filesArray.filter((_, i) => i !== index);
        
        // Convert back to FileList if needed
        const dataTransfer = new DataTransfer();
        updatedFiles.forEach((file) => dataTransfer.items.add(file));
        updatedFiles = dataTransfer.files;
      }

      setValue("images", updatedFiles);
      return updatedPreviews;
    });
  };

  return (
    <div className="bg-white p-4 rounded">
      {/* Main image upload */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Upload Main Image</h2>
        <div className="flex justify-center items-center mb-4">
          {mainImagePreview ? (
            <div className="relative w-32 h-32 border rounded-md overflow-hidden">
              <img
                src={mainImagePreview}
                alt="Main Image Preview"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-32 h-32 border rounded-md flex justify-center items-center bg-gray-200 text-gray-500">
              No image
            </div>
          )}
        </div>
        <label className="block w-32 h-32 border rounded-md flex justify-center items-center cursor-pointer bg-gray-200">
          <input
            type="file"
            accept="image/*"
            onChange={handleMainImageUpload}
            className="hidden"
          />
          <span className="text-gray-500 text-2xl">+</span>
        </label>
      </div>

      {/* Product images upload */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Upload Product Images</h2>
        <p className="font-light">Bạn cần xóa hết các ảnh cũ</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {productImagePreviews.length > 0 ? (
            productImagePreviews.map((src, index) => (
              <div
                key={index}
                className="relative w-20 h-20 border rounded-md overflow-hidden"
              >
                <img
                  src={src}
                  alt={`Product Image Preview ${index}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  x
                </button>
              </div>
            ))
          ) : (
            <div className="w-full text-gray-500">No images uploaded</div>
          )}
        </div>
        <label className="block w-20 h-20 border rounded-md flex items-center justify-center cursor-pointer bg-gray-200">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleProductImagesUpload}
            className="hidden"
          />
          <span className="text-gray-500 text-2xl">+</span>
        </label>
      </div>
    </div>
  );
};

export default ImageForm;