import '../pages/main.css'
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import Sidebar from '@/components/Sidebar/Sidebar';
import Login from './login';
export default function App({ Component, pageProps }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    document.body.style.overflowX = isOpen ? "auto" : "hidden";
  };

  // Sử dụng hook useRouter để lấy thông tin về route hiện tại
  const router = useRouter();
  const { pathname } = router;

  const [token, setToken] = useState(null);
  const [isSidebarRender, setIsSidebarRender] = useState(false);
  // Kiểm tra token khi component được render
  useEffect(() => {
    const cookies = parseCookies(); // Lấy cookie mà không cần truyền context
    const userToken = cookies.token; // Lấy giá trị token từ cookie
    if (userToken) {
      setToken(userToken); // Nếu có token, cập nhật state token
      setIsSidebarRender(true)
    } else {
      router.push('/login'); // Nếu không có token, chuyển hướng đến trang login
    }
  }, []);
  return (
    <>
      {pathname === '/login' ? <Login />
        :
        <div className="flex flex-col md:flex-row items-center relative">

          {/* Sidebar */}
          {/* Toggle button */}
          <button className="fixed top-4 left-4 bg-white p-2 rounded-full shadow-md focus:outline-none z-10 transition-all duration-300 ease-in-out transform hover:scale-110" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} size='lg' className="text-gray-500" />
          </button>
          {isSidebarRender && <Sidebar token={token} isOpen={isOpen} toggleSidebar={toggleSidebar} />}

          {/* Content */}
          <div className="w-screen flex-grow h-full flex transition-all duration-300 ease-in-out bg-gray-200">
            <Component {...pageProps} />
          </div>

          {/* Overlay */}
          {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-30" onClick={toggleSidebar}></div>}
          
        </div>

      }
    </>
  )
}