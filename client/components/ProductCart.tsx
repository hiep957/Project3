import { ProductType } from "@/utils/Type";
import { FC } from "react";
import Image from "next/image";
import Link from "next/link";

const API_URL = process.env.SV_HOST || "http://localhost:5000";
const ProductCard: FC<{ product: ProductType }> = ({ product }) => (
  <Link href={`/product/${product._id}`} passHref>
    <div className="border rounded-lg  hover:shadow-md transition-shadow ">
      <Image
        src={`${API_URL}${product.product_Image}`}
        height={960}
        width={720}
        objectFit="cover"
        alt={product.name}
        loading="lazy"
        className="object-cover h-[300px]"
      />
      <div className="p-2 h-[150px] flex flex-col justify-between">
        {/* Tên sản phẩm */}
        <div className="font-medium tracking-wider line-clamp-2 flex-1">
          {product.name}
        </div>

        {/* Giá và số lượng đã bán */}
        <div className="flex justify-between text-sm text-gray-600 font-bold  flex-1">
          <span className="text-red-500 mt-2">{product.price} VNĐ</span>
          <span className="text-gray-500 mt-2">
            Đã bán: {product.selled_quantity}
          </span>
        </div>

        {/* Mô tả sản phẩm */}
        <div className="text-sm text-gray-500 mt-1 line-clamp-2 flex-1">
          {product.description}
        </div>
      </div>
    </div>
  </Link>
);

export default ProductCard;
