import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import {
  registerStudentSchema,
  registerWorkerSchema,
} from '../utils/validationSchemas';
import { showError, showSuccess } from '../utils/toastUtils';
import toast from 'react-hot-toast';
import SiteFooter from '../components/SiteFooter';
import './RegisterPage.css';

const RegisterPage = () => {
  const [userType, setUserType] = useState('student');
  const { register } = useAuth();
  const navigate = useNavigate();

  const currentSchema =
    userType === 'worker' ? registerWorkerSchema : registerStudentSchema;

  const initialValues =
    userType === 'worker'
      ? {
          name: '',
          email: '',
          phone: '',
          position: '',
          password: '',
        }
      : {
          name: '',
          email: '',
          phone: '',
          rollNumber: '',
          branch: '',
          semester: '',
          password: '',
          confirmPassword: '',
        };

  const {
    formData,
    errors,
    touched,
    loading,
    handleChange,
    handleBlur,
    handleSubmit: onSubmit,
    resetForm,
  } = useForm(initialValues, currentSchema, async (data) => {
    try {
      // Extra validation for confirm password
      if (
        userType === 'student' &&
        data.password !== data.confirmPassword
      ) {
        showError('Passwords do not match');
        return;
      }

      const toastId = toast.loading('Registering...');

      // Remove confirmPassword before sending to API
      const submitData = { ...data };
      delete submitData.confirmPassword;

      await register(submitData, userType);

      toast.dismiss(toastId);
      showSuccess('Registration successful! Redirecting...');

      setTimeout(() => {
        navigate(`/${userType}`);
      }, 1500);
    } catch (error) {
      showError(error.message || 'Registration failed. Please try again.');
    }
  });

  const handleUserTypeChange = (newType) => {
    setUserType(newType);
    resetForm();
  };

  return (
    <div className="page page--center">
      <div className="card card--auth">
        <h1>🏛️ Hostel Management Register</h1>
        <p className="text--muted">
          Create a new account as a student or worker
        </p>

        {/* User Type Switch */}
        <div className="role-switch">
          <button
            type="button"
            className={`role-switch__btn ${
              userType === 'student' ? 'role-switch__btn--active' : ''
            }`}
            onClick={() => handleUserTypeChange('student')}
            disabled={loading}
          >
            👤 Student
          </button>
          <button
            type="button"
            className={`role-switch__btn ${
              userType === 'worker' ? 'role-switch__btn--active' : ''
            }`}
            onClick={() => handleUserTypeChange('worker')}
            disabled={loading}
          >
            🔧 Worker
          </button>
        </div>

        {/* Registration Form */}
        <form onSubmit={onSubmit} className="form">
          {/* Name Field */}
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your full name"
              disabled={loading}
              className={`form-input ${
                touched.name && errors.name ? 'form-input--error' : ''
              }`}
              required
            />
            {touched.name && errors.name && (
              <span className="form-error">{errors.name}</span>
            )}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
              disabled={loading}
              className={`form-input ${
                touched.email && errors.email ? 'form-input--error' : ''
              }`}
              required
            />
            {touched.email && errors.email && (
              <span className="form-error">{errors.email}</span>
            )}
          </div>

          {/* Phone Field */}
          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter 10-digit phone number"
              disabled={loading}
              className={`form-input ${
                touched.phone && errors.phone ? 'form-input--error' : ''
              }`}
              required
            />
            {touched.phone && errors.phone && (
              <span className="form-error">{errors.phone}</span>
            )}
          </div>

          {/* Student-specific fields */}
          {userType === 'student' && (
            <>
              {/* Roll Number */}
              <div className="form-group">
                <label htmlFor="rollNumber">Roll Number *</label>
                <input
                  type="text"
                  id="rollNumber"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g., 21BCA001"
                  disabled={loading}
                  className={`form-input ${
                    touched.rollNumber && errors.rollNumber
                      ? 'form-input--error'
                      : ''
                  }`}
                  required
                />
                {touched.rollNumber && errors.rollNumber && (
                  <span className="form-error">{errors.rollNumber}</span>
                )}
              </div>

              {/* Branch */}
              <div className="form-group">
                <label htmlFor="branch">Branch *</label>
                <select
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={`form-input ${
                    touched.branch && errors.branch ? 'form-input--error' : ''
                  }`}
                  required
                >
                  <option value="">Select branch</option>
                  <option value="BCA">BCA</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="B.Sc">B.Sc</option>
                </select>
                {touched.branch && errors.branch && (
                  <span className="form-error">{errors.branch}</span>
                )}
              </div>

              {/* Semester */}
              <div className="form-group">
                <label htmlFor="semester">Semester *</label>
                <select
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={`form-input ${
                    touched.semester && errors.semester ? 'form-input--error' : ''
                  }`}
                  required
                >
                  <option value="">Select semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
                {touched.semester && errors.semester && (
                  <span className="form-error">{errors.semester}</span>
                )}
              </div>
            </>
          )}

        {/* Worker-specific fields */}
{userType === 'worker' && (
  <div className="form-group">
    <label htmlFor="position">Position *</label>
    <select
      id="position"
      name="position"
      value={formData.position}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={loading}
      className={`form-input ${
        touched.position && errors.position ? 'form-input--error' : ''
      }`}
      required
    >
      <option value="">Select position</option>
      <option value="Electrician">Electrician</option>
      <option value="Plumber">Plumber</option>
      <option value="Cleaner">Cleaner</option>
      <option value="Maintenance">Maintenance</option>
      <option value="Security">Security</option>
    </select>
    {touched.position && errors.position && (
      <span className="form-error">{errors.position}</span>
    )}
  </div>
)}

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Minimum 6 characters"
              disabled={loading}
              className={`form-input ${
                touched.password && errors.password ? 'form-input--error' : ''
              }`}
              required
            />
            {touched.password && errors.password && (
              <span className="form-error">{errors.password}</span>
            )}
          </div>

          {/* Confirm Password (Student only) */}
          {userType === 'student' && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Re-enter your password"
                disabled={loading}
                className={`form-input ${
                  touched.confirmPassword && errors.confirmPassword
                    ? 'form-input--error'
                    : ''
                }`}
                required
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <span className="form-error">{errors.confirmPassword}</span>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`btn btn--primary btn--full ${
              loading ? 'btn--loading' : ''
            }`}
          >
            {loading ? (
              <>
                <span className="spinner"></span> Registering...
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="text--center text--small">
          Already have an account?{' '}
          <a href="/login" className="link">
            Login here
          </a>
        </p>
      </div>

      <SiteFooter />
    </div>
  );
};

export default RegisterPage;

