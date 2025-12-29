# Week 4: Polish - Styling, Skeletons & End-to-End Testing

## Overview

Week 4 focuses on polishing the application with professional loading states, consistent styling, and comprehensive testing.

## 1️⃣ LOADING SKELETONS

### Implementation

Create comprehensive skeleton components in `src/components/SkeletonComponents.jsx` (✅ DONE)

#### Usage Example:

```jsx
import { TableSkeleton, CardSkeleton, PageSkeleton } from '../components/SkeletonComponents';
import { useState, useEffect } from 'react';

function RoomManagementPage() {
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const data = await roomService.getAllRooms();
      setRooms(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <PageSkeleton /> // Shows professional loading state
      ) : (
        // Actual content
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TableSkeleton rows={5} />
          <CardSkeleton />
        </div>
      )}
    </div>
  );
}
```

#### Available Skeleton Components:

- **TableSkeleton** - For data tables
- **CardSkeleton** - For info cards
- **RoomCardSkeleton** - For room-specific cards
- **FormSkeleton** - For form pages
- **ListSkeleton** - For lists of items
- **DetailViewSkeleton** - For detail pages
- **GridSkeleton** - For grid layouts
- **DashboardSkeleton** - For full dashboards
- **PageSkeleton** - For entire pages
- **AvatarSkeleton, BadgeSkeleton, ProgressBarSkeleton** - For small components
- **SkeletonBox** - Generic fallback

---

## 2️⃣ TAILWIND CSS STYLING

### Setup (if not already done)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Configure tailwind.config.js

```js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        danger: '#EF4444',
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
```

### Common Tailwind Patterns for Your App

#### Page Layout
```jsx
<div className="min-h-screen bg-gray-50">
  {/* Header */}
  <header className="bg-white shadow-sm">
    <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Hostel Management</h1>
    </nav>
  </header>

  {/* Main Content */}
  <main className="max-w-7xl mx-auto px-4 py-8">
    {/* Content here */}
  </main>

  {/* Footer */}
  <footer className="bg-gray-900 text-white mt-12 py-8">
    {/* Footer content */}
  </footer>
</div>
```

#### Form Styling
```jsx
<form className="bg-white rounded-lg shadow-md p-6 space-y-6">
  <div className="form-group">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Room Number
    </label>
    <input
      type="number"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="Enter room number"
    />
  </div>

  <button
    type="submit"
    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
  >
    Save
  </button>
</form>
```

#### Table Styling
```jsx
<div className="overflow-x-auto">
  <table className="w-full">
    <thead className="bg-gray-100 border-b border-gray-200">
      <tr>
        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Room No</th>
        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Floor</th>
        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Capacity</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
      {rooms.map((room) => (
        <tr key={room.id} className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 text-sm text-gray-900">{room.roomNo}</td>
          <td className="px-6 py-4 text-sm text-gray-600">{room.floor}</td>
          <td className="px-6 py-4 text-sm text-gray-600">{room.capacity}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

#### Card Styling
```jsx
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
  <h3 className="text-lg font-semibold text-gray-900 mb-2">Room 101</h3>
  <p className="text-gray-600 mb-4">Floor 1 • 4 Capacity</p>
  <div className="flex gap-2">
    <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Edit</button>
    <button className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700">Delete</button>
  </div>
</div>
```

#### Status Badges
```jsx
{/* Available status */}
<span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
  Available
</span>

{/* Full status */}
<span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
  Full
</span>
```

---

## 3️⃣ END-TO-END TESTING

### Setup

```bash
npm install -D cypress
npx cypress open
```

### Test Scenarios

#### Scenario 1: Room List Loading & Display

```javascript
// cypress/e2e/room-management.cy.js

