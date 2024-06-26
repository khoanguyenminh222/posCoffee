import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, fain } from '@fortawesome/free-solid-svg-icons';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase';
import EditDrinkFrom from './EditDrinkFrom';
import { baseURL, drinksRoutes } from '@/api/api';
import IngredentForm from './IngredentForm';

const DrinkCard = ({ token, drink, deleteDrink, editCard }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditIngredients, setIsEditIngredients] = useState(false);
    useEffect(() => {
        const fetchImageUrl = async () => {
            try {
                const storageRef = ref(storage, drink.image);
                const url = await getDownloadURL(storageRef);
                setImageUrl(url);
            } catch (error) {
                console.error('Lỗi khi lấy URL hình ảnh:', error);
            }
        };
        fetchImageUrl();
    }, [drink.image, storage]);
    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleSaveEdit = (data) => {
        editCard(data.updatedDrink)
        setIsEditing(false);
    };
    const handleDelete = async() => {
        deleteDrink(drink._id,drink.name)
    }
    const handleEditIngredients = async() => {
        setIsEditIngredients(true);
    }
    const handleCancelIngredients = () => {
        setIsEditIngredients(false);
    };
    const handleSaveIngredients = (data) => {
        editCard(data.drink)
        setIsEditing(false);
    };
    return (
        <>
        <div className="bg-white shadow-md rounded-md p-4 mb-4 relative cursor-pointer hover:shadow-2xl">
            <img src={imageUrl} alt={drink.name} className="w-full h-32 object-cover mb-4 rounded-md" />
            <h2 className="text-lg font-semibold uppercase">{drink.name}</h2>
            <div className="flex justify-between mt-2">
                <span className="text-gray-600">Giá M: {drink.prices.M.toLocaleString('vi-VN')} đ</span>
                <span className="text-gray-600">Giá L: {drink.prices.L.toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="mt-4">
                <h3 className="text-md font-semibold mb-1">Tùy chọn:</h3>
                <ul className="list-disc list-inside">
                    {drink.options.temperature && drink.options.temperature.length > 0 && (
                        <li className="text-gray-600">Nhiệt độ: {drink.options.temperature.join(', ')}</li>
                    )}
                    {drink.options.sugar && drink.options.sugar.length > 0 && (
                        <li className="text-gray-600">Đường: {drink.options.sugar.join(', ')}</li>
                    )}
                    {drink.options.ice && drink.options.ice.length > 0 && (
                        <li className="text-gray-600">Đá: {drink.options.ice.join(', ')}</li>
                    )}
                </ul>
            </div>
            <div className=' justify-end bottom-0'>
                <button onClick={handleEditIngredients} className="text-sm text-blue-600 mr-2 hover:underline focus:outline-none">
                    Sửa nguyên liệu
                </button>
            </div>
            <div className="absolute bottom-4 right-4">
                <button onClick={handleEditClick} className="text-sm text-blue-600 mr-2 hover:underline focus:outline-none">
                    <FontAwesomeIcon icon={faEdit} className="mr-1" />
                    Sửa
                </button>
                <button onClick={handleDelete} className="text-sm text-red-600 hover:underline focus:outline-none">
                    <FontAwesomeIcon icon={faTrashAlt} className="mr-1" />
                    Xoá
                </button>
            </div>
        </div>
        {isEditing && <EditDrinkFrom token={token} drink={drink} onCancel={handleCancelEdit} onSave={handleSaveEdit}/>}
        {isEditIngredients && <IngredentForm token={token} drink={drink} onCancel={handleCancelIngredients} onSave={handleSaveIngredients}/>}
        </>
    );
}

export default DrinkCard;
