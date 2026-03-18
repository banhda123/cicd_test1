# Database Migration Guide: MySQL → PostgreSQL

## ✅ **Đã fix:**

### **1. Database Dialect**
```javascript
// File: src/models/index.js, dòng 19
// Đã thay đổi từ:
dialect: 'mysql',
// Thành:
dialect: 'postgres',
```

## ⚠️ **Cần kiểm tra thêm:**

### **1. Package Dependencies**
Kiểm tra xem có cần thêm PostgreSQL driver không:

```bash
# Kiểm tra package.json
npm list | grep -i postgres

# Nếu chưa có, thêm:
npm install pg
# Hoặc:
npm install @sequelize/core pg pg-hstore
```

### **2. Data Types Compatibility**
Một số data types có thể cần adjustment:

#### **MySQL vs PostgreSQL Differences:**
- `DATETIME` → `TIMESTAMP`
- `TEXT` → `TEXT` (compatible)
- `BOOLEAN` → `BOOLEAN` (compatible)
- `JSON` → `JSONB` (PostgreSQL better)

### **3. SQL Syntax Differences**
```sql
-- MySQL
AUTO_INCREMENT
-- PostgreSQL
SERIAL or GENERATED AS IDENTITY

-- MySQL
LIMIT 10 OFFSET 20
-- PostgreSQL (compatible)
LIMIT 10 OFFSET 20

-- MySQL
TINYINT(1)
-- PostgreSQL
BOOLEAN
```

## 🔧 **Steps để migrate:**

### **Step 1: Update Dependencies**
```bash
# Thêm PostgreSQL driver
npm install pg

# Hoặc nếu dùng Sequelize v6+
npm install @sequelize/core pg pg-hstore
```

### **Step 2: Test Connection**
```bash
# Test local với PostgreSQL
# Có thể dùng Docker:
docker run --name postgres-test -e POSTGRES_PASSWORD=test -p 5432:5432 -d postgres:14

# Set environment variables:
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=test
DB_NAME=test_db
```

### **Step 3: Run Database Sync**
```bash
# Sync schema với PostgreSQL
npm run db:sync
```

### **Step 4: Verify Models**
Kiểm tra các model files để đảm bảo compatibility:

#### **Common Issues:**
```javascript
// ❌ MySQL-specific
// user.model.js
email: {
  type: Sequelize.STRING(255),
  charset: 'utf8mb4', // MySQL only
  collate: 'utf8mb4_unicode_ci', // MySQL only
}

// ✅ PostgreSQL compatible  
email: {
  type: Sequelize.STRING(255),
}
```

## 🚀 **Render Deployment:**

### **1. Render Database Setup**
Render sẽ tự động:
- Tạo PostgreSQL database
- Cung cấp connection string
- Set `DATABASE_URL` environment variable

### **2. Environment Variables trên Render:**
```bash
# Render tự động cung cấp:
DATABASE_URL=postgresql://username:password@host:5432/dbname

# Manual variables của bạn:
DB_HOST=dpg-d6sj7pvgi27c73d5hhc0-a
DB_USER=lms_user
DB_PASSWORD=6IDBxSwra9M2KV1NwdN2IBAc9UP9TvkX
DB_NAME=lms_prod
```

### **3. Build Process**
```bash
# Render sẽ chạy:
npm install  # Tự động install pg
npm start    # Kết nối với PostgreSQL
```

## 📊 **Testing Checklist:**

### **Pre-deployment:**
- [ ] Thêm `pg` vào dependencies
- [ ] Test local với PostgreSQL
- [ ] Verify tất cả models
- [ ] Run tests suite

### **Post-deployment:**
- [ ] Health check passes
- [ ] Database connects successfully
- [ ] CRUD operations work
- [ ] Authentication works

## 🐛 **Common Issues & Solutions:**

### **1. Connection Error**
```
Error: getaddrinfo ENOTFOUND
```
**Solution**: Check `DB_HOST` và network connectivity

### **2. Authentication Error**
```
Error: password authentication failed
```
**Solution**: Verify `DB_USER` và `DB_PASSWORD`

### **3. Database Not Found**
```
Error: database "lms_prod" does not exist
```
**Solution**: Create database trên Render dashboard

### **4. Syntax Error**
```
Error: syntax error at or near "AUTO_INCREMENT"
```
**Solution**: Remove MySQL-specific syntax

## 📝 **Quick Fix Summary:**

1. ✅ **Đã fix**: `dialect: 'postgres'`
2. ⚠️ **Cần làm**: Add `pg` dependency
3. ⚠️ **Nên làm**: Test local với PostgreSQL
4. ✅ **Sẵn sàng**: Deploy lên Render

**Database của bạn giờ đã compatible với Render!**
