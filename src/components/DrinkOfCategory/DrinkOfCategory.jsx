import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faDroplet } from '@fortawesome/free-solid-svg-icons';

function DrinkOfCategory({ category }) {
  const [temperature, setTemperature] = useState(null);
  const [size, setSize] = useState(null);
  const [sugar, setSugar] = useState(null);
  const [ice, setIce] = useState(null);

  const handleTemperatureClick = (option) => {
    setTemperature(option === temperature ? null : option);
  };

  const handleSizeClick = (option) => {
    setSize(option === size ? null : option);
  };

  const handleSugarClick = (option) => {
    setSugar(option === sugar ? null : option);
  };

  const handleIceClick = (option) => {
    setIce(option === ice ? null : option);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4 w-1/3">
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
      
    </>
  );
}

export default DrinkOfCategory;
