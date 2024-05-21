import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ListPromotion({ promotionList, onCancel, onSelectPromotion }) {
    const [selectedPromotionIndex, setSelectedPromotionIndex] = useState(-1);
    const [selectedFreeItem, setSelectedFreeItem] = useState([{itemId: '', quantity: 0}]);
    const handleCancel = () => {
        onCancel();
    };
    const handleSelect = () => {
        if(selectedPromotionIndex < 0) {
            toast.warn('Yêu cầu chọn khuyến mãi.');
            return;
        }
        const selectedFreeItemId = selectedFreeItem[selectedPromotionIndex];

        if(selectedFreeItemId == null) {
            toast.warn('Yêu cầu chọn đồ uống.');
            return;
        }
        onSelectPromotion({
            promotion: promotionList[selectedPromotionIndex].promotion,
            selectedFreeItem: selectedFreeItem[selectedPromotionIndex]
        });
        toast.success('Đã áp dụng mã khuyến mãi');
    };

    const handleFreeItemChange = (promotionIndex, itemId, quantity) => {
        setSelectedFreeItem(prevSelectedFreeItem => {
            const updatedSelectedFreeItem = { ...prevSelectedFreeItem };
            updatedSelectedFreeItem[promotionIndex] = { itemId, quantity };
            return updatedSelectedFreeItem;
        });
    };
    const renderFreeItems = (promotion, promotionIndex) => {
        if (promotion.type === 'buy_get_free') {
            return promotion.conditions.buy_get_free.freeItems.map((item, index) => (
                <li key={index}>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name={`freeItem-${promotionIndex}`}
                            value={item.drink._id}
                            checked={selectedFreeItem[promotionIndex] && selectedFreeItem[promotionIndex].itemId === item.drink._id}
                            onChange={() => handleFreeItemChange(promotionIndex, item.drink._id, item.quantity)}
                            className="mr-2"
                        />
                        <span>{item.drink.name} - Số lượng: {item.quantity}</span>
                    </label>
                </li>
            ));
        } else if (promotion.type === 'buy_category_get_free') {
            return promotion.conditions.buy_category_get_free.freeCategoryItems.map((item, index) => (
                <li className="capitalize" key={index}>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name={`freeItem-${promotionIndex}`}
                            value={item.drink._id}
                            checked={selectedFreeItem[promotionIndex] && selectedFreeItem[promotionIndex].itemId === item.drink._id}
                            onChange={() => handleFreeItemChange(promotionIndex, item.drink._id, item.quantity)}
                            className="mr-2"
                        />
                        <span>{item.drink.name} - Số lượng: {item.quantity}</span>
                    </label>
                </li>
            ));
        }
        return null;
    };
    return (
        <div className="fixed z-10 top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-md shadow-md">
                {promotionList.length === 0 ? (
                    <p>Không có khuyến mãi nào được áp dụng.</p>
                ) : (
                    <ul>
                        {promotionList.map((promotion, index) => (
                            <li key={index} className="mb-2 text-center">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="promotion"
                                        value={index}
                                        checked={selectedPromotionIndex === index}
                                        onChange={() => setSelectedPromotionIndex(index)}
                                        className="mr-2"
                                    />
                                    <span>{promotion.promotion.name} - {promotion.promotion.description}</span>
                                </label>
                                {selectedPromotionIndex === index && (
                                    <ul className="mt-2 ml-4 text-left">
                                        {renderFreeItems(promotion.promotion, index)}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
                <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Huỷ
                    </button>
                    <button
                        type="button"
                        onClick={handleSelect}
                        disabled={selectedPromotionIndex === null}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white cursor-pointer bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ListPromotion