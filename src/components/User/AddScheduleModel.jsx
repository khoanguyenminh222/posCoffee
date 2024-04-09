import React, { useState } from 'react';
import axios from 'axios';
import { baseURL, weekScheduleRoutes } from '@/api/api';

function AddScheduleModal({ user, onClose, onScheduleUpdated }) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [shifts, setShifts] = useState({
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
    });

    const handleSaveSchedule = async () => {
        console.log("userid",user._id)
        try {
            // Chuyển đổi kiểu dữ liệu của startDate và endDate sang kiểu Date
            const formattedStartDate = new Date(startDate);
            const formattedEndDate = new Date(endDate);
    
            // Tạo một đối tượng dữ liệu tuân thủ schema đã cung cấp
            const scheduleData = {
                userId: user._id,
                weeks: [{
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                    monday: shifts.monday.map(shift => ({ startTime: shift.startTime, endTime: shift.endTime })),
                    tuesday: shifts.tuesday.map(shift => ({ startTime: shift.startTime, endTime: shift.endTime })),
                    wednesday: shifts.wednesday.map(shift => ({ startTime: shift.startTime, endTime: shift.endTime })),
                    thursday: shifts.thursday.map(shift => ({ startTime: shift.startTime, endTime: shift.endTime })),
                    friday: shifts.friday.map(shift => ({ startTime: shift.startTime, endTime: shift.endTime })),
                    saturday: shifts.saturday.map(shift => ({ startTime: shift.startTime, endTime: shift.endTime })),
                    sunday: shifts.sunday.map(shift => ({ startTime: shift.startTime, endTime: shift.endTime })),
                }]
            };
            // Gửi đối tượng dữ liệu đã tạo lên máy chủ
            const response = await axios.post(`${baseURL}${weekScheduleRoutes}`, scheduleData);
            console.log("response",response)
            if(response.status==201){
                alert("Thêm thành công")
                onScheduleUpdated();
                onClose()
            }
            else{
                alert('Lỗi tạo mới lịch')
            }
            // Đóng modal sau khi lưu thành công
            onClose();
        } catch (error) {
            if(error.response.status==400){
                alert("Bạn đã thêm lịch cho người này ở tuần này rồi")
            }else{
                console.error('Error saving schedule:', error);
                alert("Error saving schedule")
            }
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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10 overflow-auto">
            <div className="bg-white p-4 rounded-lg max-w-6xl w-full max-h-full overflow-auto">
                <h2 className="text-lg font-semibold mb-2">Thêm lịch làm việc {user.fullname}</h2>
                <div className="flex flex-col mb-4">
                    <div className="flex space-x-4">
                        <div className="flex flex-col">
                            <label htmlFor="startDate" className="mb-1">Ngày bắt đầu:</label>
                            <input className='border border-gray-300 rounded-md focus:outline-none' type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="endDate" className="mb-1">Ngày kết thúc:</label>
                            <input className='border border-gray-300 rounded-md focus:outline-none' type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                    </div>
                </div>
                {/* Hiển thị form cho các ngày */}
                <div className="flex flex-wrap justify-between">
                    {Object.keys(shifts).map(day => (
                        <div key={day} className="w-full sm:w-auto mb-4">
                            <div className="bg-gray-100 p-4 rounded-md">
                                <h3 className="text-lg font-semibold mb-2">{day.charAt(0).toUpperCase() + day.slice(1)}</h3>
                                {shifts[day].map((shift, index) => (
                                    <div key={index} className="flex flex-col space-y-2">
                                        <div className="flex">
                                            <input
                                                type="time"
                                                value={shifts[day][0].startTime}
                                                onChange={(e) => {
                                                    const updatedShifts = { ...shifts };
                                                    updatedShifts[day][0].startTime = e.target.value;
                                                    setShifts(updatedShifts);
                                                }}
                                                placeholder="Giờ bắt đầu"
                                                className="border border-gray-300 rounded px-3 py-2 mr-2 w-32"
                                            />
                                            <input
                                                type="time"
                                                value={shifts[day][0].endTime}
                                                onChange={(e) => {
                                                    const updatedShifts = { ...shifts };
                                                    updatedShifts[day][0].endTime = e.target.value;
                                                    setShifts(updatedShifts);
                                                }}
                                                placeholder="Giờ kết thúc"
                                                className="border border-gray-300 rounded px-3 py-2 mr-2 w-32"
                                            />
                                        </div>
                                    </div>
                                ))}
                                {shifts[day].length === 0 && (
                                    <div className="flex flex-col space-y-2">
                                        <div className="flex">
                                            <input
                                                type="time"
                                                value={shifts[day]?.[0]?.startTime || ''}
                                                onChange={(e) => {
                                                    const updatedShifts = { ...shifts };
                                                    if (!updatedShifts[day]) {
                                                        updatedShifts[day] = [{ startTime: '', endTime: '' }];
                                                    } else if (!updatedShifts[day][0]) {
                                                        updatedShifts[day][0] = { startTime: '', endTime: '' };
                                                    }
                                                    updatedShifts[day][0].startTime = e.target.value;
                                                    setShifts(updatedShifts);
                                                }}
                                                placeholder="Giờ bắt đầu"
                                                className="border border-gray-300 rounded px-3 py-2 mr-2 w-32"
                                            />
                                            <input
                                                type="time"
                                                value={shifts[day]?.[0]?.endTime || ''}
                                                onChange={(e) => {
                                                    const updatedShifts = { ...shifts };
                                                    if (!updatedShifts[day]) {
                                                        updatedShifts[day] = [{ startTime: '', endTime: '' }];
                                                    } else if (!updatedShifts[day][0]) {
                                                        updatedShifts[day][0] = { startTime: '', endTime: '' };
                                                    }
                                                    updatedShifts[day][0].endTime = e.target.value;
                                                    setShifts(updatedShifts);
                                                }}
                                                placeholder="Giờ kết thúc"
                                                className="border border-gray-300 rounded px-3 py-2 mr-2 w-32"
                                            />

                                        </div>
                                    </div>
                                )}
                                <button className="text-blue-500 mt-2" onClick={() => addShift(day)}>Thêm thời gian</button>
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

export default AddScheduleModal;
