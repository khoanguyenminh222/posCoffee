import React from 'react';

const UserCard = ({ user }) => {

  return (
    <div key={user._id} className="bg-white rounded-md shadow-md p-4">
            <h2 className="text-xl font-semibold">{user.fullname}</h2>
            <p><span className="font-semibold">Tài khoản:</span> {user.username}</p>
            <p><span className="font-semibold">Ngày sinh:</span> {user.dateOfBirth}</p>
            <p><span className="font-semibold">Giới tính:</span> {user.gender}</p>
            <p><span className="font-semibold">Địa chỉ:</span> {user.address}</p>
            <p><span className="font-semibold">Điện thoại:</span> {user.phoneNumber}</p>
            <p><span className="font-semibold">Email:</span> {user.email}</p>
            <p><span className="font-semibold">Ca:</span> {user.shift}</p>
            <p><span className="font-semibold">Vai trò:</span> {user.role}</p>
          </div>
  );
};

export default UserCard;
