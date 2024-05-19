import React from 'react'

function View_BuyGetFree({ promotion }) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
            <div className="capitalize">
                <p className="text-gray-800 font-semibold mb-2">Mua:</p>
                {promotion.conditions.buy_get_free.buyItems.map((item, index) => (
                    <div key={index}>
                        <p><span className="font-semibold">Sản phẩm:</span> {item.drink.name}</p>
                        <p><span className="font-semibold">Số lượng:</span> {item.quantity}</p>
                    </div>
                ))}
            </div>
            <div className="capitalize">
                <p className="text-gray-800 font-semibold mb-2">Nhận:</p>
                {promotion.conditions.buy_get_free.freeItems.map((item, index) => (
                    <div key={index}>
                        <p><span className="font-semibold">Sản phẩm:</span> {item.drink.name}</p>
                        <p><span className="font-semibold">Số lượng:</span> {item.quantity}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default View_BuyGetFree