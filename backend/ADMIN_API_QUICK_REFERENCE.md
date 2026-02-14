# Admin Panel API - Quick Reference

## All Admin Endpoints

### 📋 List Users (Pagination, Search, Filter)
```bash
GET /accounts/admin/users/?page=1&page_size=10&search=john&role=LEARNER&is_deleted=false
```

### 👤 Get User Details
```bash
GET /accounts/admin/users/<user_id>/
```

### ✏️ Update User (Email/Username)
```bash
PATCH /accounts/admin/users/<user_id>/
{
    "email": "new@email.com",
    "username": "new_username"
}
```

### 🔑 Change User Role
```bash
PATCH /accounts/update-role/<user_id>/
{
    "role": "ADMIN"  # or "LEARNER"
}
```

### 🗑️ Delete User (Soft Delete)
```bash
DELETE /accounts/admin/users/<user_id>/delete/
```

### ♻️ Restore Deleted User
```bash
POST /accounts/admin/users/<user_id>/restore/
```

---

## Key Features Implemented

✅ **Soft Delete** - Users are never permanently deleted
✅ **Custom Pagination** - Flexible page size (up to 100 items)
✅ **Search** - Search by username OR email
✅ **Role Filter** - Filter by ADMIN or LEARNER
✅ **View Deleted Users** - Toggle to show deleted users
✅ **Self-Delete Protection** - Admins can't delete themselves
✅ **Custom Model Manager** - Automatically filters deleted users
✅ **Admin-Only Routes** - All endpoints require ADMIN role

---

## Example Test Payloads

### List Users with Custom Page Size
```json
GET /accounts/admin/users/?page_size=25&page=1
```

### Search for Users
```json
GET /accounts/admin/users/?search=john
```

### Update User
```json
PATCH /accounts/admin/users/5/
{
    "email": "updated@example.com"
}
```

### Change Role to Admin
```json
PATCH /accounts/update-role/5/
{
    "role": "ADMIN"
}
```

---

## Response Format (List Users)

```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": [...],
    "count": 50,
    "page": 1,
    "page_size": 10,
    "total_pages": 5,
    "next": "...",
    "previous": null
}
```

---

See `ADMIN_API_DOCUMENTATION.md` for complete documentation.
