import { motion } from 'framer-motion';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';

const Financial = () => {
  const [files, setFiles] = useState([]);

  const validationSchema = Yup.object({
    assetType: Yup.string().required('Required'),
    assetId: Yup.string().required('Required'),
    issuer: Yup.string().required('Required'),
    issueDate: Yup.date().required('Required'),
    maturityDate: Yup.date().min(
      Yup.ref('issueDate'),
      'Maturity date must be after issue date'
    ),
    faceValue: Yup.number().required('Required').positive('Must be positive'),
    currentValue: Yup.number().required('Required').positive('Must be positive'),
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Register Financial Asset</h1>
        
        <Formik
          initialValues={{
            assetType: '',
            assetId: '',
            issuer: '',
            issueDate: '',
            maturityDate: '',
            faceValue: '',
            currentValue: '',
            description: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log(values, files);
          }}
        >
          {({ errors, touched }) => (
            <Form className="space-y-6 bg-white p-8 rounded-xl shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field
                  as="select"
                  name="assetType"
                  className="input-field"
                >
                  <option value="">Select Asset Type</option>
                  <option value="Bonds">Bonds</option>
                  <option value="Stocks">Stocks</option>
                  <option value="MutualFunds">Mutual Funds</option>
                  <option value="FixedDeposits">Fixed Deposits</option>
                </Field>

                <Field
                  name="assetId"
                  placeholder="Asset ID/Certificate Number"
                  className="input-field"
                />

                <Field
                  name="issuer"
                  placeholder="Issuer Name"
                  className="input-field"
                />

                <Field
                  name="issueDate"
                  type="date"
                  className="input-field"
                />

                <Field
                  name="maturityDate"
                  type="date"
                  className="input-field"
                />

                <Field
                  name="faceValue"
                  type="number"
                  placeholder="Face Value (in INR)"
                  className="input-field"
                />

                <Field
                  name="currentValue"
                  type="number"
                  placeholder="Current Value (in INR)"
                  className="input-field"
                />

                <Field
                  name="description"
                  as="textarea"
                  placeholder="Asset Description"
                  className="input-field col-span-2"
                  rows="4"
                />
              </div>

              {/* Document Upload */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Upload Documents</h3>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files))}
                  className="w-full"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Upload relevant certificates, proof of ownership, and other supporting documents
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full btn-primary"
              >
                Register Financial Asset
              </motion.button>
            </Form>
          )}
        </Formik>
      </div>
    </motion.div>
  );
};

export default Financial;