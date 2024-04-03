import React from 'react';

function Category({ onClick, categoryName }) {
  return (
    <div onClick={() => onClick(categoryName)} className="pr-2 py-2 cursor-pointer">
      <div className="border rounded-md p-2 text-center bg-white hover:bg-gray-100 transition duration-300">
        <img src="/images/cat1.jpg" alt="cat" className="w-full h-16 object-cover rounded-md mb-2" />
        <span className="text-sm font-semibold">{categoryName}</span>
      </div>
    </div>
  );
}

export default Category;