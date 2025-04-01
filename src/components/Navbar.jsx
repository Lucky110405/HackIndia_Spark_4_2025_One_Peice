import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">AssetChain</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/auth" 
              className={`px-3 py-2 rounded-md ${
                location.pathname === '/auth' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;