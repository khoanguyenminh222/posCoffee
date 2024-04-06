import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase';

const DrinkCard = ({ drink }) => {
    const [imageUrl, setImageUrl] = useState(null);
    useEffect(() => {
        const fetchImageUrl = async () => {
            try {
                const storageRef = ref(storage, drink.image);
                const url = await getDownloadURL(storageRef);
                setImageUrl(url);
            } catch (error) {
                console.error('Error getting image URL:', error);
            }
        };
        fetchImageUrl();
    }, [drink.img, storage]);
    return (
        <div className="bg-white shadow-md rounded-md p-4 mb-4">
            <img src={imageUrl} alt={drink.name} className="w-full h-32 object-cover mb-4 rounded-md" />
            <h2 className="text-lg font-semibold">{drink.name}</h2>
            <div className="flex justify-between mt-2">
                <span>Price M: {drink.prices.M}</span>
                <span>Price L: {drink.prices.L}</span>
            </div>
        </div>
    );
}

export default DrinkCard; // Đảm bảo bạn export component này
