import React, { useState, useEffect } from 'react';
import { getServerSideProps } from '@/helpers/cookieHelper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { format } from 'date-fns';
import PromotionCreateForm from '@/components/promotion-management/PromotionCreateForm';
import { baseURL, promotionRoutes } from '@/api/api';


function PromotionManagement({ token }) {
    const [promotions, setPromotions] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newPromotion, setNewPromotion] = useState({
        name: '',
        description: '',
        type: 'buy_get_free',
        buyItems: [{ drink: '', quantity: '' }],
        freeItems: [{ drink: '', quantity: '' }],
        discountPercent: null,
        fixedPriceItems: [{ drink: '', fixedPrice: '' }],
        buyCategoryItems: { category: '', quantity: '' },
        freeCategoryItems: { category: '', quantity: '' },
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
        isActive: true
    });
    const [isEdit, setIsEdit] = useState(false);

    const fetchPromotionData = async () => {
        try {
            const promotionsResponse = await axios.get(`${baseURL}${promotionRoutes}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPromotions(promotionsResponse.data);
        } catch (error) {
            console.error('Error fetching promotion:', error);
        }
    }

    useEffect(() => {
        fetchPromotionData();
    }, [])

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(newPromotion)
            // Call API to create new promotion
            const response = await axios.post(`${baseURL}${promotionRoutes}`, newPromotion, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(response.data); // Log response for testing
            // Reset form and close modal
            setNewPromotion({
                name: '',
                description: '',
                type: 'buy_get_free',
                buyItems: [{ drink: '', quantity: '' }],
                freeItem: [{ drink: '', quantity: '' }],
                discountPercent: null,
                fixedPriceItems: [{ drink: '', fixedPrice: '' }],
                buyCategoryItems: { category: '', quantity: '' },
                freeCategoryItems: { category: '', quantity: '' },
                startDate: new Date().toISOString().slice(0, 10),
                endDate: new Date().toISOString().slice(0, 10),
                isActive: true
            });
            setShowCreateForm(false);
            // Refresh promotion list
            // You may want to refactor this to fetch promotions only when needed
            fetchPromotionData();
        } catch (error) {
            console.error('Error creating promotion:', error);
        }
    };

    const handleEditForm = async (e) => {
        e.preventDefault();
        try {
            console.log(newPromotion)
        } catch (error) {
            console.error('Error updating promotion:', error);
        }
    }

    const handleSingleInputChange = (e, type) => {
        const { name, value } = e.target;
        console.log(value)
        setNewPromotion(prevState => ({
            ...prevState,
            [type]: {
                ...prevState[type],
                [name]: value
            }
        }));
    };

    // Function to handle changes in input fields
    const handleInputChange = (e, index, type) => {
        const { name, value } = e.target;
        const list = [...newPromotion[type]];
        list[index][name] = value;
        setNewPromotion(prevState => ({
            ...prevState,
            [type]: list
        }));
    };

    // Function to add new row for buyItems, freeItem, and fixedPriceItems
    const handleAddRow = (type) => {
        setNewPromotion(prevState => ({
            ...prevState,
            [type]: [...prevState[type], { drink: '', quantity: '' }]
        }));
    };

    // Function to remove row for buyItems, freeItem, and fixedPriceItems
    const handleRemoveRow = (index, type) => {
        const list = [...newPromotion[type]];
        list.splice(index, 1);
        setNewPromotion({ ...newPromotion, [type]: list });
    };

    const handleEdit = (promotion) => {
        setIsEdit(true);
        setNewPromotion(promotion);
        setShowCreateForm(true);
    };

    return (
        <div className="container mx-auto max-h-full px-4 py-8 flex flex-col overflow-x-auto mt-5">
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                <h1 className="text-3xl font-semibold mb-4">Quản lý Khuyến Mãi</h1>
                <button className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg" onClick={() => setShowCreateForm(true)}>Tạo Mới</button>
            </div>
            {/* Promotion Creation Form Modal */}
            {showCreateForm &&
                <PromotionCreateForm
                    token={token}
                    setShowCreateForm={setShowCreateForm}
                    newPromotion={newPromotion}
                    setNewPromotion={setNewPromotion}
                    handleSubmit={handleSubmit}
                    handleEditForm={handleEditForm}
                    handleInputChange={handleInputChange}
                    handleAddRow={handleAddRow}
                    handleRemoveRow={handleRemoveRow}
                    handleSingleInputChange={handleSingleInputChange}
                    isEdit={isEdit}
                />
            }
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {/* Map through promotions and render each one as a card */}
                {promotions.map((promotion, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-4 mb-4 w-full md:w-auto lg:w-auto relative">
                        {/* Add edit and delete icons */}
                        <div className="absolute top-0 right-0 m-2">
                            <FontAwesomeIcon icon={faEdit} className="text-blue-500 mr-2 cursor-pointer" onClick={() => handleEdit(promotion)} />
                            <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 cursor-pointer" onClick={() => handleDelete(promotion)} />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">{promotion.name}</h2>
                        <p className="text-gray-700 mb-2">{promotion.description}</p>
                        {promotion.type === 'buy_category_get_free' && (
                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <p className="text-lg font-semibold mb-2">Chương trình khuyến mãi:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                    <div>
                                        <p className="text-gray-800 font-semibold mb-2">Mua:</p>
                                        <p><span className="font-semibold">Sản phẩm:</span> {promotion.buyCategoryItems.category.name}</p>
                                        <p><span className="font-semibold">Số lượng:</span> {promotion.buyCategoryItems.quantity}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-800 font-semibold mb-2">Nhận:</p>
                                        <p><span className="font-semibold">Sản phẩm:</span> {promotion.freeCategoryItems.category.name}</p>
                                        <p><span className="font-semibold">Số lượng:</span> {promotion.freeCategoryItems.quantity}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-800 font-semibold mb-2">Ngày bắt đầu:</p>
                                        <p>{format(new Date(promotion.startDate), 'dd/MM/yyyy')}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-800 font-semibold mb-2">Ngày kết thúc:</p>
                                        <p>{format(new Date(promotion.endDate), 'dd/MM/yyyy')}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

        </div>
    );
}
export { getServerSideProps };
export default PromotionManagement