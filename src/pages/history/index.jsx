import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faSearch } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { baseURL, historyRoutes, transactionIngredientRoutes, userRoutes } from '@/api/api';
import { getServerSideProps } from '@/helpers/cookieHelper';
import Detail from '@/components/History/Detail';

function History({ token }) {
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
    const [isDetail, setIsDetail] = useState(false);
    const [historyDetail, setHistoryDetail] = useState('');

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

            const response = await axios.get(apiURL, {
                headers: { Authorization: `Bearer ${token}` }
            });
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
            const response = await axios.get(`${baseURL}${userRoutes}/getAll`, {
                headers: { Authorization: `Bearer ${token}` }
            });
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

    const viewDetail = (id) => {
        setIsDetail(true)
        setHistoryDetail(id);
    };
    const handleCancelHistoryDetail = () => {
        setIsDetail(false)
        setHistoryDetail('');
    }

    //table lịch sử nguyên liệu
    const [transactionsIngredient, setTransactionsIngredient] = useState([]);
    const [priceIngredient, setPriceIngredient] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTransactionIngredient = async () => {
            try {
                const response = await axios.get(`${baseURL}${transactionIngredientRoutes}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTransactionsIngredient(response.data.transactions);
                setPriceIngredient(response.data.totalPrices)
                console.log(response.data)
            } catch (error) {
                console.log('Error fetching transaction ingredient:', error);
            }
        }
        fetchTransactionIngredient();
    },[])
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    const filteredHistoryIngredient = transactionsIngredient.filter(t =>
        t.ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return (
        <div className="container mx-auto px-4 py-8 h-full">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold mb-4">Lịch sửa giao dịch</h1>
                <div className="mb-4 flex items-center lg:justify-start justify-between">
                    <label htmlFor="period" className="mr-2">Lọc:</label>
                    <select id="period" className="border rounded px-2 py-1" value={period} onChange={handlePeriodChange}>
                        <option value="day">Ngày</option>
                        <option value="week">Tuần</option>
                        <option value="month">Tháng</option>
                        <option value="year">Năm</option>
                        <option value="all">All</option>
                    </select>
                </div>
                <div className="mb-4 flex items-center lg:justify-start justify-between"> {/* Add select for user */}
                    <label htmlFor="user" className="mr-2">Nhân viên:</label>
                    <select id="user" className="border rounded px-2 py-1" value={userId} onChange={handleUserChange}>
                        <option value="">Chọn nhân viên</option>
                        {users.map(user => (
                            <option key={user._id} value={user._id}>{user.fullname}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4 flex flex-col sm:flex-row lg:justify-between">
                    <div className="flex items-center mb-2 sm:mb-0 lg:justify-start justify-between">
                        <label htmlFor="date" className="mr-2">Ngày:</label>
                        <div className="border rounded px-2 py-1">
                            <DatePicker className='hover:outline-none focus:outline-none' id="date" selected={selectedDate} onChange={handleDateChange} />
                        </div>
                    </div>
                    <div className="relative w-full sm:w-auto">
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
                    <div className="text-lg font-bold mt-2 sm:mt-0">
                        Tổng tiền: {totalAmountSum.toLocaleString('vi-VN')} đ
                    </div>
                </div>
                <div className="overflow-x-auto block max-h-96">
                    <table className="min-w-full divide-y divide-slate-400 text-center">
                        <thead className='bg-slate-200 sticky top-0'>
                            <tr>
                                <th className="px-4 py-2">Mã hoá đơn</th>
                                <th className="px-4 py-2">Nhân viên</th>
                                <th className="px-4 py-2">Tổng tiền</th>
                                <th className="px-4 py-2">Ngày lập</th>
                                <th className="px-4 py-2">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className='overflow-y-auto'>
                            {transactions.map(transaction => (
                                <tr key={transaction._id} className="border cursor-pointer hover:bg-slate-100">
                                    <td className="px-4 py-2" onClick={toggleShowFullId}>{shortenId(transaction._id)}</td>
                                    <td className="px-4 py-2">{transaction.userId.fullname}</td>
                                    <td className="px-4 py-2">{transaction.totalAmount.toLocaleString('vi-VN')} đ</td>
                                    <td className="px-4 py-2">{format(new Date(transaction.createdAt), 'dd/MM/yyyy HH:mm:ss')}</td>
                                    <td className="px-4 py-2" onClick={() => viewDetail(transaction._id)}>
                                        <FontAwesomeIcon icon={faCircleInfo} className="text-gray-500 cursor-pointer ml-2" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center items-center mt-4">
                    <button onClick={handlePreviousPage} disabled={currentPage === 1} className="text-sm mr-2 px-3 py-1 bg-gray-200 rounded-md focus:outline-none">Trang trước</button>
                    <span className="mx-2 text-sm">Trang {currentPage} / {totalPages}</span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages} className="text-sm ml-2 px-3 py-1 bg-gray-200 rounded-md focus:outline-none">Trang sau</button>
                </div>
                {isDetail && <Detail token={token} historyDetail={historyDetail} onCancel={handleCancelHistoryDetail}/>}
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 mt-4">
                <h1 className="text-3xl font-bold mb-4">Lịch sửa nguyên liệu</h1>
                <div className='flex flex-col sm:flex-row justify-start md:justify-between lg:justify-between items-center w-full mb-2'>
                    <input type="text" placeholder="Nhập nguyên liệu tìm kiếm" onChange={handleSearch} className="border border-gray-300 rounded px-4 py-2 lg:w-80 md:w-48 w-full" />
                    <p className="text-lg font-bold mt-2 sm:mt-0 text-red-500">Tổng tiền {priceIngredient.toLocaleString('vi-VN')} đ</p>
                </div>
                
                <div className="overflow-x-auto block max-h-96">
                    <table className="min-w-full divide-y divide-slate-400 text-center">
                        <thead className='bg-slate-200 sticky top-0'>
                            <tr>
                                <th className="px-4 py-2">Đồ uống</th>
                                <th className="px-4 py-2">Nguyên liệu</th>
                                <th className="px-4 py-2">Số lượng giao dịch</th>
                                <th className="px-4 py-2">Đơn giá</th>
                                <th className="px-4 py-2">Thành tiền</th>
                                <th className="px-4 py-2">Số lượng trước đó</th>
                                <th className="px-4 py-2">Ngày giao dịch</th>
                            </tr>
                        </thead>
                        <tbody className='overflow-y-auto'>
                            {filteredHistoryIngredient.map(transaction => (
                                <tr key={transaction._id} className="border cursor-pointer hover:bg-slate-100">
                                    <td className="px-4 py-2">{transaction.drink.name}</td>
                                    <td className="px-4 py-2">{transaction.ingredient.name}</td>
                                    <td className="px-4 py-2">{transaction.quantity_transaction}</td>
                                    <td className="px-4 py-2">{transaction.priceOfUnit.toLocaleString('vi-VN')} đ</td>
                                    <td className="px-4 py-2">{transaction.price.toLocaleString('vi-VN')} đ</td>
                                    <td className="px-4 py-2">{transaction.quantity_prevTransaction}</td>
                                    <td className="px-4 py-2">{format(new Date(transaction.createdAt), 'dd/MM/yyyy HH:mm:ss')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export { getServerSideProps };
export default History;
