import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBars } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '@/components/Sidebar/Sidebar';
import Bill from '@/components/Bill/Bill';
import Category from '@/components/Category/Category';
import DrinkOfCategory from '@/components/DrinkOfCategory/DrinkOfCategory';
import { baseURL, categoriesGet } from '@/api/api';
import { storage } from '@/firebase';

function Home() {


  const [categories, setCategories] = useState([]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    document.body.style.overflowX = isOpen ? "auto" : "hidden";
  };

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${baseURL}${categoriesGet}`); // Assume the API endpoint is '/api/categories'
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="flex">

      {/* Sidebar */}
      {/* Toggle button */}
      <button className="fixed top-4 left-4 bg-white p-2 rounded-full shadow-md focus:outline-none z-10 transition-all duration-300 ease-in-out transform hover:scale-110" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} size='lg' className="text-gray-500" />
      </button>
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div className={`flex-grow h-screen bg-gray-200 flex ${isOpen ? 'ml-20' : 'ml-0'} transition-all duration-300 ease-in-out`}>
        <div className="flex-grow flex flex-col w-3/4">

          <div className="flex-grow px-4 flex">
            {/* Phần category */}
            <div className="flex flex-col overflow-auto w-1/5 mr-4 max-h-screen" style={{ scrollbarWidth: 'thin', scrollbarColor: 'gray', scrollbarTrackColor: 'rgba(0, 0, 0, 0.1)' }}>
            {categories.map(category => (
              <Category key={category._id} category={category} storage={storage}/>
            ))}
            </div>

            {/* Phần drink */}
            {/* <div className='flex flex-wrap overflow-auto h-full w-4/5 justify-center max-h-screen' style={{ scrollbarWidth: 'thin', scrollbarColor: 'gray', scrollbarTrackColor: 'rgba(0, 0, 0, 0.1)' }}>
              <div className="bg-white rounded-xl shadow-md my-2 mx-2">
                <div className="p-4">
                  <div className="flex items-center">
                    <img className="h-20 w-20 rounded-full object-cover" src="/images/coffee1.png" alt="Drink" />
                    <div className="ml-4">
                      <div className="text-lg font-semibold text-gray-900">Tên đồ uống</div>
                      <div className="text-sm text-gray-500">50.000đ</div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="text-gray-700 font-semibold">Nhiệt độ:</td>
                        <td>
                          <div className="flex space-x-4 mt-1">
                            <span className={`text-sm text-gray-500 cursor-pointer ${temperature === 'hot' ? 'bg-gray-100 ' : 'hover:bg-gray-100 hover:'} rounded-full p-2`} onClick={() => handleTemperatureClick('hot')}>
                              <FontAwesomeIcon color='red' icon={faFire} />
                            </span>
                            <span className={`text-sm text-gray-500 cursor-pointer ${temperature === 'cold' ? 'bg-gray-100 ' : 'hover:bg-gray-100 hover:'} rounded-full p-2`} onClick={() => handleTemperatureClick('cold')}>
                              <FontAwesomeIcon color='blue' icon={faFire} />
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-gray-700 font-semibold">Kích thước:</td>
                        <td>
                          <div className="flex space-x-4 mt-1">
                            <span className={`text-sm text-gray-500 cursor-pointer ${size === 'S' ? 'bg-gray-100 ' : 'hover:bg-gray-100 hover:'} rounded-full p-2`} onClick={() => handleSizeClick('S')}>
                              S
                            </span>
                            <span className={`text-sm text-gray-500 cursor-pointer ${size === 'M' ? 'bg-gray-100 ' : 'hover:bg-gray-100 hover:'} rounded-full p-2`} onClick={() => handleSizeClick('M')}>
                              M
                            </span>
                            <span className={`text-sm text-gray-500 cursor-pointer ${size === 'L' ? 'bg-gray-100 ' : 'hover:bg-gray-100 hover:'} rounded-full p-2`} onClick={() => handleSizeClick('L')}>
                              L
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-gray-700 font-semibold">Đường:</td>
                        <td>
                          <div className="flex space-x-4 mt-1">
                            <span className={`text-sm text-gray-500 cursor-pointer ${sugar === '30%' ? 'bg-gray-100 ' : 'hover:bg-gray-100 hover:'} rounded-full p-2`} onClick={() => handleSugarClick('30%')}>
                              30%
                            </span>
                            <span className={`text-sm text-gray-500 cursor-pointer ${sugar === '50%' ? 'bg-gray-100 ' : 'hover:bg-gray-100 hover:'} rounded-full p-2`} onClick={() => handleSugarClick('50%')}>
                              50%
                            </span>
                            <span className={`text-sm text-gray-500 cursor-pointer ${sugar === '70%' ? 'bg-gray-100 ' : 'hover:bg-gray-100 hover:'} rounded-full p-2`} onClick={() => handleSugarClick('70%')}>
                              70%
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="text-gray-700 font-semibold">Đá:</td>
                        <td>
                          <div className="flex space-x-4 mt-1">
                            <span className={`text-sm text-gray-500 cursor-pointer ${ice === '30%' ? 'bg-gray-100 ' : 'hover:bg-gray-100 hover:'} rounded-full p-2`} onClick={() => handleIceClick('30%')}>
                              30%
                            </span>
                            <span className={`text-sm text-gray-500 cursor-pointer ${ice === '50%' ? 'bg-gray-100 ' : 'hover:bg-gray-100 hover:'} rounded-full p-2`} onClick={() => handleIceClick('50%')}>
                              50%
                            </span>
                            <span className={`text-sm text-gray-500 cursor-pointer ${ice === '70%' ? 'bg-gray-100 ' : 'hover:bg-gray-100 hover:'} rounded-full p-2`} onClick={() => handleIceClick('70%')}>
                              70%
                            </span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4">
                  <div className="flex justify-center">
                    <button className="bg-amber-600 text-white px-4 py-2 rounded-full hover:bg-amber-700 transition duration-300">
                      Thêm vào hóa đơn
                    </button>
                  </div>
                </div>
              </div>

            </div> */}
          </div>
        </div>

        {/* Component Bill */}
        <Bill />
      </div>
    </div>
  );
}

export default Home;
