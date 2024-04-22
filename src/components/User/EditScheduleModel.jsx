import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL, weekScheduleRoutes } from '@/api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function EditScheduleModal({ token, user, onClose, onScheduleUpdated, startDate, endDate }) {
    const [shifts, setShifts] = useState({
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
    });

    useEffect(() => {
        const fetchWeekScheduleForUser = async (startDate, endDate) => {
            try {
                const response = await axios.get(`${baseURL}${weekScheduleRoutes}/${user._id}?startDate=${startDate}&endDate=${endDate}`,{
                    headers: { Authorization: `Bearer ${token}` }
                });
                const schedule = response.data;
                // Lấy thông tin lịch làm việc hiện tại của người dùng và cập nhật state
                if (schedule.weeks.length > 0) {
                    const currentWeek = schedule.weeks[0];
                    setShifts(currentWeek);
                }
            } catch (error) {
                console.error('Error fetching week schedule for user:', error);
            }
        };
        fetchWeekScheduleForUser(startDate, endDate); // Truyền startDate và endDate vào hàm fetchWeekScheduleForUser
    }, [user._id]); // Thêm startDate và endDate vào dependencies để useEffect re-run khi chúng thay đổi


    const handleSaveSchedule = async () => {
        try {
            const scheduleData = {
                user: user._id,
                startDay: startDate,
                endDay: endDate,
                newWeeks: {
                    monday: shifts.monday,
                    tuesday: shifts.tuesday,
                    wednesday: shifts.wednesday,
                    thursday: shifts.thursday,
                    friday: shifts.friday,
                    saturday: shifts.saturday,
                    sunday: shifts.sunday,
                }
            };
            const response = await axios.put(`${baseURL}${weekScheduleRoutes}/${user._id}`, scheduleData,{
                headers: { Authorization: `Bearer ${token}` }
            });
            if(response.status == 201){
                alert("Cập nhật thành công")
                onClose();
                onScheduleUpdated();
            }else{
                alert("Lỗi cập nhật")
            }
        } catch (error) {
            console.error('Error saving schedule:', error);
            alert("Error saving schedule")
        }
    };

    const addShift = (day) => {
        const updatedShifts = { ...shifts };
        if (!updatedShifts[day]) {
            updatedShifts[day] = []; // Khởi tạo mảng nếu chưa tồn tại
        }

        // Kiểm tra xem mảng shifts[day] có ít nhất một phần tử hay không
        if (updatedShifts[day].length === 0 || (updatedShifts[day].length > 0 && updatedShifts[day][0].startTime && updatedShifts[day][0].endTime)) {
            // Nếu mảng không có phần tử hoặc đã có thời gian bắt đầu và kết thúc được chọn, thêm một shift mới
            updatedShifts[day].push({ startTime: '', endTime: '' });
            setShifts(updatedShifts);
        } else {
            // Nếu chưa chọn thời gian bắt đầu hoặc kết thúc, hiển thị cảnh báo hoặc không thực hiện hành động gì
            console.log('Vui lòng chọn thời gian bắt đầu và kết thúc trước khi thêm thời gian mới.');
        }
    };

    const removeShift = (day, index) => {
        const updatedShifts = { ...shifts };
        updatedShifts[day.toLowerCase()].splice(index, 1);
        setShifts(updatedShifts);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10 overflow-auto">
            <div className="bg-white p-4 rounded-lg max-w-6xl w-full max-h-full overflow-auto">
                <h2 className="text-lg font-semibold mb-2">Chỉnh sửa lịch làm việc của {user.fullname}</h2>
                <div className="flex flex-col mb-4">
                    <div className="flex space-x-4">
                        <div className="flex flex-col">
                            <label htmlFor="startDate" className="mb-1">Ngày bắt đầu:</label>
                            <input type="date" id="startDate" value={startDate} readOnly />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="endDate" className="mb-1">Ngày kết thúc:</label>
                            <input type="date" id="endDate" value={endDate} readOnly />
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap justify-between">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                        <div key={day} className="w-full sm:w-auto mb-4">
                            <div className="bg-gray-100 p-4 rounded-md">
                                <h3 className="text-lg font-semibold mb-2">
                                    {day === 'Monday' && 'Thứ Hai'}
                                    {day === 'Tuesday' && 'Thứ Ba'}
                                    {day === 'Wednesday' && 'Thứ Tư'}
                                    {day === 'Thursday' && 'Thứ Năm'}
                                    {day === 'Friday' && 'Thứ Sáu'}
                                    {day === 'Saturday' && 'Thứ Bảy'}
                                    {day === 'Sunday' && 'Chủ Nhật'}
                                </h3>
                                {shifts[day.toLowerCase()] && shifts[day.toLowerCase()].map((shift, index) => (
                                    <div key={index} className="flex flex-col space-y-2">
                                        <div className="flex">
                                            <input
                                                type="time"
                                                value={shift.startTime}
                                                onChange={(e) => {
                                                    const updatedShifts = { ...shifts };
                                                    updatedShifts[day.toLowerCase()][index].startTime = e.target.value;
                                                    setShifts(updatedShifts);
                                                }}
                                                placeholder="Giờ bắt đầu"
                                                className="border border-gray-300 rounded px-3 py-2 mr-2 w-32"
                                            />
                                            <input
                                                type="time"
                                                value={shift.endTime}
                                                onChange={(e) => {
                                                    const updatedShifts = { ...shifts };
                                                    updatedShifts[day.toLowerCase()][index].endTime = e.target.value;
                                                    setShifts(updatedShifts);
                                                }}
                                                placeholder="Giờ kết thúc"
                                                className="border border-gray-300 rounded px-3 py-2 mr-2 w-32"
                                            />
                                            <FontAwesomeIcon icon={faTrash} className="text-red-500 mt-2 cursor-pointer" onClick={() => removeShift(day.toLowerCase(), index)} />
                                        </div>
                                    </div>
                                ))}

                                <button className="text-blue-500 mt-2" onClick={() => addShift(day.toLowerCase())}>Thêm thời gian</button>

                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end mt-4">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2" onClick={handleSaveSchedule}>Lưu</button>
                    <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg" onClick={onClose}>Hủy</button>
                </div>
            </div>
        </div>
    );
}

export default EditScheduleModal;
