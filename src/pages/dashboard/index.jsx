import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar, Line } from 'react-chartjs-2';
import { baseURL, reportRoutes } from '@/api/api';

function Dashboard() {
    const [period, setPeriod] = useState('all');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [popularItems, setPopularItems] = useState([]);
    const [revenue, setRevenue] = useState([]);
    const [itemsSold, setItemsSold] = useState([]);

    useEffect(() => {
        fetchData();
    }, [period, selectedDate]);
  
    const fetchData = async () => {
        try {
            const response1 = await axios.get(`${baseURL}${reportRoutes}/popular-items/${period}?date=${date}`);
            setPopularItems(response1.data);

            const response2 = await axios.get(`${baseURL}${reportRoutes}/revenue/${period}?date=${date}`);
            setRevenue(response2.data);

            const response3 = await axios.get(`${baseURL}${reportRoutes}/items-sold/${period}?date=${date}`);
            setItemsSold(response3.data);
            console.log("re", response2)
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const handlePeriodChange = (e) => {
        setPeriod(e.target.value);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    // Thiết lập dữ liệu cho biểu đồ
    const popularItemsData = {
        labels: popularItems.map(item => item._id),
        datasets: [{
            label: 'Quantity',
            data: popularItems.map(item => item.totalQuantity),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };
    const revenueData = {
        labels: revenue.map(item=>item._id), // Thêm nhãn cho trục x
        datasets: [
            {
                label: 'Revenue',
                data: revenue.map(item=>item.totalRevenue),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ]
    };

    const itemsSoldData = {
        labels: itemsSold.map(item => item._id),
        datasets: [{
            label: 'Quantity',
            data: itemsSold.map(item => item.totalQuantity),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };
    return (
        <div className="container mx-auto mt-8 px-4">
            <h1 className="text-3xl font-semibold mb-8">Dashboard</h1>

            <div className="flex flex-wrap mb-4">
                <div className="mb-4 mr-4">
                    <label htmlFor="period" className="mr-2">Period:</label>
                    <select id="period" className="border rounded px-2 py-1" value={period} onChange={handlePeriodChange}>
                        <option value="day">Day</option>
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                        <option value="year">Year</option>
                        <option value="all">All</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="date" className="mr-2">Date:</label>
                    <DatePicker className="border rounded px-2 py-1" id="date" selected={selectedDate} onChange={handleDateChange} />
                </div>
            </div>

            <div className="flex flex-wrap mx-4">
                <div className="w-full px-4 mb-8">
                    <div className="bg-white shadow-md rounded-md p-6 mb-4">
                        <h2 className="text-xl font-semibold mb-4">Popular Items</h2>
                        <Bar data={popularItemsData} />
                    </div>

                    <div className="flex flex-wrap -mx-4">
                        <div className="w-full sm:w-1/2 lg:w-1/2 px-4 mb-8">
                            <div className="bg-white shadow-md rounded-md p-6">
                                <h2 className="text-xl font-semibold mb-4">Revenue</h2>
                                <Line data={revenueData} />
                            </div>
                        </div>

                        <div className="w-full sm:w-1/2 lg:w-1/2 px-4 mb-8">
                            <div className="bg-white shadow-md rounded-md p-6">
                                <h2 className="text-xl font-semibold mb-4">Items Sold</h2>
                                <Bar data={itemsSoldData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
