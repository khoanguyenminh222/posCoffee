import React, { useState, useEffect } from 'react';
import { getServerSideProps } from '@/helpers/cookieHelper';
import RevenueChart from '@/components/Report/RevenueChart ';
import PopularItemChart from '@/components/Report/PopularItemChart';
import ItemSoldChart from '@/components/Report/ItemSoldChart';

function Dashboard({ token }) {
    const [period, setPeriod] = useState('all');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

    const handlePeriodChange = (e) => {
        setPeriod(e.target.value);
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };
    return (
        <div className="container mx-auto mt-8 px-4 py-8">
            <h1 className="text-3xl font-semibold mb-8">Dashboard</h1>
            <div className="flex flex-wrap mb-4">
                <div className="mb-4 mr-4">
                    <label htmlFor="period" className="mr-2">Chọn khoảng thời gian:</label>
                    <select id="period" className="border rounded px-2 py-1 outline-none" value={period} onChange={handlePeriodChange}>
                        <option value="day">Ngày</option>
                        <option value="week">Tuần</option>
                        <option value="month">Tháng</option>
                        <option value="year">Năm</option>
                        <option value="all">Tất cả</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="date" className="mr-2">Chọn ngày:</label>
                    <input type="date" className="border rounded px-2 py-1 outline-none" id="date" value={selectedDate} onChange={handleDateChange} />
                </div>
            </div>
            <div className="flex flex-wrap mb-8 justify-between">
                <div className="lg:flex flex-col w-full lg:w-5/12">
                    <div className="bg-white mb-5 shadow-md rounded-md p-6 flex-grow">
                        <RevenueChart token={token} date={selectedDate} />
                    </div>
                    <div className="bg-white shadow-md rounded-md p-6 flex-grow">
                        <ItemSoldChart token={token} date={selectedDate} period={period} />
                    </div>
                </div>
                <div className="hidden lg:block lg:w-1/12"></div> {/* Thêm một div trống để tạo khoảng cách */}
                <div className="w-full lg:w-6/12">
                    <div className="bg-white shadow-md rounded-md p-6">
                        <PopularItemChart token={token} date={selectedDate} period={period} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export { getServerSideProps };
export default Dashboard;
