import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Bar, Line } from 'react-chartjs-2';
import { baseURL, reportRoutes } from '@/api/api';

function Dashboard() {
    const [period, setPeriod] = useState('day');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [popularItems, setPopularItems] = useState([]);
    const [revenue, setRevenue] = useState(0);
    const [itemsSold, setItemsSold] = useState([]);

    useEffect(() => {
        fetchData();
    }, [period, selectedDate]);

    const fetchData = async () => {
        try {
            const response1 = await axios.post(`${baseURL}${reportRoutes}/popular-items/${period}`, { date: selectedDate });
            setPopularItems(response1.data);

            const response2 = await axios.post(`${baseURL}${reportRoutes}/revenue/${period}`, { date: selectedDate });
            setRevenue(response2.data.length ? response2.data[0].totalRevenue : 0);

            const response3 = await axios.post(`${baseURL}${reportRoutes}/items-sold/${period}`, { date: selectedDate });
            setItemsSold(response3.data);
            console.log(response1)
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
        labels: ['Total Revenue'], // Thêm nhãn cho trục x
        datasets: [{
            label: 'Revenue',
            data: [revenue],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
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
        <div className="container mx-auto mt-8">
            <h1 className="text-3xl font-semibold mb-4">Dashboard</h1>

            <div className="mb-4">
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
                <DatePicker id="date" selected={selectedDate} onChange={handleDateChange} />
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Popular Items</h2>
                <Bar data={popularItemsData} />
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Revenue</h2>
                <Line data={revenueData} />
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-2">Items Sold</h2>
                <Bar data={itemsSoldData} />
            </div>
        </div>
    );
}

export default Dashboard;
