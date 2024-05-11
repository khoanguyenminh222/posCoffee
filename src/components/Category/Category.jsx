import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';

function Category({category, storage, onClick }) {
  const [imageUrl, setImageUrl] = useState(null);
  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        if(category._id!=="all"){
          const storageRef = ref(storage, category.img);
          const url = await getDownloadURL(storageRef);
          setImageUrl(url);
        }
      } catch (error) {
        console.error('Error getting image URL:', error);
      }
    };
    fetchImageUrl();
  }, [category.img, storage]);
  return (
    <div onClick={() => onClick(category)} className="pr-2 py-2 cursor-pointer">
      <div className="border rounded-md p-2 text-center bg-white hover:bg-gray-100 transition duration-300">
        {category._id !== "all" ? (
          <img src={imageUrl} alt="cat" className="lg:w-full w-20 h-16 object-cover rounded-md mb-2" />
        ) : (
          <div className="lg:w-full w-20 h-16 object-cover rounded-md mb-2"></div>
        )}
        <span className="text-xs lg:text-sm font-semibold">{category.name}</span>
      </div>
    </div>
  );
}

export default Category;