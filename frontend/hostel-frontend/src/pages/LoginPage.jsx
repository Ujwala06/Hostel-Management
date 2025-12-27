import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { loginSchema, workerLoginSchema } from '../utils/validationSchemas';
import { showError, showSuccess } from '../utils/toastUtils';
import SiteFooter from '../components/SiteFooter';
import toast from 'react-hot-toast';
import './LoginPage.css';

const LoginPage = () => {
  const [roleType, setRoleType] = useState('student');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Determine schema based on role
  const currentSchema = roleType === 'worker' ? workerLoginSchema : loginSchema;

  // Initialize form
  const {
    formData,
    errors,
    touched,
    loading,
    handleChange,
    handleBlur,
    handleSubmit: onSubmit,
    resetForm,
  } = useForm(
    roleType === 'worker'
      ? { phone: '', password: '' }
      : { email: '', password: '' },
    currentSchema,
    async (data) => {
      try {
        const toastId = toast.loading('Logging in...');

        if (roleType === 'worker') {
          await login(data.phone, data.password, 'worker');
        } else if (roleType === 'admin') {
          await login(data.email, data.password, 'admin');
        } else {
          await login(data.email, data.password, 'student');
        }

        toast.dismiss(toastId);
        showSuccess('Login successful!');

        // Redirect based on role
        setTimeout(() => {
          if (roleType === 'admin') {
            navigate('/admin');
          } else if (roleType === 'worker') {
            navigate('/worker');
          } else {
            navigate('/student');
          }
        }, 1000);
      } catch (error) {
        showError(error.message || 'Login failed. Please check your credentials.');
      }
    }
  );

  const handleFormSubmit = async (e) => {
    try {
      await onSubmit(e);
    } catch (err) {
      // Error already shown via toast
    }
  };

  const handleRoleChange = (newRole) => {
    setRoleType(newRole);
    resetForm();
  };

  return (
    <div className="page page--center">
      <div className="card card--auth">
        <h1>🏛️ Hostel Management Login</h1>
        <p className="text--muted">Sign in as student, admin/warden, or worker.</p>

        {/* Role Switch Buttons */}
        <div className="role-switch">
          <button
            type="button"
            className={`role-switch__btn ${
              roleType === 'student' ? 'role-switch__btn--active' : ''
            }`}
            onClick={() => handleRoleChange('student')}
            disabled={loading}
          >
            👤 Student
          </button>
          <button
            type="button"
            className={`role-switch__btn ${
              roleType === 'admin' ? 'role-switch__btn--active' : ''
            }`}
            onClick={() => handleRoleChange('admin')}
            disabled={loading}
          >
            🔐 Admin
          </button>
          <button
            type="button"
            className={`role-switch__btn ${
              roleType === 'worker' ? 'role-switch__btn--active' : ''
            }`}
            onClick={() => handleRoleChange('worker')}
            disabled={loading}
          >
            🔧 Worker
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleFormSubmit} className="form">
          {/* Email/Phone Field */}
          <div className="form-group">
            <label htmlFor={roleType === 'worker' ? 'phone' : 'email'}>
              {roleType === 'worker' ? 'Phone Number' : 'Email'}
            </label>
            <input
              type={roleType === 'worker' ? 'tel' : 'email'}
              id={roleType === 'worker' ? 'phone' : 'email'}
              name={roleType === 'worker' ? 'phone' : 'email'}
              value={
                formData[roleType === 'worker' ? 'phone' : 'email'] || ''
              }
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={
                roleType === 'worker'
                  ? 'Enter 10-digit phone number'
                  : 'Enter your email'
              }
              disabled={loading}
              className={`form-input ${
                touched[roleType === 'worker' ? 'phone' : 'email'] &&
                errors[roleType === 'worker' ? 'phone' : 'email']
                  ? 'form-input--error'
                  : ''
              }`}
              required
            />
            {touched[roleType === 'worker' ? 'phone' : 'email'] &&
              errors[roleType === 'worker' ? 'phone' : 'email'] && (
                <span className="form-error">
                  {errors[roleType === 'worker' ? 'phone' : 'email']}
                </span>
              )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your password"
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
                <span className="spinner"></span> Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Register Link */}
        <p className="text--center text--small">
          Don't have an account?{' '}
          <a href="/register" className="link">
            Register here
          </a>
        </p>
      </div>

      <SiteFooter />
    </div>
  );
};

export default LoginPage;
