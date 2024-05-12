import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBars, faBurger, faHistory, faSignOutAlt, faUser, faChartSimple, faWarehouse } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import { getUserIdFromToken } from '@/helpers/getUserIdFromToken';
import { baseURL, userRoutes } from '@/api/api';

const Sidebar = ({ token, isOpen, toggleSidebar }) => {
    const [activeLink, setActiveLink] = useState("/home");
    const router = useRouter();
    const handleLogout = () => {
        // Xoá cookie 'token'
        Cookies.remove('token');
        // Chuyển hướng đến trang đăng nhập
        router.push('/login');
    };

    const sidebarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                toggleSidebar();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, toggleSidebar]);

    const [userId, setUserId] = useState();
    useEffect(() => {
        if (token) {
    
          const useridfromtoken = getUserIdFromToken(token);
          if (useridfromtoken) {
            setUserId(useridfromtoken);
          }
        }
      }, [token])

    const [user, setUser] = useState([]);
    useEffect(()=>{
        const fetchUser = async() =>{
            try {
                const response = await axios.get(`${baseURL}${userRoutes}/userId/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
            } catch (error) {
                console.log(error)
            }
        }
        fetchUser(); 
    },[userId]);

    return (
        <div ref={sidebarRef} className={`fixed top-0 left-0 z-50 w-48 bg-gray-800 overflow-y-auto transition-all duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ height: '100vh' }}>
            <div className="py-4 flex flex-col items-center w-full h-full">
                <div className="flex flex-col items-center mb-4 mt-3">
                    <img src="/images/Coffee Ryo.png" alt="Logo" className="mb-2 rounded-full" width={80} height={80} />
                    <p className="text-white text-sm">{user.fullname}</p>
                    <p className="text-white text-xs">{user.role}</p>
                </div>
                {/* <img src="/images/Coffee Ryo.png" alt="Logo" className="mb-4 rounded-full" width={100} height={100}/> */}
                <ul className="flex flex-col h-full">
                    <SidebarLink href="/home" icon={faHome} label="Bán hàng" activeLink={activeLink} setActiveLink={setActiveLink} />
                    <SidebarLink href="/management" icon={faBurger} label="Quản lý" activeLink={activeLink} setActiveLink={setActiveLink} />
                    <SidebarLink href="/user" icon={faUser} label="Nhân viên" activeLink={activeLink} setActiveLink={setActiveLink} />
                    <SidebarLink href="/dashboard" icon={faChartSimple} label="Dashboard" activeLink={activeLink} setActiveLink={setActiveLink} />
                    <SidebarLink href="/warehouse" icon={faWarehouse} label="Kho" activeLink={activeLink} setActiveLink={setActiveLink} />
                    <SidebarLink href="/history" icon={faHistory} label="Lịch sử" activeLink={activeLink} setActiveLink={setActiveLink} />
                </ul>
                <div className="text-center py-3 px-4 text-white cursor-pointer hover:bg-gray-700 transition-colors duration-200" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} size='lg' className="mr-3" />
                    <span className="text-base font-medium">Đăng xuất</span>
                </div>
            </div>
        </div>
    );
};
const SidebarLink = ({ href, icon, label, activeLink, setActiveLink }) => {
    const handleClick = () => {
        setActiveLink(href);
    };

    return (
        <Link href={href}>
                <li onClick={handleClick} className={`flex items-center py-3 px-4 cursor-pointer hover:bg-gray-700 transition-colors duration-200 ${activeLink === href ? 'text-amber-500' : 'text-white'}`}>
                    <FontAwesomeIcon icon={icon} size='lg' className="mr-3" />
                    <span className="text-base font-medium">{label}</span>
                </li>
        </Link>
    );
};

export default Sidebar;
