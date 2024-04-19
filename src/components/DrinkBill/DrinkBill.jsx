import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

function DrinkBill({item, onDelete, onIncrement, onDecrement}) {
    const { temperature, sugar, ice, size } = item.options;
    const [showNoteInput, setShowNoteInput] = useState(false);
    const [note, setNote] = useState('');

    const handleNoteClick = () => {
        setShowNoteInput(!showNoteInput);
    };
    const handleChangeNote = (event) => {
        setNote(event.target.value);
    };
    return (
        <div className='mb-6'>
            <div className="flex items-center mb-1">
                <div className="flex-grow">
                    <div className="font-semibold capitalize">{item.name}</div>
                    <div className="flex items-center">
                    <button onClick={() => onDecrement(item)} className="text-sm mr-2 bg-gray-200 rounded-full px-2 focus:outline-none">-</button>
                        <div className="text-sm mr-2">{item.quantity}</div>
                        <button onClick={() => onIncrement(item)} className="text-sm bg-gray-200 rounded-full px-2 focus:outline-none">+</button>
                        <div
                            className="text-sm text-orange-500 flex items-center cursor-pointer"
                            onClick={handleNoteClick}
                        >
                            Ghi chú
                            <span className="ml-1"><FontAwesomeIcon icon={faPen} className="text-md" /></span>
                        </div>
                    </div>
                </div>
                <div className="text-sm ml-auto">{item.price.toLocaleString('vi-VN')}</div>
                <button onClick={() => onDelete(item)} className="text-sm ml-4 text-red-500 focus:outline-none"><FontAwesomeIcon icon={faTrash} /></button>
            </div>
            {showNoteInput && (
                <input
                    type="text"
                    className="border border-gray-300 rounded p-1 w-full focus:outline-none mb-4"
                    placeholder="Nhập ghi chú"
                    value={note}
                    onChange={handleChangeNote}
                />
            )}
            {/* Thêm thông tin về đá%, đường%, và size */}
            <div className="text-sm">
                <div className='flex'>
                    {size && <div>Size: {size}</div>}
                    {temperature && <div className='ml-3'>{temperature=="cold"?"lạnh":"nóng"}</div>}
                </div>
                
                {ice && <div>Đá: {ice}</div>}
                {sugar && <div>Đường: {sugar}</div>}
            </div>
        </div>
    );
}

export default DrinkBill;
