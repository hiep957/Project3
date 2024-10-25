import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <div className="flex justify-between">
      <div>Shop admin</div>
      <div className="bg-slate-400 mr-10 rounded">
        <Link to="/login " className="p-4 ">Login</Link>
      </div>

      
    </div>
  );
};
