import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint  } from '@fortawesome/free-solid-svg-icons';
import DrinkBill from '../DrinkBill/DrinkBill';

function Bill() {
    return (
        <div className="w-1/4 h-full bg-white p-4 shadow-md rounded-md relative">
            {/* Avatar và tên người dùng */}
            <div className="mb-4 flex items-center">
                <img src="/images/avatar.png" alt="Avatar" className="w-10 h-10 rounded-full mr-2" />
                <span className="text-lg font-semibold">Tên người dùng</span>
            </div>

            {/* Phần hiển thị hóa đơn */}
            <div className="mb-4 overflow-y-auto max-h-96" style={{scrollbarWidth: 'thin', scrollbarColor: 'gray', scrollbarTrackColor: 'rgba(0, 0, 0, 0.1)'}}>
                {/* Tiêu đề hóa đơn */}
                <h2 className="text-lg font-semibold mb-2">Hóa đơn</h2>

                {/* Danh sách các mặt hàng trong hóa đơn */}
                <div>
                    <DrinkBill />
                    <DrinkBill />
                    <DrinkBill />
                    <DrinkBill />
                    {/* Thêm các mặt hàng khác tương tự nếu cần */}
                </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full bg-white p-4">
                <div className="border-b-2 border-gray-300 mb-4"></div> {/* Đường kẻ đẹp hơn */}
                {/* Hiển thị tổng tiền */}
                <div className="text-lg font-semibold mb-2 flex justify-between">
                    <span>Tổng tiền:</span> {/* Thay số này bằng biến hoặc tính toán thực tế */}
                    <span>120.000Đ</span>
                </div>

                {/* Nút in hoá đơn */}
                <button className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 flex items-center">
                    <FontAwesomeIcon icon={faPrint} className="mr-2" /> In hoá đơn
                </button>
            </div>
        </div>
    );
}

export default Bill;
