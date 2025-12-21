# Admin Dashboard - Complete Management System

## Overview

The admin dashboard is a comprehensive backend management system for the entire AlbashSolution platform. It provides full CRUD (Create, Read, Update, Delete) capabilities for all platform entities.

## Access

- **URL:** `/dashboard/admin`
- **Requirements:** User must have `role = "admin"` in the profiles table
- **Access Control:** All admin routes check for admin role and redirect unauthorized users

## Admin Sections

### 1. Admin Dashboard (Overview)
**URL:** `/dashboard/admin`

- Platform statistics overview
- Recent users and applications
- Quick action buttons
- Department statistics
- Revenue metrics

### 2. Verification Queue
**URL:** `/dashboard/admin/verification`

- Review pending verification requests
- Approve/reject applications
- Assign departments
- View verification history

### 3. User Management
**URL:** `/dashboard/admin/users`

**Capabilities:**
- View all users
- Search and filter users
- Edit user information
- Verify/unverify users
- Suspend/unsuspend users
- Change user roles (make admin, verifier, etc.)
- View user profiles

### 4. Listing Management
**URL:** `/dashboard/admin/listings`

**Capabilities:**
- View all listings
- Approve/reject listings
- Suspend listings
- Delete listings
- Filter by status and type
- Search listings

### 5. Swap Management
**URL:** `/dashboard/admin/swaps`

**Capabilities:**
- View all swap requests
- Monitor swap status
- View swap details
- Filter by status
- Search swaps

### 6. Transaction Management (NEW)
**URL:** `/dashboard/admin/transactions`

**Capabilities:**
- View all transactions
- Filter by status
- Search transactions
- View transaction details
- Revenue statistics

### 7. Reputation Management (NEW)
**URL:** `/dashboard/admin/reputation`

**Capabilities:**
- View top users by reputation
- Adjust user reputation scores
- View reputation change logs
- Search users
- Add/subtract reputation points with reason

### 8. Settings (NEW)
**URL:** `/dashboard/admin/settings`

**Platform Configuration:**
- **Platform Settings:**
  - Platform name and description
  - Maintenance mode toggle
  - Registration enabled/disabled
  - Verification requirements

- **Swap System Settings:**
  - Enable/disable swap system
  - Minimum reputation for swaps
  - Verification requirements
  - Platform fee percentage

- **Marketplace Settings:**
  - Enable/disable marketplace
  - Listing fees
  - Verification requirements
  - Max listings per user

- **Reputation Settings:**
  - Enable/disable reputation system
  - Initial reputation score
  - Verification bonus points
  - Swap completion bonus
  - Listing creation bonus

- **Payment Settings:**
  - Enable/disable payments
  - Supported currencies
  - Platform fee percentage

### 9. Categories Management (NEW)
**URL:** `/dashboard/admin/categories`

**Capabilities:**
- Create new categories
- Edit existing categories
- Delete categories
- Set parent categories
- Add descriptions and icons
- Search categories

### 10. Departments Management (NEW)
**URL:** `/dashboard/admin/departments`

**Capabilities:**
- Create new departments
- Edit departments
- Delete departments
- Set department types
- Add descriptions and icons
- Search departments

### 11. Analytics
**URL:** `/dashboard/admin/analytics`

- Platform analytics
- User growth charts
- Revenue reports
- Activity metrics

## API Endpoints

All admin API endpoints require admin authentication:

### Settings
- `GET /api/admin/settings` - Get platform settings
- `POST /api/admin/settings` - Update platform settings

### Categories
- `GET /api/admin/categories` - List all categories
- `POST /api/admin/categories` - Create category
- `PATCH /api/admin/categories/[id]` - Update category
- `DELETE /api/admin/categories/[id]` - Delete category

### Departments
- `GET /api/admin/departments` - List all departments
- `POST /api/admin/departments` - Create department
- `PATCH /api/admin/departments/[id]` - Update department
- `DELETE /api/admin/departments/[id]` - Delete department

### Reputation
- `POST /api/admin/reputation` - Adjust user reputation

## Features

### Full CRUD Operations
All management pages support:
- **Create:** Add new entities
- **Read:** View and search entities
- **Update:** Edit existing entities
- **Delete:** Remove entities (with confirmation)

### Search & Filter
- Real-time search across all entities
- Filter by status, type, role, etc.
- Sort by various fields

### Bulk Operations
- Multiple selection (where applicable)
- Bulk actions on selected items

### Data Export
- Export data to CSV/JSON (coming soon)
- Generate reports

### Real-time Updates
- Changes reflect immediately
- Router refresh after mutations
- Toast notifications for actions

## Making a User an Admin

To grant admin access to a user:

1. Go to User Management
2. Find the user
3. Use the actions menu
4. Select "Make Admin"

Or via SQL:
```sql
UPDATE profiles SET role = 'admin' WHERE id = 'user-id-here';
```

## Security

- All admin routes check for `role = 'admin'`
- API endpoints verify admin status
- Unauthorized users are redirected
- Actions are logged (audit trail coming soon)

## Usage Examples

### Changing Platform Settings
1. Navigate to Settings
2. Modify any setting in the tabs
3. Click "Save Changes"
4. Settings apply immediately

### Creating a Category
1. Go to Categories Management
2. Click "New Category"
3. Fill in name, slug, description
4. Optionally set parent category
5. Click "Create"

### Adjusting User Reputation
1. Go to Reputation Management
2. Find the user
3. Click "Adjust"
4. Enter points (positive or negative)
5. Add reason
6. Click "Adjust Reputation"

### Approving a Listing
1. Go to Listing Management
2. Find pending listing
3. Review details
4. Click actions menu
5. Select "Approve"

## Notes

- Settings are currently stored in-memory (consider adding a settings table for persistence)
- All changes require page refresh to see updates
- Deletion actions require confirmation
- Some operations may take a few seconds to process

