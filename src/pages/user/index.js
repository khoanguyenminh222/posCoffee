import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL, userRoutes, weekScheduleRoutes } from '@/api/api';
import AddScheduleModal from '@/components/User/AddScheduleModel';

function User() {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleAddSchedule = (user) => {
        if (user) {
            setSelectedUser(user);
            setShowModal(true);
        } else {
            console.error('userId is null');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${baseURL}${userRoutes}`);
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="container mx-auto max-h-full bg-white p-6">
            <h1 className="text-3xl font-semibold my-4">Ca làm việc của nhân viên 1 tuần</h1>
            {/* hiển thị lịch làm việc cảu nhân viên */}
            <h1 className="text-3xl font-semibold my-4">Danh sách nhân viên</h1>
            <table className="min-w-full divide-y divide-slate-400">
                <thead className="bg-slate-200">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tài khoản</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điện thoại</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giới tính</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ca</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(user => (
                        <tr key={user._id} className='cursor-pointer'>
                            <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.fullname}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.phoneNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.gender}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.shift}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                            <td>
                                <button className="bg-green-500 text-white px-4 py-2 rounded-lg" onClick={() => handleAddSchedule(user)}>Thêm lịch làm việc</button>
                                {showModal && <AddScheduleModal user={selectedUser} onClose={handleCloseModal} />}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default User;
