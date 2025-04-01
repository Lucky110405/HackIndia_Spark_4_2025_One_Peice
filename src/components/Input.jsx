import { Field } from 'formik';

const Input = ({ 
  name, 
  label, 
  type = "text", 
  placeholder = "", 
  className = "",
  error,
  touched 
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <Field
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className={`
          w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${error && touched ? 'border-red-500' : 'border-gray-300'}
        `}
      />
      {error && touched && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;