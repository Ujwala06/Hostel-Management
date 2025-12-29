/**
 * Data Transformers - Convert API responses to frontend format
 * This file contains all transformation functions for data normalization
 * between backend API responses and frontend consumption.
 */

// ============ COMPLAINT TRANSFORMERS ============

/**
 * Transform single complaint from API format to frontend format
 * @param {Object} apiComplaint - Complaint object from API
 * @returns {Object} Normalized complaint object for frontend
 */
export const transformComplaint = (apiComplaint) => ({
  id: apiComplaint._id,
  student: apiComplaint.student,
  category: apiComplaint.category,
  description: apiComplaint.description,
  status: apiComplaint.status,
  priority: apiComplaint.priority,
  assignedWorker: apiComplaint.assignedWorker,
  createdAt: new Date(apiComplaint.createdAt),
  updatedAt: new Date(apiComplaint.updatedAt),
  completedAt: apiComplaint.completedAt ? new Date(apiComplaint.completedAt) : null,
});

/**
 * Transform array of complaints
 * @param {Array} complaints - Array of complaint objects from API
 * @returns {Array} Array of normalized complaint objects
 */
export const transformComplaints = (complaints) =>
  complaints.map(transformComplaint);

/**
 * Reverse transform - Convert frontend complaint data to API format
 * @param {Object} frontendComplaint - Complaint object from frontend
 * @returns {Object} API-compatible complaint object
 */
export const reverseTransformComplaint = (frontendComplaint) => ({
  _id: frontendComplaint.id,
  student: frontendComplaint.student,
  category: frontendComplaint.category,
  description: frontendComplaint.description,
  status: frontendComplaint.status,
  priority: frontendComplaint.priority,
  assignedWorker: frontendComplaint.assignedWorker,
  createdAt: frontendComplaint.createdAt?.toISOString(),
  updatedAt: frontendComplaint.updatedAt?.toISOString(),
  completedAt: frontendComplaint.completedAt?.toISOString() || null,
});

// ============ ROOM TRANSFORMERS ============

/**
 * Transform single room from API format to frontend format
 * @param {Object} apiRoom - Room object from API
 * @returns {Object} Normalized room object for frontend
 */
export const transformRoom = (apiRoom) => ({
  id: apiRoom._id,
  roomNo: apiRoom.roomNo,
  floor: apiRoom.floor,
  capacity: apiRoom.capacity,
  roomType: apiRoom.roomType,
  currentOccupancy: apiRoom.currentOccupancy || 0,
  availableBeds: (apiRoom.capacity - (apiRoom.currentOccupancy || 0)),
  occupancyPercentage: Math.round(((apiRoom.currentOccupancy || 0) / apiRoom.capacity) * 100),
  students: apiRoom.students || [],
  block: apiRoom.block,
});

/**
 * Transform array of rooms
 * @param {Array} rooms - Array of room objects from API
 * @returns {Array} Array of normalized room objects
 */
export const transformRooms = (rooms) =>
  rooms.map(transformRoom);

/**
 * Reverse transform - Convert frontend room data to API format
 * @param {Object} frontendRoom - Room object from frontend
 * @returns {Object} API-compatible room object
 */
export const reverseTransformRoom = (frontendRoom) => ({
  _id: frontendRoom.id,
  roomNo: frontendRoom.roomNo,
  floor: frontendRoom.floor,
  capacity: frontendRoom.capacity,
  roomType: frontendRoom.roomType,
  currentOccupancy: frontendRoom.currentOccupancy,
  block: frontendRoom.block,
});

// ============ STUDENT TRANSFORMERS ============

/**
 * Transform single student from API format to frontend format
 * @param {Object} apiStudent - Student object from API
 * @returns {Object} Normalized student object for frontend
 */
export const transformStudent = (apiStudent) => ({
  id: apiStudent._id,
  name: apiStudent.name,
  email: apiStudent.email,
  phone: apiStudent.phone,
  rollNumber: apiStudent.rollNumber,
  roomNo: apiStudent.roomNo,
  branch: apiStudent.branch,
  semester: apiStudent.semester,
  status: apiStudent.status || 'Active',
  enrollmentDate: apiStudent.enrollmentDate ? new Date(apiStudent.enrollmentDate) : null,
  lastUpdated: new Date(apiStudent.updatedAt || Date.now()),
});

/**
 * Transform array of students
 * @param {Array} students - Array of student objects from API
 * @returns {Array} Array of normalized student objects
 */
export const transformStudents = (students) =>
  students.map(transformStudent);

/**
 * Reverse transform - Convert frontend student data to API format
 * @param {Object} frontendStudent - Student object from frontend
 * @returns {Object} API-compatible student object
 */
export const reverseTransformStudent = (frontendStudent) => ({
  _id: frontendStudent.id,
  name: frontendStudent.name,
  email: frontendStudent.email,
  phone: frontendStudent.phone,
  rollNumber: frontendStudent.rollNumber,
  roomNo: frontendStudent.roomNo,
  branch: frontendStudent.branch,
  semester: frontendStudent.semester,
  status: frontendStudent.status,
});

