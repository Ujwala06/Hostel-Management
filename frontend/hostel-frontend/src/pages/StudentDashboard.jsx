import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { complaintService, studentService } from '../services';
import { useApi } from '../hooks/useApi';
import { useForm } from '../hooks/useForm';
import { complaintSchema } from '../utils/validationSchemas';
import { showSuccess, showError } from '../utils/toastUtils';
import toast from 'react-hot-toast';
import TopBar from '../components/TopBar';
import SiteFooter from '../components/SiteFooter';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { auth } = useAuth();
  const [activeTab, setActiveTab] = useState('complaints');

  // Fetch student profile
  const {
    data: profile,
    loading: profileLoading,
    error: profileError,
    execute: fetchProfile,
  } = useApi(
    () => studentService.getProfile(auth.id),
    false
  );

  // Fetch complaints
  const {
    data: complaints,
    loading: complaintsLoading,
    error: complaintsError,
    execute: fetchComplaints,
  } = useApi(
    () => complaintService.getStudentComplaints(auth.id),
    false
  );

  // Complaint form
  const {
    formData: complaintForm,
    errors: complaintErrors,
    touched: complaintTouched,
    loading: submittingComplaint,
    handleChange: handleComplaintChange,
    handleBlur: handleComplaintBlur,
    handleSubmit: submitComplaint,
    resetForm: resetComplaintForm,
  } = useForm(
    {
      category: '',
      description: '',
      priority: 'Medium',
    },
    complaintSchema,
    async (data) => {
      try {
        const toastId = toast.loading('Submitting complaint...');
        await complaintService.createComplaint(data);
        toast.dismiss(toastId);
        showSuccess('Complaint submitted successfully!');
        resetComplaintForm();
        await fetchComplaints();
      } catch (error) {
        showError(error.message || 'Failed to submit complaint');
      }
    }
  );

  // Load data on mount
  useEffect(() => {
    fetchProfile();
    fetchComplaints();
  }, []);

  return (
    <div className="page">
      <TopBar />

      <div className="dashboard dashboard--student">
        <div className="dashboard__header">
          <h1>Welcome back, {profile?.name || 'Student'}! 👋</h1>
          {profileError && (
            <div className="alert alert--error">
              <p>{profileError.message}</p>
              <button onClick={fetchProfile} className="btn btn--small">
                Retry
              </button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        {!profileLoading && profile && (
          <div className="card card--profile">
            <h2>Your Profile</h2>
            <div className="profile-grid">
              <div className="profile-item">
                <label>Name:</label>
                <span>{profile.name}</span>
              </div>
              <div className="profile-item">
                <label>Email:</label>
                <span>{profile.email}</span>
              </div>
              <div className="profile-item">
                <label>Roll Number:</label>
                <span>{profile.rollNumber}</span>
              </div>
              <div className="profile-item">
                <label>Room:</label>
                <span>{profile.room?.roomNumber || 'Not assigned'}</span>
              </div>
            </div>
          </div>
        )}

        {profileLoading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        )}

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'complaints' ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveTab('complaints')}
          >
            📋 My Complaints ({complaints?.length || 0})
          </button>
          <button
            className={`tab-btn ${activeTab === 'new-complaint' ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveTab('new-complaint')}
          >
            ➕ Submit New Complaint
          </button>
        </div>

        {/* Complaints List Tab */}
        {activeTab === 'complaints' && (
          <div className="tab-content">
            {complaintsError && (
              <div className="alert alert--error">
                <p>{complaintsError.message}</p>
                <button onClick={fetchComplaints} className="btn btn--small">
                  Retry
                </button>
              </div>
            )}

            {complaintsLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading complaints...</p>
              </div>
            ) : complaints && complaints.length > 0 ? (
              <div className="complaints-list">
                {complaints.map((complaint) => (
                  <div key={complaint.id} className="complaint-card">
                    <div className="complaint-header">
                      <h3>{complaint.category}</h3>
                      <span className={`status-badge status--${complaint.status.toLowerCase()}`}>
                        {complaint.status}
                      </span>
                    </div>
                    <p className="complaint-description">{complaint.description}</p>
                    <div className="complaint-meta">
                      <span className={`priority-badge priority--${complaint.priority.toLowerCase()}`}>
                        {complaint.priority} Priority
                      </span>
                      <span className="complaint-date">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No complaints yet. Everything looks good! ✅</p>
              </div>
            )}
          </div>
        )}

        {/* New Complaint Tab */}
        {activeTab === 'new-complaint' && (
          <div className="tab-content">
            <form onSubmit={submitComplaint} className="form">
              {/* Category */}
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={complaintForm.category}
                  onChange={handleComplaintChange}
                  onBlur={handleComplaintBlur}
                  disabled={submittingComplaint}
                  className={`form-input ${
                    complaintTouched.category && complaintErrors.category
                      ? 'form-input--error'
                      : ''
                  }`}
                  required
                >
                  <option value="">Select category</option>
                  <option value="Cleaning">🧹 Cleaning</option>
                  <option value="Electrical">⚡ Electrical</option>
                  <option value="Plumbing">🚿 Plumbing</option>
                  <option value="WiFi">📡 WiFi</option>
                  <option value="Furniture">🪑 Furniture</option>
                  <option value="Other">📝 Other</option>
                </select>
                {complaintTouched.category && complaintErrors.category && (
                  <span className="form-error">{complaintErrors.category}</span>
                )}
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={complaintForm.description}
                  onChange={handleComplaintChange}
                  onBlur={handleComplaintBlur}
                  placeholder="Describe the issue in detail..."
                  disabled={submittingComplaint}
                  className={`form-input form-textarea ${
                    complaintTouched.description && complaintErrors.description
                      ? 'form-input--error'
                      : ''
                  }`}
                  rows="5"
                  required
                />
                <span className="char-count">
                  {complaintForm.description.length}/500
                </span>
                {complaintTouched.description && complaintErrors.description && (
                  <span className="form-error">{complaintErrors.description}</span>
                )}
              </div>

              {/* Priority */}
              <div className="form-group">
                <label htmlFor="priority">Priority *</label>
                <select
                  id="priority"
                  name="priority"
                  value={complaintForm.priority}
                  onChange={handleComplaintChange}
                  disabled={submittingComplaint}
                  className={`form-input ${
                    complaintTouched.priority && complaintErrors.priority
                      ? 'form-input--error'
                      : ''
                  }`}
                  required
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submittingComplaint}
                className={`btn btn--primary ${
                  submittingComplaint ? 'btn--loading' : ''
                }`}
              >
                {submittingComplaint ? (
                  <>
                    <span className="spinner"></span> Submitting...
                  </>
                ) : (
                  'Submit Complaint'
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
};

export default StudentDashboard;
