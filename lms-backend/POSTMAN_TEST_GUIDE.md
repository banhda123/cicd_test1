# Postman Testing Guide for LMS Backend

## 📋 Setup Instructions

### 1. Import Collections

Import these Postman collections from your `test/` folder:
- `LMS_Backend_All_API.postman_collection.json` - Complete API collection
- `LMS_Auth_API.postman_collection.json` - Authentication focused collection

### 2. Environment Variables

Create a Postman environment with these variables:

```json
{
  "baseUrl": "https://your-app-name.onrender.com",
  "token": "",
  "userId": "",
  "userEmail": "",
  "verificationCode": "",
  "resetToken": ""
}
```

## 🧪 Test Scenarios

### **Authentication Flow**

#### 1. **User Registration**
```http
POST {{baseUrl}}/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "username": "testuser123",
  "email": "test@example.com",
  "phone": "0123456789",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công. Mã xác nhận của bạn: 123456 (Email disabled on Render)",
  "data": {
    "user": {
      "id": "user_id_here",
      "name": "Test User",
      "username": "testuser123",
      "email": "test@example.com",
      "phone": "0123456789",
      "role": "student",
      "isEmailVerified": false
    },
    "verificationCode": "123456"
  }
}
```

**Postman Test Script:**
```javascript
pm.test("Registration successful", () => {
  pm.response.to.have.status(201);
  const jsonData = pm.response.json();
  pm.expect(jsonData.success).to.be.true;
  pm.expect(jsonData.data.verificationCode).to.exist;
  
  // Save verification code and user email
  pm.environment.set("verificationCode", jsonData.data.verificationCode);
  pm.environment.set("userEmail", jsonData.data.user.email);
});
```

#### 2. **Email Verification**
```http
POST {{baseUrl}}/api/auth/verify-email-by-code
Content-Type: application/json

{
  "token": "{{verificationCode}}"
}
```

**Postman Test Script:**
```javascript
pm.test("Email verification successful", () => {
  pm.response.to.have.status(200);
  const jsonData = pm.response.json();
  pm.expect(jsonData.success).to.be.true;
});
```

#### 3. **User Login**
```http
POST {{baseUrl}}/api/auth/login
Content-Type: application/json

{
  "email": "{{userEmail}}",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "user": {
      "id": "user_id_here",
      "name": "Test User",
      "username": "testuser123",
      "email": "test@example.com",
      "phone": "0123456789",
      "role": "student"
    },
    "token": "jwt_token_here"
  }
}
```

**Postman Test Script:**
```javascript
pm.test("Login successful", () => {
  pm.response.to.have.status(200);
  const jsonData = pm.response.json();
  pm.expect(jsonData.success).to.be.true;
  pm.expect(jsonData.data.token).to.exist;
  
  // Save token for authenticated requests
  pm.environment.set("token", jsonData.data.token);
  pm.environment.set("userId", jsonData.data.user.id);
});
```

#### 4. **Forgot Password**
```http
POST {{baseUrl}}/api/auth/forgot-password
Content-Type: application/json

{
  "email": "{{userEmail}}"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Token đặt lại mật khẩu: abc123def456 (Email disabled on Render)"
}
```

**Postman Test Script:**
```javascript
pm.test("Forgot password successful", () => {
  pm.response.to.have.status(200);
  const jsonData = pm.response.json();
  pm.expect(jsonData.success).to.be.true;
  
  // Extract reset token from message
  const message = jsonData.message;
  const tokenMatch = message.match(/Token đặt lại mật khẩu: (.+?) \(/);
  if (tokenMatch) {
    pm.environment.set("resetToken", tokenMatch[1]);
  }
});
```

