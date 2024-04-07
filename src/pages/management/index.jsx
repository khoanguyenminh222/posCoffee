import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { baseURL, categoriesRoutes, drinksRoutes } from '@/api/api';
import CategoryCard from '@/components/Category/CategoryCard';
import DrinkCard from '@/components/DrinkOfCategory/DrinkCard';
import AddCategoryForm from '@/components/Category/AddCategoryForm';

function Management() {
  const [categories, setCategories] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [selectedDrinks, setSelectedDrinks] = useState([]);

  // hiện form category add
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const handleAddCategory = () => {
    setIsAddingCategory(true);
  };

  const sortDrinks = () => {
    const sortedDrinks = [...drinks];
    sortedDrinks.sort((a, b) => a.categoryId.localeCompare(b.categoryId)); // Sắp xếp các đồ uống theo category
    setSelectedDrinks(sortedDrinks);
  };

  const handleCategorySelect = (selectedCategory) => {
    if (selectedCategory.name === 'All') {
      sortDrinks(); // Sắp xếp lại các đồ uống
    } else {
      // Lọc danh sách đồ uống theo danh mục được chọn
      const filteredDrinks = drinks.filter(drink => drink.categoryId === selectedCategory._id);
      setSelectedDrinks(filteredDrinks);
    }
  };

  useEffect(() => {
    // Fetch categories from the server
    axios.get(`${baseURL}${categoriesRoutes}`)
      .then(response => {
        // Add "All" category
        const allCategory = { _id: 'all', name: 'All', img: 'All' };
        const sortedCategories = response.data.sort((a, b) => a._id.localeCompare(b._id)); // Sắp xếp categories theo id
        setCategories([allCategory, ...sortedCategories]);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });

    // Fetch drinks from the server
    axios.get(`${baseURL}${drinksRoutes}`)
      .then(response => {
        setDrinks(response.data);
        setSelectedDrinks(response.data);
      })
      .catch(error => {
        console.error('Error fetching drinks:', error);
      });
  }, []);

  return (
    <>
    <div className="container mx-auto px-4 max-h-full">
      <h1 className="text-3xl font-semibold my-4">Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map(category => (
          <CategoryCard key={category._id} category={category} onSelect={() => handleCategorySelect(category)}/>
        ))}
      </div>
      <h1 className="text-3xl font-semibold my-4">Drinks</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {selectedDrinks.map(drink => (
          <DrinkCard key={drink._id} drink={drink} />
        ))}
      </div>
      <button className="fixed bottom-16 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-md focus:outline-none z-10" onClick={handleAddCategory}>
        <FontAwesomeIcon icon={faCoffee} className="mr-2" />
        Add Category
      </button>
      <button className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-md focus:outline-none z-10" onClick={() => console.log('Add Drink')}>
        <FontAwesomeIcon icon={faCoffee} className="mr-2" />
        Add Drink
      </button>
    </div>
    {isAddingCategory && (
      <AddCategoryForm />
    )}

    </>
  );
}

export default Management;
