/**
 * Validation schemas for all forms in the app
 * Each schema defines rules for field validation
 */

export const loginSchema = {
  email: {
    label: 'Email',
    required: true,
    type: 'email',
    minLength: 5,
  },
  password: {
    label: 'Password',
    required: true,
    minLength: 6,
    maxLength: 50,
  },
};

export const workerLoginSchema = {
  phone: {
    label: 'Phone Number',
    required: true,
    type: 'phone',
    pattern: /^[0-9]{10}$/,
    patternMessage: 'Please enter a valid 10-digit phone number',
  },
  password: {
    label: 'Password',
    required: true,
    minLength: 6,
  },
};

export const registerStudentSchema = {
  name: {
    label: 'Full Name',
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  email: {
    label: 'Email',
    required: true,
    type: 'email',
  },
  phone: {
    label: 'Phone Number',
    required: true,
    type: 'phone',
  },
  rollNumber: {
    label: 'Roll Number',
    required: true,
    minLength: 6,
    maxLength: 20,
  },
  branch: {
    label: 'Branch',
    required: true,
  },
  semester: {
    label: 'Semester',
    required: true,
  },
  password: {
    label: 'Password',
    required: true,
    minLength: 6,
    maxLength: 50,
  },
  confirmPassword: {
    label: 'Confirm Password',
    required: true,
    minLength: 6,
  },
};

export const registerWorkerSchema = {
  name: {
    label: 'Full Name',
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  email: {
    label: 'Email',
    required: true,
    type: 'email',
  },
  phone: {
    label: 'Phone Number',
    required: true,
    type: 'phone',
  },
  position: {
    label: 'Position',
    required: true,
  },
  password: {
    label: 'Password',
    required: true,
    minLength: 6,
  },
};

export const complaintSchema = {
  category: {
    label: 'Category',
    required: true,
  },
  description: {
    label: 'Description',
    required: true,
    minLength: 10,
    maxLength: 500,
  },
  priority: {
    label: 'Priority',
    required: true,
  },
};

export const roomManagementSchema = {
  roomNumber: {
    label: 'Room Number',
    required: true,
    minLength: 3,
    maxLength: 10,
  },
  capacity: {
    label: 'Capacity',
    required: true,
    type: 'number',
    min: 1,
    max: 6,
  },
  floor: {
    label: 'Floor',
    required: true,
    type: 'number',
  },
  block: {
    label: 'Block',
    required: true,
  },
};

export const emergencySchema = {
  type: {
    label: 'Emergency Type',
    required: true,
  },
  roomNo: {
    label: 'Room Number',
    required: true,
  },
  description: {
    label: 'Description',
    required: true,
    minLength: 10,
    maxLength: 500,
  },
};

export const updateProfileSchema = {
  name: {
    label: 'Full Name',
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  phone: {
    label: 'Phone Number',
    required: true,
    type: 'phone',
  },
  email: {
    label: 'Email',
    required: true,
    type: 'email',
  },
};
