import { motion } from 'framer-motion';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';

const RealEstate = () => {
  const [files, setFiles] = useState([]);

  const validationSchema = Yup.object({
    title: Yup.string().required('Required'),
    propertyType: Yup.string().required('Required'),
    area: Yup.number().required('Required').positive('Must be positive'),
    areaUnit: Yup.string().required('Required'),
    address: Yup.string().required('Required'),
    city: Yup.string().required('Required'),
    state: Yup.string().required('Required'),
    pincode: Yup.string().required('Required'),
    registrationNumber: Yup.string().required('Required'),
    registrationDate: Yup.date().required('Required'),
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
        <h1 className="text-3xl font-bold text-center mb-8">Register Real Estate Asset</h1>
        
        <Formik
          initialValues={{
            title: '',
            propertyType: '',
            area: '',
            areaUnit: 'sqft',
            address: '',
            city: '',
            state: '',
            pincode: '',
            registrationNumber: '',
            registrationDate: '',
            currentValue: '',
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
                  name="title"
                  placeholder="Property Title"
                  className="input-field"
                />
                
                <Field
                  as="select"
                  name="propertyType"
                  className="input-field"
                >
                  <option value="">Select Property Type</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Land">Land</option>
                </Field>

                {/* Area Details */}
                <div className="flex space-x-4">
                  <Field
                    name="area"
                    type="number"
                    placeholder="Area"
                    className="input-field"
                  />
                  <Field
                    as="select"
                    name="areaUnit"
                    className="input-field"
                  >
                    <option value="sqft">sq ft</option>
                    <option value="sqm">sq m</option>
                    <option value="acres">acres</option>
                  </Field>
                </div>

                {/* Location Details */}
                <Field
                  name="address"
                  placeholder="Address"
                  className="input-field"
                />
                <Field
                  name="city"
                  placeholder="City"
                  className="input-field"
                />
                <Field
                  name="state"
                  placeholder="State"
                  className="input-field"
                />
                <Field
                  name="pincode"
                  placeholder="Pincode"
                  className="input-field"
                />

                {/* Registration Details */}
                <Field
                  name="registrationNumber"
                  placeholder="Registration Number"
                  className="input-field"
                />
                <Field
                  name="registrationDate"
                  type="date"
                  className="input-field"
                />
                <Field
                  name="currentValue"
                  type="number"
                  placeholder="Current Value (in INR)"
                  className="input-field"
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
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full btn-primary"
              >
                Register Property
              </motion.button>
            </Form>
          )}
        </Formik>
      </div>
    </motion.div>
  );
};

export default RealEstate;