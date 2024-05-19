import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRemove, faPlus  } from '@fortawesome/free-solid-svg-icons';
import { baseURL, drinksRoutes } from '@/api/api';

function BuyGetFree({ token, newPromotion, handleInputChange, handleAddRowDrink, handleRemoveRow, isEdit }) {
    const [drinkOptions, setDrinkOptions] = useState([]);

    useEffect(() => {
        // Call API to fetch drink options
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
        fetchDrinkOptions();
    }, []);
    return (
        <div>
            <h3 className="font-semibold mb-2 capitalize">Đồ uống mua</h3>
            {newPromotion.conditions.buy_get_free.buyItems.map((item, index) => (
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
                        onChange={(selectedOption) => handleInputChange({ target: { name: 'drink', value: selectedOption.value } }, 'buy_get_free', 'buyItems', index, 'drink')}
                        isSearchable
                        placeholder="Chọn đồ uống"
                        className="w-1/2 mr-2 outline-blue-500"
                    />
                    <input
                        type="number"
                        name="quantity"
                        placeholder="Số lượng"
                        value={item.quantity}
                        onChange={(e) => handleInputChange(e, 'buy_get_free', 'buyItems', index, 'quantity')}
                        className="border rounded-md px-3 py-2 w-1/4 mr-2 outline-blue-500"
                    />
                    {index > 0 && (
                        <button
                            type="button"
                            className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg outline-blue-500"
                            onClick={() => handleRemoveRow('buy_get_free', 'buyItems', index)}
                        >
                            <FontAwesomeIcon icon={faRemove} size="lg" />
                        </button>
                    )}
                </div>
            ))}
            <button
                type="button"
                className="bg-blue-500 text-white font-semibold w-10 h-10 flex items-center justify-center rounded-full mb-2"
                onClick={() => handleAddRowDrink('buy_get_free', 'buyItems')}
            >
                <FontAwesomeIcon icon={faPlus} />
            </button>
            <h3 className="font-semibold mb-2 capitalize">Đồ uống được tặng</h3>
            {newPromotion.conditions.buy_get_free.freeItems.map((item, index) => (
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
                        onChange={(selectedOption) => handleInputChange({ target: { name: 'drink', value: selectedOption.value } }, 'buy_get_free', 'freeItems', index, 'drink')}
                        isSearchable
                        placeholder="Chọn đồ uống"
                        className="w-1/2 mr-2 outline-blue-500"
                    />
                    <input
                        type="number"
                        name="quantity"
                        placeholder="Số lượng"
                        value={item.quantity}
                        onChange={(e) => handleInputChange(e, 'buy_get_free', 'freeItems', index, 'quantity')}
                        className="border rounded-md px-3 py-2 w-1/4 mr-2 outline-blue-500"
                    />
                    {index > 0 && (
                        <button
                            type="button"
                            className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg outline-blue-500"
                            onClick={() => handleRemoveRow('buy_get_free', 'freeItems', index)}
                        >
                            <FontAwesomeIcon icon={faRemove} size="lg" />
                        </button>
                    )}
                </div>
            ))}
            <button
                type="button"
                className="bg-blue-500 text-white font-semibold w-10 h-10 flex items-center justify-center rounded-full mb-2"
                onClick={() => handleAddRowDrink('buy_get_free', 'freeItems')}
            >
                <FontAwesomeIcon icon={faPlus} />
            </button>
        </div>
    )
}

export default BuyGetFree