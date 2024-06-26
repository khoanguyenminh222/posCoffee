import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faUserPlus, faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { baseURL, userRoutes, weekScheduleRoutes } from '@/api/api';
import AddScheduleModal from '@/components/User/AddScheduleModel';
import EditScheduleModel from '@/components/User/EditScheduleModel';
import AddUserModal from '@/components/User/AddUserModel';
import EditUserModal from '@/components/User/EditUserModel';
import { getServerSideProps } from '@/helpers/cookieHelper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function User({ token }) {
    const [users, setUsers] = useState([]);
    const [usersOfSchedule, setUsersOfSchedule] = useState([]);
    const [showModalAddSchedule, setShowModalAddSchedule] = useState(false);
    const [showModalEditSchedule, setShowModalEditSchedule] = useState(false);
    const [showModalAddUser, setShowModalAddUser] = useState(false);
    const [showModalEditUser, setShowModalEditUser] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [schedule, setSchedule] = useState(null)
    const [scheduleUpdated, setScheduleUpdated] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(7); // Số lượng nhân viên trên mỗi trang
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');


    const handleAddUser = () => {
        // Hiển thị modal hoặc form để tạo mới nhân viên
        setShowModalAddUser(true);
    };
    const handleEditModelUser = (user) => {
        if (user) {
            setSelectedUser(user);
            setShowModalEditUser(true)
        } else {
            console.error('userId is null');
        }
    };
    const handleCloseEditModelUser = () => {
        setShowModalEditUser(false)
    };
    const handleCloseAddModelUser = () => {
        setShowModalAddUser(false);
    };

    const handleDeleteUser = async (user) => {
        if (window.confirm(`Bạn có muốn xoá ${user.fullname}?`)) {
            try {
                const response = await axios.delete(`${baseURL}${userRoutes}/${user._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.status === 201) {
                    toast.success(response.data.message);
                    handleUserUpdated();
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
    const handleUserUpdated = async () => {
        try {
            const response = await axios.get(`${baseURL}${userRoutes}`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    page: currentPage,
                    pageSize: pageSize
                }
            });
            setUsers(response.data.users);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };


    const handleScheduleUpdated = () => {
        setScheduleUpdated(true);
    };

    const handleAddSchedule = (user) => {
        if (user) {
            setSelectedUser(user);
            setShowModalAddSchedule(true);
        } else {
            console.error('userId is null');
        }
    };

    const handleEditSchedule = (user) => {
        if (user) {
            setSelectedUser(user);
            setShowModalEditSchedule(true);
        } else {
            console.error('userId is null');
        }
    };

    const handleCloseAddModalSchedule = () => {
        setShowModalAddSchedule(false);
        setSelectedUser(null);
    };

    const handleCloseEditModalSchedule = () => {
        setShowModalEditSchedule(false);
        setSelectedUser(null);
    };

    const handelDeleteSchedule = async (user) => {
        if (window.confirm(`Bạn có muốn xoá lịch ${startDate}-${endDate} của ${user.fullname}?`)) {
            try {
                const response = await axios.delete(`${baseURL}${weekScheduleRoutes}/${user._id}?startDate=${startDate}&endDate=${endDate}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.status === 201) {
                    toast.success(response.data.message);
                    fetchWeekScheduleForAllUsers(startDate, endDate);
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
    useEffect(() => {
        const fetchUsersOfSchedule = async () => {
            try {
                const response = await axios.get(`${baseURL}${userRoutes}/getAll`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsersOfSchedule(response.data);
            } catch (error) {
                console.error('Error fetching all users:', error);
            }
        }
        fetchUsersOfSchedule();
    },[])

    useEffect(() => {
        if (scheduleUpdated) {
            fetchWeekScheduleForAllUsers(startDate, endDate);
        }
    }, [scheduleUpdated, startDate, endDate]);

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

    const fetchWeekScheduleForAllUsers = async (start, end) => {
        try {
            const response = await axios.get(`${baseURL}${weekScheduleRoutes}?startDate=${start}&endDate=${end}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSchedule(response.data);
            setScheduleUpdated(false);
        } catch (error) {
            console.error('Error fetching week schedules for all users:', error);
        }
    };

    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);

        // Tính toán và cập nhật endDate bằng cách cộng thêm 7 ngày
        const startDateObj = new Date(newStartDate);
        const newEndDate = new Date(startDateObj.getTime()); // Copy giá trị của newStartDate
        newEndDate.setDate(newEndDate.getDate() + 6); // Add 6 days to get end of week
        setEndDate(newEndDate.toISOString().slice(0, 10));
        setScheduleUpdated(true);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
        setScheduleUpdated(true);
    };


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${baseURL}${userRoutes}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        page: currentPage,
                        pageSize: pageSize
                    }
                });
                setUsers(response.data.users);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, [currentPage, pageSize]);
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

    const handleSearch = async () => {
        try {
            const response = await axios.get(`${baseURL}${userRoutes}`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    page: currentPage,
                    pageSize: pageSize,
                    searchTerm: searchTerm // Thêm searchTerm vào yêu cầu API
                }
            });
            setUsers(response.data.users);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };
    // Sử dụng useEffect để gọi hàm handleSearch khi searchTerm thay đổi
    useEffect(() => {
        handleSearch();
    }, [searchTerm]);

    return (
        <div className="container mx-auto max-h-full px-4 py-8 flex flex-col overflow-x-auto">
            <div className="bg-white rounded-lg p-4 mb-4">
                <h1 className="text-3xl font-semibold my-4">Ca làm việc của nhân viên 1 tuần</h1>
                <div className='flex mb-4'>
                    <div className="items-center mr-4">
                        <label className="mr-2" htmlFor="start-date">Từ ngày:</label>
                        <input className="w-32 lg:w-full p-2 border border-gray-300 rounded-md focus:outline-none" type="date" id="start-date" value={startDate ? startDate : ''} onChange={handleStartDateChange} />
                    </div>
                    <div className="items-center">
                        <label className="mr-2" htmlFor="end-date">Đến ngày:</label>
                        <input className="w-32 lg:w-full p-2 border border-gray-300 rounded-md focus:outline-none" type="date" id="end-date" value={endDate ? endDate : ''} onChange={handleEndDateChange} />
                    </div>
                </div>
                <div className="flex flex-col overflow-x-auto">
                    {schedule && startDate && endDate && (
                        <div className="flex-1 mr-4 block max-h-96">
                            <h2 className="text-lg font-semibold">Lịch làm việc của nhân viên</h2>
                            <table className="min-w-full divide-y divide-slate-400">
                                <thead className="bg-slate-200 sticky top-0">
                                    <tr>
                                        <th scope="col" className="sticky left-0 z-1 px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-blue-600">Nhân viên</th>
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                                            <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                                {day === 'Monday' && 'Thứ Hai'}
                                                {day === 'Tuesday' && 'Thứ Ba'}
                                                {day === 'Wednesday' && 'Thứ Tư'}
                                                {day === 'Thursday' && 'Thứ Năm'}
                                                {day === 'Friday' && 'Thứ Sáu'}
                                                {day === 'Saturday' && 'Thứ Bảy'}
                                                {day === 'Sunday' && 'Chủ Nhật'}
                                            </th>
                                        ))}
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 overflow-y-auto">
                                    {usersOfSchedule.map((user, index) => {
                                        const userSchedule = schedule.find(item => item.user._id === user._id);
                                        if (!userSchedule) return null; // Không có lịch làm việc cho người dùng này

                                        return userSchedule.weeks.map((week, weekIndex) => {
                                            const weekStartDate = new Date(week.startDate);
                                            const weekEndDate = new Date(week.endDate);

                                            // Kiểm tra xem tuần này có trong khoảng start date và end date không
                                            if (weekEndDate >= new Date(startDate) && weekStartDate <= new Date(endDate)) {
                                                return (
                                                    <tr key={`${user._id}_${week.startDate}`}>
                                                        <td className="sticky left-0 z-1 px-6 py-4 font-medium tracking-wider text-black bg-blue-200 whitespace-nowrap">{user.fullname}</td>
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
                                                                        <span>.</span>
                                                                    )}
                                                                </td>
                                                            );
                                                        })}
                                                        <td>
                                                            <button onClick={() => handelDeleteSchedule(user)} className="mr-2 focus:outline-none">
                                                                <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 hover:text-red-600" />
                                                            </button>
                                                            <button onClick={() => handleEditSchedule(user)} className="focus:outline-none">
                                                                <FontAwesomeIcon icon={faEdit} className="text-blue-500 hover:text-blue-600" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            } else {
                                                return null;
                                            }
                                        });
                                    })}
                                </tbody>

                            </table>
                        </div>
                    )}
                </div>
            </div>
            {/* hiển thị danh sách nhân viên */}
            <div className="flex-1 bg-white rounded-lg p-4">
                <h1 className="text-3xl font-semibold my-4">Danh sách nhân viên</h1>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    {/* Thêm thanh tìm kiếm */}
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="p-2 border border-gray-300 rounded-md mb-2 sm:mb-0 sm:mr-2 focus:outline-none"
                    />
                    <button
                        onClick={handleAddUser}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded whitespace-nowrap"
                    >
                        <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                        Tạo mới nhân viên
                    </button>
                </div>
                <div className="overflow-auto block max-h-96">
                    <table className="min-w-full divide-y divide-slate-400">
                        <thead className="bg-slate-200 sticky top-0 z-10">
                            <tr>
                                <th scope="col" className="sticky left-0 z-1 px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-blue-600 whitespace-nowrap">Họ tên</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Điện thoại</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Giới tính</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Vai trò</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 overflow-y-auto">
                            {users.map(user => (
                                <tr key={`${user._id}`} className='cursor-pointer'>
                                    <td className="sticky left-0 z-1 px-6 py-4 font-medium tracking-wider text-black bg-blue-200 whitespace-nowrap">{user.fullname}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.phoneNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.gender}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                                    <td>
                                        <button onClick={() => handleDeleteUser(user)} className="mr-2 focus:outline-none">
                                            <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 hover:text-red-600" />
                                        </button>
                                        <button onClick={() => handleEditModelUser(user)} className="focus:outline-none">
                                            <FontAwesomeIcon icon={faEdit} className="text-blue-500 hover:text-blue-600" />
                                        </button>
                                    </td>
                                    <td>
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded whitespace-nowrap" onClick={() => handleAddSchedule(user)}>
                                            <FontAwesomeIcon icon={faCalendarDay} className="mr-2" />
                                            Tạo lịch
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center mt-4">
                    <button onClick={handlePreviousPage} disabled={currentPage === 1} className="mr-2 px-3 py-1 bg-gray-200 rounded-md focus:outline-none">Trang trước</button>
                    <span className="mx-2">Trang {currentPage} / {totalPages}</span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages} className="ml-2 px-3 py-1 bg-gray-200 rounded-md focus:outline-none">Trang sau</button>
                </div>
                {/* Hiển thị model thêm lịch cho nhân viên */}
                {showModalAddSchedule && <AddScheduleModal token={token} user={selectedUser} onClose={handleCloseAddModalSchedule} onScheduleUpdated={handleScheduleUpdated} />}
                {/* Hiển thị modal chỉnh sửa lịch khi đã chọn một người dùng */}
                {showModalEditSchedule && <EditScheduleModel token={token} user={selectedUser} onClose={handleCloseEditModalSchedule} onScheduleUpdated={handleScheduleUpdated} startDate={startDate} endDate={endDate} />}
                {/* Hiển thị model thêm nhân viên */}
                {showModalAddUser && <AddUserModal token={token} onClose={handleCloseAddModelUser} onUpdateUser={handleUserUpdated} />}
                {/* Hiển thị model chỉnh sửa nhân viên */}
                {showModalEditUser && <EditUserModal token={token} user={selectedUser} onClose={handleCloseEditModelUser} onUpdateUser={handleUserUpdated} />}
            </div>
            <ToastContainer/>
        </div>
    );
}

export { getServerSideProps };
export default User;
