import { useAppSelector } from "@/redux/hooks";
import { Category } from "@/redux/slice/categorySlice";
import { RootState } from "@/redux/store";
import Link from "next/link";


// const categories = [
//   { name: "Nam", subcategories: ["Áo", "Quần", "Giày"] },
//   { name: "Nữ", subcategories: ["Váy", "Túi", "Giày"] },
//   { name: "Bóng đá", subcategories: ["Quần áo", "Giày", "Phụ kiện"] },
//   { name: "Bóng rổ", subcategories: ["Áo", "Bóng", "Giày"] },
//   { name: "Accessories", subcategories: ["Mũ", "Kính", "Đồng hồ"] },
// ];

const CategoryBar = () => {
  const categories: Category[]  = useAppSelector((state: RootState) => state.category.categories);
  
  return (
    <div className="flex md:flex-row flex-col space-x-10">
      {categories.map((category, index) => (
        <div key={index} className="relative group">
          {/* Category Name */}
          <Link href={`/category/${category.name}`} passHref>
            <div className="text-lg font-bold p-2">{category.name}</div>
          </Link>

          {/* Underline */}
          <div className="bg-red-500 h-1 w-0 group-hover:w-full transition-all duration-300"></div>

          {/* Subcategories */}
          <div className="absolute top-full left-0 w-60 bg-white shadow-lg border rounded-md hidden group-hover:block z-10">
            <ul className="p-2 space-y-1">
              {category.subcategories.map((sub, subIndex) => (
                <li
                  key={subIndex}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {sub.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};



export default CategoryBar;
