# Admin Panel API Documentation

This document provides comprehensive information about the Admin Panel APIs for user management.

## Authentication

All admin APIs require:
- **Authentication**: Valid JWT access token in the `Authorization` header
- **Admin Role**: The authenticated user must have `role = "ADMIN"`

**Header Format:**
```
Authorization: Bearer <your_access_token>
```

---

## API Endpoints

### 1. List All Users (with Pagination, Search & Filters)

**Endpoint:** `GET /accounts/admin/users/`

**Description:** Get a paginated list of all users with search and filter capabilities.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `page_size` | integer | 10 | Number of items per page (max: 100) |
| `search` | string | - | Search by username or email (case-insensitive) |
| `role` | string | - | Filter by role (`LEARNER` or `ADMIN`) |
| `is_deleted` | string | false | Filter by deletion status:<br>- `false` or omitted: Active users only (default)<br>- `true`: Deleted users only (for trash page)<br>- `all`: All users (both active and deleted) |

**Example Requests:**

```bash
# Get first page with default page size (10)
GET /accounts/admin/users/

# Get page 2 with 20 users per page
GET /accounts/admin/users/?page=2&page_size=20

# Search for users with "john" in username or email
GET /accounts/admin/users/?search=john

# Filter by role
GET /accounts/admin/users/?role=ADMIN

# Show ONLY deleted users (trash page)
GET /accounts/admin/users/?is_deleted=true

# Show all users (active + deleted)
GET /accounts/admin/users/?is_deleted=all

# Combined filters
GET /accounts/admin/users/?search=john&role=LEARNER&page_size=25

# Search deleted users (trash page with search)
GET /accounts/admin/users/?is_deleted=true&search=john
```

**Response Format:**

```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": [
        {
            "id": 1,
            "email": "user@example.com",
            "username": "johndoe",
            "role": "LEARNER",
            "is_active": true,
            "is_deleted": false,
            "deleted_at": null,
            "date_joined": "2026-01-01T10:00:00Z",
            "last_login": "2026-02-01T15:30:00Z"
        }
    ],
    "count": 50,
    "page": 1,
    "page_size": 10,
    "total_pages": 5,
    "next": "http://localhost:8000/accounts/admin/users/?page=2",
    "previous": null
}
```

**CURL Example:**

```bash
curl -X GET "http://localhost:8000/accounts/admin/users/?page=1&page_size=15&search=john" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 2. Get User Details

**Endpoint:** `GET /accounts/admin/users/<user_id>/`

**Description:** Get detailed information about a specific user.

**Path Parameters:**
- `user_id` (integer): ID of the user to retrieve

**Example Request:**

```bash
GET /accounts/admin/users/5/
```

**Response:**

```json
{
    "success": true,
    "message": "User details retrieved successfully",
    "data": {
        "id": 5,
        "email": "user@example.com",
        "username": "johndoe",
        "role": "LEARNER",
        "is_active": true,
        "is_deleted": false,
        "deleted_at": null,
        "date_joined": "2026-01-15T10:00:00Z",
        "last_login": "2026-02-02T12:00:00Z"
    }
}
```

**CURL Example:**

```bash
curl -X GET "http://localhost:8000/accounts/admin/users/5/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 3. Update User Details

**Endpoint:** `PATCH /accounts/admin/users/<user_id>/`

**Description:** Update a user's username and/or email. **Note:** This endpoint does NOT update password or role.

**Path Parameters:**
- `user_id` (integer): ID of the user to update

**Request Body (JSON):**

```json
{
    "username": "new_username",
    "email": "newemail@example.com"
}
```

**Fields:**
- `username` (optional): New username (must be unique)
- `email` (optional): New email (must be unique)

**Example Request:**

```bash
PATCH /accounts/admin/users/5/
Content-Type: application/json

{
    "email": "newemail@example.com"
}
```

**Response:**

```json
{
    "success": true,
    "message": "User updated successfully",
    "data": {
        "id": 5,
        "email": "newemail@example.com",
        "username": "johndoe",
        "role": "LEARNER"
    }
}
```

**Error Response (Email Already Exists):**

```json
{
    "success": false,
    "message": "Update failed",
    "errors": {
        "email": ["This email is already in use"]
    }
}
```

**CURL Example:**

```bash
curl -X PATCH "http://localhost:8000/accounts/admin/users/5/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "newemail@example.com", "username": "newusername"}'
```

---

### 4. Update User Role

**Endpoint:** `PATCH /accounts/update-role/<user_id>/`

**Description:** Change a user's role (separate endpoint from user details update).

**Path Parameters:**
- `user_id` (integer): ID of the user to update

**Request Body (JSON):**

```json
{
    "role": "ADMIN"
}
```

**Allowed Values:**
- `LEARNER`
- `ADMIN`

**Response:**

```json
{
    "success": true,
    "message": "User role updated successfully",
    "data": {
        "id": 5,
        "email": "user@example.com",
        "username": "johndoe",
        "role": "ADMIN"
    }
}
```

**CURL Example:**

```bash
curl -X PATCH "http://localhost:8000/accounts/update-role/5/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "ADMIN"}'
```

---

### 5. Delete User (Soft Delete)

