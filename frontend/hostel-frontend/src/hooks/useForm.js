import { useState, useCallback } from 'react';
import { validateFormData } from '../utils/errorHandler';

/**
 * Custom hook for form handling with validation
 * 
 * Usage:
 * const { formData, errors, loading, handleChange, handleSubmit, resetForm } = useForm(
 *   initialValues,
 *   validationSchema,
 *   onSubmit
 * );
 */
export const useForm = (initialValues, validationSchema, onSubmit) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    // Mark field as touched
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate single field
    if (validationSchema && validationSchema[name]) {
      const fieldSchema = { [name]: validationSchema[name] };
      const fieldData = { [name]: formData[name] };
      const validation = validateFormData(fieldData, fieldSchema);

      if (!validation.isValid) {
        setErrors((prev) => ({
          ...prev,
          [name]: validation.errors[name],
        }));
      }
    }
  }, [formData, validationSchema]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitError(null);

      // Validate all fields
      if (validationSchema) {
        const validation = validateFormData(formData, validationSchema);

        if (!validation.isValid) {
          setErrors(validation.errors);
          setTouched(
            Object.keys(validationSchema).reduce((acc, key) => {
              acc[key] = true;
              return acc;
            }, {})
          );
          return;
        }
      }

      setLoading(true);

      try {
        await onSubmit(formData);
      } catch (error) {
        setSubmitError(error.message || 'Form submission failed');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [formData, validationSchema, onSubmit]
  );

  const resetForm = useCallback(() => {
    setFormData(initialValues);
    setErrors({});
    setTouched({});
    setSubmitError(null);
  }, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  return {
    formData,
    errors,
    touched,
    loading,
    submitError,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
  };
};
