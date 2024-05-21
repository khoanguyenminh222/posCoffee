import React from 'react'

function Discount({ newPromotion, handleInputChange, isEdit }) {
    return (
        <div>
            <h3 className="font-semibold mb-2 capitalize">Giảm giá</h3>
            
            <div className="mb-2">
                <label className="block mb-1" htmlFor="totalAmount">Tổng số tiền</label>
                <input
                    type="number"
                    id="totalAmount"
                    name="totalAmount"
                    placeholder="Nhập tổng số tiền"
                    value={newPromotion.conditions.discount.totalAmount || ''}
                    onChange={(e) => handleInputChange(e, 'discount', 'discount', 0, 'totalAmount')}
                    className="border rounded-md px-3 py-2 w-full outline-blue-500"
                    required
                />
            </div>
            
            <div className="mb-2">
                <label className="block mb-1" htmlFor="discountPercent">Phần trăm giảm giá</label>
                <input
                    type="number"
                    id="discountPercent"
                    name="discountPercent"
                    placeholder="Nhập phần trăm giảm giá"
                    value={newPromotion.conditions.discount.discountPercent || ''}
                    onChange={(e) => handleInputChange(e, 'discount', 'discount', 0, 'discountPercent')}
                    className="border rounded-md px-3 py-2 w-full outline-blue-500"
                    required
                />
            </div>
        </div>
    )
}

export default Discount