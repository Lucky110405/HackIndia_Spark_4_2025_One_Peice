import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from '@components/Navbar';
import Hero from '@pages/Hero';
import Auth from '@pages/Auth';
import AssetChoice from '@pages/AssetChoice';
import RealEstate from '@pages/RealEstate';
import Financial from '@pages/Financial';
import FraudPrediction from '@pages/FraudPrediction';

function App() {
  return (
    <Router>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/choose-asset" element={<AssetChoice />} />
          <Route path="/real-estate" element={<RealEstate />} />
          <Route path="/financial" element={<Financial />} />
          <Route path="/fraud-prediction" element={<FraudPrediction />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;
