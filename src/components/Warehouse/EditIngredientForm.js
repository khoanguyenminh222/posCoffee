import React from 'react'

function EditIngredientForm({ editIngredient, onEditIngredientChange, onEditIngredientSubmit }) {
    return (
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 lg:ml-3 mt-3 lg:mt-0 border-2">
            <h2 className="text-xl font-semibold mb-4">Sửa Thành Phần</h2>
            
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Tên Thành Phần <span className='text-red-500'>(*)</span></label>
                <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    placeholder="Nhập tên Thành Phần" 
                    value={editIngredient.name} 
                    onChange={onEditIngredientChange} 
                    className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-500" 
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Số Lượng <span className='text-red-500'>(*)</span></label>
                <input 
                    type="number" 
                    id="quantity" 
                    name="quantity" 
                    placeholder="Nhập số lượng" 
                    value={editIngredient.quantity} 
                    onChange={onEditIngredientChange} 
                    className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-500" 
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">Đơn Vị <span className='text-red-500'>(*)</span></label>
                <input 
                    type="text" 
                    id="unit" 
                    name="unit" 
                    placeholder="Nhập đơn vị" 
                    value={editIngredient.unit} 
                    onChange={onEditIngredientChange} 
                    className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-500" 
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="priceOfUnit" className="block text-sm font-medium text-gray-700 mb-1">Giá/Đơn vị</label>
                <p className='text-sm text-gray-400'>mặc định lấy thành tiền/số lượng</p>
                <input 
                    type="number" 
                    id="priceOfUnit" 
                    name="priceOfUnit" 
                    placeholder="Nhập giá/đơn vị" 
                    value={editIngredient.priceOfUnit} 
                    onChange={onEditIngredientChange} 
                    className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-500" 
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="totalPrice" className="block text-sm font-medium text-gray-700 mb-1">Thành Tiền <span className='text-red-500'>(*)</span></label>
                <input 
                    type="number" 
                    id="totalPrice" 
                    name="totalPrice" 
                    placeholder="Nhập thành tiền" 
                    value={editIngredient.totalPrice} 
                    onChange={onEditIngredientChange} 
                    className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-500" 
                    required
                />
            </div>
            <button 
                onClick={onEditIngredientSubmit} 
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500"
            >
                Lưu
            </button>
            {editIngredient.totalPrice && <span className='text-red-500 text-sm ml-2'>Thành tiền sẽ không được cập nhật trong lịch sử</span>}
        </div>
    );
}

export default EditIngredientForm