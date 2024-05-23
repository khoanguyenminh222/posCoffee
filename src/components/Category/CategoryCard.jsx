import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase';

import EditCategoryForm from './EditCategoryForm';

const CategoryCard = ({ token, category, onSelect, onDeleteCategory, onEditCategory }) => {
    const [name,setName] = useState(category.name);
    const [img, setImg] = useState(category.img);
    const [imageUrl, setImageUrl] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchImageUrl = async () => {
            try {
                if(category.img!=='All'){
                    const storageRef = ref(storage, img);
                    const url = await getDownloadURL(storageRef);
                    setImageUrl(url);
                }
            } catch (error) {
                console.error('Error getting image URL:', error);
            }
        };
        fetchImageUrl();
    }, [img, storage]);

    const handleDelete = async () => {
        onDeleteCategory(category._id, category.name);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleSaveEdit = (data) => {
        const updatedCategory = data.updatedCategory
        if(updatedCategory){
            setName(updatedCategory.name);
            setImg(updatedCategory.img)
            onEditCategory({ _id: category._id, name: updatedCategory.name, img: updatedCategory.img });
        }else{
            console.log('Có lỗi xảy ra')
        }
        setIsEditing(false);
    };

    useEffect(() => {
        category.name = name;
        category.img = img;
    },[name, img]);

    return (
        <>
            <div onClick={() => onSelect(category)} className="bg-white shadow-md rounded-md p-4 mb-4 cursor-pointer hover:shadow-2xl">
                {imageUrl && <img src={imageUrl} alt={category.name} className="w-full h-32 object-cover mb-4 rounded-md" />}
                <h2 className="text-lg font-semibold">{name}</h2>
                {name !== "All" ?
                    <div className="flex justify-end mt-4">
                        <button onClick={handleDelete} className="mr-2 focus:outline-none">
                            <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 hover:text-red-600" />
                        </button>
                        <button onClick={handleEdit} className="focus:outline-none">
                            <FontAwesomeIcon icon={faEdit} className="text-blue-500 hover:text-blue-600" />
                        </button>
                    </div> :
                    <div></div>}

            </div>
            {isEditing && (
                <EditCategoryForm token={token} category={category}
                    onSave={handleSaveEdit}
                    onCancel={handleCancelEdit} />
            )}
        </>
    );
}

export default CategoryCard;
