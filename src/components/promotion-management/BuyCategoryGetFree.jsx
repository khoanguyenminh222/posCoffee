import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRemove, faPlus } from '@fortawesome/free-solid-svg-icons';
import { baseURL, categoriesRoutes, drinksRoutes } from '@/api/api';

function BuyCategoryGetFree({ token, newPromotion, handleSingleInputChange, isEdit }) {
    const [categoryOptions, setCategoryOptions] = useState([]);
    const categoryId = newPromotion['buyCategoryItems'].category._id ? newPromotion['buyCategoryItems'].category._id : newPromotion['buyCategoryItems'].category;

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
        fetchCategoryOptions();
    }, []);
    return (
        <div>
            <h3 className="font-semibold mb-2 capitalize">Đồ uống mua</h3>
            <div className="flex items-center mb-2">
                {isEdit ?
                    <Select
                        id="category"
                        name="category"
                        options={categoryOptions}
                        value={categoryOptions.find(option => option.value === categoryId) || ''}
                        onChange={(selectedOption) => handleSingleInputChange({ target: { name: 'category', value: selectedOption.value } }, 'buyCategoryItems')}
                        isSearchable
                        placeholder="Chọn đồ uống"
                        className="w-2/3 mr-2 outline-blue-500"
                    />
                    :
                    <Select
                        id="category"
                        name="category"
                        options={categoryOptions}
                        value={categoryOptions.find(option => option.value === newPromotion['buyCategoryItems'].category) || ''}
                        onChange={(selectedOption) => handleSingleInputChange({ target: { name: 'category', value: selectedOption.value } }, 'buyCategoryItems')}
                        isSearchable
                        placeholder="Chọn đồ uống"
                        className="w-2/3 mr-2 outline-blue-500"
                    />
                }
                <input
                    type="number"
                    name="quantity"
                    placeholder="Số lượng"
                    value={newPromotion['buyCategoryItems'].quantity}
                    onChange={(e) => handleSingleInputChange(e, 'buyCategoryItems')}
                    className="border rounded-md px-3 py-2 w-1/3 mr-2 outline-blue-500"
                />
            </div>
            <h3 className="font-semibold mb-2 capitalize">Đồ uống được tặng</h3>

            <div className="flex items-center mb-2">
                {isEdit ?
                    <Select
                        id="category"
                        name="category"
                        options={categoryOptions}
                        value={categoryOptions.find(option => option.value === newPromotion['freeCategoryItems'].category._id) || ''}
                        onChange={(selectedOption) => handleSingleInputChange({ target: { name: 'category', value: selectedOption.value } }, 'freeCategoryItems')}
                        isSearchable
                        placeholder="Chọn đồ uống"
                        className="w-2/3 mr-2 outline-blue-500"
                    />
                    :
                    <Select
                        id="category"
                        name="category"
                        options={categoryOptions}
                        value={categoryOptions.find(option => option.value === newPromotion['freeCategoryItems'].category) || ''}
                        onChange={(selectedOption) => handleSingleInputChange({ target: { name: 'category', value: selectedOption.value } }, 'freeCategoryItems')}
                        isSearchable
                        placeholder="Chọn đồ uống"
                        className="w-2/3 mr-2 outline-blue-500"
                    />
                }

                <input
                    type="number"
                    name="quantity"
                    placeholder="Số lượng"
                    value={newPromotion['freeCategoryItems'].quantity}
                    onChange={(e) => handleSingleInputChange(e, 'freeCategoryItems')}
                    className="border rounded-md px-3 py-2 w-1/3 mr-2 outline-blue-500"
                />
            </div>
        </div>
    )
}

export default BuyCategoryGetFree