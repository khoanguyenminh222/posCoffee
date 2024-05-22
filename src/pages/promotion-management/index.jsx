import React, { useState, useEffect } from 'react';
import { getServerSideProps } from '@/helpers/cookieHelper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PromotionCreateForm from '@/components/promotion-management/PromotionCreateForm';
import { baseURL, promotionRoutes } from '@/api/api';
import View_BuyCategoryGetFree from '@/components/promotion-management/View_BuyCategoryGetFree';
import View_BuyGetFree from '@/components/promotion-management/View_BuyGetFree';
import View_FixedPrice from '@/components/promotion-management/View_FixedPrice';
import View_Discount from '@/components/promotion-management/View_Discount';


function PromotionManagement({ token }) {
    const [promotions, setPromotions] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newPromotion, setNewPromotion] = useState({
        name: '',
        description: '',
        type: 'buy_get_free',
        conditions: {
            buy_get_free: {
                buyItems: [{ drink: '', quantity: '' }],
                freeItems: [{ drink: '', quantity: '' }]
            },
            discount: {
                totalAmount: null,
                discountPercent: null
            },
            fixed_price: {
                fixedPriceItems: [{ category: '', fixedPrice: '' }]
            },
            buy_category_get_free: {
                buyCategoryItems: [{ category: '', quantity: '' }],
                freeCategoryItems: [{ drink: '', quantity: '' }]
            }
        },
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
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchPromotionData();
    }, [])

    // Function to handle form submission
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!newPromotion.name) {
            toast.warn('Yêu cầu nhập tên khuyến mãi.');
            return;
        }
        if (!newPromotion.description) {
            toast.warn('Yêu cầu nhập mô tả.');
            return;
        }
        // Lọc các loại có giá trị
        const filteredConditions = Object.entries(newPromotion.conditions).reduce((acc, [key, value]) => {
            if (value && Object.keys(value).length !== 0) {
                // Lọc ra từng điều kiện có giá trị
                const filteredCondition = Object.entries(value).reduce((subAcc, [subKey, subValue]) => {
                    if (Array.isArray(subValue)) {
                        // Lọc ra từng mục có giá trị
                        const filteredItems = subValue.filter(item => {
                            if (subKey === 'fixedPriceItems') {
                                return item.category && item.fixedPrice;
                            } else if (subKey === 'buyItems' || subKey === 'freeItems') {
                                return item.drink && item.quantity;
                            } else if (subKey === 'buyCategoryItems') {
                                return item.category && item.quantity;
                            } else if (subKey === 'freeCategoryItems') {
                                return item.drink && item.quantity;
                            }
                            return Object.values(item).every(val => val !== '');
                        });
                        if (filteredItems.length > 0) {
                            subAcc[subKey] = filteredItems;
                        }
                    } else if (typeof subValue === 'number' && subValue > 0) {
                        // Bao gồm các giá trị số không phải mảng hợp lệ
                        subAcc[subKey] = subValue;
                    } else if (subValue !== '') {
                        // Bao gồm các giá trị không phải mảng và không rỗng
                        subAcc[subKey] = subValue;
                    }
                    return subAcc;
                }, {});
    
                // Nếu điều kiện này vẫn còn mục có giá trị, thêm vào filteredConditions
                if (Object.keys(filteredCondition).length !== 0) {
                    acc[key] = filteredCondition;
                }
            }
            return acc;
        }, {});

        // Loại bỏ trường conditions ra khỏi newPromotion nếu không còn loại nào có giá trị
        const conditions = Object.keys(filteredConditions).length === 0 ? {} : { conditions: filteredConditions };
        const promotionData = { ...newPromotion, ...conditions };

        try {
            // Call API to create new promotion
            const response = await axios.post(`${baseURL}${promotionRoutes}`, promotionData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status >= 200 && response.status < 300) {
                toast.success(response.data.message);
            }
            // Reset form and close modal
            setNewPromotion({
                name: '',
                description: '',
                type: 'buy_get_free',
                conditions: {
                    buy_get_free: {
                        buyItems: [{ drink: '', quantity: '' }],
                        freeItems: [{ drink: '', quantity: '' }]
                    },
                    discount: {
                        totalAmount: null,
                        discountPercent: null
                    },
                    fixed_price: {
                        fixedPriceItems: [{ category: '', fixedPrice: '' }]
                    },
                    buy_category_get_free: {
                        buyCategoryItems: [{ category: '', quantity: '' }],
                        freeCategoryItems: [{ drink: '', quantity: '' }]
                    }
                },
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
            toast.error(error.message)
        }
    };

    const handleOpenCreateForm = () => {
        setShowCreateForm(!showCreateForm);
        setNewPromotion({
            name: '',
            description: '',
            type: 'buy_get_free',
            conditions: {
                buy_get_free: {
                    buyItems: [{ drink: '', quantity: '' }],
                    freeItems: [{ drink: '', quantity: '' }]
                },
                discount: {
                    totalAmount: null,
                    discountPercent: null
                },
                fixed_price: {
                    fixedPriceItems: [{ category: '', fixedPrice: '' }]
                },
                buy_category_get_free: {
                    buyCategoryItems: [{ category: '', quantity: '' }],
                    freeCategoryItems: [{ drink: '', quantity: '' }]
                }
            },
            startDate: new Date().toISOString().slice(0, 10),
            endDate: new Date().toISOString().slice(0, 10),
            isActive: true
        })
    }

    const handleEditForm = async (e, id) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${baseURL}${promotionRoutes}/${id}`, newPromotion, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status >= 200 && response.status < 300) {
                toast.success(response.data.message);
            }
            setShowCreateForm(false);
            fetchPromotionData();
        } catch (error) {
            console.error('Error updating promotion:', error);
            toast.error(error.message)
        }
    }

    // Function to handle changes in input fields
    const handleInputChange = (e, conditionType, itemType, index, field) => {
        const { name, value } = e.target;
    
        setNewPromotion(prevState => {
            const conditions = { ...prevState.conditions };
    
            if (Array.isArray(conditions[conditionType][itemType])) {
                // Handle iterable items (e.g., fixed_price, buy_get_free, buy_category_get_free)
                const items = [...conditions[conditionType][itemType]];
                items[index] = { ...items[index], [field]: value };
                conditions[conditionType][itemType] = items;
            } else {
                // Handle non-iterable items (e.g., discount)
                conditions[conditionType] = {
                    ...conditions[conditionType],
                    [field]: value
                };
            }
            return { ...prevState, conditions };
        });
    };

    // Function to add new row for buyItems, freeItem, and fixedPriceItems
    const handleAddRowDrink = (conditionType, rowType) => {
        setNewPromotion(prevState => {
            const conditions = { ...prevState.conditions };
            const items = conditions[conditionType][rowType];
            // Kiểm tra xem trường trước đó đã có giá trị hay chưa
            const lastItem = items[items.length - 1];
            if (!lastItem || (lastItem.drink !== '' && lastItem.quantity !== '')) {
                // Nếu trường trước đó đã có giá trị hoặc không có hàng trước đó, thêm hàng mới
                conditions[conditionType][rowType].push({ drink: '', quantity: '' });
            }
            return { ...prevState, conditions };
        });
    };

    const handleAddRowCategory = (conditionType, rowType) => {
        setNewPromotion(prevState => {
            const conditions = { ...prevState.conditions };
            const items = conditions[conditionType][rowType];
            // Kiểm tra xem trường trước đó đã có giá trị hay chưa
            const lastItem = items[items.length - 1];
            // Kiểm tra nếu có quantity
            if (!lastItem || (lastItem.category !== '' && (lastItem.quantity !== undefined && lastItem.quantity !== ''))) {
                conditions[conditionType][rowType].push({ category: '', quantity: '' });
            } 
            // Kiểm tra nếu có fixedPrice
            else if (!lastItem || (lastItem.category !== '' && (lastItem.fixedPrice !== undefined && lastItem.fixedPrice !== ''))) {
                conditions[conditionType][rowType].push({ category: '', fixedPrice: '' });
            }
            // Loại bỏ trường quantity nếu không cần thiết
            conditions[conditionType][rowType] = conditions[conditionType][rowType].map(item => {
            if (item.fixedPrice !== undefined) {
                delete item.quantity;
            }
            return item;
        });
            return { ...prevState, conditions };
        });
    };

    // Function to remove row for buyItems, freeItem, and fixedPriceItems
    const handleRemoveRow = (conditionType, rowType, index) => {
        setNewPromotion(prevState => {
            const conditions = { ...prevState.conditions };
            const updatedItems = [...conditions[conditionType][rowType]];
            updatedItems.splice(index, 1);
            conditions[conditionType][rowType] = updatedItems;
            return { ...prevState, conditions };
        });
    };

    const handleEdit = (promotion) => {
        setIsEdit(true);
        setNewPromotion(promotion);
        setShowCreateForm(true);
    };

    const handleDelete = async (promotion) => {
        if (window.confirm(`Bạn có muốn xoá ${promotion.name}?`)) {
            try {
                const response = await axios.delete(`${baseURL}${promotionRoutes}/${promotion._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.status >= 200 && response.status < 300) {
                    toast.success(response.data.message);
                    fetchPromotionData();
                }
            } catch (error) {
                console.error('Error deleting promotion:', error);
                toast.error(error.message)
            }
        }
    }

    // Cập nhật trạng thái isActive của promotion
    const handleToggle = async (promotion) => {
        console.log(promotion)
        try {
            const response = await axios.put(`${baseURL}${promotionRoutes}/setActive/${promotion._id}`, { isActive: !promotion.isActive }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(response)
            if (response.status >= 200 && response.status < 300) {
                toast.success(response.data.message);
                fetchPromotionData();
            }
        } catch (error) {
            console.log("Có lỗi khi chuyển đổi trạng thái", error);
            toast.error(error.message)
        }
    }

    return (
        <div className="container mx-auto max-h-full px-4 py-8 flex flex-col overflow-x-auto mt-5">
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                <h1 className="text-3xl font-semibold mb-4">Quản lý Khuyến Mãi</h1>
                <button className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg" onClick={() => handleOpenCreateForm()}>Tạo Mới</button>
            </div>
            {/* Promotion Creation Form Modal */}
            {showCreateForm &&
                <PromotionCreateForm
                    token={token}
                    newPromotion={newPromotion}
                    setShowCreateForm={setShowCreateForm}
                    setNewPromotion={setNewPromotion}
                    handleSubmit={handleSubmit}
                    handleEditForm={handleEditForm}
                    handleInputChange={handleInputChange}
                    handleAddRowDrink={handleAddRowDrink}
                    handleAddRowCategory={handleAddRowCategory}
                    handleRemoveRow={handleRemoveRow}
                    isEdit={isEdit}
                    handleOpenCreateForm={handleOpenCreateForm}
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
                        <div className='mb-2 flex justify-start items-center'>
                            <FontAwesomeIcon
                                icon={promotion.isActive ? faToggleOn : faToggleOff}
                                className={`text-2xl cursor-pointer ${promotion.isActive ? 'text-green-500' : 'text-gray-500'}`}
                                onClick={() => handleToggle(promotion)}
                            />
                            <span className="ml-2">{promotion.isActive ? 'Kích hoạt' : 'Vô hiệu hóa'}</span>
                        </div>

                        <div className="border-t border-gray-200 pt-4 mt-4">
                            <p className="text-lg font-semibold mb-2">Chương trình khuyến mãi:</p>

                            {promotion.type === 'buy_category_get_free' && <View_BuyCategoryGetFree promotion={promotion}/>}
                            {promotion.type === 'buy_get_free' && <View_BuyGetFree promotion={promotion}/>}
                            {promotion.type === 'fixed_price' && <View_FixedPrice promotion={promotion}/>}
                            {promotion.type === 'discount' && <View_Discount promotion={promotion}/>}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
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
                    </div>
                ))}
            </div>
            <ToastContainer />
        </div>
    );
}
export { getServerSideProps };
export default PromotionManagement