import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';

const PasswordInput = ({ placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  return (
    <div className="relative mb-4">
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        value={password}
        onChange={handlePasswordChange}
        className="border rounded-lg px-4 py-2 pr-10 w-full focus:border-blue-500 focus:outline-none"
      />
      {/* Biểu tượng con mắt */}
      <span
        className="absolute top-0 right-0 mt-2 mr-2 cursor-pointer"
        onClick={handleTogglePassword}
      >
        <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
      </span>
    </div>
  )
}

export default PasswordInput