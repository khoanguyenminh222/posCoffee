import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBurger, faHistory, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
    return (
        <div className="bg-white text-gray-500 w-16 h-screen flex flex-col justify-between">
            {/* Logo và các menu */}
            <div className="py-4 flex-grow flex flex-col items-center">
                <img src="/images/logoCoffee.png" alt="Logo" className="mb-2" />
                <ul className="text-center">
                    <li className="py-4 flex flex-col items-center transition duration-300 ease-in-out transform hover:scale-110 cursor-pointer">
                        <FontAwesomeIcon icon={faHome} className="text-lg" />
                        <span className="text-xs">Trang chủ</span>
                    </li>
                    <li className="py-4 flex flex-col items-center transition duration-300 ease-in-out transform hover:scale-110 cursor-pointer">
                        <FontAwesomeIcon icon={faBurger} className="text-lg" />
                        <span className="text-xs">Thực đơn</span>
                    </li>
                    <li className="py-4 flex flex-col items-center transition duration-300 ease-in-out transform hover:scale-110 cursor-pointer">
                        <FontAwesomeIcon icon={faHistory} className="text-lg" />
                        <span className="text-xs">Lịch sử</span>
                    </li>
                </ul>
            </div>
            {/* Logout */}
            <div className="py-2 flex flex-col items-center transition duration-300 ease-in-out transform hover:scale-110 cursor-pointer">
                <FontAwesomeIcon icon={faSignOutAlt} className="text-lg" />
                <span className="text-xs">Đăng xuất</span>
            </div>
        </div>
    );
};

export default Sidebar;