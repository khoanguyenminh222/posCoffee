import React from 'react'

function View_FixedPrice({promotion}) {
  return (
    <div className="capitalize">
      <p className="text-gray-800 font-semibold mb-2">Đồng giá:</p>
      {promotion.conditions.fixed_price.fixedPriceItems.map((item, index) => (
        <div key={index} className="mb-2">
          <p><span className="font-semibold">Sản phẩm:</span> {item.category.name}</p>
          <p><span className="font-semibold">Giá bán:</span> {item.fixedPrice.toLocaleString('vi-VN')}đ</p>
        </div>
      ))}
    </div>
  )
}

export default View_FixedPrice