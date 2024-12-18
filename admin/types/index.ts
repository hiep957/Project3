export type User = {
  _id: string;
  name: string;
  surname: string;
  password: string;
  email: string;
  bio: string;
  phoneNumber: string;
  address: string;
  confirmPassword: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  role?: string;
};


export type LoginType = {
    email: string;
    password: string;
}


export type ProductType = {
  _id: string; // ID sản phẩm
  name: string; // Tên sản phẩm
  description: string; // Mô tả sản phẩm
  price: number; // Giá sản phẩm
  slug: string; // Slug sản phẩm (dùng cho URL)
  stock_quantity: number; // Số lượng sản phẩm trong kho
  brand: string; // Thương hiệu
  sizes: {
    size: string; // Kích thước (ví dụ: 'M', 'L', 'XL')
    quantity: number; // Số lượng của từng kích thước
  }[]; // Mảng các kích thước và số lượng
  mainImage: File | null; // Ảnh chính sản phẩm (dạng File)
  images: FileList; // Các ảnh chi tiết sản phẩm (dạng mảng File)
  category_id: string; // ID danh mục sản phẩm
  subcategoryId: string; // ID danh mục con sản phẩm
  category: string; // Tên danh mục sản phẩm
  subcategory: string; // Tên danh mục con sản phẩm
  product_Image?: string;
  product_Images?: string[];
}