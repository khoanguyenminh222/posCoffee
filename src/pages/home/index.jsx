import React, { useState, useEffect } from 'react';
import Bill from '@/components/Bill/Bill';
import Category from '@/components/Category/Category';
import DrinkOfCategory from '@/components/DrinkOfCategory/DrinkOfCategory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faMoneyBill, faClose } from '@fortawesome/free-solid-svg-icons';
import { baseURL, categoriesRoutes, drinksGetByCategory } from '@/api/api';
import { storage } from '@/firebase';
import axios from 'axios';
import { getServerSideProps } from '@/helpers/cookieHelper';
import { getUserIdFromToken } from '@/helpers/getUserIdFromToken';

function Home({ token }) {
  const [drinks, setDrinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({
    temperature: null,
    sugar: null,
    ice: null,
    size: null
  });
  const [billItems, setBillItems] = useState([]);
  const [isBillRendered, setIsBillRendered] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isBillOpen, setIsBillOpen] = useState(false);

  // State để lưu trạng thái của thiết bị là điện thoại hay không
  const [isMobile, setIsMobile] = useState(false);
  // Effect để kiểm tra kích thước màn hình khi component được render
  useEffect(() => {
    // Lấy độ rộng của màn hình
    const screenWidth = window.innerWidth;

    // Kiểm tra nếu độ rộng của màn hình nhỏ hơn 768px, đó là điện thoại
    if (screenWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }

    // Xử lý sự kiện resize để kiểm tra lại khi kích thước màn hình thay đổi
    const handleResize = () => {
      const newScreenWidth = window.innerWidth;
      if (newScreenWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function để loại bỏ sự kiện resize khi component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Hàm để mở modal
  const openBillModal = () => {
    setIsBillOpen(true);
  };

  // Hàm để đóng modal
  const closeBillModal = () => {
    setIsBillOpen(false);
  };

  const toggleCategory = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  const [userId, setUserId] = useState();
  useEffect(() => {
    if (token) {

      const useridfromtoken = getUserIdFromToken(token);
      if (useridfromtoken) {
        setUserId(useridfromtoken);
        setIsBillRendered(true);
      }
    }
  }, [token])



  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseURL}${categoriesRoutes}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    try {
      const response = await axios.get(`${baseURL}${drinksGetByCategory}/${category._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDrinks(response.data);
    } catch (error) {
      console.error('Error fetching drinks by category:', error);
    }
  };

  const addToBill = (drink, quantity) => {
    // Kiểm tra xem đã tồn tại billItem có id là drink._id và options giống nhau không
    const existingItem = billItems.find(item => item.id === drink._id && JSON.stringify(item.options) === JSON.stringify(selectedOptions));

    // Nếu tồn tại billItem có id là drink._id và options giống nhau, không thêm mới vào billItems
    if (existingItem) {
      // Cập nhật số lượng của billItem đã tồn tại
      const updatedBillItems = billItems.map(item => {
        if (item.id === drink._id && JSON.stringify(item.options) === JSON.stringify(selectedOptions)) {
          return { ...item, quantity: item.quantity + quantity };
        }
        return item;
      });

      setBillItems(updatedBillItems);
    } else {
      // Nếu chưa tồn tại billItem có id là drink._id và options giống nhau, thêm mới vào billItems
      const billItem = {
        id: drink._id,
        name: drink.name,
        price: selectedOptions.size === 'M' ? drink.prices.M : drink.prices.L,
        quantity: quantity,
        options: selectedOptions
      };

      setBillItems([...billItems, billItem]);
    }
  };

  const searchDrinks = () => {
    const filteredDrinks = drinks.filter(drink => {
      if (
        (selectedOptions.temperature && !drink.options.temperature.includes(selectedOptions.temperature)) ||
        (selectedOptions.sugar && !drink.options.sugar.includes(selectedOptions.sugar)) ||
        (selectedOptions.ice && !drink.options.ice.includes(selectedOptions.ice)) ||
        (selectedOptions.size && selectedOptions.size !== 'M' && selectedOptions.size !== 'L')
      ) {
        return false;
      }
      return true;
    });
    return filteredDrinks;
  };

  useEffect(() => {
    // Call searchDrinks whenever selected options change
    const filteredDrinks = searchDrinks();
    setDrinks(filteredDrinks);
  }, [selectedOptions]);


  const onDeleteAll = () => {
    setBillItems([]);
  };

  const onDeleteItem = (item) => {
    setBillItems(billItems.filter(billItem => {
      // Kiểm tra xem billItem có id khác với item.id hoặc options khác với item.options không
      return billItem.id !== item.id || JSON.stringify(billItem.options) !== JSON.stringify(item.options);
    }));
  };


  const onIncrementItem = (item) => {
    const updatedBillItems = billItems.map(billItem => {
      if (billItem.id === item.id) {
        return { ...billItem, quantity: billItem.quantity + 1 };
      }
      return billItem;
    });
    setBillItems(updatedBillItems);
  };

  const onDecrementItem = (item) => {
    const updatedBillItems = billItems.map(billItem => {
      if (billItem.id === item.id && billItem.quantity > 1) {
        return { ...billItem, quantity: billItem.quantity - 1 };
      }
      return billItem;
    });
    setBillItems(updatedBillItems);
  };


  return (
    <>
      <div className="flex-grow flex flex-col w-screen h-screen">
        <div className="flex-grow px-4 flex relative">
          {/* Phần category */}
          <div className={`flex flex-col overflow-auto mr-4 max-h-screen transition-width duration-300`} style={{ width: isCategoryOpen ? 'auto' : 0, scrollbarWidth: 'thin', scrollbarColor: 'gray', scrollbarTrackColor: 'rgba(0, 0, 0, 0.1)' }}>

            {categories.map(category => (
              <Category key={category._id} category={category} storage={storage} onClick={handleCategoryClick} />
            ))}
          </div>

          {/* Phần drink */}
          <div className={`flex flex-wrap overflow-y-auto h-full w-${isCategoryOpen ? 'full' : 'full'} justify-center max-h-screen`} style={{ scrollbarWidth: 'thin', scrollbarColor: 'gray', scrollbarTrackColor: 'rgba(0, 0, 0, 0.1)' }}>

            {selectedCategory &&
              drinks.map(drink => (
                <DrinkOfCategory key={drink._id} drink={drink} addToBill={addToBill} setSelectedOptions={setSelectedOptions} />
              ))}
          </div>
          {/* Toggle button */}
          
            {isCategoryOpen ?
            <button className="absolute top-1/2 left-2 bg-white p-2 rounded-full shadow-md focus:outline-none z-10 transition-all duration-300 ease-in-out transform hover:scale-110" onClick={toggleCategory}>
              <FontAwesomeIcon icon={faChevronLeft} size='lg' className="text-gray-500" />
              </button>
            :
            <button className="absolute top-1/2 left-2 bg-white p-2 rounded-full shadow-md focus:outline-none z-10 transition-all duration-300 ease-in-out transform hover:scale-110" onClick={toggleCategory}>
              <FontAwesomeIcon icon={faChevronRight} size='lg' className="text-gray-500" />
              </button>  
            }
          
        </div>
      </div>


      {/* Component Bill */}
      {isMobile ?
        isBillRendered && (
          <div>
            {/* Nút để mở modal */}
            <button onClick={openBillModal} className='fixed top-3 right-3 bg-white p-2 rounded-full shadow-md focus:outline-none z-10 transition-all duration-300 ease-in-out transform hover:scale-110'>
              <FontAwesomeIcon icon={faMoneyBill} size='lg' className="text-gray-500" />
            </button>

            {/* Modal Bill */}
            {isBillOpen && (
              <div className="fixed h-screen z-50 inset-0 flex items-center justify-end overflow-x-auto overflow-y-auto outline-none focus:outline-none bg-gray-800 bg-opacity-50">
                <div className="relative w-11/12 h-full bg-white p-4 shadow-md rounded-md">
                  <div className="absolute top-0 right-0 p-2">
                    {/* Nút để đóng modal */}
                    <button onClick={closeBillModal}>
                      <FontAwesomeIcon icon={faClose} size='lg' className="text-gray-500" />
                    </button>
                  </div>
                  {/* Component Bill */}
                  <Bill
                    token={token}
                    userId={userId}
                    billItems={billItems}
                    onDeleteAll={onDeleteAll}
                    onDeleteItem={onDeleteItem}
                    onIncrementItem={onIncrementItem}
                    onDecrementItem={onDecrementItem}
                  />
                </div>
              </div>
            )}
          </div>
        )
        :
        isBillRendered && (
          <div className="w-1/4 h-screen bg-white p-4 shadow-md rounded-md relative">
            <Bill
              token={token}
              userId={userId}
              billItems={billItems}
              onDeleteAll={onDeleteAll}
              onDeleteItem={onDeleteItem}
              onIncrementItem={onIncrementItem}
              onDecrementItem={onDecrementItem} />
          </div>
        )
      }


    </>
  );
}

export { getServerSideProps };
export default Home;
