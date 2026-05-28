# 📋 DANH SÁCH TẤT CẢ CÁC API TRONG PROJECT

## 🔹 1. Root API
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Kiểm tra trạng thái backend (Backend OK) |

---

## 🔹 2. Admin APIs (`/api/admin`)

### POST `/api/admin/login` - Đăng nhập admin
**Validation:** `validateAdminLogin`

**Request Body:**
```json
{
  "username": "string (required, không được để trống)",
  "password": "string (required, không được để trống)"
}
```

### POST `/api/admin/register` - Đăng ký admin
**Validation:** `validateAdminRegister`

**Request Body:**
```json
{
  "username": "string (required, ≥ 4 ký tự, unique)",
  "password": "string (required, ≥ 6 ký tự)"
}
```

---

## 🔹 3. Application APIs (`/api/applications`)

### POST `/api/applications` - Tạo đơn đăng ký mới
**Validation:** `validateApplicationCreate`

**Request Body:**
```json
{
  "parent_name": "string (required)",
  "parent_email": "string (required, format email hợp lệ)",
  "parent_phone": "string (required, format: 0xxxxxxxxx hoặc +84xxxxxxxxx, 9 số)",
  "child_name": "string (required)",
  "child_age": "integer (required, 1-18)",
  "program_id": "integer (required)",
  "message": "string (optional, TEXT)",
  "submitted_at": "date (optional)",
  "status": "string (optional)"
}
```

### PUT `/api/applications/:id` - Cập nhật đơn đăng ký
**Validation:** `validateApplicationUpdate`

**Request Body:** (Tất cả các field đều optional, chỉ gửi field cần cập nhật)
```json
{
  "parent_name": "string (optional)",
  "parent_email": "string (optional, format email hợp lệ nếu có)",
  "parent_phone": "string (optional, format: 0xxxxxxxxx hoặc +84xxxxxxxxx nếu có)",
  "child_name": "string (optional)",
  "child_age": "integer (optional, 1-18 nếu có)",
  "program_id": "integer (optional)",
  "message": "string (optional)",
  "submitted_at": "date (optional)",
  "status": "string (optional)"
}
```

### GET `/api/applications` - Lấy tất cả đơn đăng ký
### GET `/api/applications/:id` - Lấy đơn đăng ký theo ID
### DELETE `/api/applications/:id` - Xóa đơn đăng ký

---

## 🔹 4. Comment APIs (`/api/comments`)

### POST `/api/comments` - Tạo comment mới
**Validation:** `validateCommentCreate`

**Request Body:**
```json
{
  "article_id": "integer (required)",
  "author_name": "string (required, ≥ 2 ký tự)",
  "content": "string (required, ≥ 5 ký tự, TEXT)",
  "created_at": "date (optional)"
}
```

### PUT `/api/comments/:id` - Cập nhật comment
**Validation:** `validateCommentUpdate`

**Request Body:** (Tất cả các field đều optional)
```json
{
  "author_name": "string (optional, ≥ 2 ký tự nếu có)",
  "content": "string (optional, ≥ 5 ký tự nếu có)"
}
```

### GET `/api/comments` - Lấy tất cả comments
### GET `/api/comments/:id` - Lấy comment theo ID
### DELETE `/api/comments/:id` - Xóa comment

---

## 🔹 5. News Article APIs (`/api/news-articles`)

### POST `/api/news-articles` - Tạo bài viết tin tức mới
**Request Body:**
```json
{
  "title": "string (optional)",
  "slug": "string (optional)",
  "thumbnail_url": "string (optional)",
  "content": "string (optional, TEXT)",
  "author_name": "string (optional)",
  "published_at": "date (optional)"
}
```

### PUT `/api/news-articles/:id` - Cập nhật bài viết tin tức
**Request Body:** (Tất cả các field đều optional)
```json
{
  "title": "string (optional)",
  "slug": "string (optional)",
  "thumbnail_url": "string (optional)",
  "content": "string (optional, TEXT)",
  "author_name": "string (optional)",
  "published_at": "date (optional)"
}
```

### GET `/api/news-articles` - Lấy tất cả bài viết tin tức
### GET `/api/news-articles/:id` - Lấy bài viết tin tức theo ID
### DELETE `/api/news-articles/:id` - Xóa bài viết tin tức

---

## 🔹 6. Newsletter Subscriber APIs (`/api/newsletter`)

### POST `/api/newsletter` - Đăng ký nhận newsletter
**Request Body:**
```json
{
  "email": "string (optional, unique)",
  "subscribed_at": "date (optional)"
}
```

