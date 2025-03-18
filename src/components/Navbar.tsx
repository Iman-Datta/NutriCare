
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ProfileMenu from './ProfileMenu';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Don't show navbar on landing page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link 
          to={isAuthenticated ? "/bmi-calculator" : "/login"} 
          className="text-xl font-heading font-bold text-primary transition-transform hover:scale-105"
        >
          FitNavi
        </Link>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/about" className="font-medium">
              About Us
            </Link>
          </Button>
          
          {isAuthenticated && <ProfileMenu />}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
