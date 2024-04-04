import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

function DrinkBill({item}) {
    const [showNoteInput, setShowNoteInput] = useState(false);

    const handleNoteClick = () => {
        setShowNoteInput(!showNoteInput);
    };
    console.log(item);
    return (
        <div className='mb-6'>
            <div className="flex items-center mb-1">
                <img src="/images/coffee1.png" alt="Đồ uống" className="w-8 h-8 rounded mr-2" />
                <div className="flex-grow">
                    <div className="font-semibold">{item.name}</div>
                    <div className="flex items-center">
                        <div className="text-sm mr-2">x2</div>
                        <div
                            className="text-sm text-orange-500 flex items-center cursor-pointer"
                            onClick={handleNoteClick}
                        >
                            Ghi chú
                            <span className="ml-1"><FontAwesomeIcon icon={faPen} className="text-md" /></span>
                        </div>
                    </div>
                </div>
                <div className="text-sm ml-auto">20.000Đ</div>
            </div>
            {showNoteInput && (
                <input
                    type="text"
                    className="border border-gray-300 rounded p-1 w-full focus:outline-none mb-4"
                    placeholder="Nhập ghi chú"
                />
            )}
            {/* Thêm thông tin về đá%, đường%, và size */}
            <div className="text-sm">
                <div>Đá: 50%</div>
                <div>Đường: 30%</div>
                <div>Size: Lớn</div>
            </div>
        </div>
    );
}

export default DrinkBill;
