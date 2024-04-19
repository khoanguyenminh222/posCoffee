import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faTint } from '@fortawesome/free-solid-svg-icons';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase';

function DrinkOfCategory({ drink, addToBill, setSelectedOptions  }) {
  const { temperature, sugar, ice } = drink.options;
  const [selectedTemperature, setSelectedTemperature] = useState('');
  const [selectedSugar, setSelectedSugar] = useState(null);
  const [selectedIce, setSelectedIce] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const storageRef = ref(storage, drink.image);
        const url = await getDownloadURL(storageRef);
        setImageUrl(url);
      } catch (error) {
        console.error('Error getting image URL:', error);
      }
    };
    fetchImageUrl();
  }, [drink.img, storage]);

  const updateSelectedOptions = (optionName, optionValue) => {
    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      [optionName]: optionValue
    }));
  };

  useEffect(()=>{
    updateSelectedOptions('size', selectedSize);
    updateSelectedOptions('temperature', selectedTemperature);
    updateSelectedOptions('ice', selectedIce);
    updateSelectedOptions('sugar', selectedSugar);
  },[selectedSize, selectedTemperature, selectedIce, selectedSugar]);

  

  const handleAddToBill = () => {
    if (!selectedTemperature || !selectedSize) {
      setError('Please select temperature and size.');
      return;
    }
    addToBill(drink, quantity, selectedTemperature, selectedSize);
    setError('');
  };

  return (
    <div className="flex flex-col items-center mx-auto my-6">
      <div className="bg-white rounded-lg shadow-md">
        <img src={imageUrl} alt="Drink" className="rounded-t-lg w-64 h-48 object-cover" />
        <div className="lg:p-6 md:p-4 p-2">
          <div className='flex flex-col'>
            <div className="font-semibold text-lg uppercase text-nowrap">{drink.name}</div>
            <div className='flex justify-between'>
              <div className="text-gray-600 text-sm mt-2">{selectedSize === 'M' ? drink.prices.M.toLocaleString('vi-VN') : drink.prices.L.toLocaleString('vi-VN')}đ</div>
              <div className="flex items-center">
                {['M', 'L'].map((option, index) => (
                  <div key={index} className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer mr-2 ${selectedSize === option ? 'bg-amber-500 text-white rounded-full' : 'bg-gray-200'}`} onClick={() => {setSelectedSize((prevOption) => prevOption === option ? null : option); updateSelectedOptions('size', option);}}>
                    {option}
                  </div>
                ))}

              </div>
            </div>

          </div>

          <div className="mt-4">
            <div className="flex justify-between text-gray-700">
              <div className="flex items-center">
                {Array.isArray(temperature) && temperature.length > 0 && temperature.map((option, index) => (
                  <div key={index} className="ml-2">
                    {option == "hot" ?
                      <FontAwesomeIcon icon={faFire} className={`text-red-500 p-2 rounded-full mr-2 cursor-pointer ${selectedTemperature === option ? 'bg-amber-500 rounded-full' : 'bg-gray-200'}`} onClick={() => {setSelectedTemperature((prevOption) => prevOption === option ? null : option); updateSelectedOptions('temperature', option);}} />
                      :
                      <FontAwesomeIcon icon={faTint} className={`text-blue-500 p-2 rounded-full cursor-pointer ${selectedTemperature === option ? 'bg-amber-500 rounded-full' : 'bg-gray-200'}`} onClick={() => {setSelectedTemperature((prevOption) => prevOption === option ? null : option); updateSelectedOptions('temperature', option);}} />}
                  </div>
                ))}

              </div>

            </div>
            <div className="text-gray-700 mt-2">
              <div className="flex items-center justify-between">
                {Array.isArray(sugar) && sugar.length > 0 && <div>Đường:</div>}

                <div className='flex'>
                  {Array.isArray(sugar) && sugar.length > 0 && sugar.map((option, index) => (
                    <div key={index} className={`ml-2 p-1 text-sm rounded-full cursor-pointer ${selectedSugar === option ? 'bg-amber-500 text-white rounded-full' : 'bg-gray-200'}`} onClick={() => {setSelectedSugar((prevOption) => prevOption === option ? null : option); updateSelectedOptions('sugar', option);}}>
                      {option}
                    </div>
                  ))}

                </div>

              </div>
              <div className="flex items-center mt-2 justify-between">
                {Array.isArray(ice) && ice.length > 0 && <div>Đá:</div>}
                <div className='flex'>
                  {Array.isArray(ice) && ice.length > 0 && ice.map((option, index) => (
                    <div key={index} className={`ml-2 p-1 text-sm rounded-full cursor-pointer ${selectedIce === option ? 'bg-amber-500 text-white rounded-full' : 'bg-gray-200'}`} onClick={() => {setSelectedIce((prevOption) => prevOption === option ? null : option); updateSelectedOptions('ice', option);}}>
                      {option}
                    </div>
                  ))}
                </div>

              </div>
            </div>
            <div className="flex items-center justify-center mt-4">
              <div className="relative">
                <button
                  onClick={() => setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1))}
                  className="absolute inset-y-0 left-0 px-3 bg-gray-200 text-gray-600 focus:outline-none"
                >
                  -
                </button>
                <input
                  type="number"
                  className="w-20 pl-6 pr-2 text-center bg-gray-200 focus:outline-none"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
                <button
                  onClick={() => setQuantity((prevQuantity) => prevQuantity + 1)}
                  className="absolute inset-y-0 right-0 px-3 bg-gray-200 text-gray-600 focus:outline-none"
                >
                  +
                </button>
              </div>
            </div>
            <div className="mt-4 flex-col justify-center text-center">
              {error && <div className="text-red-500">{error}</div>}
              <button onClick={handleAddToBill} className="bg-amber-600 text-white px-4 py-2 rounded-full hover:bg-amber-700 transition duration-300">
                Thêm vào hóa đơn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DrinkOfCategory;
