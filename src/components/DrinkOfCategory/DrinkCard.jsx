import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase';
import EditDrinkFrom from './EditDrinkFrom';
import { baseURL, drinksRoutes } from '@/api/api';

const DrinkCard = ({ drink }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
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

    const handleSaveEdit = (formdata) => {
        if(formdata.status==201){
            alert("Cập nhật thành công");
        }else{
            alert("Có lỗi xảy ra");
        }
        setIsEditing(false);
    };
    const handleDelete = async() => {
        if (window.confirm(`Bạn có muôn xoá ${drink.name}?`)) {
            try {
                // Gửi request POST sử dụng axios
                const response = await axios.delete(`${baseURL}${drinksRoutes}/${drink._id}`);
                if(response.status==201){
                    alert("Xoá thành công")
                }else{
                    alert("Có lỗi xảy ra");
                }
              } catch (error) {
                console.error('Error saving category:', error);
                // Xử lý lỗi nếu có
              }
        }
    }

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
                    {drink.options.temperature && (
                        <li className="text-gray-600">Nhiệt độ: {drink.options.temperature.join(', ')}</li>
                    )}
                    {drink.options.sugar.length > 0 && (
                        <li className="text-gray-600">Đường: {drink.options.sugar.join(', ')}</li>
                    )}
                    {drink.options.ice.length > 0 && (
                        <li className="text-gray-600">Đá: {drink.options.ice.join(', ')}</li>
                    )}
                </ul>
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
        {isEditing && <EditDrinkFrom drink={drink} onCancel={handleCancelEdit} onSave={handleSaveEdit}/>}
        </>
    );
}

export default DrinkCard;
