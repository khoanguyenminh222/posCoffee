import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL, drinksRoutes, ingredientRoutes } from '@/api/api';

function IngredientForm({ token, drink, onCancel, onSave }) {
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState('');
    const [quantity, setQuantity] = useState('');
    const [addedIngredients, setAddedIngredients] = useState([]);

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await axios.get(`${baseURL}${ingredientRoutes}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIngredients(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách thành phần:', error);
            }
        };
        const fetchIngredientForDrink = async () => {
            try {
                const response = await axios.get(`${baseURL}${drinksRoutes}/${drink._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const transformedIngredients = response.data.ingredients.map(item => ({
                    _id: item.ingredient ? item.ingredient._id : null,
                    name: item.ingredient ? item.ingredient.name : null,
                    unit: item.ingredient ? item.ingredient.unit : null,
                    quantity: item.quantity
                }));
                setAddedIngredients(transformedIngredients);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách thành phần đồ uống:', error);
            }
        };
        fetchIngredientForDrink();
        fetchIngredients();
    }, []);

    const handleAddIngredient = () => {
        const selectedIngredientInfo = ingredients.find(ingredient => ingredient._id === selectedIngredient);
        if (selectedIngredientInfo && quantity) {
            // Kiểm tra xem ID đã tồn tại trong addedIngredients chưa
            const isExisting = addedIngredients.some(item => item._id === selectedIngredientInfo._id);
            if (!isExisting) {
                setAddedIngredients([...addedIngredients, { ...selectedIngredientInfo, quantity }]);
                
            }else{
                window.confirm(`Nguyên liệu đã tồn tại`)
            }
            setSelectedIngredient('');
            setQuantity('');
            onCancel();
        }
    };

    const handleRemoveIngredient = (id) => {
        setAddedIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient._id !== id));
    }

    const handleSubmit = async() => {
        try {
            const response = await axios.post(`${baseURL}${drinksRoutes}/${drink._id}/ingredients`, {ingredients:addedIngredients}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onSave(response);
        } catch (error) {
            console.error('Lỗi khi thêm danh sách thành phần:', error);
        }
    };

    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg">
                <h2 className=' mb-2 font-bold uppercase'>{drink.name}</h2>
                {addedIngredients.map((ingredient) => (
                    <div key={ingredient._id} className="mb-2">
                        <input readOnly={true} className="mr-2 p-2 border border-gray-300 rounded" value={`${ingredient.name}-${ingredient.unit}`} />
                        <input
                            type="number"
                            placeholder="Số lượng"
                            value={ingredient.quantity}
                            readOnly={true}
                            className="mr-2 p-2 border border-gray-300 rounded"
                        />
                        <button onClick={() => handleRemoveIngredient(ingredient._id)} className="px-3 py-2 bg-red-500 text-white rounded">Xóa</button>
                    </div>
                ))}
                <div className="mb-2">
                    <select value={selectedIngredient} onChange={e => setSelectedIngredient(e.target.value)} className="mr-2 p-2 border border-gray-300 rounded">
                        <option value="">Chọn Thành Phần</option>
                        {ingredients.map(ingredient => (
                            <option key={ingredient._id} value={ingredient._id}>{ingredient.name}-{ingredient.unit}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Số lượng"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        className="mr-2 p-2 border border-gray-300 rounded"
                    />
                    <button onClick={handleAddIngredient} className="px-3 py-2 bg-blue-500 text-white rounded">Thêm Thành Phần</button>
                </div>
                <button onClick={handleSubmit} className="px-3 py-2 mr-3 bg-green-500 text-white rounded">Xác Nhận</button>
                <button onClick={onCancel} className="px-3 py-2 bg-gray-500 text-white rounded">Hủy Bỏ</button>
            </div>
        </div>
    );
}

export default IngredientForm;
