import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

const ImageForm: React.FC = () => {
  const { setValue, getValues } = useFormContext();
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [productImagePreviews, setProductImagePreviews] = useState<string[]>([]);

  // Handle main image upload
  const handleMainImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setMainImagePreview(previewUrl);
      setValue("mainImage", file); // Save the main image to the form
      console.log("mainImage", file);
    }
  };

  // Handle product image uploads (multiple images)
  const handleProductImagesUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    console.log("files", files);
    if (files) {
      setValue("images", files); // Save product images to the form
      const newPreviews = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setProductImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
      console.log("images", files);
    }
  };

  // Handle removing an image
  const handleRemoveImage = (index: number) => {
    setProductImagePreviews((prevPreviews) => {
      const updatedPreviews = prevPreviews.filter((_, i) => i !== index);
      
      // Update the form value
      const currentFiles = (getValues("images") as FileList) || [];
      const updatedFilesArray = Array.from(currentFiles).filter((_, i) => i !== index);
      
      // Convert array back to FileList
      const updatedFiles = new DataTransfer();
      updatedFilesArray.forEach(file => updatedFiles.items.add(file));
  
      setValue("images", updatedFiles.files);
      return updatedPreviews;
    });
  };

  return (
    <div className="bg-slate-100 p-4 rounded">
      {/* Main image upload */}
      <div className="mb-4 ">
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
        <div className="flex flex-wrap gap-2 mb-4">
          {productImagePreviews.length > 0 ? (
            productImagePreviews.map((src, index) => (
              <div key={index} className="relative w-20 h-20 border rounded-md overflow-hidden">
                <img
                  src={src}
                  alt={`Product Image Preview ${index}`}
                  className="w-full h-full object-cover"
                />
                <button
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
