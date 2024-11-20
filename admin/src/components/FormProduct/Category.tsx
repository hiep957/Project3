import React from "react";
import { useFormContext } from "react-hook-form";
import { ProductType } from "../../../types";
import { useAppSelector } from "../../redux/hooks";

const CategoryForm = () => {
  const { register } = useFormContext<ProductType>();
  const categories = useAppSelector((state) => state.category);
  console.log("categories trong CategoryForm: ", categories);
  return (
    <div className="flex flex-col space-y-4">
      <label htmlFor="category">Chọn danh mục</label>
      <select
        id="category"
        className="p-2 border rounded"
        {...register("category_id" as const)} // Adjust the name to match your form data structure
      >
        <option value="">Chọn một danh mục</option>
        {categories.categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryForm;
