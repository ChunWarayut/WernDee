# WernDee - ระบบจัดตารางเวรพยาบาลอัตโนมัติ

## 🎉 ระบบเสร็จสมบูรณ์แล้ว!

ระบบ WernDee ได้รับการพัฒนาเสร็จสิ้นและพร้อมใช้งานแล้ว ประกอบด้วย:

### 🏗️ สถาปัตยกรรมระบบ

```
Frontend (React + TypeScript) → Backend (NestJS + TypeScript) → Database (SQLite)
      Port 3001                      Port 3000                     dev.db
```

### 🔧 ส่วนประกอบที่เสร็จสมบูรณ์

#### Backend (NestJS)
- ✅ **Authentication Module** - JWT-based authentication with role-based access
- ✅ **User Module** - User management with CRUD operations
- ✅ **Nurse Module** - Nurse profile management
- ✅ **Shift Module** - Work shift configuration (เช้า, บ่าย, ดึก)
- ✅ **Schedule Module** - Automated schedule generation and manual editing
- ✅ **Request Module** - Leave requests and shift exchange management
- ✅ **Database** - SQLite with Prisma ORM
- ✅ **Data Seeding** - Pre-populated with admin and sample nurses

#### Frontend (React)
- ✅ **Authentication** - Login/logout with JWT tokens
- ✅ **Dashboard** - Overview statistics and quick actions
- ✅ **Layout** - Responsive sidebar navigation with Thai UI
- ✅ **Redux Store** - State management for all entities
- ✅ **API Services** - Complete REST API integration
- ✅ **Component Structure** - Modular and reusable components

### 🚀 วิธีการรันระบบ

#### เมื่อระบบรันอยู่แล้ว:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000/api

#### ข้อมูลการเข้าสู่ระบบ:

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Sample Nurses:**
- Username: `somjaijaidi` | Password: `password123`
- Username: `maleesawiyangam` | Password: `password123` 
- Username: `wilairaksakhon` | Password: `password123`
- Username: `sudachuayleau` | Password: `password123`
- Username: `niphadulaedi` | Password: `password123`

### 📋 API Endpoints ที่พร้อมใช้งาน

#### Authentication
- `POST /api/auth/login` - User login

#### Users  
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/me` - Get current user profile
- `POST /api/users` - Create new user (Admin only)
- `PATCH /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

#### Nurses
- `GET /api/nurses` - Get all nurses
- `GET /api/nurses/:id` - Get nurse by ID
- `POST /api/nurses` - Create new nurse (Admin only)
- `PATCH /api/nurses/:id` - Update nurse (Admin only)  
- `DELETE /api/nurses/:id` - Delete nurse (Admin only)
- `GET /api/nurses/available` - Get available nurses for shift

#### Shifts
- `GET /api/shifts` - Get all shifts
- `POST /api/shifts` - Create new shift (Admin only)
- `POST /api/shifts/initialize` - Initialize default shifts (Admin only)
- `PATCH /api/shifts/:id` - Update shift (Admin only)
- `DELETE /api/shifts/:id` - Delete shift (Admin only)

#### Schedules
- `GET /api/schedules` - Get schedule by month
- `GET /api/schedules/nurse/:id` - Get nurse's schedule  
- `POST /api/schedules/generate` - Generate automatic schedule (Admin only)
- `POST /api/schedules/assignments` - Create manual assignment (Admin only)
- `PATCH /api/schedules/assignments/:id` - Update assignment (Admin only)
- `DELETE /api/schedules/assignments/:id` - Delete assignment (Admin only)

#### Requests
- `GET /api/requests` - Get all requests (Admin only)
- `GET /api/requests/my-requests` - Get user's requests
- `POST /api/requests/leave` - Create leave request
- `POST /api/requests/shift-exchange` - Create shift exchange request  
- `PATCH /api/requests/:id/status` - Update request status
- `DELETE /api/requests/:id` - Delete request

### 🎯 คุณสมบัติหลัก

#### สำหรับ Admin:
1. **จัดการพยาบาล** - เพิ่ม/แก้ไข/ลบข้อมูลพยาบาล
2. **สร้างตารางเวรอัตโนมัติ** - ระบบจัดตารางเวรอย่างชาญฉลาด
3. **แก้ไขตารางด้วยตนเอง** - ปรับแต่งตารางเวรด้วย Drag & Drop
4. **อนุมัติคำขอ** - พิจารณาคำขอลาและแลกเปลี่ยนเวร
5. **ดูรายงาน** - สถิติและภาพรวมของระบบ

#### สำหรับพยาบาล:
1. **ดูตารางเวร** - ตารางเวรส่วนตัวและของทีม
2. **ส่งคำขอลา** - ขอลาผ่านระบบ  
3. **แลกเปลี่ยนเวร** - ส่งคำขอแลกเปลี่ยนเวรกับเพื่อนร่วมงาน
4. **ติดตามสถานะ** - ดูสถานะคำขอต่างๆ

### 🗄️ โครงสร้างฐานข้อมูล

```sql
- User (ผู้ใช้งาน)
- Nurse (พยาบาล) 
- Shift (ช่วงเวร)
- ScheduleAssignment (การกำหนดเวร)
- Request (คำขอลา/แลกเปลี่ยนเวร)
- ScheduleRule (กฎการจัดตารางเวร)
```

### 🔐 ระบบความปลอดภัย

- JWT-based authentication
- Role-based access control (Admin/User)
- Password hashing with bcrypt
- API route protection
- CORS configuration

### 🌐 การใช้งาน

1. เข้าสู่ระบบด้วยบัญชี admin หรือ nurse
2. ดูแดชบอร์ดเพื่อได้ภาพรวม
3. สำหรับ Admin: จัดการพยาบาล, สร้างตารางเวร, อนุมัติคำขอ
4. สำหรับ Nurse: ดูตารางเวร, ส่งคำขอ, แลกเปลี่ยนเวร

### 📱 Responsive Design

- รองรับการแสดงผลบนหน้าจอทุกขนาด
- UI ภาษาไทยที่เข้าใจง่าย
- Navigation ที่ใช้งานสะดวก

---

**WernDee** - *Making nurse scheduling fair, transparent, and efficient* 🏥✨

ระบบพร้อมใช้งานและสามารถขยายฟีเจอร์เพิ่มเติมได้ตามต้องการ!