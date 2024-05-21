import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import DrinkBill from '../DrinkBill/DrinkBill';
import { baseURL, billRoutes, categoriesRoutes, drinksRoutes, promotionRoutes, userRoutes } from '@/api/api';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useReactToPrint } from 'react-to-print';
import BillToPrint from './BillToPrint';
import ListPromotion from './ListPromotion';

function Bill({ userId, billItems, addToBill, onDeleteAll, onDeleteItem, onIncrementItem, onDecrementItem, token }) {
    const [isPrinted, setIsPrinted] = useState(false);
    const [bill, setBill] = useState([]);
    const [user, setUser] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
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
    }, []);
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
            const responsePromotion = await axios.post(`${baseURL}${promotionRoutes}/check-promotion`, {drinks: billItems}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if(responsePromotion.data.promotions.length>0 && selectedPromotion==null){
                setPromotionList(responsePromotion.data.promotions || [])
                setIsListPromotion(true);
                return;
            }
            
            const updatedBillItems = [];
            // Lặp qua từng đồ uống trong danh sách billItems và gửi yêu cầu API để lấy thông tin
            for (const item of billItems) {
                const response = await axios.get(`${baseURL}${drinksRoutes}/${item.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                updatedBillItems.push({ ...item, ingredients: response.data.ingredients });
            }
            const data = {
                userId: userId,
                drinks: updatedBillItems,
                totalAmount: totalAmount,
            };
            // Gửi yêu cầu POST đến API
            const response = await axios.post(`${baseURL}${billRoutes}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBill(response.data)
            setIsPrinted(true);
            setSelectedPromotion(null)
            toast.success('Đã tạo mới hoá đơn');
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu POST:', error);
            toast.error(error.message);
            // Xử lý lỗi nếu cần
        }
    };

    const [isListPromotion, setIsListPromotion] = useState(false);
    const [promotionList, setPromotionList] = useState([]);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const handleApplyPromotion = async() => {
        try {
            const response = await axios.post(`${baseURL}${promotionRoutes}/check-promotion`, {drinks: billItems}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPromotionList(response.data.promotions || [])
            setIsListPromotion(true);
        } catch (error) {
            console.error(error)
        }
    }
    const handleCancelListPromotion = () => {
        setIsListPromotion(false);
        setSelectedPromotion(null)
    }
    const handlePromotionSelect = async(data) => {
        const currentDate = new Date();
        const promotion = data.promotion
        const selectedFreeItem = data.selectedFreeItem

        if(promotion.isActive && currentDate >= new Date(promotion.startDate) && currentDate <= new Date(promotion.endDate)){
            setSelectedPromotion(promotion);
            setIsListPromotion(false);
            const response = await axios.get(`${baseURL}${drinksRoutes}/${selectedFreeItem.itemId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const freeBillItem = {
                _id: response.data._id, // Sử dụng id của sản phẩm miễn phí
                name: "FREE "+response.data.name, // Tên của sản phẩm miễn phí
                prices: {"M": 0, "L": 0}, // Giá của sản phẩm miễn phí là 0 (do đã miễn phí)
                quantity: selectedFreeItem.quantity, // Số lượng sản phẩm miễn phí
                options: {}, // Không có option cho sản phẩm miễn phí
            };
            //Thêm sản phẩm miễn phí vào danh sách billItems
            addToBill(freeBillItem, selectedFreeItem.quantity, "", "", "", "");
        }else{
            console.log('Promotion is not active or not within the date range.');
            alert("Chương trình khuyến mãi không còn")
        }
    };

    return (
        <>
            <div className="mb-4 flex items-center">
                <img src="/images/avatar.png" alt="Avatar" className="w-10 h-10 rounded-full mr-2" />
                <span className="text-lg font-semibold">{user.fullname}</span>
            </div>
            {/* Tiêu đề hóa đơn */}
            <div className='flex justify-between items-center mb-2'>
                <h2 className="text-lg font-semibold">Hóa đơn</h2>
                <button onClick={() => { onDeleteAll(); setIsPrinted(false); setSelectedPromotion(null) }} className="bg-red-500 text-white px-2 py-1 rounded-md">Xoá hết</button>
            </div>
            {/* Phần hiển thị hóa đơn */}
            <div className="mb-4 overflow-y-auto max-h-96" style={{ scrollbarWidth: 'thin', scrollbarColor: 'gray', scrollbarTrackColor: 'rgba(0, 0, 0, 0.1)' }}>

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
                <div onClick={handleApplyPromotion} className='flex flex-row cursor-pointer hover:underline mb-2 justify-start items-center'>
                    <p>Áp dụng khuyến mãi</p>
                    {selectedPromotion ? <FontAwesomeIcon icon={faCircleCheck} color='green' className="ml-2" />
                    :
                    <FontAwesomeIcon icon={faCircle} color='black' className="ml-2" />}
                </div>
                {isListPromotion && <ListPromotion promotionList={promotionList} onCancel={handleCancelListPromotion} onSelectPromotion={handlePromotionSelect}/>}
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
                        <FontAwesomeIcon icon={faPrint} className="mr-2" /> Thanh toán
                    </button>}
                <BillToPrint ref={componentRef} bill={bill} billItems={billItems} user={user} totalAmount={totalAmount} />   
            </div>
        </>
    );
}
export default Bill;
