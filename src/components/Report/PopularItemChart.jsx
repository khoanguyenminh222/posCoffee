import React, { useState, useEffect } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import axios from 'axios';
import { Doughnut  } from 'react-chartjs-2';
import { baseURL, reportRoutes } from '@/api/api';

function PopularItemChart({token, date, period}) {
    const [popularItems, setPopularItems] = useState([]);
    useEffect(() => {
        fetchData();
    }, [period, date]);
    const fetchData = async () => {
        try {
            const response1 = await axios.get(`${baseURL}${reportRoutes}/popular-items/${period}?date=${date}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPopularItems(response1.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };
    const popularItemsData = {
        labels: popularItems.map(item => item._id),
        datasets: [{
            label: 'Quantity',
            data: popularItems.map(item => item.totalQuantity),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1
        }]
    };
    const options = {
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: true,
                text: 'Popular Items',
                font: {
                    size: 16,
                },
                position: 'top'
            }
        }
    };
  return (
        <div>
            <Doughnut data={popularItemsData} options={options}/>
        </div>
  )
}

export default PopularItemChart