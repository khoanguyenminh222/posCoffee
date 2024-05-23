import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { baseURL, ingredientExpenseRoutes, ingredientRoutes } from '@/api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddStock({ token, ingredientAddStock, onCancel, onSave }) {
    const [quantityAction, setQuantityAction] = useState('add');
    const [formData, setFormData] = useState({
        quantity: ingredientAddStock.quantity,
        priceOfUnit: ingredientAddStock.priceOfUnit,
        totalPrice: ingredientAddStock.totalPrice
    });

    const handleOptionChange = (event) => {
        setQuantityAction(event.target.value);
    };
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const handleSubmit = async () => {
        try {
            
            const { quantity, priceOfUnit, totalPrice } = formData;
            if(!quantity || !totalPrice){
                toast.warning('Vui lòng điền số lượng và thành tiền');
                return;
            }
            const expenseItem = {
                quantity: parseInt(quantity),
                priceOfUnit: priceOfUnit ? parseFloat(priceOfUnit) : '',
                totalPrice: parseFloat(totalPrice)
            };

            const response = await axios.put(`${baseURL}${ingredientRoutes}/addStock/${ingredientAddStock._id}`, expenseItem, {
                headers: { Authorization: `Bearer ${token}` },
                params: { action: quantityAction }
            });
            if (response.status>=200 && response.status<300) {
                toast.success(response.data.message);
                onCancel();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            if(error.response){
                toast.error(error.response.data.message);
            }else{
                toast.error(error.message)
            }
        }
    };

    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
            <div className="bg-white p-8 rounded-md shadow-md w-96 relative overflow-auto max-h-full">
                <h2 className="text-2xl font-semibold mb-4">Nhập hàng</h2>
                <div className="mb-4">
                    <label htmlFor="name" className="block mb-2">Tên nguyên liệu</label>
                    <input type="text" id="name" name="name" value={ingredientAddStock.name} placeholder="Tên nguyên liệu" className="w-full border border-gray-300 rounded-md p-2 mb-2 outline-none" readOnly/>

                    <label htmlFor="unit" className="block mb-2">Đơn vị tính</label>
                    <input type="text" id="unit" name="unit" value={ingredientAddStock.unit} placeholder="Đơn vị tính" className="w-full border border-gray-300 rounded-md p-2 mb-2 outline-none" readOnly/>
                    <div className="mb-2">
                        <label className="mr-2">
                            <input type="radio" value="add" checked={quantityAction === 'add'} onChange={handleOptionChange} className="mr-1"/>
                            Cộng thêm
                        </label>
                        <label>
                            <input type="radio" value="change" checked={quantityAction === 'change'}onChange={handleOptionChange}className="mr-1"/>
                            Thay thế
                        </label>
                    </div>
                    <label htmlFor="quantity" className="block mb-2">Số lượng <span className='text-red-500'>(*)</span></label>
                    <input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Số lượng" className="w-full border border-gray-300 rounded-md p-2 mb-2 outline-none" />

                    <label htmlFor="priceOfUnit" className="block mb-2">Đơn giá/đơn vị</label>
                    <input type="number" id="priceOfUnit" name="priceOfUnit" value={formData.priceOfUnit} onChange={handleChange} placeholder="Giá/đơn vị" className="w-full border border-gray-300 rounded-md p-2 mb-2 outline-none" />

                    <label htmlFor="totalPrice" className="block mb-2">Tổng tiền <span className='text-red-500'>(*)</span></label>
                    <input type="number" id="totalPrice" name="totalPrice" value={formData.totalPrice} onChange={handleChange} placeholder="Tổng tiền" className="w-full border border-gray-300 rounded-md p-2 mb-2 outline-none" />
                </div>
                <button type="submit" onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Xác nhận</button>
                <button onClick={onCancel} className="absolute top-2 right-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center justify-center">
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
        </div>
    );
}

export default AddStock;
