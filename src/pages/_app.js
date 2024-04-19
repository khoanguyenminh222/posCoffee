import '../pages/main.css'
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBars } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import Sidebar from '@/components/Sidebar/Sidebar';
import Login from './login';
import Navbar from '@/components/Navbar/Navbar';
export default function App({ Component, pageProps }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    document.body.style.overflowX = isOpen ? "auto" : "hidden";
  };

  // Sử dụng hook useRouter để lấy thông tin về route hiện tại
  const router = useRouter();
  const { pathname } = router;


  return (
    <>
      {pathname === '/login' ? <Login />
        :
        <div className="flex flex-col md:flex-row items-center">

          {/* Sidebar */}
          {/* Toggle button */}
          <button className="fixed top-4 left-4 bg-white p-2 rounded-full shadow-md focus:outline-none z-10 transition-all duration-300 ease-in-out transform hover:scale-110" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} size='lg' className="text-gray-500" />
          </button>
          <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

          <div className={`w-screen flex-grow h-full bg-gray-200 flex ${isOpen ? 'lg:ml-20 ml-0' : 'ml-0'} transition-all duration-300 ease-in-out`}>
            <Component {...pageProps} />
          </div>
        </div>

      }
    </>
  )
}