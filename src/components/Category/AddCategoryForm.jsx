import React, { useState } from 'react';
import axios from 'axios';
import { baseURL, categoriesRoutes } from '@/api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddCategoryForm({token, onSave, onCancel}) {
  const [name, setName] = useState('');
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
      const response = await axios.post(`${baseURL}${categoriesRoutes}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 201) {
        toast.success(response.data.message);
        setName(''); // Đặt lại giá trị của name và imageFile sau khi thêm category thành công
        setImageFile(null);
        onSave(response.data.newCategory);
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
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">Thêm mặt hàng</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên</label>
            <input type="text" id="name" name='name' value={name} onChange={handleNameChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Hình ảnh</label>
            <input type="file" id="image" name='img' onChange={handleImageChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
          </div>
          <div className="flex justify-between">
            {/* Cancel button */}
            <button type="button" onClick={onCancel} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Huỷ
            </button>
            {/* Submit button */}
            <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCategoryForm;
