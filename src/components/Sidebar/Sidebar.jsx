import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBars, faBurger, faHistory, faSignOutAlt, faUser, faChartSimple, faWarehouse } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const [activeLink, setActiveLink] = useState("/home");
    const router = useRouter();
    const handleLogout = () => {
        // Xoá cookie 'token'
        Cookies.remove('token');
        // Chuyển hướng đến trang đăng nhập
        router.push('/login');
    };

    return (
        <div className={`overflow-x-auto fixed inset-y-0 left-0 z-50 bg-white text-gray-500 w-20 outline-none focus:outline-none flex flex-col justify-between transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'gray', scrollbarTrackColor: 'rgba(0, 0, 0, 0.1)' }}>
            {/* Logo và các menu */}
            <div className="py-4 flex-grow flex flex-col items-center">
                <FontAwesomeIcon icon={faBars} size='lg' onClick={toggleSidebar} className='transition duration-300 ease-in-out transform hover:scale-110 cursor-pointer hover:text-amber-700' />
                <img src="/images/logoCoffee.png" alt="Logo" className="mb-2" />
                <ul className="text-center">
                    <Link href="/home">
                        <li onClick={() => setActiveLink("/home")} className={`py-4 flex flex-col items-center transition duration-300 ease-in-out transform hover:scale-110 cursor-pointer hover:text-amber-700 ${activeLink === "/home" ? 'text-amber-700' : 'text-gray-500'}`}>
                            <FontAwesomeIcon icon={faHome} size='2x' />
                            <span className="text-sm">Bán hàng</span>
                        </li>
                    </Link>
                    <Link href="/management">
                        <li onClick={() => setActiveLink("/management")} className={`py-4 flex flex-col items-center transition duration-300 ease-in-out transform hover:scale-110 cursor-pointer hover:text-amber-700 ${activeLink === "/management" ? 'text-amber-700' : 'text-gray-500'}`}>
                            <FontAwesomeIcon icon={faBurger} size='2x' />
                            <span className="text-sm">Quản lý</span>
                        </li>
                    </Link>
                    <Link href="/user">
                        <li onClick={() => setActiveLink("/user")} className={`py-4 flex flex-col items-center transition duration-300 ease-in-out transform hover:scale-110 cursor-pointer hover:text-amber-700 ${activeLink === "/user" ? 'text-amber-700' : 'text-gray-500'}`}>
                            <FontAwesomeIcon icon={faUser} size='2x' />
                            <span className="text-sm">Nhân viên</span>
                        </li>
                    </Link>
                    <Link href="/dashboard">
                        <li onClick={() => setActiveLink("/dashboard")} className={`py-4 flex flex-col items-center transition duration-300 ease-in-out transform hover:scale-110 cursor-pointer hover:text-amber-700 ${activeLink === "/dashboard" ? 'text-amber-700' : 'text-gray-500'}`}>
                            <FontAwesomeIcon icon={faChartSimple} size='2x' />
                            <span className="text-sm">Dashboard</span>
                        </li>
                    </Link>
                    <Link href="/warehouse">
                        <li onClick={() => setActiveLink("/warehouse")} className={`py-4 flex flex-col items-center transition duration-300 ease-in-out transform hover:scale-110 cursor-pointer hover:text-amber-700 ${activeLink === "/warehouse" ? 'text-amber-700' : 'text-gray-500'}`}>
                            <FontAwesomeIcon icon={faWarehouse} size='2x' />
                            <span className="text-sm">Kho</span>
                        </li>
                    </Link>
                    <Link href="/history">
                        <li onClick={() => setActiveLink("/history")} className={`py-4 flex flex-col items-center transition duration-300 ease-in-out transform hover:scale-110 cursor-pointer hover:text-amber-700 ${activeLink === "/history" ? 'text-amber-700' : 'text-gray-500'}`}>
                            <FontAwesomeIcon icon={faHistory} size='2x' />
                            <span className="text-sm">Lịch sử</span>
                        </li>
                    </Link>
                </ul>
            </div>
            {/* Logout */}
            <div onClick={handleLogout} className="pb-6 flex flex-col items-center cursor-pointer hover:text-amber-700">
                <FontAwesomeIcon icon={faSignOutAlt} size='2x' />
                <span className="text-sm">Đăng xuất</span>
            </div>
        </div>
    );
};

export default Sidebar;
