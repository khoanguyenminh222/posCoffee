import React from 'react'

function View_Discount({ promotion }) {
    return (
        <div className="capitalize mb-3">
            <p className="text-gray-800 font-semibold mb-2">Giảm giá:</p>
            <div>
                <span className="text-gray-600">Tổng số tiền: </span>
                <span>{promotion.conditions.discount.totalAmount.toLocaleString('vi-VN')}đ</span>
            </div>
            <div>
                <span className="text-gray-600">Phần trăm giảm giá: </span>
                <span>{promotion.conditions.discount.discountPercent}%</span>
            </div>
        </div>
    )
}

export default View_Discount