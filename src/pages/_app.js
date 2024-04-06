import '../pages/main.css'
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBars } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
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

  // Kiểm tra pathname để đảm bảo rằng Component luôn chạy vào trang Home
  useEffect(() => {
    if (pathname === '/') {
      router.push('/home');
    }
  }, [pathname]);
  return (
    <>
      {pathname === '/login' ? <Login />
        :
        <div className="flex">

          {/* Sidebar */}
          {/* Toggle button */}
          <button className="fixed top-4 left-4 bg-white p-2 rounded-full shadow-md focus:outline-none z-10 transition-all duration-300 ease-in-out transform hover:scale-110" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} size='lg' className="text-gray-500" />
          </button>
          <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

          <div className={`flex-grow h-screen bg-gray-200 flex ${isOpen ? 'ml-20' : 'ml-0'} transition-all duration-300 ease-in-out`}>
            <Component {...pageProps} />
          </div>
        </div>
      }
    </>
  )
}