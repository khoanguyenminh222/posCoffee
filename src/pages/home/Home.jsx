import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '@/components/Sidebar/Sidebar';
import Bill from '@/components/Bill/Bill';
import Category from '@/components/Category/Category';
import DrinkOfCategory from '@/components/DrinkOfCategory/DrinkOfCategory';

function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null); // State to store selected category

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-grow bg-gray-200 flex h-screen">
        <div className="flex-grow p-6">
          <div className="flex">
            {/* Tiêu đề loại thức uống */}
            <h2 className="text-xl font-semibold mb-4 w-1/3">Loại thức uống</h2>

            {/* Thanh tìm kiếm */}
            <div className="relative w-2/3">
              <input
                type="text"
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 mr-2 w-full"
                placeholder="Tìm kiếm..."
              />
              <span className="absolute top-0 right-0 mt-2 mr-2 cursor-pointer">
                <FontAwesomeIcon icon={faSearch} />
              </span>
            </div>
          </div>

          {/* Phần category */}
            <div className="mt-4 flex flex-wrap overflow-auto w-100" style={{scrollbarWidth: 'thin', scrollbarColor: 'gray', scrollbarTrackColor: 'rgba(0, 0, 0, 0.1)'}}>
              <Category onClick={handleCategoryClick} categoryName="Cà phê" />
              <Category onClick={handleCategoryClick} categoryName="Trà sữa" />
              <Category onClick={handleCategoryClick} categoryName="Trà trái cây" />
              <Category onClick={handleCategoryClick} categoryName="Đá xay" />
              <Category onClick={handleCategoryClick} categoryName="Sữa chua" />
              <Category onClick={handleCategoryClick} categoryName="Sữa chua" />
            </div>
          
          

          {/* Phần drink */}
          <div className='flex flex-wrap overflow-auto h-4/6'>
            {selectedCategory && <DrinkOfCategory category={selectedCategory} />} 
            {selectedCategory && <DrinkOfCategory category={selectedCategory} />}
            {selectedCategory && <DrinkOfCategory category={selectedCategory} />}
            {selectedCategory && <DrinkOfCategory category={selectedCategory} />}
            {selectedCategory && <DrinkOfCategory category={selectedCategory} />}
          </div>
          
        </div>

        {/* Component Bill */}
        <Bill />
      </div>
    </div>
  );
}

export default Home;