describe('Room Management Page', () => {
  beforeEach(() => {
    cy.visit('/room-management');
  });

  it('should show loading skeleton while fetching rooms', () => {
    cy.get('[data-testid="page-skeleton"]').should('exist');
  });

  it('should display all rooms after loading', () => {
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
  });

  it('should filter rooms by floor', () => {
    cy.get('#filter-floor').type('2');
    cy.get('table tbody tr').each((row) => {
      cy.wrap(row).contains('2'); // Floor 2
    });
  });

  it('should show available rooms only when checkbox is checked', () => {
    cy.get('#filter-available').check();
    cy.get('[data-testid="available-badge"]').should('exist');
  });
});
```

#### Scenario 2: Create Room

```javascript
it('should create a new room successfully', () => {
  // Click new room button
  cy.contains('button', '+ New Room').click();

  // Fill form
  cy.get('#roomNo').type('105');
  cy.get('#floor').type('1');
  cy.get('#capacity').type('4');
  cy.get('#roomType').select('Double');

  // Submit
  cy.contains('button', 'Create Room').click();

  // Verify success
  cy.get('.toast--success').should('contain', 'Room created successfully');
  cy.get('table tbody tr').should('contain', '105');
});
```

#### Scenario 3: Edit Room

```javascript
it('should edit an existing room', () => {
  // Select room
  cy.contains('button', 'Details / Edit').first().click();

  // Verify form is populated
  cy.get('#roomNo').should('be.disabled');
  cy.get('#capacity').should('have.value', '4');

  // Update capacity
  cy.get('#capacity').clear().type('5');
  cy.contains('button', 'Save Changes').click();

  // Verify
  cy.get('.toast--success').should('contain', 'Room updated successfully');
});
```

#### Scenario 4: Delete Room

```javascript
it('should delete a room', () => {
  cy.contains('button', 'Delete').first().click();
  cy.get('[role="dialog"]').should('contain', 'Are you sure');
  cy.contains('button', 'Confirm').click();
  cy.get('.toast--success').should('contain', 'Room deleted successfully');
});
```

#### Scenario 5: Room Details Loading

```javascript
it('should show detail loading skeleton', () => {
  cy.contains('button', 'Details / Edit').first().click();
  cy.get('[data-testid="detail-loading"]').should('exist');
  cy.get('[data-testid="student-list"]').should('be.visible');
});
```

#### Scenario 6: Error Handling

```javascript
it('should show error message on failed API call', () => {
  cy.intercept('GET', '/api/rooms', { statusCode: 500 });
  cy.visit('/room-management');
  cy.get('.alert--error').should('contain', 'Failed to load rooms');
});
```

### Running Tests

```bash
# Interactive mode
npm run cypress:open

# Headless mode
npm run cypress:run

# Specific test file
npm run cypress:run -- --spec "cypress/e2e/room-management.cy.js"
```

### Test Data Attributes

Add data-testid to components for easier testing:

```jsx
<div data-testid="page-skeleton" className="...">
  <PageSkeleton />
</div>

<table>
  <tbody>
    {rooms.map(room => (
      <tr key={room.id} data-testid={`room-row-${room.roomNo}`}>
        {/* ... */}
      </tr>
    ))}
  </tbody>
</table>
```

---

## Testing Checklist

### Room Management
- [ ] Load page and verify skeleton
- [ ] Verify rooms display after loading
- [ ] Test floor filter
- [ ] Test available only filter
- [ ] Create new room
- [ ] Edit existing room
- [ ] Delete room with confirmation
- [ ] View room details and students
- [ ] Test error scenarios

### Cross-Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (Chrome, Safari)

### Performance Testing
- [ ] Page loads within 3 seconds
- [ ] Skeleton appears immediately
- [ ] API calls complete smoothly
- [ ] No memory leaks

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast is sufficient
- [ ] Form labels associated with inputs

---

## Quick Reference: Tailwind Classes

```
Spacing: m-4, p-6, gap-2
Display: flex, grid, hidden, block
Text: text-lg, font-bold, text-center, text-gray-600
Bg: bg-white, bg-blue-600, bg-gray-100
Border: border, border-gray-300, rounded-lg
Hover: hover:bg-blue-700, hover:shadow-lg
State: focus:ring-2, disabled:opacity-50
Responsive: md:grid-cols-2, lg:grid-cols-3
```

---

## Summary

✅ **Skeletons Implemented**: 15+ component variations
✅ **Tailwind Setup**: Ready to style all pages
✅ **Testing Framework**: Cypress setup with sample tests
✅ **Testing Scenarios**: 6+ comprehensive test cases

Next Step: Apply these patterns to all pages in your application!
