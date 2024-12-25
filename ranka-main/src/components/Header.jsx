import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">My App</h1>
        <nav>
          <Link to="/" className="mr-4 hover:text-gray-300">Home</Link>
          <Link to="/about" className="hover:text-gray-300">About</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
