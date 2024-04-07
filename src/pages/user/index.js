import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL, userRoutes, weekScheduleRoutes } from '@/api/api';
import AddScheduleModal from '@/components/User/AddScheduleModel';

function User() {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [weekSchedules, setWeekSchedules] = useState([]);

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
        const fetchWeekSchedules = async () => {
            try {
                const responses = await Promise.all(users.map(user => axios.get(`${baseURL}${weekScheduleRoutes}/${user._id}`)));
                const schedules = responses.map(response => response.data);
                setWeekSchedules(schedules);
            } catch (error) {
                console.error('Error fetching week schedules:', error);
            }
        };
        fetchUsers();
        fetchWeekSchedules();
    }, [users]);

    return (
        <div className="container mx-auto max-h-full bg-white p-6">
            <h1 className="text-3xl font-semibold my-4">Ca làm việc của nhân viên 1 tuần</h1>
            {/* hiển thị lịch làm việc cùng thời gian */}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhân viên</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thứ 2</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thứ 3</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thứ 4</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thứ 5</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thứ 6</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thứ 7</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chủ nhật</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user, userIndex) => (
                        <tr key={user._id}>
                            <td className="px-6 py-4 whitespace-nowrap">{user.fullname}</td>
                            {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => (
                                <td key={dayIndex} className="px-6 py-4 whitespace-nowrap">
                                    {weekSchedules[userIndex] && weekSchedules[userIndex].weeks[0][dayIndex].length > 0 ? (
                                        <div>
                                            {weekSchedules[userIndex].weeks[0][dayIndex].map(schedule => (
                                                <div key={schedule._id}>
                                                    {schedule.startTime} - {schedule.endTime}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div>Không có lịch</div>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* hiên thị danh sách nhân viên*/}
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
