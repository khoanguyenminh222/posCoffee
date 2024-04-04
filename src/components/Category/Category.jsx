import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';

function Category({ onClick, category, storage }) {
  const [imageUrl, setImageUrl] = useState(null);
  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const storageRef = ref(storage, category.img);
        const url = await getDownloadURL(storageRef);
        setImageUrl(url);
      } catch (error) {
        console.error('Error getting image URL:', error);
      }
    };
    fetchImageUrl();
  }, [category.img, storage]);
  return (
    <div onClick={() => onClick(category)} className="pr-2 py-2 cursor-pointer">
      <div className="border rounded-md p-2 text-center bg-white hover:bg-gray-100 transition duration-300">
        <img src={imageUrl} alt="cat" className="w-full h-16 object-cover rounded-md mb-2" />
        <span className="text-sm font-semibold">{category.name}</span>
      </div>
    </div>
  );
}

export default Category;