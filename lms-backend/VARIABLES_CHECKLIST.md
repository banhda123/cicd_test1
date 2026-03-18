# Environment Variables Checklist for Render Deployment

## ✅ **Variables bạn đã cung cấp:**

### **Database**
- ✅ `DB_HOST=dpg-d6sj7pvgi27c73d5hhc0-a`
- ✅ `DB_USER=lms_user`
- ✅ `DB_PASSWORD=6IDBxSwra9M2KV1NwdN2IBAc9UP9TvkX`
- ✅ `DB_NAME=lms_prod`

### **JWT & Security**
- ✅ `JWT_SECRET=13062003`
- ✅ `JWT_EXPIRES_IN=7d`

### **CORS**
- ✅ `ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,https://elearning-eduvn.vercel.app`

### **Cloudinary**
- ✅ `CLOUDINARY_CLOUD_NAME=donhsx3ds`
- ✅ `CLOUDINARY_API_KEY=816275128273327`
- ✅ `CLOUDINARY_API_SECRET=5T3MPxrjC3rY044dXuL1SPOROQo`
- ✅ `CLOUDINARY_FOLDER=lms_media`

### **Email**
- ✅ `EMAIL_HOST=smtp.gmail.com`
- ✅ `EMAIL_PORT=465`
- ✅ `EMAIL_USER=www.thaitrinh12@gmail.com`
- ✅ `EMAIL_PASSWORD=ogxrhwtycdbyziph`
- ✅ `EMAIL_FROM_NAME=lms`
- ✅ `EMAIL_VERIFY_EXPIRE=24h`
- ✅ `RESET_PASSWORD_EXPIRE=1h`

### **Admin**
- ✅ `ADMIN_EMAIL=admin@lms.com`
- ✅ `ADMIN_PASSWORD=admin123456`

### **General**
- ✅ `NODE_ENV=production`
- ✅ `PORT=5000`
- ✅ `URL_FE_RESETPASS=http://localhost:5173/reset-password`

## ⚠️ **Variables còn thiếu (Quan trọng):**

### **1. AI Services**
```bash
# Cần thêm nếu dùng AI features
AI_ENABLED=true
AI_PROVIDER=gemini
AI_MODEL=gemini-1.5-flash
AI_EMBEDDING_MODEL=gemini-embedding-001
AI_MAX_OUTPUT_TOKENS=1024
AI_RAG_TOP_K=5
AI_CHUNK_MAX_CHARS=900
GEMINI_API_KEY=your_gemini_api_key_here
```

### **2. Testing Variables**
```bash
# Cho test suite
TEST_ADMIN_EMAIL=admin@lms.com
TEST_ADMIN_PASSWORD=admin123456
TEST_TEACHER_EMAIL=teacher@lms.com
TEST_TEACHER_PASSWORD=teacher123
TEST_STUDENT_EMAIL=student@lms.com
TEST_STUDENT_PASSWORD=student123
TEST_CLEANUP=0
```

### **3. Session & Rate Limiting**
```bash
# Session management
SESSION_SECRET=your_session_secret_here
# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### **4. Supabase (nếu dùng)**
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### **5. Google OAuth (nếu dùng)**
```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-app-name.onrender.com/auth/google/callback
```

### **6. Frontend URL**
```bash
# Cho Google OAuth và redirects
FRONTEND_URL=https://elearning-eduvn.vercel.app
```

## 🔧 **Variables cần cập nhật cho Render:**

### **1. PORT**
```bash
# Thay vì:
PORT=5000
# Sử dụng:
PORT=$PORT
# Render sẽ tự động inject port đúng
```

### **2. Frontend URLs**
```bash
# Cập nhật localhost URLs thành production URLs:
URL_FE_RESETPASS=https://elearning-eduvn.vercel.app/reset-password
FRONTEND_URL=https://elearning-eduvn.vercel.app
```

### **3. Database Dialect**
```bash
# Code hiện tại dùng MySQL, nhưng Render cung cấp PostgreSQL
# Cần update src/models/index.js dòng 19:
dialect: 'postgres'
```

## 📊 **Phân tích mức độ quan trọng:**

| Variable | Mức độ | Ảnh hưởng nếu thiếu |
|----------|---------|-------------------|
| Database | ⭐⭐⭐⭐⭐ | **CRITICAL** - App không start |
| JWT_SECRET | ⭐⭐⭐⭐⭐ | **CRITICAL** - Không authentication |
| ALLOWED_ORIGINS | ⭐⭐⭐⭐ | **HIGH** - CORS errors |
| CLOUDINARY_* | ⭐⭐⭐ | **MEDIUM** - Không upload file |
| EMAIL_* | ⭐⭐ | **LOW** - Không gửi email (đã disabled) |
| AI_* | ⭐ | **OPTIONAL** - Không có AI features |

## 🚀 **Action Items:**

### **Bắt buộc (Must-have):**
1. ✅ Database variables - Đã có
2. ✅ JWT_SECRET - Đã có
3. ✅ ALLOWED_ORIGINS - Đã có
4. ✅ CLOUDINARY_* - Đã có
5. ⚠️ Update database dialect sang PostgreSQL

### **Khuyến nghị (Should-have):**
1. ⚠️ Thêm `SESSION_SECRET`
2. ⚠️ Thêm `FRONTEND_URL`
3. ⚠️ Cập nhật `PORT=$PORT`
4. ⚠️ Cập nhật `URL_FE_RESETPASS` thành production URL

### **Tùy chọn (Nice-to-have):**
1. ⚠️ AI variables nếu dùng features
2. ⚠️ Google OAuth nếu cần
3. ⚠️ Testing variables cho CI/CD

## 📝 **Kết luận:**

**Variables của bạn đã ~80% hoàn chỉnh** cho basic functionality. Chỉ cần:
1. Update database dialect
2. Thêm SESSION_SECRET  
3. Cập nhật PORT và URLs cho production

**App sẽ chạy được** với các core features (auth, CRUD, file uploads).
