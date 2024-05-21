import React, { useState, useEffect } from 'react';
import BuyGetFree from './BuyGetFree';
import BuyCategoryGetFree from './BuyCategoryGetFree';
import FixedPrice from './FixedPrice';
import Discount from './Discount';

function PromotionCreateForm({ setShowCreateForm, token, newPromotion, setNewPromotion, handleSubmit, handleEditForm, handleInputChange, handleAddRowDrink, handleAddRowCategory, handleRemoveRow, isEdit }) {
    const [formAction, setFormAction] = useState('Tạo Mới');

    useEffect(() => {
        if (isEdit) {
            setFormAction('edit');
        } else {
            setFormAction('create');
        }
    }, [isEdit]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        switch (formAction) {
            case 'edit':
                handleEditForm(e,newPromotion._id);
                break;
            case 'create':
                handleSubmit(e);
                break;
            default:
                console.log("lỗi khi gửi form promotion create");
                break;
        }
    };

    return (
        <div className="fixed top-0 left-0 z-10 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-none lg:rounded-lg shadow-md p-6 max-h-full overflow-auto w-96 lg:w-full lg:max-w-xl md:w-full md:max-w-md max-w-sm">
                <h2 className="text-xl font-semibold mb-4">{isEdit ? 'Chỉnh Sửa' : 'Tạo Mới'} Khuyến Mãi</h2>
                <form onSubmit={handleFormSubmit}>
                    {/* Input fields for promotion details */}
                    <div className="mb-4">
                        <label htmlFor="startDate" className="block font-semibold">Ngày bắt đầu:</label>
                        {isEdit ?
                            <input
                                id="startDate"
                                className="border rounded-md px-3 py-2 outline-blue-500"
                                type="date"
                                value={new Date(newPromotion.startDate).toISOString().slice(0, 10)}
                                onChange={(e) => setNewPromotion({ ...newPromotion, startDate: e.target.value })}
                            />
                            :
                            <input
                                id="startDate"
                                className="border rounded-md px-3 py-2 outline-blue-500"
                                type="date"
                                value={newPromotion.startDate}
                                onChange={(e) => setNewPromotion({ ...newPromotion, startDate: e.target.value })}
                            />
                        }

                    </div>
                    <div className="mb-4">
                        <label htmlFor="endDate" className="block font-semibold">Ngày kết thúc:</label>
                        {isEdit ?
                            <input
                                id="endDate"
                                className="border rounded-md px-3 py-2 outline-blue-500"
                                type="date"
                                value={new Date(newPromotion.endDate).toISOString().slice(0, 10)}
                                onChange={(e) => setNewPromotion({ ...newPromotion, endDate: e.target.value })}
                            />
                            :
                            <input
                                id="endDate"
                                className="border rounded-md px-3 py-2 outline-blue-500"
                                type="date"
                                value={newPromotion.endDate}
                                onChange={(e) => setNewPromotion({ ...newPromotion, endDate: e.target.value })}
                            />
                        }

                    </div>
                    <div className="mb-4">
                        <label htmlFor="name" className="block font-semibold">Tên <span className='text-red-500'>(*)</span></label>
                        <input type="text" id="name" name="name" className="border rounded-md px-3 py-2 w-full outline-blue-500" value={newPromotion.name} onChange={(e) => setNewPromotion({ ...newPromotion, name: e.target.value })} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block font-semibold">Mô tả <span className='text-red-500'>(*)</span></label>
                        <textarea id="description" name="description" className="border rounded-md px-3 py-2 w-full outline-blue-500" value={newPromotion.description} onChange={(e) => setNewPromotion({ ...newPromotion, description: e.target.value })} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="type" className="block font-semibold">Loại <span className='text-red-500'>(*)</span></label>
                        {isEdit ?
                            (newPromotion.type === "buy_get_free" ? <input type="text" className="border rounded-md px-3 py-2 w-full outline-blue-500" value='Mua hàng được tặng' readOnly/>
                                : newPromotion.type === "buy_category_get_free" ? <input type="text" className="border rounded-md px-3 py-2 w-full outline-blue-500" value='Mua theo loại đồ uống được tặng' readOnly/>
                                    : newPromotion.type === "discount" ? <input type="text" className="border rounded-md px-3 py-2 w-full outline-blue-500" value='Giảm giá' readOnly/>
                                        : <input type="text" className="border rounded-md px-3 py-2 w-full outline-blue-500" value='Đồng giá' readOnly/>
                            )
                            :
                            (
                                <select id="type" name="type" className="border rounded-md px-3 py-2 w-full outline-blue-500" value={newPromotion.type} onChange={(e) => setNewPromotion({ ...newPromotion, type: e.target.value })}>
                                    <option value="buy_get_free">Mua hàng được tặng</option>
                                    <option value="buy_category_get_free">Mua theo loại đồ uống được tặng</option>
                                    <option value="discount">Giảm giá</option>
                                    <option value="fixed_price">Đồng giá</option>
                                </select>
                            )
                        }

                    </div>
                    {/* Render additional fields based on promotion type */}
                    {/* For example: */}
                    {newPromotion.type === 'buy_get_free' && (
                        <BuyGetFree
                            token={token}
                            newPromotion={newPromotion}
                            isEdit={isEdit}
                            handleInputChange={handleInputChange}
                            handleAddRowDrink={handleAddRowDrink}
                            handleRemoveRow={handleRemoveRow}
                        />
                    )}
                    {newPromotion.type === 'buy_category_get_free' && (
                        <BuyCategoryGetFree
                            token={token}
                            newPromotion={newPromotion}
                            isEdit={isEdit}
                            handleInputChange={handleInputChange}
                            handleAddRowCategory={handleAddRowCategory}
                            handleAddRowDrink={handleAddRowDrink}
                            handleRemoveRow={handleRemoveRow}
                        />
                    )}
                    {newPromotion.type === 'fixed_price' && (
                        <FixedPrice 
                            token={token}
                            newPromotion={newPromotion}
                            isEdit={isEdit}
                            handleInputChange={handleInputChange}
                            handleAddRowCategory={handleAddRowCategory}
                            handleRemoveRow={handleRemoveRow}
                        />
                    )}
                    {newPromotion.type === 'discount' && (
                        <Discount 
                            token={token}
                            newPromotion={newPromotion}
                            isEdit={isEdit}
                            handleInputChange={handleInputChange}
                        />
                    )}
                    {/* Add similar logic for other types */}
                    {/* End of additional fields */}
                    <button type="submit" className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg">{isEdit ? 'Lưu' : 'Tạo Mới'}</button>
                    <button type="button" className="bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg ml-2" onClick={() => setShowCreateForm(false)}>Hủy</button>
                </form>
            </div>
        </div>
    )
}

export default PromotionCreateForm