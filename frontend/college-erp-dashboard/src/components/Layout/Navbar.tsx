import React from 'react';
import { FiBell, FiSearch, FiUser, FiMenu } from 'react-icons/fi';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-white/90 backdrop-blur-sm supports-[backdrop-filter]:bg-white/80 shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-20 border-b border-gray-100">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-full hover:bg-gray-100 mr-3 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <FiMenu className="w-5 h-5" />
        </button>
        <div className="flex items-center">
          <FiSearch className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search..."
            className="outline-none bg-transparent"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100" aria-label="Notifications">
          <FiBell className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
            <FiUser className="text-white" />
          </div>
          <span className="text-sm font-medium hidden sm:block">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;