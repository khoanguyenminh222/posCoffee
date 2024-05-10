import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { baseURL, ingredientExpenseRoutes, ingredientRoutes } from '@/api/api';

function AddStock({ token, onCancel }) {
    const [ingredients, setIngredients] = useState([]);
    const [expenseItems, setExpenseItems] = useState([
        { ingredient: '', quantity: '', unit: '', unitPrice: '', totalAmount: '' }
    ]);

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await axios.get(`${baseURL}${ingredientRoutes}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIngredients(response.data);
            } catch (error) {
                console.error('Error fetching ingredients:', error);
            }
        };

        fetchIngredients();
    }, [token]);

    const handleAddExpenseItem = () => {
        setExpenseItems([...expenseItems, { ingredient: '', quantity: '', unit: '', totalAmount: '' }]);
    };

    const handleRemoveExpenseItem = (index) => {
        const newExpenseItems = [...expenseItems];
        newExpenseItems.splice(index, 1);
        setExpenseItems(newExpenseItems);
    };

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const newExpenseItems = [...expenseItems];
        newExpenseItems[index][name] = value;
        setExpenseItems(newExpenseItems);
    };

    const handleSubmit = async () => {
        try {
            expenseItems.forEach(item => {
                item.unitPrice = (item.totalAmount / item.quantity).toFixed(2);
            });
            await axios.post(`${baseURL}${ingredientExpenseRoutes}`, expenseItems, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Nhập nguyên liệu thành công');
        } catch (error) {
            console.error('Error adding ingredient expenses:', error);
            alert('Failed to add ingredient expenses');
        }
    };

    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
            <div className="bg-white p-8 rounded-md shadow-md w-96 relative overflow-auto max-h-full">
                <h2 className="text-2xl font-semibold mb-4">Nhập hàng</h2>
                {expenseItems.map((item, index) => (
                    <div key={index} className="mb-4">
                        <select name="ingredient" value={item.ingredient} onChange={(e) => handleChange(e, index)} className="w-full border border-gray-300 rounded-md p-2 mb-2">
                            <option value="">Chọn nguyên liệu</option>
                            {ingredients.map((ingredient) => (
                                <option key={ingredient._id} value={ingredient._id}>{ingredient.name}</option>
                            ))}
                        </select>
                        <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleChange(e, index)} placeholder="Số lượng" className="w-full border border-gray-300 rounded-md p-2 mb-2" />
                        <input type="text" name="unit" value={item.unit} onChange={(e) => handleChange(e, index)} placeholder="Đơn vị" className="w-full border border-gray-300 rounded-md p-2 mb-2" />
                        <input type="number" name="totalAmount" value={item.totalAmount} onChange={(e) => handleChange(e, index)} placeholder="Tổng tiền" className="w-full border border-gray-300 rounded-md p-2 mb-2" />
                        {index > 0 && <button type="button" onClick={() => handleRemoveExpenseItem(index)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mr-2">Xóa</button>}
                    </div>
                ))}
                <button type="button" onClick={handleAddExpenseItem} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2">Thêm mục chi phí</button>
                <button type="submit" onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Xác nhận</button>
                <button onClick={onCancel} className="absolute top-2 right-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center justify-center">
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
        </div>
    );
}

export default AddStock;
