import React from 'react'

function View_FixedPrice({promotion}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
            <div className="capitalize">
                <p className="text-gray-800 font-semibold mb-2">Đồng giá:</p>
                {promotion.conditions.fixed_price.fixedPriceItems.map((item, index) => (
                    <div key={index}>
                        <p><span className="font-semibold">Sản phẩm:</span> {item.category.name}</p>
                        <p><span className="font-semibold">Giá bán:</span> {item.fixedPrice}</p>
                    </div>
                ))}
            </div>
        </div>
  )
}

export default View_FixedPrice