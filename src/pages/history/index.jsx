import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { baseURL, historyRoutes, userRoutes } from '@/api/api';

function History() {
    const [period, setPeriod] = useState("day");
    const [userId, setUserId] = useState("");
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [totalAmountSum, setTotalAmountSum] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [showFullId, setShowFullId] = useState(false);
    const [billCode, setBillCode] = useState('');

    const handleBillCodeChange = (e) => {
        setBillCode(e.target.value);
    };
    const toggleShowFullId = () => {
        setShowFullId(!showFullId);
    };
    const shortenId = (id) => {
        if (!showFullId) {
            return id.substring(0, 3) + '...' + id.substring(id.length - 3);
        }
        return id;
    };
    async function fetchTransactions(period, userId, page, date, billCode) {
        try {
            let apiURL = `${baseURL}${historyRoutes}/${period}`;
            if (userId !== "") {
                apiURL += `/${userId}`;
            }
            apiURL += `?date=${date}&page=${page}&pageSize=${pageSize}&billCode=${billCode}`;

            const response = await axios.get(apiURL);
            const { transactions, totalAmountSum, totalPages, currentPage } = response.data;
            setTransactions(transactions);
            setTotalAmountSum(totalAmountSum);
            setTotalPages(totalPages);
            setCurrentPage(currentPage);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    }

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${baseURL}${userRoutes}/getAll`);
            setUsers(response.data);
        } catch (error) {
            console.log('Error fetching users:', error);
        }
    }

    // Fetch transactions when component mounts
    useEffect(() => {
        fetchTransactions(period, userId, currentPage, selectedDate, billCode);
    }, [period, userId, currentPage, selectedDate, billCode]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const handlePeriodChange = (e) => {
        setPeriod(e.target.value);
        setCurrentPage(1); // Reset page when period changes
    };

    const handleUserChange = (e) => {
        setUserId(e.target.value);
        setCurrentPage(1); // Reset page when user changes
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

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

    return (
        <div className="container mx-auto px-4 py-8 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold mb-4">Lịch sửa giao dịch</h1>
                <div className="mb-4 flex items-center">
                    <label htmlFor="period" className="mr-2">Lọc:</label>
                    <select id="period" className="border rounded px-2 py-1" value={period} onChange={handlePeriodChange}>
                        <option value="day">Ngày</option>
                        <option value="week">Tuần</option>
                        <option value="month">Tháng</option>
                        <option value="year">Năm</option>
                        <option value="all">All</option>
                    </select>
                </div>
                <div className="mb-4 flex items-center"> {/* Add select for user */}
                    <label htmlFor="user" className="mr-2">Nhân viên:</label>
                    <select id="user" className="border rounded px-2 py-1" value={userId} onChange={handleUserChange}>
                        <option value="">Chọn nhân viên</option>
                        {users.map(user => (
                            <option key={user._id} value={user._id}>{user.fullname}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <label htmlFor="date" className="mr-2">Ngày:</label>
                        <div className="border rounded px-2 py-1">
                            <DatePicker className='hover:outline-none focus:outline-none' id="date" selected={selectedDate} onChange={handleDateChange} />
                        </div>
                    </div>
                    <div className="relative w-3/12">
                        <label htmlFor="billCode" className="sr-only">Mã hóa đơn:</label>
                        <div className="flex items-center border rounded px-3 py-1">
                            <input
                                type="text"
                                id="billCode"
                                className="flex-grow focus:outline-none"
                                value={billCode}
                                onChange={handleBillCodeChange}
                                placeholder="Nhập mã hóa đơn..."
                            />
                            <FontAwesomeIcon icon={faSearch} className="text-gray-500 cursor-pointer ml-2" />
                        </div>
                    </div>
                    <div className="text-lg font-bold">
                        Tổng tiền: {totalAmountSum.toLocaleString('vi-VN')} đ
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-400 text-center">
                        <thead className='bg-slate-200'>
                            <tr>
                                <th className="px-4 py-2">Mã hoá đơn</th>
                                <th className="px-4 py-2">Nhân viên</th>
                                <th className="px-4 py-2">Tổng tiền</th>
                                <th className="px-4 py-2">Ngày lập</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(transaction => (
                                <tr key={transaction._id} className="border cursor-pointer hover:bg-slate-100">
                                    <td className="px-4 py-2" onClick={toggleShowFullId}>{shortenId(transaction._id)}</td>
                                    <td className="px-4 py-2">{transaction.userId.fullname}</td>
                                    <td className="px-4 py-2">{transaction.totalAmount.toLocaleString('vi-VN')} đ</td>
                                    <td className="px-4 py-2">{format(new Date(transaction.createdAt), 'dd/MM/yyyy HH:mm:ss')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-center mt-4">
                        <button onClick={handlePreviousPage} disabled={currentPage === 1} className="mr-2 px-3 py-1 bg-gray-200 rounded-md focus:outline-none">Trang trước</button>
                        <span className="mx-2">Trang {currentPage} / {totalPages}</span>
                        <button onClick={handleNextPage} disabled={currentPage === totalPages} className="ml-2 px-3 py-1 bg-gray-200 rounded-md focus:outline-none">Trang sau</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default History;
