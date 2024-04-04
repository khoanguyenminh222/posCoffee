import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBars } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '@/components/Sidebar/Sidebar';
import Bill from '@/components/Bill/Bill';
import Category from '@/components/Category/Category';
import DrinkOfCategory from '@/components/DrinkOfCategory/DrinkOfCategory';
import { baseURL, categoriesGet, drinksGetByCategory } from '@/api/api';
import { storage } from '@/firebase';

function Home() {
  const [drinks, setDrinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    temperature: null,
    sugar: null,
    ice: null,
    size: null
  });
  const [billItems, setBillItems] = useState([]);

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

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    try {
      const response = await fetch(`${baseURL}${drinksGetByCategory}/${category._id}`);
      const data = await response.json();
      setDrinks(data);
    } catch (error) {
      console.error('Error fetching drinks by category:', error);
    }
  };

  const addToBill = (drink, quantity) => {
    const billItem = {
      id: drink._id,
      name: drink.name,
      price: selectedOptions.size === 'M' ? drink.prices.M : drink.prices.L,
      quantity: quantity,
      options: selectedOptions
    };
    setBillItems([...billItems, billItem]);
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
                <Category key={category._id} category={category} storage={storage} onClick={handleCategoryClick} />
              ))}
            </div>

            {/* Phần drink */}
            <div className='flex flex-wrap overflow-auto h-full w-4/5 justify-center max-h-screen' style={{ scrollbarWidth: 'thin', scrollbarColor: 'gray', scrollbarTrackColor: 'rgba(0, 0, 0, 0.1)' }}>
            {selectedCategory && 
              drinks.map(drink => (
                <DrinkOfCategory key={drink._id} drink={drink} addToBill={addToBill} setSelectedOptions={setSelectedOptions}/>
              ))}
            

            </div>
          </div>
        </div>

        {/* Component Bill */}
        <Bill billItems={billItems}/>
      </div>
    </div>
  );
}

export default Home;
