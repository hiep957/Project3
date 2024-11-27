export interface ProductQueryParam {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  category?: string;
  subcategory?: string;
}

export type ProductType = {
  _id: string; // ID sản phẩm
  name: string; // Tên sản phẩm
  description: string; // Mô tả sản phẩm
  price: number; // Giá sản phẩm
  slug: string; // Slug sản phẩm (dùng cho URL)
  // stock_quantity: number; // Số lượng sản phẩm trong kho
  brand: string; // Thương hiệu
  sizes: {
    size: string; // Kích thước (ví dụ: 'M', 'L', 'XL')
    quantity: number; // Số lượng của từng kích thước
  }[]; // Mảng các kích thước và số lượng
  product_Image: string;
  product_Images: string[];
  category: string; // Tên danh mục sản phẩm
  subcategory: string; // Tên danh mục con sản phẩm
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
