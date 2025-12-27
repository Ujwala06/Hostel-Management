// Transform backend complaint to frontend format
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

// Transform array of complaints
export const transformComplaints = (complaints) =>
  complaints.map(transformComplaint);

// Transform backend room to frontend format
export const transformRoom = (apiRoom) => ({
  id: apiRoom._id,
  roomNumber: apiRoom.roomNumber,
  capacity: apiRoom.capacity,
  occupants: apiRoom.occupants || [],
  availableBeds: apiRoom.capacity - (apiRoom.occupants?.length || 0),
  floor: apiRoom.floor,
  block: apiRoom.block,
});

// Transform backend student to frontend format
export const transformStudent = (apiStudent) => ({
  id: apiStudent._id,
  name: apiStudent.name,
  email: apiStudent.email,
  phone: apiStudent.phone,
  rollNumber: apiStudent.rollNumber,
  room: apiStudent.room,
  branch: apiStudent.branch,
  semester: apiStudent.semester,
});
