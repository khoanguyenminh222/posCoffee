import React, { useState, useEffect } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { baseURL, reportRoutes } from '@/api/api';

function ItemSoldChart({ token, date, period }) {
    const [itemsSold, setItemsSold] = useState([]);
    useEffect(() => {
        fetchData();
    }, [period, date]);
    const fetchData = async () => {
        try {
            const response = await axios.get(`${baseURL}${reportRoutes}/items-sold/${period}?date=${date}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setItemsSold(response.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }

    };
    const itemsSoldData = {
        labels: itemsSold.map(item => item._id),
        datasets: [{
            label: 'Quantity',
            data: itemsSold.map(item => item.totalQuantity),
            backgroundColor: 'rgba(54, 162, 235, 0.6)', // Màu nền của thanh cột
            borderColor: 'rgba(54, 162, 235, 1)', // Màu viền của thanh cột
            borderWidth: 2, // Độ dày của viền
        }]
    };
    const options = {
        scales: {
            x: {
                stacked: true,
                grid: {
                    display: false // Ẩn lưới trên trục x
                }
            },
            y: {
                stacked: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)' // Màu của lưới trên trục y
                },
                ticks: {
                    font: {
                        family: 'Arial', // Font chữ
                        size: 14 // Kích thước font chữ
                    }
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    font: {
                        family: 'Arial',
                        size: 16
                    }
                }
            }
        }
    };
    return (
        <div>
            <h2>Biểu đồ đồ uống đã bán</h2>
            <Bar data={itemsSoldData} options={options}/>
        </div>
    )
}

export default ItemSoldChart