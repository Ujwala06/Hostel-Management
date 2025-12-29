# Data Transformers Integration Guide

## Overview

This guide explains how to use the data transformers in your Hostel Management application to normalize API responses and convert frontend data for submissions.

## What are Data Transformers?

Data transformers are functions that convert data between two formats:
- **Forward Transformers**: Convert API responses to frontend-friendly format
- **Reverse Transformers**: Convert frontend data back to API format for submissions

## Why Use Transformers?

1. **Data Normalization**: Consistent naming conventions (API uses `_id`, frontend uses `id`)
2. **Type Conversion**: Automatic conversion of date strings to Date objects
3. **Calculated Fields**: Compute derived values (e.g., availableBeds, occupancyPercentage)
4. **Separation of Concerns**: Keep API structure separate from UI logic
5. **Maintainability**: Easy to update data structure without changing components

## Available Transformers

### Complaint Transformers

```javascript
import { 
  transformComplaint, 
  transformComplaints,
  reverseTransformComplaint 
} from './transformers';

// Single complaint
const complaint = transformComplaint(apiResponse);

// Array of complaints
const complaints = transformComplaints(apiResponse);

// For form submission
const apiData = reverseTransformComplaint(frontendData);
```

### Room Transformers

```javascript
import { 
  transformRoom, 
  transformRooms,
  reverseTransformRoom 
} from './transformers';

// Features:
// - Calculates availableBeds: capacity - currentOccupancy
// - Calculates occupancyPercentage for visual indicators
// - Includes array of students (if populated)

const room = transformRoom(apiResponse);
const rooms = transformRooms(apiResponse);
const apiData = reverseTransformRoom(frontendData);
```

### Student Transformers

```javascript
import { 
  transformStudent, 
  transformStudents,
  reverseTransformStudent 
} from './transformers';

const student = transformStudent(apiResponse);
const students = transformStudents(apiResponse);
const apiData = reverseTransformStudent(frontendData);
```

### Worker Transformers

```javascript
import { 
  transformWorker, 
  transformWorkers,
  reverseTransformWorker 
} from './transformers';

const worker = transformWorker(apiResponse);
const workers = transformWorkers(apiResponse);
const apiData = reverseTransformWorker(frontendData);
```

### Emergency Transformers

```javascript
import { 
  transformEmergency, 
  transformEmergencies,
  reverseTransformEmergency 
} from './transformers';

const emergency = transformEmergency(apiResponse);
const emergencies = transformEmergencies(apiResponse);
const apiData = reverseTransformEmergency(frontendData);
```

### Notification Transformers

```javascript
import { 
  transformNotification, 
  transformNotifications,
  reverseTransformNotification 
} from './transformers';

const notification = transformNotification(apiResponse);
const notifications = transformNotifications(apiResponse);
const apiData = reverseTransformNotification(frontendData);
```

## Service Integration Examples

### Room Service Example

```javascript
// src/services/roomService.js
import apiClient from './apiClient';
import { transformRoom, transformRooms, reverseTransformRoom } from './transformers';
import { toast } from 'react-hot-toast';

export const roomService = {
  getAllRooms: async (filters = {}) => {
    try {
      const response = await apiClient.get('/rooms', { params: filters });
      // Transform API response to frontend format
      return transformRooms(response.data);
    } catch (error) {
      toast.error('Failed to fetch rooms');
      throw error;
    }
  },

  getRoomById: async (roomNo) => {
    try {
      const response = await apiClient.get(`/rooms/${roomNo}`);
      return transformRoom(response.data);
    } catch (error) {
      toast.error('Failed to fetch room details');
      throw error;
    }
  },

  createRoom: async (roomData) => {
    try {
      // Convert frontend data back to API format
      const apiData = reverseTransformRoom(roomData);
      const response = await apiClient.post('/rooms', apiData);
      toast.success('Room created successfully');
      return transformRoom(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create room');
      throw error;
    }
  },

  updateRoom: async (roomNo, roomData) => {
    try {
      const apiData = reverseTransformRoom(roomData);
      const response = await apiClient.patch(`/rooms/${roomNo}`, apiData);
      toast.success('Room updated successfully');
      return transformRoom(response.data);
    } catch (error) {
      toast.error('Failed to update room');
      throw error;
    }
  },

  deleteRoom: async (roomNo) => {
    try {
      await apiClient.delete(`/rooms/${roomNo}`);
      toast.success('Room deleted successfully');
    } catch (error) {
      toast.error('Failed to delete room');
      throw error;
    }
  },
};
```

### Student Service Example

