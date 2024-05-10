import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { baseURL, billRoutes } from '@/api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function Detail({ token, historyDetail, onCancel }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await axios.get(`${baseURL}${billRoutes}/${historyDetail}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHistory(response.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        };
        fetchDetail();
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-md shadow-md w-96 relative">
                <h2 className="text-2xl font-semibold mb-4">Chi tiết hóa đơn</h2>
                {loading && <p className="text-center">Loading...</p>}
                {!loading && history && (
                    <>
                        <p className="mb-2"><strong>Tổng số tiền:</strong> {history.totalAmount.toLocaleString('vi-VN')} đ</p>
                        <p className="mb-2 text-sm">Ngày tạo: {format(new Date(history.createdAt), 'dd/MM/yyyy HH:mm:ss')}</p>
                        <ul>
                            {history.drinks.map((drink, index) => (
                                <li key={index} className="mb-4">
                                    <p className="font-semibold">{drink.name}</p>
                                    <p><strong>Số lượng:</strong> {drink.quantity}</p>
                                    <p><strong>Giá:</strong> {drink.price.toLocaleString('vi-VN')} đ</p>
                                    {Object.keys(drink.options).length > 0 && (
                                        <p><strong>Tuỳ chọn:</strong> {Object.entries(drink.options).map(([key, value]) => {
                                            if (key && value) {
                                                return `${key}: ${value}`;
                                            }
                                        }).filter(Boolean).join(', ')}</p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                <button onClick={onCancel} className="absolute bottom-2 right-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center justify-center">
                    <FontAwesomeIcon icon={faTimes} className="mr-2" />
                    Đóng
                </button>
            </div>
        </div>
    );
}

export default Detail;
