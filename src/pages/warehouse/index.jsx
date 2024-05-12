import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getServerSideProps } from '@/helpers/cookieHelper';
import { format } from 'date-fns';
import { baseURL, ingredientRoutes } from '@/api/api';
import AddStock from '@/components/Warehouse/AddStock';

function Warehouse({ token }) {
  const [ingredients, setIngredients] = useState([]);
  const [editIngredient, setEditIngredient] = useState({
    id: '',
    name: '',
    quantity: '',
    unit: '',
    totalPrice: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get(`${baseURL}${ingredientRoutes}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIngredients(response.data);
      } catch (error) {
        console.error('Lỗi khi fetch danh sách thành phần:', error);
      }
    };
    fetchIngredients();
  }, []);

  const handleAddIngredient = async () => {
    console.log(editIngredient)
    try {
      const response = await axios.post(`${baseURL}${ingredientRoutes}`, {
        name: editIngredient.name,
        quantity: editIngredient.quantity,
        unit: editIngredient.unit,
        totalPrice: editIngredient.totalPrice
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIngredients([...ingredients, response.data]);
      setEditIngredient({
        name: '',
        quantity: '',
        unit: '',
        totalPrice: ''
      });
    } catch (error) {
      console.error('Lỗi khi thêm thành phần:', error);
    }
  };

  const handleDeleteIngredient = async (ingredient) => {
    console.log(ingredient.name)
    if (window.confirm(`Bạn có muốn xoá?`)){
      try {
        await axios.delete(`${baseURL}${ingredientRoutes}/${ingredient._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIngredients(ingredients.filter(i => i._id !== ingredient._id));
      } catch (error) {
        console.error('Lỗi khi xoá thành phần:', error);
      }
    }
  };

  const handleEditIngredient = async () => {
    try {
      const response = await axios.patch(`${baseURL}${ingredientRoutes}/${editIngredient.id}`, {
        name: editIngredient.name,
        quantity: editIngredient.quantity,
        unit: editIngredient.unit,
        totalPrice: editIngredient.totalPrice
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIngredients(ingredients.map(ingredient => (ingredient._id === response.data._id ? response.data : ingredient)));
      setEditIngredient({
        id: '',
        name: '',
        quantity: '',
        unit: '',
        totalPrice: '',
      });
    } catch (error) {
      console.error('Lỗi khi sửa thành phần:', error);
    }
  };

  const handleSelectEditIngredient = (ingredient) => {
    setEditIngredient({
      id: ingredient._id,
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      totalPrice: ingredient.totalPrice
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditIngredient({ ...editIngredient, [name]: value });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [isAddStock, setIsAddStock] = useState(false)
  const handleAddStock = () => {
    setIsAddStock(true);
  }
  const handleCancelAddStock = () => {
    setIsAddStock(false);
  }

  return (
    <div className="container mx-auto max-h-full px-4 py-8 flex flex-col overflow-x-auto">
      <h1 className="text-3xl font-semibold mb-4">Quản lý Thành Phần</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Thêm Thành Phần</h2>
        <input type="text" name="name" placeholder="Tên Thành Phần" value={editIngredient.name} onChange={handleEditInputChange} className="border border-gray-300 rounded px-4 py-2 mb-2 lg:w-60 w-full" />
        <input type="number" name="quantity" placeholder="Số Lượng" value={editIngredient.quantity} onChange={handleEditInputChange} className="border border-gray-300 rounded px-4 py-2 mb-2 lg:w-60 w-full" />
        <input type="text" name="unit" placeholder="Đơn Vị" value={editIngredient.unit} onChange={handleEditInputChange} className="border border-gray-300 rounded px-4 py-2 mb-2 lg:w-60 w-full" />
        <input type="number" name="totalPrice" placeholder="Giá" value={editIngredient.totalPrice} onChange={handleEditInputChange} className="border border-gray-300 rounded px-4 py-2 mb-2 lg:w-60 w-full" />
        <button onClick={handleAddIngredient} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ml-2">Thêm</button>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Sửa Thành Phần</h2>
        <input type="text" name="name" value={editIngredient.name} onChange={handleEditInputChange} className="border border-gray-300 rounded px-4 py-2 mb-2 lg:w-60 w-full" />
        <input type="number" name="quantity" value={editIngredient.quantity} onChange={handleEditInputChange} className="border border-gray-300 rounded px-4 py-2 mb-2 lg:w-60 w-full" />
        <input type="text" name="unit" value={editIngredient.unit} onChange={handleEditInputChange} className="border border-gray-300 rounded px-4 py-2 mb-2 lg:w-60 w-full" />
        <input type="number" name="totalPrice" value={editIngredient.totalPrice} onChange={handleEditInputChange} className="border border-gray-300 rounded px-4 py-2 mb-2 lg:w-60 w-full" />
        <button onClick={handleEditIngredient} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ml-2">Lưu</button>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Danh sách Thành Phần</h2>
        <input type="text" placeholder="Nhập từ khóa tìm kiếm" onChange={handleSearch} className="border border-gray-300 rounded px-4 py-2 mb-2 lg:w-80 w-full" />
        <button onClick={handleAddStock} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 lg:ml-2 mb-2">Nhập hàng</button>
        <div className='overflow-x-auto block max-h-96'>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Lượng</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn Vị</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá/đơn vị</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày cập nhật</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành Động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIngredients.map(ingredient => (
                <tr key={ingredient._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{ingredient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{ingredient.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{ingredient.unit}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{ingredient.priceOfUnit.toLocaleString('vi-VN')} đ</td>
                  <td className="px-6 py-4 whitespace-nowrap">{ingredient.totalPrice.toLocaleString('vi-VN')} đ</td>
                  <td className="px-6 py-4 whitespace-nowrap">{format(new Date(ingredient.updatedAt), 'dd/MM/yyyy HH:mm:ss')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-blue-500 mr-2" onClick={() => handleSelectEditIngredient(ingredient)}>Sửa</button>
                    <button className="text-red-500" onClick={() => handleDeleteIngredient(ingredient)}>Xoá</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isAddStock && <AddStock token={token} onCancel={handleCancelAddStock} />}
      </div>
    </div>
  );
}

export { getServerSideProps };
export default Warehouse;
