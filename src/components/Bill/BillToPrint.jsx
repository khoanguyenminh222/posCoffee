import React, { forwardRef, useEffect, useState } from 'react';

const BillToPrint = forwardRef(({ billItems, bill, user, totalAmount }, ref) => {
    const [formattedDateTime, setFormattedDateTime] = useState('');
    useEffect(() => {
        if (bill && bill.createdAt) {
            const createdAt = new Date(bill.createdAt);
            const year = createdAt.getFullYear();
            const month = createdAt.getMonth() + 1; // Tháng bắt đầu từ 0
            const date = createdAt.getDate();
            const hours = createdAt.getHours();
            const minutes = createdAt.getMinutes();
            const seconds = createdAt.getSeconds();
            const formattedDateTime = `${date}/${month}/${year} ${hours}:${minutes}:${seconds}`;
            setFormattedDateTime(formattedDateTime);
        }
    }, [bill]);
    return (
        <div ref={ref} className="billContainer hidden max-w-md mx-auto p-4 rounded-md overflow-y-auto">
            <h1 className="text-center mb-4 text-lg font-semibold">The Coffee Ryo</h1>
            <p className="text-center text-gray-600 mb-2">55A Ngô Đức Kế, P7, TP-Vũng Tàu</p>
            {bill && bill._id && (
                <>
                    <div className="font-semibold">Id: {bill._id}</div>
                    <div className="flex justify-between mb-2">
                        <div className="font-semibold">Thời gian: {formattedDateTime}</div>
                        <div className="font-semibold">Thu ngân: {user.fullname}</div>
                    </div>
                </>
            )}
            <table className="w-full mb-4 table-fixed">
                <thead>
                    <tr>
                        <th className="text-left w-1/3">Tên</th>
                        <th className="text-left w-2/6">Số lượng</th>
                        <th className="text-left w-2/6">Đơn giá</th>
                        <th className="text-left w-1/3">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    {billItems.map((item, index) => (
                        <tr key={index}>
                            <td className="truncate">{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price}đ</td>
                            <td>{item.quantity * item.price}đ</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className="text-right font-semibold">Tổng tiền: {totalAmount}đ</p>

            {/* CSS cho việc in ấn */}
            <style>{`
                @media print {
                    .billContainer {
                        overflow-y: visible !important;
                        display: block !important;
                    }
                }
            `}</style>
        </div>
    );
});

export default BillToPrint;
