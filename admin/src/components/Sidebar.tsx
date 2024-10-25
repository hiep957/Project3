
import { Link, useLocation } from 'react-router-dom';

const links = [
    { label: 'Dashboard', path: '/' },
    { label: 'Product', path: '/product' },
    { label: 'Profile', path: '/profile' },
  ];
export const Sidebar = () => {
    return(
        <div className="w-64 ">
            <div className="flex justify-center">
                <div>Side bar</div>
            </div>
            <div>
                {links.map((link) => (
                    <Link to={link.path} key={link.path} className="block p-4 hover:bg-gray-200">
                        {link.label}
                    </Link>
                ))}
            </div>
        </div>
    )
}