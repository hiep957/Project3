import { logout } from "@/redux/api";
import { useAppDispatch } from "@/redux/hooks";
import { logoutUser } from "@/redux/slice/authSlice";
import { resetCart } from "@/redux/slice/cartSlice";
import router from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";

const API_URL = process.env.SV_HOST || "http://localhost:5000";
const ChangePassword = () => {
  const [step, setStep] = useState(1); // Quản lý bước hiện tại
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const dispatch = useAppDispatch();

  const handleSendEmail = async () => {
    if (email) {
      console.log("Gửi email xác nhận đến:", email);
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        toast.error("Email không hợp lệ! Vui lòng nhập lại");
        return;
      }
      const response = await fetch(
        `${API_URL}/api/v1/auth/sendCodeResetPassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        }
      );
      if (response.ok) {
        toast.success("Đã gửi mã xác nhận đến email của bạn!");
        setStep(2); // Chuyển sang bước tiếp theo
      } else {
        const error = await response.json();
        toast.error(error.message || "Đã có lỗi xảy ra");
      }
    } else {
      toast.warning("Vui lòng nhập email!");
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode) {
      console.log("Xác nhận mã:", verificationCode);
      const response = await fetch(
        `${API_URL}/api/v1/auth/verifyCodeResetPassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, code: verificationCode }),
        }
      );
      if (response.ok) {
        toast.success("Xác nhận mã thành công!");
        setStep(3); // Chuyển sang bước tiếp theo
      } else {
        const error = await response.json();
        toast.error(error.message || "Đã có lỗi xảy ra");
      }
    } else {
      toast.warning("Vui lòng nhập mã xác nhận!");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length >= 6) {
      const response = await fetch(
        `${API_URL}/api/v1/auth/updatePasswordWithEmail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, password: newPassword }),
        }
      );
      if (response.ok) {
        toast.success("Đổi mật khẩu thành công!");
        const resultAction = await dispatch(logoutUser());
        if (logoutUser.fulfilled.match(resultAction)) {
          toast.success("Logout success");
          dispatch(resetCart());
          // router.push('/login');
          router.push("/");
        } else {
          toast.error("Logout failed");
          console.log("Logout failed: ", resultAction.error.message);
        }
      } else {
        const error = await response.json();
        toast.error(error.message || "Đã có lỗi xảy ra");
      }
    } else {
      toast.warning("Mật khẩu phải có ít nhất 6 ký tự");
    }
  };

  return (
    <div>
      {step === 1 && (
        <div>
          <div>Vui lòng nhập email để chúng tôi gửi mã xác nhận</div>
          <div className="mt-2 flex flex-row space-x-2">
            <input
              className="p-2 border rounded"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="p-2 bg-blue-200 rounded"
              onClick={handleSendEmail}
            >
              Gửi
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-2">
          <div>Nhập mã xác nhận</div>
          <div className="flex flex-row space-x-2 mt-2">
            <input
              className="p-2 border rounded"
              placeholder="Mã xác nhận"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <button
              className="p-2 bg-blue-200 rounded"
              onClick={handleVerifyCode}
            >
              Xác nhận
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-2">
          <div>Nhập mật khẩu mới</div>
          <div className="flex flex-row space-x-2 mt-2">
            <input
              className="p-2 border rounded"
              placeholder="Mật khẩu mới"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              className="p-2 bg-blue-200 rounded "
              onClick={handleChangePassword}
            >
              Lưu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;
