import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRemove, faPlus } from '@fortawesome/free-solid-svg-icons';
import { baseURL, categoriesRoutes } from '@/api/api';

function FixedPrice({ token, newPromotion, handleInputChange, handleAddRowCategory, handleRemoveRow, isEdit }) {
    const [categoryOptions, setCategoryOptions] = useState([]);
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
        <h3 className="font-semibold mb-2 capitalize">Đồ uống đồng giá</h3>
        {newPromotion.conditions.fixed_price.fixedPriceItems.map((item, index) => (
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
                    onChange={(selectedOption) => handleInputChange({ target: { name: 'category', value: selectedOption.value } }, 'fixed_price', 'fixedPriceItems', index, 'category')}
                    isSearchable
                    placeholder="Chọn đồ uống"
                    className="w-2/3 mr-2 outline-blue-500"
                    required={true}
                />

                <input
                    type="number"
                    name="fixedPrice"
                    placeholder="Giá bán"
                    value={item.fixedPrice ?? ''}
                    onChange={(e) => handleInputChange(e, 'fixed_price', 'fixedPriceItems', index, 'fixedPrice')}
                    className="border rounded-md px-3 py-2 w-1/3 mr-2 outline-blue-500"
                    required={true}
                />
                {index > 0 && (
                    <button
                        type="button"
                        className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg outline-blue-500"
                        onClick={() => handleRemoveRow('fixed_price', 'fixedPriceItems', index)}
                    >
                        <FontAwesomeIcon icon={faRemove} size="lg" />
                    </button>
                )}
            </div>
        ))}
        <button
            type="button"
            className="bg-blue-500 text-white font-semibold w-10 h-10 flex items-center justify-center rounded-full mb-2"
            onClick={() => handleAddRowCategory('fixed_price', 'fixedPriceItems')}
        >
            <FontAwesomeIcon icon={faPlus} />
        </button>
    </div>
  )
}

export default FixedPrice