import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBars } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '@/components/Sidebar/Sidebar';
import Bill from '@/components/Bill/Bill';
import Category from '@/components/Category/Category';
import DrinkOfCategory from '@/components/DrinkOfCategory/DrinkOfCategory';

function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null); // State to store selected category

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    document.body.style.overflowX = isOpen ? "auto" : "hidden";
  };


  return (
    <div className="flex">
      {/* Sidebar */}
      {/* Toggle button */}
      <button className="fixed top-4 left-4 bg-white p-2 rounded-full shadow-md focus:outline-none z-10 transition-all duration-300 ease-in-out transform hover:scale-110" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} size='lg' className="text-gray-500" />
      </button>
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar}/>

      <div className={`flex-grow h-screen bg-gray-200 flex ${isOpen ? 'ml-20' : 'ml-0'} transition-all duration-300 ease-in-out`}>
        <div className="flex-grow flex flex-col w-3/4">
          
          <div className="flex-grow px-4 flex">
            {/* Phần category */}
            <div className="flex flex-col overflow-auto w-1/5 mr-4 max-h-screen" style={{scrollbarWidth: 'thin', scrollbarColor: 'gray', scrollbarTrackColor: 'rgba(0, 0, 0, 0.1)'}}>
              <Category onClick={handleCategoryClick} categoryName="Cà phê" />
              <Category onClick={handleCategoryClick} categoryName="Trà sữa" />
              <Category onClick={handleCategoryClick} categoryName="Trà trái cây" />
              <Category onClick={handleCategoryClick} categoryName="Đá xay" />
              <Category onClick={handleCategoryClick} categoryName="Sữa chua" />
              <Category onClick={handleCategoryClick} categoryName="Sữa chua" />
            </div>

            {/* Phần drink */}
            <div className='flex flex-wrap overflow-auto h-full w-4/5 justify-center max-h-screen' style={{scrollbarWidth: 'thin', scrollbarColor: 'gray', scrollbarTrackColor: 'rgba(0, 0, 0, 0.1)'}}>
              {selectedCategory && <DrinkOfCategory category={selectedCategory} />}
              {selectedCategory && <DrinkOfCategory category={selectedCategory} />}
              {selectedCategory && <DrinkOfCategory category={selectedCategory} />}
              {selectedCategory && <DrinkOfCategory category={selectedCategory} />}
              {selectedCategory && <DrinkOfCategory category={selectedCategory} />}
            </div>
          </div>
        </div>

        {/* Component Bill */}
        <Bill />
      </div>
    </div>
  );
}

export default Home;
