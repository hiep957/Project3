import { Layout } from "@/components/Layout";
import { Container, Divider, Grid2 } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

/**
 *
 * @returns
 * items, totalAmount, buyerName, buyerEmail, buyerPhone, buyerAddress
 */

const Checkout = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const items = searchParams.get("items");
  const selectedItems = items ? JSON.parse(decodeURIComponent(items)) : [];
  const totalPrice = searchParams.get("total");
  console.log("selectedItemsInCheckout: ", selectedItems);
  // State lưu dữ liệu tỉnh, quận, xã
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  const itemToFetch = selectedItems.map((item: any) => ({
    productId: item.productId._id,
    name: item.productId.name,
    price: item.price,
    quantity: item.quantity,
    size: item.size,
  }));

  // State theo dõi lựa chọn hiện tại
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [selectedHomeNumber, setSelectedHomeNumber] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedPhone, setSelectedPhone] = useState("");
  const [selectedName, setSelectedName] = useState("");

  const getProvinceName = (provinceId: any) => {
    const province = provinces.find((p) => p.id === provinceId);
    return province ? province.name : "";
  };

  const getDistrictName = (districtId: any) => {
    const district = districts.find((d) => d.id === districtId);
    return district ? district.name : "";
  };

  const getWardName = (wardId: any) => {
    const ward = wards.find((w) => w.id === wardId);
    return ward ? ward.name : "";
  };

  const getAddress =
    selectedHomeNumber +
    ", " +
    getWardName(selectedWard) +
    ", " +
    getDistrictName(selectedDistrict) +
    ", " +
    getProvinceName(selectedProvince);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^(?:\+84|0)[3|5|7|8|9]\d{8}$/;

  const createPaymentLink = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/payment/create",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: itemToFetch,
            totalAmount: totalPrice,
            buyerName: selectedName,
            buyerEmail: selectedEmail,
            buyerPhone: selectedPhone,
            buyerAddress: getAddress,
          }),
        }
      );
      const data = await response.json();
      console.log("data: ", data);
      if (data.data.checkoutUrl) {
        router.push(data.data.checkoutUrl);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const handleClickPayment = () => {
    if (
      selectedName === "" ||
      selectedProvince === "" ||
      selectedDistrict === "" ||
      selectedWard === "" ||
      selectedHomeNumber === "" ||
      selectedEmail === "" ||
      selectedPhone === ""
    ) {
      toast.warning("Vui lòng điền đầy đủ thông tin thanh toán");
      if (emailRegex.test(selectedEmail) === false) {
        toast.warning("Email không hợp lệ");
      }
      if (phoneRegex.test(selectedPhone) === false) {
        toast.warning("Số điện thoại không hợp lệ");
      }
    } else {
      console.log(
        "Form: ",
        selectedName,
        getAddress,
        selectedEmail,
        selectedPhone
      );
      createPaymentLink();
    }
  };

  // Lấy danh sách tỉnh
  useEffect(() => {
    const fetchProvinces = async () => {
      const res = await fetch(
        "https://open.oapi.vn/location/provinces?page=0&size=63"
      );
      const data = await res.json();
      console.log("data: ", data);
      setProvinces(data.data || []);
    };
    fetchProvinces();
  }, []);

  // Lấy danh sách quận/huyện khi chọn tỉnh
  useEffect(() => {
    if (!selectedProvince) return;
    const fetchDistricts = async () => {
      const res = await fetch(
        `https://open.oapi.vn/location/districts/${selectedProvince}`
      );
      const data = await res.json();
      setDistricts(data.data || []);
      setWards([]); // Reset wards khi tỉnh thay đổi
      setSelectedDistrict("");
      setSelectedWard("");
    };
    fetchDistricts();
  }, [selectedProvince]);

  // Lấy danh sách xã/phường khi chọn quận/huyện
  useEffect(() => {
    if (!selectedDistrict) return;
    const fetchWards = async () => {
      const res = await fetch(
        `https://open.oapi.vn/location/wards/${selectedDistrict}`
      );
      const data = await res.json();
      setWards(data.data || []);
      setSelectedWard("");
    };
    fetchWards();
  }, [selectedDistrict]);

  return (
    <Layout>
      <Container maxWidth={false} sx={{ maxWidth: "1280px" }}>
        <Grid2 container columnSpacing={2}>
          <Grid2 size={7}>
            <div className="border rounded p-4 flex flex-col">
              <p className="font-semibold text-xl">Thông tin thanh toán</p>
              <div className="mt-2">
                <label htmlFor="name">Họ và tên</label>
                <input
                  value={selectedName}
                  onChange={(e) => setSelectedName(e.target.value)}
                  type="text"
                  id="name"
                  name="name"
                  className="w-full border p-2"
                  placeholder="Mã Tiến Hiệp"
                />
              </div>

              <div className="flex flex-row w-full space-x-2">
                {/* Dropdown chọn Tỉnh */}
                <div className="mt-4 w-1/2">
                  <label htmlFor="province">Tỉnh/Thành phố</label>
                  <select
                    id="province"
                    className="w-full border p-2"
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                  >
                    <option value="">Chọn tỉnh/thành phố</option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dropdown chọn Quận/Huyện */}

                <div className="mt-4 w-1/2">
                  <label htmlFor="district">Quận/Huyện</label>
                  <select
                    id="district"
                    className="w-full border p-2"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    disabled={!selectedProvince}
                  >
                    <option value="">Chọn quận/huyện</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dropdown chọn Xã/Phường */}
              <div className="flex flex-row w-full space-x-2">
                <div className="mt-4 w-1/2">
                  <label htmlFor="ward">Xã/Phường</label>
                  <select
                    id="ward"
                    className="w-full border p-2"
                    value={selectedWard}
                    onChange={(e) => setSelectedWard(e.target.value)}
                    disabled={!selectedDistrict}
                  >
                    <option value="">Chọn xã/phường</option>
                    {wards.map((ward) => (
                      <option key={ward.id} value={ward.id}>
                        {ward.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nhập số nhà/đường */}
                <div className="mt-4 w-1/2">
                  <label htmlFor="addressDetail">Số nhà, đường</label>
                  <input
                    type="text"
                    value={selectedHomeNumber}
                    onChange={(e) => setSelectedHomeNumber(e.target.value)}
                    id="addressDetail"
                    name="addressDetail"
                    className="w-full border p-2"
                    placeholder="Số 1, Đường 2"
                  />
                </div>
              </div>

              <div className="flex flex-row w-full space-x-2">
                <div className="mt-4 w-1/2">
                  <label htmlFor="ward">Email</label>
                  <input
                    id="ward"
                    value={selectedEmail}
                    type="email"
                    onChange={(e) => setSelectedEmail(e.target.value)}
                    className="w-full border p-2"
                    placeholder="hiep@gmail.com"
                  ></input>
                </div>

                {/* Nhập số nhà/đường */}
                <div className="mt-4 w-1/2">
                  <label htmlFor="addressDetail">Số điện thoại</label>
                  <input
                    type="text"
                    value={selectedPhone}
                    onChange={(e) => setSelectedPhone(e.target.value)}
                    id="addressDetail"
                    name="addressDetail"
                    className="w-full border p-2"
                    placeholder="Số 1, Đường 2"
                  />
                </div>
              </div>

              <div className="mt-2">
                <p>Phương thức thanh toán của bạn sẽ mặc định là:</p>
                <p>Chuyển khoản qua VietQR</p>
              </div>
            </div>
          </Grid2>
          <Grid2 size={5}>
            <div className="border rounded p-4">
              <div className="font-medium text-xl ">Chi tiết đơn hàng</div>
              <div className="flex flex-row justify-between mt-4">
                <div className="font-thin">Tổng giá trị sản phẩm</div>
                <div className="">{totalPrice} VNĐ</div>
              </div>
              <div className="flex flex-row justify-between mt-2 mb-4">
                <div className="font-thin">Giảm giá</div>
                <div>-0 VNĐ</div>
              </div>
              <Divider />
              <div className="flex flex-row justify-between mt-4">
                <div className="font-medium text-xl">Tổng thanh toán</div>
                <div className="font-medium">{totalPrice} Vnđ</div>
              </div>

              <div className="flex w-full justify-center mt-4">
                <button
                  className="bg-yellow-500 p-2 rounded w-full font-medium text-xl"
                  onClick={handleClickPayment}
                >
                  Thanh toán
                </button>
              </div>
            </div>
          </Grid2>
        </Grid2>
      </Container>
    </Layout>
  );
};

export default Checkout;