```javascript
// src/services/studentService.js
import apiClient from './apiClient';
import { transformStudent, transformStudents, reverseTransformStudent } from './transformers';
import { toast } from 'react-hot-toast';

export const studentService = {
  getAllStudents: async () => {
    try {
      const response = await apiClient.get('/students');
      return transformStudents(response.data);
    } catch (error) {
      toast.error('Failed to fetch students');
      throw error;
    }
  },

  getStudentById: async (studentId) => {
    try {
      const response = await apiClient.get(`/students/${studentId}`);
      return transformStudent(response.data);
    } catch (error) {
      toast.error('Failed to fetch student details');
      throw error;
    }
  },

  updateStudent: async (studentId, studentData) => {
    try {
      const apiData = reverseTransformStudent(studentData);
      const response = await apiClient.patch(`/students/${studentId}`, apiData);
      toast.success('Student updated successfully');
      return transformStudent(response.data);
    } catch (error) {
      toast.error('Failed to update student');
      throw error;
    }
  },
};
```

## Utility Functions

### Safe Transform (Error Handling)

```javascript
import { safeTransform } from './transformers';

// Transforms data with error handling
// Returns original data if transform fails
const data = safeTransform(apiResponse, transformComplaint);
```

### Batch Transform

```javascript
import { safeBatchTransform } from './transformers';

// Safely transforms arrays of data
const items = safeBatchTransform(apiResponse, transformStudent);
```

## React Hook Integration

### Using with useState

```javascript
import { useState, useEffect } from 'react';
import { roomService } from '../services/roomService';

function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      // roomService.getAllRooms() already returns transformed data
      const data = await roomService.getAllRooms();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {rooms.map((room) => (
        <div key={room.id}>
          <h3>Room {room.roomNo}</h3>
          <p>Available Beds: {room.availableBeds}</p>
          <p>Occupancy: {room.occupancyPercentage}%</p>
        </div>
      ))}
    </div>
  );
}
```

### Using with React Query (Recommended)

```javascript
import { useQuery, useMutation } from '@tanstack/react-query';
import { roomService } from '../services/roomService';

function RoomList() {
  // Fetch rooms with caching
  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomService.getAllRooms(),
  });

  // Create room mutation
  const createMutation = useMutation({
    mutationFn: (roomData) => roomService.createRoom(roomData),
    onSuccess: () => {
      // Invalidate cache and refetch
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        rooms.map((room) => <RoomCard key={room.id} room={room} />)
      )}
    </div>
  );
}
```

## Form Submission Pattern

```javascript
const handleSubmit = async (formData) => {
  try {
    // formData is from your form state (already in frontend format)
    const response = await roomService.updateRoom(
      formData.roomNo,
      formData // Transformer will convert to API format
    );
    
    // Use transformed response data
    setRoom(response);
  } catch (error) {
    console.error('Submission error:', error);
  }
};
```

## Best Practices

1. **Always Transform API Responses**: Never use raw API data in components
   ```javascript
   // ✅ Good
   const data = transformRoom(apiResponse);
   
   // ❌ Avoid
   const data = apiResponse;
   ```

2. **Use Services for API Calls**: Services should handle transformations
   ```javascript
   // roomService.js handles all transformations internally
   const data = await roomService.getAllRooms();
   ```

3. **Reverse Transform Before Submission**: Convert frontend data before sending
   ```javascript
   // ✅ Good
   const apiData = reverseTransformRoom(formData);
   await apiClient.post('/rooms', apiData);
   
   // ❌ Avoid
   await apiClient.post('/rooms', formData);
   ```

4. **Handle Null/Undefined**: Transformers have fallbacks for missing data
   ```javascript
   // Safe to transform incomplete objects
   const transformed = transformRoom({ roomNo: 101 });
   // Will have default values for missing properties
   ```

5. **Use Utility Functions**: Leverage safe transforms for error handling
   ```javascript
   // Automatically handles errors
   const data = safeTransform(item, transformComplaint);
   ```

## Checklist for Implementing Transformers

- [ ] Import transformers in all service files
- [ ] Apply transformers to all API GET responses
- [ ] Apply reverse transformers to all API POST/PATCH requests
- [ ] Update components to use transformed data from services
- [ ] Remove any manual data mapping in components
- [ ] Test with sample API responses
- [ ] Verify calculated fields display correctly (availableBeds, occupancyPercentage, etc.)
- [ ] Add error handling with safeTransform where needed

## Debugging

If transformed data looks incorrect:

```javascript
// Log the original API response
console.log('API Response:', apiResponse);

// Log the transformed data
console.log('Transformed:', transformRoom(apiResponse));

// Check field mappings in transformers.js
```

## Next Steps

1. Update all service files to use transformers
2. Refactor components to use services (not direct API calls)
3. Implement React Query for caching and state management
4. Add validation layer if needed
5. Monitor component renders to ensure caching benefits
