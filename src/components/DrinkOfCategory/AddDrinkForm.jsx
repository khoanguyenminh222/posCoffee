import { baseURL, categoriesRoutes, drinksRoutes } from '@/api/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddDrinkForm({ onCancel, onSave }) {
    const [name, setName] = useState('');
    const [priceM, setPriceM] = useState('');
    const [priceL, setPriceL] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [options, setOptions] = useState({
        temperature: [],
        sugar: [],
        ice: []
    });
    const [imageFile, setImageFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [checkAllTemperature, setCheckAllTemperature] = useState(false);
    const [checkAllSugar, setCheckAllSugar] = useState(false);
    const [checkAllIce, setCheckAllIce] = useState(false);

    useEffect(() => {
        // Call API to get all categories when the component mounts
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${baseURL}${categoriesRoutes}`);
                setCategories(response.data);
                // Set the default category to the first one
                if (response.data.length > 0) {
                    setCategoryId(response.data[0]._id);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
    };

    const handleCategoryChange = (event) => {
        setCategoryId(event.target.value);
    };

    const handleChangeName = (event) => {
        setName(event.target.value);
    };

    const handleChangePriceM = (event) => {
        setPriceM(event.target.value);
    };

    const handleChangePriceL = (event) => {
        setPriceL(event.target.value);
    };

    const handleOptionChange = (type, value) => {
        let updatedOptions = { ...options };

        switch (type) {
            case 'temperature':
                if (updatedOptions.temperature.includes(value)) {
                    updatedOptions.temperature = updatedOptions.temperature.filter(item => item !== value);
                } else {
                    updatedOptions.temperature.push(value);
                }
                break;
            case 'sugar':
                if (updatedOptions.sugar.includes(value)) {
                    updatedOptions.sugar = updatedOptions.sugar.filter(item => item !== value);
                } else {
                    updatedOptions.sugar.push(value);
                }
                break;
            case 'ice':
                if (updatedOptions.ice.includes(value)) {
                    updatedOptions.ice = updatedOptions.ice.filter(item => item !== value);
                } else {
                    updatedOptions.ice.push(value);
                }
                break;
            default:
                break;
        }

        setOptions(updatedOptions);
    };

    const handleCheckAllTemperature = () => {
        setCheckAllTemperature(!checkAllTemperature);
        if (!checkAllTemperature) {
            setOptions(prevOptions => ({
                ...prevOptions,
                temperature: ['hot', 'cold']
            }));
        } else {
            setOptions(prevOptions => ({
                ...prevOptions,
                temperature: []
            }));
        }
    };

    const handleCheckAllSugar = () => {
        setCheckAllSugar(!checkAllSugar);
        if (!checkAllSugar) {
            setOptions(prevOptions => ({
                ...prevOptions,
                sugar: ['30%', '50%', '70%']
            }));
        } else {
            setOptions(prevOptions => ({
                ...prevOptions,
                sugar: []
            }));
        }
    };

    const handleCheckAllIce = () => {
        setCheckAllIce(!checkAllIce);
        if (!checkAllIce) {
            setOptions(prevOptions => ({
                ...prevOptions,
                ice: ['30%', '50%', '70%']
            }));
        } else {
            setOptions(prevOptions => ({
                ...prevOptions,
                ice: []
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('prices[M]', priceM);
        formData.append('prices[L]', priceL);
        formData.append('categoryId', categoryId);

        // Add each option to FormData
        options.temperature.forEach(temp => {
            formData.append('options[temperature][]', temp);
        });

        options.sugar.forEach(sugar => {
            formData.append('options[sugar][]', sugar);
        });

        options.ice.forEach(ice => {
            formData.append('options[ice][]', ice);
        });

        if (imageFile) {
            formData.append('image', imageFile);
        }
        console.log(formData)
        try {
            const response = await axios.post(`${baseURL}${drinksRoutes}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if(response.status==201){
                alert("Tạo mới thành công");
                onSave(response.data); // Call the onSave function when request is successful
                onCancel();
            }else{
                alert("Có lỗi");
            }
        } catch (error) {
            console.error('Error saving drink:', error);
            alert('Error saving drink');
        }
    };

    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-md shadow-md">
                <h2 className="text-xl font-semibold mb-4">Thêm đồ uống mới</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên</label>
                        <input required type="text" id="name" value={name} onChange={handleChangeName} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                        <select id="category" value={categoryId} onChange={handleCategoryChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none">
                            {categories.map(category => (
                                <option key={category._id} value={category._id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="priceM" className="block text-sm font-medium text-gray-700">Giá (Size M)</label>
                        <input type="number" id="priceM" value={priceM} onChange={handleChangePriceM} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="priceL" className="block text-sm font-medium text-gray-700">Giá (Size L)</label>
                        <input type="number" id="priceL" value={priceL} onChange={handleChangePriceL} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nhiệt độ</label>
                        <div className="flex items-center">
                            <input type="checkbox" id="selectAllTemperature" checked={checkAllTemperature} onChange={handleCheckAllTemperature} className="mr-2" />
                            <label htmlFor="selectAllTemperature" className="mr-4">Tất cả</label>
                            <input type="checkbox" id="hot" value="hot" checked={options.temperature.includes('hot')} onChange={() => handleOptionChange('temperature', 'hot')} className="mr-2" />
                            <label htmlFor="hot" className="mr-4">Nóng</label>
                            <input type="checkbox" id="cold" value="cold" checked={options.temperature.includes('cold')} onChange={() => handleOptionChange('temperature', 'cold')} />
                            <label htmlFor="cold">Lạnh</label>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Đường</label>
                        <div className="flex items-center">
                            <input type="checkbox" id="selectAllSugar" checked={checkAllSugar} onChange={handleCheckAllSugar} className="mr-2" />
                            <label htmlFor="selectAllSugar" className="mr-4">Tất cả</label>
                            <input type="checkbox" id="sugar30" value="30%" checked={options.sugar.includes('30%')} onChange={() => handleOptionChange('sugar', '30%')} className="mr-2" />
                            <label htmlFor="sugar30" className="mr-4">30% đường</label>
                            <input type="checkbox" id="sugar50" value="50%" checked={options.sugar.includes('50%')} onChange={() => handleOptionChange('sugar', '50%')} className="mr-2" />
                            <label htmlFor="sugar50" className="mr-4">50% đường</label>
                            <input type="checkbox" id="sugar70" value="70%" checked={options.sugar.includes('70%')} onChange={() => handleOptionChange('sugar', '70%')} />
                            <label htmlFor="sugar70">70% đường</label>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Đá</label>
                        <div className="flex items-center">
                            <input type="checkbox" id="selectAllIce" checked={checkAllIce} onChange={handleCheckAllIce} className="mr-2" />
                            <label htmlFor="selectAllIce" className="mr-4">Tất cả</label>
                            <input type="checkbox" id="ice30" value="30%" checked={options.ice.includes('30%')} onChange={() => handleOptionChange('ice', '30%')} className="mr-2" />
                            <label htmlFor="ice30" className="mr-4">30% đá</label>
                            <input type="checkbox" id="ice50" value="50%" checked={options.ice.includes('50%')} onChange={() => handleOptionChange('ice', '50%')} className="mr-2" />
                            <label htmlFor="ice50" className="mr-4">50% đá</label>
                            <input type="checkbox" id="ice70" value="70%" checked={options.ice.includes('70%')} onChange={() => handleOptionChange('ice', '70%')} />
                            <label htmlFor="ice70">70% đá</label>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">Hình ảnh</label>
                        <input required type="file" id="image" onChange={handleImageChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div className="flex justify-between">
                        <button type="button" onClick={onCancel} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Huỷ
                        </button>
                        <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddDrinkForm;
