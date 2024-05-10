import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import DrinkBill from '../DrinkBill/DrinkBill';
import { baseURL, billRoutes, drinksRoutes, userRoutes } from '@/api/api';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import BillToPrint from './BillToPrint';

function Bill({ userId, billItems, onDeleteAll, onDeleteItem, onIncrementItem, onDecrementItem, token }) {
    const [isPrinted, setIsPrinted] = useState(false);
    const [bill, setBill] = useState([]);
    const [user, setUser] = useState([]); 

    useEffect(()=>{
        const fetchUser = async() =>{
            try {
                const response = await axios.get(`${baseURL}${userRoutes}/userId/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
            } catch (error) {
                console.log(error)
            }
        }
        fetchUser(); 
    },[]);
    const totalAmount = billItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const handlePrintBill = async () => {
        try {
            if (billItems.length === 0) {
                alert("Không có đồ uống trong hóa đơn để lưu.");
                return; // Không có đồ uống, không thực hiện lưu
            }

            const updatedBillItems = [];
            // Lặp qua từng đồ uống trong danh sách billItems và gửi yêu cầu API để lấy thông tin
            for (const item of billItems) {
                const response = await axios.get(`${baseURL}${drinksRoutes}/${item.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                updatedBillItems.push({...item, ingredients: response.data.ingredients});
            }
            console.log(updatedBillItems)
            const data = {
                userId: userId,
                drinks: updatedBillItems,
                totalAmount: totalAmount,
            };
            // Gửi yêu cầu POST đến API
            const response = await axios.post(`${baseURL}${billRoutes}`, data,{
                headers: { Authorization: `Bearer ${token}` }
            });
            setBill(response.data)
            setIsPrinted(true);
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu POST:', error);
            // Xử lý lỗi nếu cần
        }
    };


    return (
        <>
            <div className="mb-4 flex items-center">
                <img src="/images/avatar.png" alt="Avatar" className="w-10 h-10 rounded-full mr-2" />
                <span className="text-lg font-semibold">{user.fullname}</span>
            </div>

            {/* Phần hiển thị hóa đơn */}
            <div className="mb-4 overflow-y-auto max-h-96" style={{ scrollbarWidth: 'thin', scrollbarColor: 'gray', scrollbarTrackColor: 'rgba(0, 0, 0, 0.1)' }}>
                {/* Tiêu đề hóa đơn */}
                <h2 className="text-lg font-semibold mb-2">Hóa đơn</h2>
                <button onClick={() => { onDeleteAll(); setIsPrinted(false) }} className="bg-red-500 text-white px-2 py-1 rounded-md mb-4">Xoá hết</button>

                {/* Danh sách các mặt hàng trong hóa đơn */}
                <div>
                    {billItems.map((item, index) => (
                        <DrinkBill
                            key={index}
                            item={item}
                            onDelete={() => onDeleteItem(item)}
                            onIncrement={() => onIncrementItem(item)}
                            onDecrement={() => onDecrementItem(item)} />
                    ))}
                </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full bg-white p-4">
                <div className="border-b-2 border-gray-300 mb-4"></div> {/* Đường kẻ đẹp hơn */}
                {/* Hiển thị tổng tiền */}
                <div className="text-lg font-semibold mb-2 flex justify-between">
                    <span>Tổng tiền:</span> {/* Thay số này bằng biến hoặc tính toán thực tế */}
                    <span>{totalAmount.toLocaleString('vi-VN')} đ</span>
                </div>

                {/* Nút in hoá đơn */}
                {isPrinted ?
                    <button onClick={handlePrint} className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 flex items-center">
                        <FontAwesomeIcon icon={faPrint} className="mr-2" /> In hoá đơn
                    </button>
                    :
                    <button onClick={handlePrintBill} className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 flex items-center">
                        <FontAwesomeIcon icon={faPrint} className="mr-2" /> Lưu
                    </button>}
                <BillToPrint ref={componentRef} bill={bill} billItems={billItems} user={user} totalAmount={totalAmount} />
            </div>
        </>
    );
}
export default Bill;
