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
      <div className="p-2">
        <div className="font-medium tracking-wider">{product.name}</div>
        <div className="text-gray-600 font-bold">
          <span className="text-red-500">{product.price} VNĐ </span> 
        </div>
        <div className="text-sm text-gray-500 mt-1">{product.description}</div>
      </div>
    </div>
  </Link>
);

export default ProductCard;
