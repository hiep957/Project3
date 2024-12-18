type SizeProductProps = {
    sizes: {
      size: string;
      quantity: number;
    }[];
    selectedSize: string;
    handleSizeChange: (size: string) => void; // Truyền thẳng size
  };
  
  export default function SizeProduct({
    sizes,
    selectedSize,
    handleSizeChange,
  }: SizeProductProps) {
    const selectedSizeInfo = sizes.find((size) => size.size === selectedSize); // Tìm thông tin của kích thước đã chọn
  
    return (
      <div className="space-y-2">
        <p className="text-lg font-medium">Kích thước:</p>
        <div className="flex flex-wrap gap-3">
          {sizes.map((size) => (
            <button
              key={size.size}
              onClick={() => handleSizeChange(size.size)} // Gửi size được chọn
              disabled={size.quantity === 0} // Disable nếu hết hàng
              className={`px-4 py-2 rounded border text-sm font-medium transition-all
                ${
                  size.size === selectedSize
                    ? "bg-black text-white border-black" // Kích thước được chọn
                    : size.quantity === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed" // Hết hàng
                    : "bg-white text-black border-gray-300 hover:border-black" // Bình thường
                }`}
            >
              {size.size}
            </button>
          ))}
        </div>
        {selectedSizeInfo && (
          <p className="mt-2 text-sm text-gray-600">
            {selectedSizeInfo.quantity > 0
              ? `Số lượng còn lại: ${selectedSizeInfo.quantity}`
              : "Kích thước này đã hết hàng"}
          </p>
        )}
      </div>
    );
  }
  