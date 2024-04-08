import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL, userRoutes, weekScheduleRoutes } from '@/api/api';
import AddScheduleModal from '@/components/User/AddScheduleModel';

function User() {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [schedule, setSchedule] = useState(null)

    useEffect(() => {
        const currentDate = new Date();
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Set start of week to Monday
        const endOfWeek = new Date(currentDate);
        endOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 7); // Set end of week to Sunday
        const startDateString = startOfWeek.toISOString().slice(0, 10);
        const endDateString = endOfWeek.toISOString().slice(0, 10);

        setStartDate(startDateString);
        setEndDate(endDateString);

        fetchWeekScheduleForAllUsers(startDateString, endDateString);
    }, []);

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

    const fetchWeekScheduleForAllUsers = async (start, end) => {
        console.log(start)
        try {
            const response = await axios.get(`${baseURL}${weekScheduleRoutes}?startDate=${start}&endDate=${end}`);
            setSchedule(response.data);
            console.log("response", response.data)
        } catch (error) {
            console.error('Error fetching week schedules for all users:', error);
        }
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
            <div>
                <label htmlFor="start-date">Start Date:</label>
                <input type="date" id="start-date" value={startDate || ''} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
                <label htmlFor="end-date">End Date:</label>
                <input type="date" id="end-date" value={endDate || ''} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            {schedule && startDate && endDate && (
                <div>
                    <h2 className="text-lg font-semibold">Lịch làm việc của nhân viên</h2>
                    <table className="min-w-full divide-y divide-slate-400">
                        <thead className="bg-slate-200">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhân viên</th>
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                                    <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map(user => {
                                const userSchedule = schedule.find(item => item.user._id === user._id);
                                if (!userSchedule) return null; // Không có lịch làm việc cho người dùng này

                                return (
                                    <React.Fragment key={user._id}>
                                        {console.log("schedule", schedule)}
                                        {userSchedule.weeks.map((week, weekIndex) => {
                                            const weekStartDate = new Date(week.startDate);
                                            const weekEndDate = new Date(week.endDate);

                                            // Kiểm tra xem tuần này có trong khoảng start date và end date không
                                            if (weekEndDate >= new Date(startDate) && weekStartDate <= new Date(endDate)) {
                                                return (
                                                    <tr key={`${user._id}_${weekIndex}`}>
                                                        <td className="px-6 py-4 whitespace-nowrap">{user.fullname}</td>
                                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, dayIndex) => {
                                                            const dayShifts = week[day.toLowerCase()] || [];
                                                            return (
                                                                <td key={dayIndex} className="px-6 py-4 whitespace-nowrap">
                                                                    {dayShifts.length > 0 ? (
                                                                        <ul className="list-disc">
                                                                            {dayShifts.map((shift, shiftIndex) => (
                                                                                <li key={shiftIndex}>{shift.startTime} - {shift.endTime}</li>
                                                                            ))}
                                                                        </ul>
                                                                    ) : (
                                                                        <span>Không có ca làm việc</span>
                                                                    )}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                );
                                            } else {
                                                return null;
                                            }
                                        })}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* hiển thị danh sách nhân viên */}
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
