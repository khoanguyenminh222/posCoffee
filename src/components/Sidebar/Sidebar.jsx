import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBurger, faHistory, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const Sidebar = () => {
    return (
        <div className="bg-white text-gray-500 w-20 h-screen flex flex-col justify-between">
            {/* Logo và các menu */}
            <div className="py-4 flex-grow flex flex-col items-center">
                <img src="/images/logoCoffee.png" alt="Logo" className="mb-2" />
                <ul className="text-center">
                    <Link href={"/"}>
                        <li className="py-4 flex flex-col items-center transition duration-300 ease-in-out transform hover:scale-110 cursor-pointer hover:text-amber-700">
                            <FontAwesomeIcon icon={faHome} size='2x' />
                            <span className="text-sm">Trang chủ</span>
                        </li>
                    </Link>

                    <li className="py-4 flex flex-col items-center transition duration-300 ease-in-out transform hover:scale-110 cursor-pointer hover:text-amber-700">
                        <FontAwesomeIcon icon={faBurger} size='2x' />
                        <span className="text-sm">Thực đơn</span>
                    </li>
                    <li className="py-4 flex flex-col items-center transition duration-300 ease-in-out transform hover:scale-110 cursor-pointer hover:text-amber-700">
                        <FontAwesomeIcon icon={faHistory} size='2x'/>
                        <span className="text-sm">Lịch sử</span>
                    </li>
                </ul>
            </div>
            {/* Logout */}
            <div className="pb-6 flex flex-col items-center cursor-pointer hover:text-amber-700">
                <FontAwesomeIcon icon={faSignOutAlt} size='2x'/>
                <span className="text-sm">Đăng xuất</span>
            </div>
        </div>
    );
};

export default Sidebar;