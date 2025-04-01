import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white"
    >
      <div className="container mx-auto px-4 py-20">
        <motion.h1
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          className="text-5xl md:text-7xl font-bold mb-8"
        >
          A unified decentralized platform 
        </motion.h1>
        
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mb-12"
        >
          <p className="text-xl mb-6">
            Ensures reliable asset ownership and transfers, along with tamper-proof storage and verification of legal documents.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center">
              <CheckIcon className="h-6 w-6 mr-2 text-green-400" />
              Immutable ownership records
            </li>
            <li className="flex items-center">
              <CheckIcon className="h-6 w-6 mr-2 text-green-400" />
              Seamless transfers
            </li>
            <li className="flex items-center">
              <CheckIcon className="h-6 w-6 mr-2 text-green-400" />
              AI-Powered AML checking
            </li>
          </ul>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-lg font-semibold"
          onClick={() => navigate('/auth')}
        >
          Get Started
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Hero;