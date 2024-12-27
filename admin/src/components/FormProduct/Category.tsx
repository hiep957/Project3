import React, { useEffect } from "react";
import { get, useFormContext } from "react-hook-form";
import { ProductType } from "../../../types";
import { useAppSelector } from "../../redux/hooks";

type CategoryFormProps = {
  category?: string;
  subcategory?: string;
};

const CategoryForm: React.FC<CategoryFormProps> = ({
  
}) => {
  const { register, setValue, watch,getValues } = useFormContext<ProductType>();
  const categories = useAppSelector((state) => state.category);
  console.log(getValues("category"));
  console.log(getValues("subcategory"));
  // Theo dõi giá trị category hiện tại
  const selectedCategory = watch("category");
  const selectedSubcategory = watch("subcategory");
  useEffect(() => {
    setValue("category", getValues("category") );
    setValue("subcategory", getValues("subcategory"));

  }, [setValue]);
  // Reset subcategory khi category thay đổi
  // useEffect(() => {
  //   setValue("subcategory", "");
  // }, [selectedCategory, setValue]);

  // Lọc subcategories dựa trên category được chọn
  const selectedCategoryData = categories.categories.find(
    (cat) => cat.name === selectedCategory
  );

  return (
    <div className="flex flex-col space-y-4 bg-white">
      <label htmlFor="category">Chọn danh mục</label>
      <select
        id="category"
        className="p-2 border rounded"
        {...register("category")}
      >
        <option value="">Chọn một danh mục</option>
        {categories.categories.map((category) => (
          <option key={category._id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>

      <label htmlFor="subcategory">Chọn danh mục con</label>
      <select
        id="subcategory"
        className="p-2 border rounded"
        {...register("subcategory")}
        disabled={!selectedCategory} // Disable nếu chưa chọn category
      >
        <option value="">Chọn một danh mục con</option>
        {selectedCategoryData?.subcategories.map((subcategory) => (
          <option key={subcategory._id} value={subcategory.name}>
            {subcategory.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryForm;