### PUT `/api/newsletter/:id` - Cập nhật thông tin đăng ký
**Request Body:** (Tất cả các field đều optional)
```json
{
  "email": "string (optional, unique)",
  "subscribed_at": "date (optional)"
}
```

### GET `/api/newsletter` - Lấy tất cả người đăng ký
### GET `/api/newsletter/:id` - Lấy người đăng ký theo ID
### DELETE `/api/newsletter/:id` - Xóa đăng ký newsletter

---

## 🔹 7. Program APIs (`/api/programs`)

### POST `/api/programs` - Tạo chương trình mới
**Validation:** `validateProgramCreate`

**Request Body:**
```json
{
  "name": "string (required, không được để trống)",
  "description": "string (optional, TEXT)",
  "type": "enum (required, chỉ nhận: 'edu', 'sport', 'teacher')"
}
```

### PUT `/api/programs/:id` - Cập nhật chương trình
**Validation:** `validateProgramUpdate`

**Request Body:** (Tất cả các field đều optional)
```json
{
  "name": "string (optional, không được để trống nếu có)",
  "description": "string (optional, TEXT)",
  "type": "enum (optional, 'edu', 'sport', 'teacher')"
}
```

### POST `/api/programs/education` - Tạo chương trình giáo dục
**Validation:** `validateProgramChild`

**Request Body:**
```json
{
  "program_id": "integer (required)",
  "title": "string (optional)",
  "detail": "string (optional, TEXT)",
  "thumbnail_url": "string (optional)",
  "age_group": "string (optional)",
  "duration_days": "string (optional)",
  "duration_hours": "string (optional)",
  "slug": "string (optional)"
}
```

### PUT `/api/programs/education/:id` - Cập nhật chương trình giáo dục

**Request Body:** (Tất cả các field đều optional, gửi field cần cập nhật)
```json
{
  "program_id": "integer (optional)",
  "title": "string (optional)",
  "detail": "string (optional, TEXT)",
  "thumbnail_url": "string (optional)",
  "age_group": "string (optional)",
  "duration_days": "string (optional)",
  "duration_hours": "string (optional)",
  "slug": "string (optional)"
}
```

### DELETE `/api/programs/education/:id` - Xóa chương trình giáo dục

### POST `/api/programs/sport` - Tạo chương trình thể thao
**Validation:** `validateProgramChild`

**Request Body:**
```json
{
  "program_id": "integer (required)",
  "title": "string (optional)",
  "detail": "string (optional, TEXT)",
  "thumbnail_url": "string (optional)",
  "slug": "string (optional)"
}
```

### PUT `/api/programs/sport/:id` - Cập nhật chương trình thể thao

**Request Body:** (Tất cả các field đều optional, gửi field cần cập nhật)
```json
{
  "program_id": "integer (optional)",
  "title": "string (optional)",
  "detail": "string (optional, TEXT)",
  "thumbnail_url": "string (optional)",
  "slug": "string (optional)"
}
```

### DELETE `/api/programs/sport/:id` - Xóa chương trình thể thao

### POST `/api/programs/teacher` - Tạo chương trình giáo viên
**Validation:** `validateProgramChild`

**Request Body:**
```json
{
  "program_id": "integer (required)",
  "full_name": "string (optional)",
  "profile_image_url": "string (optional)",
  "role": "string (optional)",
  "bio": "string (optional, TEXT)"
}
```

### PUT `/api/programs/teacher/:id` - Cập nhật chương trình giáo viên

**Request Body:** (Tất cả các field đều optional, gửi field cần cập nhật)
```json
{
  "program_id": "integer (optional)",
  "full_name": "string (optional)",
  "profile_image_url": "string (optional)",
  "role": "string (optional)",
  "bio": "string (optional, TEXT)"
}
```

### DELETE `/api/programs/teacher/:id` - Xóa chương trình giáo viên

### GET `/api/programs` - Lấy tất cả chương trình
### GET `/api/programs/:id` - Lấy chương trình theo ID
### DELETE `/api/programs/:id` - Xóa chương trình

---

## 🔹 8. Promotional Video APIs (`/api/promotional-video`)

### POST `/api/promotional-video/upload` - Upload video quảng cáo + thumbnail
**Validation:** `uploadMiddleware` (multipart/form-data)

**Request Body:** (Form Data)
```
title: string (optional)
videoFile: file (required, maxCount: 1)
thumbnailFile: file (required, maxCount: 1)
```