**Endpoint:** `DELETE /accounts/admin/users/<user_id>/delete/`

**Description:** Soft delete a user. The user is not permanently removed but marked as deleted.

**Path Parameters:**
- `user_id` (integer): ID of the user to delete

**Important Notes:**
- Admins **cannot delete themselves**
- This is a soft delete - the user is marked as `is_deleted=true` and `deleted_at` is set
- Soft-deleted users are excluded from normal queries by default
- Deleted users can be restored using the restore endpoint

**Example Request:**

```bash
DELETE /accounts/admin/users/5/delete/
```

**Response:**

```json
{
    "success": true,
    "message": "User deleted successfully"
}
```

**Error Response (Self-Delete Attempt):**

```json
{
    "success": false,
    "message": "You cannot delete your own account"
}
```

**CURL Example:**

```bash
curl -X DELETE "http://localhost:8000/accounts/admin/users/5/delete/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 6. Restore Deleted User

**Endpoint:** `POST /accounts/admin/users/<user_id>/restore/`

**Description:** Restore a previously soft-deleted user.

**Path Parameters:**
- `user_id` (integer): ID of the deleted user to restore

**Example Request:**

```bash
POST /accounts/admin/users/5/restore/
```

**Response:**

```json
{
    "success": true,
    "message": "User restored successfully",
    "data": {
        "id": 5,
        "email": "user@example.com",
        "username": "johndoe",
        "role": "LEARNER"
    }
}
```

**Error Response (User Not Found or Not Deleted):**

```json
{
    "success": false,
    "message": "Deleted user not found"
}
```

**CURL Example:**

```bash
curl -X POST "http://localhost:8000/accounts/admin/users/5/restore/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Complete Testing Workflow

Here's a complete workflow to test all the admin APIs:

### Step 1: Login as Admin

```bash
curl -X POST "http://localhost:8000/accounts/login/" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your_password"
  }'
```

Save the `access` token from the response.

### Step 2: List All Users

```bash
curl -X GET "http://localhost:8000/accounts/admin/users/?page=1&page_size=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Step 3: Search Users

```bash
curl -X GET "http://localhost:8000/accounts/admin/users/?search=john" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Step 4: Filter by Role

```bash
curl -X GET "http://localhost:8000/accounts/admin/users/?role=LEARNER" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Step 5: Get Specific User Details

```bash
curl -X GET "http://localhost:8000/accounts/admin/users/5/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Step 6: Update User Email/Username

```bash
curl -X PATCH "http://localhost:8000/accounts/admin/users/5/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "updated@example.com",
    "username": "updated_username"
  }'
```

### Step 7: Change User Role

```bash
curl -X PATCH "http://localhost:8000/accounts/update-role/5/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "ADMIN"}'
```

### Step 8: Soft Delete User

```bash
curl -X DELETE "http://localhost:8000/accounts/admin/users/5/delete/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Step 9: View Deleted Users

```bash
curl -X GET "http://localhost:8000/accounts/admin/users/?is_deleted=true" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Step 10: Restore Deleted User

```bash
curl -X POST "http://localhost:8000/accounts/admin/users/5/restore/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Technical Implementation Details

### Soft Delete Implementation

The soft delete feature is implemented using:

1. **Model Fields:**
   - `is_deleted` (BooleanField): Marks if user is deleted
   - `deleted_at` (DateTimeField): Timestamp of deletion

2. **Custom Model Managers:**
   - `User.objects` (ActiveUserManager): Returns only non-deleted users (default)
   - `User.all_objects` (UserManager): Returns all users including deleted ones

3. **Methods:**
   - `user.soft_delete()`: Marks user as deleted
   - `user.restore()`: Restores a deleted user

### Pagination

Custom pagination class with features:
- Flexible page size (default: 10, max: 100)
- Query parameters: `page` and `page_size`
- Returns metadata: total count, page numbers, next/previous links

### Search & Filtering

- **Search**: Joint search on `username` and `email` fields (case-insensitive)
- **Filter by Role**: Exact match on `role` field
- **Filter by Deletion Status**:
  - Default (`is_deleted=false` or omitted): Show only active users
  - Trash page (`is_deleted=true`): Show only deleted users
  - All users (`is_deleted=all`): Show both active and deleted users

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request (validation errors) |
| 401 | Unauthorized (missing or invalid token) |
| 403 | Forbidden (not admin) |
| 404 | Not Found (user doesn't exist) |

---

## Security Notes

1. **Admin Only**: All endpoints require `IsAdmin` permission
2. **Self-Delete Protection**: Admins cannot delete themselves
3. **Unique Constraints**: Email and username must be unique
4. **Soft Delete**: No data loss - all deletions are reversible
5. **JWT Authentication**: All requests require valid JWT token

---

## Summary of All Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/accounts/admin/users/` | List users (paginated, searchable, filterable) |
| GET | `/accounts/admin/users/<id>/` | Get user details |
| PATCH | `/accounts/admin/users/<id>/` | Update user (email/username) |
| PATCH | `/accounts/update-role/<id>/` | Update user role |
| DELETE | `/accounts/admin/users/<id>/delete/` | Soft delete user |
| POST | `/accounts/admin/users/<id>/restore/` | Restore deleted user |
