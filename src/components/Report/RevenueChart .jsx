import React, { useState, useEffect } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { baseURL, reportRoutes } from '@/api/api';

function RevenueChart({token, date}) {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Revenue',
                data: [],
                backgroundColor: '#064FF0',
                borderColor: '#064FF0',
            },
            {
                label: 'Cost',
                data: [],
                backgroundColor: '#FF3030',
                borderColor: '#FF3030',
            },
        ],
    });

    useEffect(() => {
        fetchData();
    }, [date]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${baseURL}${reportRoutes}/monthly/${date}`,{
                headers: { Authorization: `Bearer ${token}` }
            });
            const monthlyData = response.data;

            const labels = monthlyData.map(data => data.month);
            const revenueData = monthlyData.map(data => data.revenue);
            const costData = monthlyData.map(data => data.expenses);

            setChartData(prevState => ({
                ...prevState,
                labels: labels,
                datasets: [
                    {
                        ...prevState.datasets[0],
                        data: revenueData,
                    },
                    {
                        ...prevState.datasets[1],
                        data: costData,
                    },
                ],
            }));
        } catch (error) {
            console.error('Lỗi:', error.message);
        }
    };
    const options = { 
        elements: { line: { tension: 0.5 } }, 
        plugins: { 
            title: {
                display: true,
                text: 'Doanh thu và chi phí',
                font: {
                    size: 16,
                },
                position: 'top'
            }
        } 
        
    }
    return (
        <div>
            <Line data={chartData} options={options} />
        </div>
    );
}
export default RevenueChart;