// ============ WORKER TRANSFORMERS ============

/**
 * Transform single worker from API format to frontend format
 * @param {Object} apiWorker - Worker object from API
 * @returns {Object} Normalized worker object for frontend
 */
export const transformWorker = (apiWorker) => ({
  id: apiWorker._id,
  name: apiWorker.name,
  email: apiWorker.email,
  phone: apiWorker.phone,
  department: apiWorker.department,
  role: apiWorker.role,
  assignedComplaints: apiWorker.assignedComplaints || [],
  completedComplaints: apiWorker.completedComplaints || 0,
  status: apiWorker.status || 'Active',
});

/**
 * Transform array of workers
 * @param {Array} workers - Array of worker objects from API
 * @returns {Array} Array of normalized worker objects
 */
export const transformWorkers = (workers) =>
  workers.map(transformWorker);

/**
 * Reverse transform - Convert frontend worker data to API format
 * @param {Object} frontendWorker - Worker object from frontend
 * @returns {Object} API-compatible worker object
 */
export const reverseTransformWorker = (frontendWorker) => ({
  _id: frontendWorker.id,
  name: frontendWorker.name,
  email: frontendWorker.email,
  phone: frontendWorker.phone,
  department: frontendWorker.department,
  role: frontendWorker.role,
  status: frontendWorker.status,
});

// ============ EMERGENCY TRANSFORMERS ============

/**
 * Transform single emergency from API format to frontend format
 * @param {Object} apiEmergency - Emergency object from API
 * @returns {Object} Normalized emergency object for frontend
 */
export const transformEmergency = (apiEmergency) => ({
  id: apiEmergency._id,
  student: apiEmergency.student,
  type: apiEmergency.type,
  description: apiEmergency.description,
  severity: apiEmergency.severity,
  location: apiEmergency.location,
  status: apiEmergency.status,
  assignedWorker: apiEmergency.assignedWorker,
  createdAt: new Date(apiEmergency.createdAt),
  resolvedAt: apiEmergency.resolvedAt ? new Date(apiEmergency.resolvedAt) : null,
});

/**
 * Transform array of emergencies
 * @param {Array} emergencies - Array of emergency objects from API
 * @returns {Array} Array of normalized emergency objects
 */
export const transformEmergencies = (emergencies) =>
  emergencies.map(transformEmergency);

/**
 * Reverse transform - Convert frontend emergency data to API format
 * @param {Object} frontendEmergency - Emergency object from frontend
 * @returns {Object} API-compatible emergency object
 */
export const reverseTransformEmergency = (frontendEmergency) => ({
  _id: frontendEmergency.id,
  student: frontendEmergency.student,
  type: frontendEmergency.type,
  description: frontendEmergency.description,
  severity: frontendEmergency.severity,
  location: frontendEmergency.location,
  status: frontendEmergency.status,
  assignedWorker: frontendEmergency.assignedWorker,
});

// ============ NOTIFICATION TRANSFORMERS ============

/**
 * Transform single notification from API format to frontend format
 * @param {Object} apiNotification - Notification object from API
 * @returns {Object} Normalized notification object for frontend
 */
export const transformNotification = (apiNotification) => ({
  id: apiNotification._id,
  title: apiNotification.title,
  message: apiNotification.message,
  type: apiNotification.type,
  recipient: apiNotification.recipient,
  isRead: apiNotification.isRead || false,
  createdAt: new Date(apiNotification.createdAt),
  readAt: apiNotification.readAt ? new Date(apiNotification.readAt) : null,
});

/**
 * Transform array of notifications
 * @param {Array} notifications - Array of notification objects from API
 * @returns {Array} Array of normalized notification objects
 */
export const transformNotifications = (notifications) =>
  notifications.map(transformNotification);

/**
 * Reverse transform - Convert frontend notification data to API format
 * @param {Object} frontendNotification - Notification object from frontend
 * @returns {Object} API-compatible notification object
 */
export const reverseTransformNotification = (frontendNotification) => ({
  _id: frontendNotification.id,
  title: frontendNotification.title,
  message: frontendNotification.message,
  type: frontendNotification.type,
  recipient: frontendNotification.recipient,
  isRead: frontendNotification.isRead,
});

// ============ UTILITY FUNCTIONS ============

/**
 * Safe transform with fallback
 * Transforms data with error handling
 * @param {Object} data - Data to transform
 * @param {Function} transformer - Transformer function
 * @returns {Object} Transformed data or original data if transform fails
 */
export const safeTransform = (data, transformer) => {
  try {
    return transformer(data);
  } catch (error) {
    console.error('Transform error:', error);
    return data; // Return original data if transform fails
  }
};

/**
 * Batch transform with safety
 * @param {Array} dataArray - Array of data to transform
 * @param {Function} transformer - Transformer function
 * @returns {Array} Array of transformed data
 */
export const safeBatchTransform = (dataArray, transformer) => {
  if (!Array.isArray(dataArray)) return [];
  return dataArray.map(item => safeTransform(item, transformer));
};
