import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL, userRoutes } from '@/api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditUserModal({ token, user, onClose, onUpdateUser }) {
    const [formData, setFormData] = useState({
        username: user.username,
        fullname: user.fullname,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        address: user.address,
        phoneNumber: user.phoneNumber,
        email: user.email,
        role: user.role
    });

    useEffect(() => {
        setFormData({
            username: user.username,
            fullname: user.fullname,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            address: user.address,
            phoneNumber: user.phoneNumber,
            email: user.email,
            role: user.role
        });
    }, [user]);

    const [phoneError, setPhoneError] = useState('');
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Kiểm tra đầu vào của số điện thoại và cập nhật state lỗi nếu cần
        if (name === 'phoneNumber') {
            const isValidPhone = validatePhoneNumber(value);
            if (!isValidPhone) {
                setPhoneError('Số điện thoại không hợp lệ');
            } else {
                setPhoneError('');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (phoneError) {
                return; // Nếu có lỗi nhập liệu số điện thoại, không thực hiện gửi dữ liệu
            }
            // Thực hiện xử lý gửi dữ liệu
            const response = await axios.put(`${baseURL}${userRoutes}/${user._id}`, formData,{
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status == 201) {
                toast.success(response.data.message);
                onUpdateUser();
                onClose();
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
    const validatePhoneNumber = (phoneNumber) => {
        // Regex để kiểm tra số điện thoại
        const phoneRegex = /^[0-9]{10,11}$/;
        return phoneRegex.test(phoneNumber);
    };

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="mb-4">
                                <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Tên đăng nhập:</label>
                                <input placeholder="Mặc định là hotenSĐT không cách" type="text" id="username" name="username" value={formData.username} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Mật khẩu:</label>
                                <input placeholder='Mặc định là 1' type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="fullname" className="block text-gray-700 text-sm font-bold mb-2">Họ tên: <span className='text-red-500'>*</span></label>
                                <input type="text" id="fullname" name="fullname" value={formData.fullname} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required/>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="dateOfBirth" className="block text-gray-700 text-sm font-bold mb-2">Ngày sinh:</label>
                                <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="gender" className="block text-gray-700 text-sm font-bold mb-2">Giới tính:</label>
                                <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                    <option value="Male">Nam</option>
                                    <option value="Female">Nữ</option>
                                    <option value="Other">Khác</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Địa chỉ:</label>
                                <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">Số điện thoại: <span className='text-red-500'>*</span></label>
                                <input
                                    type="text" // Thay thế type "tel" bằng "text"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Nhập số điện thoại..."
                                    required
                                />
                                {phoneError && <p className="text-red-500 text-xs italic">{phoneError}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Nhập địa chỉ email..."
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">Vai trò:</label>
                                <select id="role" name="role" value={formData.role} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="user">User</option>
                                </select>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
                                Cập nhật
                            </button>
                            <button onClick={onClose} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditUserModal;
