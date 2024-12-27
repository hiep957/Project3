


const NavigationComponent = ({
  setComponentPage,
  componentPage,
}: {
  setComponentPage: any;
  componentPage: any;
}) => {
  return (
    <div className="flex flex-row space-x-2">
      <button
        onClick={() => setComponentPage("Profile")}
        className={`p-2 rounded transition-all text-sm flex-1 ${
          componentPage === "Profile"
            ? "bg-blue-400 text-white"
            : "bg-blue-200 hover:bg-blue-400"
        }`}
      >
        Thông tin cá nhân
      </button>

      <button
        onClick={() => setComponentPage("ChangeProfile")}
        className={`p-2 rounded transition-all text-sm flex-1 ${
          componentPage === "ChangeProfile"
            ? "bg-blue-400 text-white"
            : "bg-blue-200 hover:bg-blue-400"
        }`}
      >
        Sửa đổi thông tin cá nhân
      </button>

      <button
        onClick={() => setComponentPage("ChangePassword")}
        className={`p-2 rounded transition-all text-sm flex-1 ${
          componentPage === "ChangePassword"
            ? "bg-blue-400 text-white"
            : "bg-blue-200 hover:bg-blue-400"
        }`}
      >
        Quên mật khẩu
      </button>
    </div>
  );
};

export default NavigationComponent;
