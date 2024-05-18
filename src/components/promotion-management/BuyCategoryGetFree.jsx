import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRemove, faPlus } from '@fortawesome/free-solid-svg-icons';
import { baseURL, categoriesRoutes, drinksRoutes } from '@/api/api';

function BuyCategoryGetFree({ token, newPromotion, handleInputChange, isEdit, handleAddRowCategory, handleAddRowDrink, handleRemoveRow }) {
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [drinkOptions, setDrinkOptions] = useState([]);
    useEffect(() => {
        // Call API to fetch drink options
        const fetchCategoryOptions = async () => {
            try {
                const response = await axios.get(`${baseURL}${categoriesRoutes}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCategoryOptions(response.data.map(category => ({ value: category._id, label: category.name })));
            } catch (error) {
                console.error('Error fetching category options:', error);
            }
        };
        const fetchDrinkOptions = async () => {
            try {
                const response = await axios.get(`${baseURL}${drinksRoutes}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDrinkOptions(response.data.map(drink => ({ value: drink._id, label: drink.name })));
            } catch (error) {
                console.error('Error fetching drink options:', error);
            }
        };
        fetchCategoryOptions();
        fetchDrinkOptions();
    }, []);
    return (
        <div>
            <h3 className="font-semibold mb-2 capitalize">Đồ uống mua</h3>
            {newPromotion.conditions.buy_category_get_free.buyCategoryItems.map((item, index) => (
                <div key={index} className="flex items-center mb-2">
                    <Select
                        id="category"
                        name="category"
                        options={categoryOptions}
                        value={
                            isEdit
                                ? categoryOptions.find(option => option.value === (item.category._id || item.category)) || ''
                                : categoryOptions.find(option => option.value === item.category) || ''
                        }
                        onChange={(selectedOption) => handleInputChange({ target: { name: 'category', value: selectedOption.value } }, 'buy_category_get_free', 'buyCategoryItems', index, 'category')}
                        isSearchable
                        placeholder="Chọn đồ uống"
                        className="w-2/3 mr-2 outline-blue-500"
                        required={true}
                    />

                    <input
                        type="number"
                        name="quantity"
                        placeholder="Số lượng"
                        value={item.quantity}
                        onChange={(e) => handleInputChange(e, 'buy_category_get_free', 'buyCategoryItems', index, 'quantity')}
                        className="border rounded-md px-3 py-2 w-1/3 mr-2 outline-blue-500"
                        required={true}
                    />
                    {index > 0 && (
                        <button
                            type="button"
                            className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg outline-blue-500"
                            onClick={() => handleRemoveRow('buy_category_get_free', 'buyCategoryItems', index)}
                        >
                            <FontAwesomeIcon icon={faRemove} size="lg" />
                        </button>
                    )}
                </div>
            ))}
            <button
                type="button"
                className="bg-blue-500 text-white font-semibold w-10 h-10 flex items-center justify-center rounded-full mb-2"
                onClick={() => handleAddRowCategory('buy_category_get_free', 'buyCategoryItems')}
            >
                <FontAwesomeIcon icon={faPlus} />
            </button>

            <h3 className="font-semibold mb-2 capitalize">Đồ uống được tặng</h3>
            {newPromotion.conditions.buy_category_get_free.freeCategoryItems.map((item, index) => (
                <div key={index} className="flex items-center mb-2">
                    <Select
                        id="drink"
                        name="drink"
                        options={drinkOptions}
                        value={
                            isEdit
                                ? drinkOptions.find(option => option.value === (item.drink._id || item.drink)) || ''
                                : drinkOptions.find(option => option.value === item.drink) || ''
                        }
                        onChange={(selectedOption) => handleInputChange({ target: { name: 'drink', value: selectedOption.value } }, 'buy_category_get_free', 'freeCategoryItems', index, 'drink')}
                        isSearchable
                        placeholder="Chọn đồ uống"
                        className="w-2/3 mr-2 outline-blue-500"
                        required={true}
                    />
                    <input
                        type="number"
                        name="quantity"
                        placeholder="Số lượng"
                        value={item.quantity}
                        onChange={(e) => handleInputChange(e, 'buy_category_get_free', 'freeCategoryItems', index, 'quantity')}
                        className="border rounded-md px-3 py-2 w-1/3 mr-2 outline-blue-500"
                        required={true}
                    />
                    {index > 0 && (
                        <button
                            type="button"
                            className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg outline-blue-500"
                            onClick={() => handleRemoveRow('buy_category_get_free', 'freeCategoryItems', index)}
                        >
                            <FontAwesomeIcon icon={faRemove} size="lg" />
                        </button>
                    )}
                </div>
            ))}
            <button
                type="button"
                className="bg-blue-500 text-white font-semibold w-10 h-10 flex items-center justify-center rounded-full mb-2"
                onClick={() => handleAddRowDrink('buy_category_get_free', 'freeCategoryItems')}
            >
                <FontAwesomeIcon icon={faPlus} />
            </button>
        </div>
    )
}

export default BuyCategoryGetFree