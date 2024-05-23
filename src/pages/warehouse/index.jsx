import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getServerSideProps } from '@/helpers/cookieHelper';
import { format } from 'date-fns';
import { baseURL, ingredientRoutes } from '@/api/api';
import AddStock from '@/components/Warehouse/AddStock';
import AddIngredientForm from '@/components/Warehouse/AddIngredientForm';
import EditIngredientForm from '@/components/Warehouse/EditIngredientForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Warehouse({ token }) {
  const [ingredients, setIngredients] = useState([]);
  const [addIngredient, setAddIngredient] = useState({
    id: '',
    name: '',
    quantity: '',
    unit: '',
    priceOfUnit: '',
    totalPrice: ''
  });
  const [editIngredient, setEditIngredient] = useState({
    id: '',
    name: '',
    quantity: '',
    unit: '',
    priceOfUnit: '',
    totalPrice: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const fetchIngredients = async () => {
    try {
      const response = await axios.get(`${baseURL}${ingredientRoutes}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: currentPage, pageSize: pageSize, search: searchTerm }
      });
      setIngredients(response.data.ingredients);
      setTotalPages(response.data.totalPages)
      setCurrentPage(currentPage);
    } catch (error) {
      console.error('Lỗi khi fetch danh sách thành phần:', error);
    }
  };
  useEffect(() => {
    fetchIngredients();
    console.log(searchTerm)
  }, [currentPage, searchTerm]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
      if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
      }
  };

  const handleAddIngredient = async () => {
    if (!addIngredient.name || !addIngredient.quantity || !addIngredient.unit || !addIngredient.totalPrice) {
      // Nếu bất kỳ trường nào cũng không được điền vào, ngăn việc gửi dữ liệu và hiển thị thông báo lỗi
      toast.warning('Vui lòng điền đầy đủ thông tin cho tất cả các trường');
      return;
    }
    try {
      const response = await axios.post(`${baseURL}${ingredientRoutes}`, {
        name: addIngredient.name,
        quantity: addIngredient.quantity,
        unit: addIngredient.unit,
        priceOfUnit: addIngredient.priceOfUnit,
        totalPrice: addIngredient.totalPrice
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 201) {
        toast.success(response.data.message);
        setIngredients([...ingredients, response.data.newIngredient]);
        setAddIngredient({
          name: '',
          quantity: '',
          unit: '',
          priceOfUnit: '',
          totalPrice: ''
        });
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

  const handleDeleteIngredient = async (ingredient) => {

    if (window.confirm(`Bạn có muốn xoá?`)) {
      try {
        await axios.delete(`${baseURL}${ingredientRoutes}/${ingredient._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.status>=200 && response.status<300) {
          toast.success(response.data.message);
          setIngredients(ingredients.filter(i => i._id !== ingredient._id));
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
    }
  };

  const handleEditIngredient = async () => {
    if (!editIngredient.name || !editIngredient.quantity || !editIngredient.unit || !editIngredient.totalPrice) {
      // Nếu bất kỳ trường nào cũng không được điền vào, ngăn việc gửi dữ liệu và hiển thị thông báo lỗi
      toast.warning('Vui lòng điền đầy đủ thông tin cho tất cả các trường');
      return;
    }
    try {
      const response = await axios.patch(`${baseURL}${ingredientRoutes}/${editIngredient.id}`, {
        name: editIngredient.name,
        quantity: editIngredient.quantity,
        unit: editIngredient.unit,
        priceOfUnit: editIngredient.priceOfUnit,
        totalPrice: editIngredient.totalPrice
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status>=200 && response.status<300) {
        toast.success(response.data.message);
        setIngredients(ingredients.map(ingredient => (ingredient._id === response.data.updatedIngredient._id ? response.data.updatedIngredient : ingredient)));
        setEditIngredient({
          id: '',
          name: '',
          quantity: '',
          unit: '',
          priceOfUnit: '',
          totalPrice: '',
        });
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

  const handleSelectEditIngredient = (ingredient) => {
    setEditIngredient({
      id: ingredient._id,
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      priceOfUnit: ingredient.priceOfUnit,
      totalPrice: ingredient.totalPrice
    });
  };
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setAddIngredient({ ...addIngredient, [name]: value });
  };
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditIngredient({ ...editIngredient, [name]: value });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const [isAddStock, setIsAddStock] = useState(false)
  const [ingredientAddStock, setIngredientAddStock] = useState([]);
  const handleAddStock = (ingredient) => {
    setIngredientAddStock(ingredient)
    setIsAddStock(true);
  }
  const handleCancelAddStock = () => {
    setIsAddStock(false);
  }

  return (
    <div className="container mx-auto max-h-full px-4 py-8 flex flex-col overflow-x-auto mt-5">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-semibold mb-4">Quản lý Thành Phần</h1>
        <div>
          <input type="text" placeholder="Nhập từ khóa tìm kiếm" value={searchTerm} onChange={handleSearch} className="border border-gray-300 rounded px-4 py-2 mb-2 lg:w-80 w-full outline-none" />
          <div className='overflow-x-auto block max-h-96'>
            <table className="min-w-full divide-y divide-gray-200 border-2 rounded-md">
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
                {ingredients.map(ingredient => (
                  <tr key={ingredient._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{ingredient.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{ingredient.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{ingredient.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{ingredient.priceOfUnit.toLocaleString('vi-VN')} đ</td>
                    <td className="px-6 py-4 whitespace-nowrap">{ingredient.totalPrice.toLocaleString('vi-VN')} đ</td>
                    <td className="px-6 py-4 whitespace-nowrap">{format(new Date(ingredient.updatedAt), 'dd/MM/yyyy HH:mm:ss')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-blue-500 mr-2 hover:underline" onClick={() => handleSelectEditIngredient(ingredient)}>Sửa</button>
                      <button className="text-red-500 hover:underline" onClick={() => handleDeleteIngredient(ingredient)}>Xoá</button>
                      <button className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={() => handleAddStock(ingredient)}>Nhập hàng</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center items-center mt-4">
              <button onClick={handlePreviousPage} disabled={currentPage === 1} className="text-sm mr-2 px-3 py-1 bg-gray-200 rounded-md focus:outline-none">Trang trước</button>
              <span className="mx-2 text-sm">Trang {currentPage} / {totalPages}</span>
              <button onClick={handleNextPage} disabled={currentPage === totalPages} className="text-sm ml-2 px-3 py-1 bg-gray-200 rounded-md focus:outline-none">Trang sau</button>
          </div>
          {isAddStock && <AddStock token={token} ingredientAddStock={ingredientAddStock} onCancel={handleCancelAddStock} />}
        </div>
        <div className='flex lg:flex-row flex-col justify-center items-center rounded p-4'>

          <AddIngredientForm
            addIngredient={addIngredient}
            onAddIngredientChange={handleAddInputChange}
            onAddIngredientSubmit={handleAddIngredient}
          />

          <EditIngredientForm
            editIngredient={editIngredient}
            onEditIngredientChange={handleEditInputChange}
            onEditIngredientSubmit={handleEditIngredient}
          />
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
}

export { getServerSideProps };
export default Warehouse;
