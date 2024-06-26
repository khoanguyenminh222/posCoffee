import { baseURL, categoriesRoutes } from '@/api/api';
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditCategoryForm({ token, category, onSave, onCancel }) {
  const [name, setName] = useState(category.name);
  const [imageFile, setImageFile] = useState(null);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('img', imageFile);
    try {
      // Gửi request POST sử dụng axios
      const response = await axios.put(`${baseURL}${categoriesRoutes}/${category._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Cần set header 'Content-Type' là 'multipart/form-data' để gửi FormData
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 201) {
        toast.success(response.data.message);
        onSave(response.data); // Gọi hàm onSave khi request thành công
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

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">Chỉnh sửa loại mặt hàng</h2>
        {/* Form chỉnh sửa thông tin category */}
        <form onSubmit={handleSubmit}>
          {/* Input fields */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên loại hàng</label>
            <input type="text" id="name" value={name} onChange={handleNameChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none" required/>
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Hình ảnh</label>
            <input type="file" id="image" onChange={handleImageChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          {/* Submit button */}
          <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Lưu
          </button>
          {/* Cancel button */}
          <button type="button" onClick={handleCancel} className="ml-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Huỷ
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditCategoryForm;