#### 5. **Reset Password**
```http
POST {{baseUrl}}/api/auth/reset-password
Content-Type: application/json

{
  "token": "{{resetToken}}",
  "password": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

### **Protected Routes Testing**

#### 6. **Get Current User**
```http
GET {{baseUrl}}/api/auth/current-user
Authorization: Bearer {{token}}
```

**Postman Test Script:**
```javascript
pm.test("Get current user successful", () => {
  pm.response.to.have.status(200);
  const jsonData = pm.response.json();
  pm.expect(jsonData.success).to.be.true;
  pm.expect(jsonData.data.email).to.eql(pm.environment.get("userEmail"));
});
```

#### 7. **Upload Avatar**
```http
POST {{baseUrl}}/api/auth/upload-avatar
Authorization: Bearer {{token}}
Content-Type: multipart/form-data

file: [select an image file]
```

### **API Endpoints to Test**

#### **Public Routes**
- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Forgot password
- `GET /api/public/courses` - Public courses list

#### **Protected Routes** (Need Authorization Header)
- `GET /api/auth/current-user` - Get current user info
- `PUT /api/auth/current-user` - Update user info
- `POST /api/auth/upload-avatar` - Upload avatar
- `GET /api/student/enrollments` - Student enrollments
- `GET /api/teacher/courses` - Teacher courses

#### **Admin Routes** (Need Admin Role)
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

## 🔧 Test Collections

### **Collection 1: Basic Authentication**
1. Register new user
2. Verify email
3. Login with credentials
4. Get current user info
5. Logout (if implemented)

### **Collection 2: Password Reset Flow**
1. Request password reset
2. Reset password with token
3. Login with new password

### **Collection 3: User Management**
1. Update user profile
2. Upload avatar
3. Get user details

### **Collection 4: Course Management**
1. Get public courses
2. Enroll in course (student)
3. Create course (teacher)
4. Update course (teacher)

## 📊 Test Results Documentation

### **Pass Criteria**
- ✅ Status code 2xx for successful operations
- ✅ Response contains expected data structure
- ✅ Authentication works correctly
- ✅ Authorization blocks unauthorized access

### **Fail Criteria**
- ❌ Status code 4xx/5xx for valid requests
- ❌ Missing required fields in response
- ❌ Authentication bypass possible
- ❌ Data validation errors

## 🐛 Common Issues & Solutions

### **1. CORS Errors**
**Problem**: `No 'Access-Control-Allow-Origin' header`
**Solution**: Check `ALLOWED_ORIGINS` environment variable

### **2. Authentication Failures**
**Problem**: `401 Unauthorized` or `403 Forbidden`
**Solution**: 
- Check token is valid and not expired
- Verify user email is verified
- Check user role for admin routes

### **3. Database Connection**
**Problem**: `503 Service Unavailable`
**Solution**: Check database connection string and status

### **4. File Upload Issues**
**Problem**: `413 Payload Too Large` or upload errors
**Solution**: Check file size limits and Cloudinary configuration

## 📈 Performance Testing

### **Load Testing Scenarios**
1. **Concurrent Users**: Test with 10-50 simultaneous users
2. **API Response Times**: Should be < 2 seconds for most endpoints
3. **Database Queries**: Monitor slow queries during load

### **Automated Testing**
Use Postman's Collection Runner to:
- Run entire test suite automatically
- Generate test reports
- Schedule regular tests

## 📝 Test Report Template

```
LMS Backend Test Report
Date: [Date]
Environment: Render Production
Tester: [Your Name]

Authentication Tests:
✅ User Registration
✅ Email Verification
✅ User Login
✅ Password Reset
✅ Token Refresh

API Tests:
✅ Health Check
✅ Public Courses
✅ Protected Routes
✅ File Uploads

Failed Tests:
[List any failed tests with details]

Performance:
[Response times and load test results]

Issues Found:
[List any bugs or issues discovered]

Recommendations:
[Suggestions for improvement]
```

## 🔄 Continuous Testing

Set up automated testing with GitHub Actions:
1. Run tests on every push
2. Test staging environment before production
3. Monitor API health with scheduled tests
4. Get alerts for test failures
