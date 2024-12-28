import { ProductType } from "@/utils/Type";
import { Container, CircularProgress, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const API_URL = process.env.SV_HOST || "http://localhost:5000";

const VitonTest = ({ data }: { data: ProductType }) => {
  const [body, setBody] = useState("upper_body");
  // console.log("data", data.product_Image);
  const linkImageServer = `https://4bb0-118-71-223-251.ngrok-free.app${data.product_Image}`;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preViewImage, setPreViewImage] = useState<string>("");
  const [hovered, setHovered] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string>(""); // State lưu ảnh kết quả

  // Xử lý khi chọn file
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreViewImage(previewUrl);
    }
  };

  const handleSelectBody = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBody(event.target.value);
    console.log(event.target.value);
  };
  // Xử lý upload file
  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.warning("Vui lòng chọn ảnh");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("model", linkImageServer);
    formData.append("body", body);
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/v1/viton/generate-image`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setResultImage(`data:image/jpeg;base64,${result.data}`); // Lưu Base64 vào state
        toast.success("Tải lên thành công!");
        setUploadStatus("Upload thành công");
      } else {
        toast.error("Tải lên thất bại!");
        setUploadStatus("Upload thất bại");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Đã xảy ra lỗi khi tải lên");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <div className="text-center font-semibold text-xl mb-4">
        Thử sản phẩm với ảnh của bạn
      </div>
      <div className="flex justify-center ">
        <select value={body} onChange={handleSelectBody} className="mt-2 p-2 border border-gray-300 rounded-md">
          <option value="upper_body">Áo</option>
          <option value="lower_body">Quần</option>
        </select>
      </div>
      <Grid container spacing={2}>
        {/* Grid 1 */}
        <Grid size={4}>
          <div className="flex justify-center">Ảnh bạn muốn thử</div>
          <div
            className="relative bg-red-200 flex justify-center h-[400px] items-center rounded-lg overflow-hidden"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {selectedFile ? (
              <>
                <img
                  src={preViewImage}
                  alt="Preview"
                  className="object-contain h-full w-full"
                />
                {hovered && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer">
                    <label className="text-white text-lg cursor-pointer flex flex-col items-center">
                      <FaCloudUploadAlt size={40} />
                      <span>Chọn ảnh khác</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                )}
              </>
            ) : (
              <>
                <form className="flex flex-col items-center">
                  <FaCloudUploadAlt size={50} color="gray" />
                  <label className="mt-4 cursor-pointer text-gray-600">
                    Chọn ảnh của bạn
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </form>
              </>
            )}
          </div>
        </Grid>

        {/* Grid 2 */}
        <Grid size={4}>
          <div className="flex justify-center">Sản phẩm của cửa hàng</div>
          <div className="bg-blue-200 flex justify-center h-[400px] items-center">
            {data ? (
              <img
                src={linkImageServer}
                alt="Preview"
                className="object-contain h-full w-full"
              />
            ) : (
              <>Chưa có ảnh</>
            )}
          </div>
        </Grid>

        {/* Grid 3 */}
        <Grid size={4}>
          <div className="flex justify-center">Kết quả</div>
          <div className="bg-green-200 flex flex-col justify-center h-[400px] items-center space-y-4">
            {resultImage && (
              <img
                src={resultImage}
                alt="Result"
                className="object-contain h-full w-full"
              />
            )}
          </div>
        </Grid>
      </Grid>
      <div className="flex justify-center mt-4">
        <Button
          variant="contained"
          color="primary"
          onClick={handleFileUpload}
          disabled={isLoading}
        >
          Tạo ảnh
        </Button>
        {isLoading && <CircularProgress />}
      </div>
    </Container>
  );
};

export default VitonTest;
