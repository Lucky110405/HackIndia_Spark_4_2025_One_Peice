import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AssetChoice = () => {
  const navigate = useNavigate();

  const cardVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-100 py-20"
    >
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Choose Your Asset Type</h1>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="bg-white rounded-xl shadow-lg p-8 cursor-pointer"
            onClick={() => navigate('/real-estate')}
          >
            <h3 className="text-2xl font-semibold mb-4">Real Estate</h3>
            <p className="text-gray-600">
              Tokenize your property assets with secure blockchain verification.
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="bg-white rounded-xl shadow-lg p-8 cursor-pointer"
            onClick={() => navigate('/financial')}
          >
            <h3 className="text-2xl font-semibold mb-4">Financial Assets</h3>
            <p className="text-gray-600">
              Convert financial instruments into verifiable digital tokens.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AssetChoice;