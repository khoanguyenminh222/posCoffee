import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBars, faBurger, faHistory, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const Sidebar = ({ isOpen, toggleSidebar }) => {


    return (
        <div className={`fixed inset-y-0 left-0 z-50 bg-white text-gray-500 w-20 flex flex-col justify-between transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            {/* Logo và các menu */}
            <div className="py-4 flex-grow flex flex-col items-center">
                <FontAwesomeIcon icon={faBars} size='lg' onClick={toggleSidebar} className='transition duration-300 ease-in-out transform hover:scale-110 cursor-pointer hover:text-amber-700' />
                <img src="/images/logoCoffee.png" alt="Logo" className="mb-2" />
                <ul className="text-center">
                    <Link href="/home">
                        <li className="py-4 flex flex-col items-center transition duration-300 ease-in-out transform hover:scale-110 cursor-pointer hover:text-amber-700">
                            <FontAwesomeIcon icon={faHome} size='2x' />
                            <span className="text-sm">Trang chủ</span>
                        </li>
                    </Link>
                    <Link href="/management">
                        <li className="py-4 flex flex-col items-center transition duration-300 ease-in-out transform hover:scale-110 cursor-pointer hover:text-amber-700">
                            <FontAwesomeIcon icon={faBurger} size='2x' />
                            <span className="text-sm">Quản lý</span>
                        </li>
                    </Link>
                    <li className="py-4 flex flex-col items-center transition duration-300 ease-in-out transform hover:scale-110 cursor-pointer hover:text-amber-700">
                        <FontAwesomeIcon icon={faHistory} size='2x' />
                        <span className="text-sm">Lịch sử</span>
                    </li>
                </ul>
            </div>
            {/* Logout */}
            <Link href="/login">
                <div className="pb-6 flex flex-col items-center cursor-pointer hover:text-amber-700">
                    <FontAwesomeIcon icon={faSignOutAlt} size='2x' />
                    <span className="text-sm">Đăng xuất</span>
                </div>
            </Link>
        </div>
    );
};

export default Sidebar;
