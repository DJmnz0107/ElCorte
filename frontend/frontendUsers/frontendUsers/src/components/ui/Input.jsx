import React from 'react';
import { Search } from 'lucide-react';

const Input = ({ className = '', withIcon = false, ...props }) => {
  return (
    <div className="relative">
      {withIcon && (
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      )}
      <input
        className={`h-8 pl-10 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#601008] ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;