**Lưu ý:** 
- Sử dụng `multipart/form-data` để upload file
- Cần có cả `videoFile` và `thumbnailFile`
- File sẽ được upload lên Google Drive và trả về URL

### GET `/api/promotional-video/auth` - Lấy URL Google OAuth để xác thực
**Response:**
```json
{
  "authUrl": "string"
}
```

### GET `/api/promotional-video/oauth2callback` - Callback từ Google OAuth
**Query Parameters:**
- `code`: string (required) - Code từ Google OAuth

---

## 🔹 9. Site Content APIs (`/api/site-content`)

### POST `/api/site-content` - Tạo nội dung trang web mới
**Request Body:**
```json
{
  "id": "integer (required, primary key)",
  "phone_number": "string (optional)",
  "support_email": "string (optional)",
  "address": "string (optional)",
  "admission_period": "string (optional)",
  "stat_years_experience": "string (optional)",
  "stat_students_info": "string (optional)",
  "stat_awards_info": "string (optional)",
  "footer_description": "string (optional, TEXT)",
  "about_section_quote": "string (optional, TEXT)"
}
```

### PUT `/api/site-content/:id` - Cập nhật nội dung trang web
**Request Body:** (Tất cả các field đều optional)
```json
{
  "phone_number": "string (optional)",
  "support_email": "string (optional)",
  "address": "string (optional)",
  "admission_period": "string (optional)",
  "stat_years_experience": "string (optional)",
  "stat_students_info": "string (optional)",
  "stat_awards_info": "string (optional)",
  "footer_description": "string (optional, TEXT)",
  "about_section_quote": "string (optional, TEXT)"
}
```

### GET `/api/site-content` - Lấy tất cả nội dung trang web
### GET `/api/site-content/:id` - Lấy nội dung trang web theo ID
### DELETE `/api/site-content/:id` - Xóa nội dung trang web

---

## 🔹 10. OAuth2 APIs (⚠️ Đã comment trong app.js)
**Lưu ý:** Các routes này đã được import nhưng bị comment trong `app.js`, nên hiện tại không hoạt động.

| Method | Endpoint | Mô tả | Validation |
|--------|----------|-------|------------|
| GET | `/oauth2/auth` | Lấy URL để login Google | - |
| GET | `/oauth2/oauth2callback` | Google redirect về đây với code | - |

---

## 🔹 11. Protected Routes (⚠️ Chưa được đăng ký trong app.js)
**Lưu ý:** File `protected.routes.js` tồn tại nhưng chưa được đăng ký trong `app.js`.

| Method | Endpoint | Mô tả | Middleware |
|--------|----------|-------|------------|
| GET | `/protected/profile` | Lấy thông tin profile của user đã xác thực | `authenticate` |

---

## 📊 TỔNG KẾT

### Số lượng API theo nhóm:
- **Root**: 1 API
- **Admin**: 2 APIs
- **Application**: 5 APIs
- **Comment**: 5 APIs
- **News Article**: 5 APIs
- **Newsletter**: 5 APIs
- **Program**: 8 APIs
- **Promotional Video**: 3 APIs
- **Site Content**: 5 APIs
- **OAuth2** (đã comment): 2 APIs
- **Protected** (chưa đăng ký): 1 API

### **Tổng cộng: 42 APIs** (bao gồm cả các API đã comment/chưa đăng ký)

### **Tổng cộng APIs đang hoạt động: 39 APIs**

---

## 📝 Ghi chú:
- **JSON Format:** Hầu hết các API sử dụng JSON format, trừ API upload file sử dụng `multipart/form-data`
- **Validation:** Các API có validation sẽ kiểm tra dữ liệu đầu vào trước khi xử lý
- **Required Fields:** Các field có ghi "(required)" là bắt buộc phải có
- **Optional Fields:** Các field không ghi "(required)" là tùy chọn
- **File Upload:** API `/api/promotional-video/upload` sử dụng `multipart/form-data` để upload file
- **Authentication:** API `/protected/profile` yêu cầu authentication token (nhưng chưa được đăng ký)
- **Email Format:** Email phải đúng format: `xxx@xxx.xxx`
- **Phone Format:** Số điện thoại phải đúng format Việt Nam: `0xxxxxxxxx` hoặc `+84xxxxxxxxx` (9 số)
- **Enum Values:** Field `type` trong Program chỉ nhận giá trị: `'edu'`, `'sport'`, `'teacher'`
