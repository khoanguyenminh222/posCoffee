import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { baseURL, categoriesRoutes, drinksRoutes } from '@/api/api';
import CategoryCard from '@/components/Category/CategoryCard';
import DrinkCard from '@/components/DrinkOfCategory/DrinkCard';
import AddCategoryForm from '@/components/Category/AddCategoryForm';
import AddDrinkForm from '@/components/DrinkOfCategory/AddDrinkForm';
import { getServerSideProps } from '@/helpers/cookieHelper';
import { getUserIdFromToken } from '@/helpers/getUserIdFromToken';

function Management({token}) {
  const [categories, setCategories] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [selectedDrinks, setSelectedDrinks] = useState();
  const [selectedCategory, setSelectedCategory] = useState(null);

  // hiện form category add
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingDrink, setIsAddingDrink] = useState(false);

  // mở form add category/ drink
  const handleAddCategory = () => {
    setIsAddingCategory(true);
  };
  const handleAddDrink = () => {
    setIsAddingDrink(true);
  };

  const sortDrinks = () => {
    const sortedDrinks = [...drinks];
    sortedDrinks.sort((a, b) => a.categoryId.localeCompare(b.categoryId)); // Sắp xếp các đồ uống theo category
    setSelectedDrinks(sortedDrinks);
  };

  const handleCategorySelect = (selectedCategory) => {
    setSelectedCategory(selectedCategory);
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
    axios.get(`${baseURL}${categoriesRoutes}`,{
      headers: { Authorization: `Bearer ${token}` }
    })
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
    axios.get(`${baseURL}${drinksRoutes}`,{
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setDrinks(response.data);
        setSelectedDrinks(response.data);
      })
      .catch(error => {
        console.error('Error fetching drinks:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedCategory && selectedCategory.name !== 'All') {
      const filteredDrinks = drinks.filter(drink => drink.categoryId === selectedCategory._id);
      setSelectedDrinks(filteredDrinks);
    } else {
      setSelectedDrinks(drinks);
    }
  }, [drinks, selectedCategory]);
  //CATEGORY
  //cập nhật lại state category sau khi thêm
  const handleSaveCategory = (newCategoryData) => {
    setCategories(prevDrinks => [...prevDrinks, newCategoryData]);
  };
  //cập nhtaaj lại state category sau khi chỉnh sửa
  const editCategoryAndUpdateState = (newCategoryData) => {
    // Cập nhật state của categories bằng cách thay đổi thông tin category đã chỉnh sửa trong danh sách categories
    const updatedCategories = categories.map(category => {
      if (category._id === newCategoryData._id) {
        return { ...category, name: newCategoryData.name, img: newCategoryData.img };
      }
      return category;
    });
    setCategories(updatedCategories);
  };
  //cập nhật lại state category sau khi xoá
  const deleteCategoryAndUpdateState = async (categoryId, categoryName) => {
    if (window.confirm(`Bạn có muốn xoá ${categoryName}?`)) {
      try {
        const response = await axios.delete(`${baseURL}${categoriesRoutes}/${categoryId}`,{
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.status === 201) {
          alert("Xoá thành công");
          const updatedCategories = categories.filter(category => category._id !== categoryId);
          setCategories(updatedCategories);
        } else {
          alert("Có lỗi xảy ra");
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert("Error deleting category");
      }
    }
  };

  //DRINK
  //cập nhật lại state drink sau khi xoá
  const deleteDrinkAndUpdateState = async (drinkId, drinkname) => {
    if (window.confirm(`Bạn có muốn xoá ${drinkname}?`)) {
      try {
        // Gửi request DELETE sử dụng axios
        const response = await axios.delete(`${baseURL}${drinksRoutes}/${drinkId}`,{
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.status === 201) {
          alert("Xoá thành công");

          // Cập nhật state của drinks bằng danh sách mới loại bỏ đồ uống đã xoá
          const updatedDrinks = drinks.filter(drink => drink._id !== drinkId);
          setDrinks(updatedDrinks);

          // Cập nhật selectedDrinks dựa trên selectedCategory
          if (selectedCategory && selectedCategory.name !== 'All') {
            const updatedSelectedDrinks = updatedDrinks.filter(drink => drink.categoryId === selectedCategory._id);
            setSelectedDrinks(updatedSelectedDrinks);
          } else {
            setSelectedDrinks(updatedDrinks);
          }
        } else {
          alert("Có lỗi xảy ra");
        }
      } catch (error) {
        console.error('Error deleting drink:', error);
        alert("Error deleting drink");
      }
    }
  };
  // cập nhật lại state drink sau khi chỉnh sửa
  const editDrinkAndUpdateState = (newDrinkData) => {
    // Cập nhật state của đồ uống sau khi chỉnh sửa
    const updatedDrinks = drinks.map(drink => {
      if (drink._id === newDrinkData._id) {
        return newDrinkData;
      }
      return drink;
    });

    // Cập nhật state của drinks
    setDrinks(updatedDrinks);

    // Cập nhật selectedDrinks dựa trên selectedCategory
    if (selectedCategory && selectedCategory.name !== 'All') {
      const filteredDrinks = updatedDrinks.filter(drink => drink.categoryId === selectedCategory._id);
      setSelectedDrinks(filteredDrinks);
    } else {
      setSelectedDrinks(updatedDrinks);
    }
  };
  //cập nhật lại state drink sau khi thêm mới
  const handleSaveDrink = (newDrinkData) => {
    // Thêm đồ uống mới vào danh sách drinks
    setDrinks(prevDrinks => [...prevDrinks, newDrinkData]);

    // Cập nhật selectedDrinks dựa trên selectedCategory
    if (selectedCategory && selectedCategory.name !== 'All') {
      // Nếu selectedCategory đã được chọn, lọc danh sách thức uống theo selectedCategory
      const filteredDrinks = [...selectedDrinks, newDrinkData].filter(drink => drink.categoryId === selectedCategory._id);
      setSelectedDrinks(filteredDrinks);
    } else {
      setSelectedDrinks(prevSelectedDrinks => [...prevSelectedDrinks, newDrinkData]);
    }
  };

  //đóng form add category / drink
  const handleCancelAddCategory = () => {
    setIsAddingCategory(false);
  }
  const handleCancelAddDrink = () => {
    setIsAddingDrink(false);
  }
  return (
    <>
      <div className="w-full">
        <div className='container mx-auto px-4 max-h-full'>
          <h1 className="text-3xl font-semibold my-4">Mặt hàng</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map(category => (
              <CategoryCard token={token} key={category._id} category={category} onSelect={handleCategorySelect} onDeleteCategory={deleteCategoryAndUpdateState} onEditCategory={editCategoryAndUpdateState} />
            ))}
          </div>
          <h1 className="text-3xl font-semibold my-4">Thức uống</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedCategory && selectedDrinks.map(drink => (
              <DrinkCard token={token} key={drink._id} drink={drink} editCard={editDrinkAndUpdateState} deleteDrink={deleteDrinkAndUpdateState} />
            ))}
          </div>
          <button className="fixed bottom-16 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-md focus:outline-none z-10" onClick={handleAddCategory}>
            <FontAwesomeIcon icon={faCoffee} className="mr-2" />
            Add Category
          </button>
          <button className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-md focus:outline-none z-10" onClick={handleAddDrink}>
            <FontAwesomeIcon icon={faCoffee} className="mr-2" />
            Add Drink
          </button>
        </div>

      </div>
      {isAddingCategory && (
        <AddCategoryForm token={token} onSave={handleSaveCategory} onCancel={handleCancelAddCategory} />
      )}
      {isAddingDrink && (
        <AddDrinkForm token={token} onSave={handleSaveDrink} onCancel={handleCancelAddDrink} />
      )}
    </>
  );
}

export { getServerSideProps };
export default Management;
