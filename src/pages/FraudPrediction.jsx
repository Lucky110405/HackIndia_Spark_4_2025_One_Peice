import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { FileUpload } from '../components/FileUpload';

const FraudPrediction = () => {
  const [files, setFiles] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (uploadedFiles) => {
    setFiles(uploadedFiles);
  };

  const handleAnalysis = async () => {
    setLoading(true);
    try {
      // Implement your fraud detection API call here
      const mockAnalysis = {
        riskScore: 85,
        confidence: 92,
        flags: [
          { type: 'document_authenticity', score: 95, status: 'verified' },
          { type: 'ownership_verification', score: 88, status: 'verified' },
          { type: 'value_assessment', score: 82, status: 'warning' },
        ],
        recommendations: [
          'Verify recent property valuation',
          'Cross-check ownership history',
          'Validate document signatures'
        ]
      };
      setAnalysis(mockAnalysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 py-12 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Asset Fraud Detection System
        </h1>

        <div className="space-y-8">
          <Card title="Document Analysis">
            <FileUpload
              onFileSelect={handleFileUpload}
              accept=".pdf,.jpg,.jpeg,.png"
              multiple={true}
            />
            <Button
              onClick={handleAnalysis}
              loading={loading}
              disabled={files.length === 0}
              className="mt-4"
            >
              Analyze Documents
            </Button>
          </Card>

          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card title="Risk Assessment">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg">Risk Score</div>
                  <div className={`text-2xl font-bold ${
                    analysis.riskScore > 90 ? 'text-green-500' :
                    analysis.riskScore > 70 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {analysis.riskScore}%
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${analysis.riskScore}%` }}
                    className={`h-full ${
                      analysis.riskScore > 90 ? 'bg-green-500' :
                      analysis.riskScore > 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  />
                </div>
              </Card>

              <Card title="Verification Flags">
                <div className="space-y-4">
                  {analysis.flags.map((flag, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">
                          {flag.type.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </div>
                        <div className="text-sm text-gray-500">
                          Confidence: {flag.score}%
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm ${
                        flag.status === 'verified' ? 'bg-green-100 text-green-800' :
                        flag.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {flag.status.charAt(0).toUpperCase() + flag.status.slice(1)}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Recommendations">
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FraudPrediction;