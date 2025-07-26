# WernDee - ระบบจัดตารางเวรพยาบาลอัตโนมัติ

> **Automated Nurse Scheduling System**

WernDee เป็นเว็บแอปพลิเคชันที่ออกแบบมาเพื่อช่วยหัวหน้าหอผู้ป่วยและพยาบาลในการจัดการตารางเวรประจำเดือนอย่างอัตโนมัติ โดยเน้นความเป็นธรรม ความโปร่งใส และความยืดหยุ่นในการทำงาน

## ✨ คุณสมบัติหลัก

### 👨‍💼 สำหรับหัวหน้าหอผู้ป่วย (Admin)
- 🏥 **จัดการข้อมูลบุคลากร** - เพิ่ม/แก้ไข/ลบข้อมูลพยาบาล กำหนดระดับและเงื่อนไขพิเศษ
- 📋 **อนุมัติคำขอลา/หยุด** - พิจารณาอนุมัติหรือปฏิเสธคำขอต่างๆ
- 🔄 **อนุมัติการแลกเปลี่ยนเวร** - ควบคุมการแลกเปลี่ยนเวรระหว่างพยาบาล
- ⚙️ **กำหนดเงื่อนไขตารางเวร** - ตั้งค่าจำนวนพยาบาลขั้นต่ำและกฎการทำงาน
- 🤖 **สร้างตารางเวรอัตโนมัติ** - ระบบจัดตารางเวรอย่างชาญฉลาด
- ✏️ **แก้ไขตารางด้วยตนเอง** - ปรับแต่งตารางด้วย Drag & Drop
- 📊 **แดชบอร์ดและรายงาน** - ดูสถิติชั่วโมงทำงาน OT และการลา

### 👩‍⚕️ สำหรับพยาบาล (User)
- 📝 **ส่งคำขอลา/หยุด** - ขอลาหรือขอหยุดผ่านระบบ
- 🔄 **แลกเปลี่ยนเวร** - ส่งคำขอแลกเปลี่ยนเวรกับเพื่อนร่วมงาน
- 📅 **ดูตารางเวร** - ดูตารางเวรส่วนตัวและของทีม
- 📱 **เข้าถึงง่าย** - ใช้งานผ่านเว็บเบราว์เซอร์บนทุกอุปกรณ์

## 🏗️ สถาปัตยกรรมระบบ

WernDee ใช้สถาปัตยกรรม Microservices พร้อม Docker containerization:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Nginx Proxy   │◄───┤  React Frontend  │    │ NestJS Backend  │
│   (Port 80)     │    │   (TypeScript)   │◄───┤   (TypeScript)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                        │
                                               ┌─────────────────┐
                                               │  PostgreSQL DB  │
                                               │   with Prisma   │
                                               └─────────────────┘
```

### 🛠️ เทคโนโลยีที่ใช้

#### Frontend
- **React.js 18** + **TypeScript**
- **Ant Design** - UI Component Library
- **Redux Toolkit** - State Management
- **React Router** - Routing
- **Axios** - HTTP Client

#### Backend
- **NestJS 10** + **TypeScript**
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Passport.js** - Authentication Strategy

#### Infrastructure
- **Docker** + **Docker Compose**
- **Nginx** - Reverse Proxy
- **Node.js 18** - Runtime

## 🚀 การติดตั้งและใช้งาน

### ข้อกำหนดระบบ
- Docker & Docker Compose
- Git

### ขั้นตอนการติดตั้ง

1. **Clone โปรเจกต์**
   ```bash
   git clone <repository-url>
   cd nurse-scheduling-system
   ```

2. **ตั้งค่า Environment Variables**
   ```bash
   # สร้างไฟล์ .env ในโฟลเดอร์ backend
   cp backend/.env.example backend/.env
   
   # แก้ไขค่าต่างๆ ตามต้องการ
   nano backend/.env
   ```

3. **เริ่มต้นระบบ**
   ```bash
   # Build และ start ทุก services
   docker-compose up --build -d
   
   # ตรวจสอบสถานะ
   docker-compose ps
   ```

4. **เข้าถึงระบบ**
   - 🌐 **เว็บไซต์**: http://localhost
   - 🔧 **Backend API**: http://localhost/api

### การจัดการ Database

```bash
# สร้าง database migration
docker-compose exec backend npx prisma migrate dev

# Seed ข้อมูลเริ่มต้น
docker-compose exec backend npx prisma db seed

# ดู database ผ่าน Prisma Studio
docker-compose exec backend npx prisma studio
```

## 📝 Database Schema

ระบบใช้ Prisma ORM พร้อม PostgreSQL:

### โมเดลหลัก
- **User** - ผู้ใช้งานระบบ (Admin/User)
- **Nurse** - ข้อมูลพยาบาล
- **Shift** - ช่วงเวรทำงาน (เช้า/บ่าย/ดึก)
- **ScheduleAssignment** - การกำหนดเวรให้พยาบาล
- **Request** - คำขอลาและแลกเปลี่ยนเวร
- **ScheduleRule** - กฎการจัดตารางเวร

### ความสัมพันธ์
- User ↔ Nurse (1:1)
- Nurse ↔ ScheduleAssignment (1:M)
- Shift ↔ ScheduleAssignment (1:M)
- Nurse ↔ Request (1:M)

## 🔧 การพัฒนา

### โครงสร้างโปรเจกต์
```
werndee/
├── backend/          # NestJS Backend
│   ├── src/
│   ├── prisma/
│   └── Dockerfile
├── frontend/         # React Frontend
│   ├── src/
│   └── Dockerfile
├── nginx/           # Nginx Configuration
│   └── nginx.conf
└── docker-compose.yml
```

### คำสั่งที่มีประโยชน์

```bash
# ดู logs ของ services
docker-compose logs -f [service-name]

# เข้าไปใน container
docker-compose exec [service-name] sh

# Restart service
docker-compose restart [service-name]

# Stop ทุก services
docker-compose down

# Stop และลบ volumes
docker-compose down -v
```

## 📋 API Documentation

### Authentication
```
POST /api/auth/login
```

### Users
```
GET    /api/users        # ดูรายชื่อผู้ใช้ทั้งหมด (Admin)
POST   /api/users        # สร้างผู้ใช้ใหม่ (Admin)
GET    /api/users/me     # ดูข้อมูลตัวเอง
GET    /api/users/:id    # ดูข้อมูลผู้ใช้ (Admin)
PATCH  /api/users/:id    # แก้ไขข้อมูลผู้ใช้ (Admin)
DELETE /api/users/:id    # ลบผู้ใช้ (Admin)
```

### Nurses
```
GET    /api/nurses       # ดูรายชื่อพยาบาล
POST   /api/nurses       # เพิ่มพยาบาลใหม่ (Admin)
PATCH  /api/nurses/:id   # แก้ไขข้อมูลพยาบาล (Admin)
DELETE /api/nurses/:id   # ลบพยาบาล (Admin)
```

### Schedules & Requests
```
GET    /api/schedules    # ดูตารางเวร
POST   /api/schedules/generate  # สร้างตารางเวรอัตโนมัติ (Admin)
GET    /api/requests     # ดูคำขอทั้งหมด
POST   /api/requests     # ส่งคำขอใหม่
PATCH  /api/requests/:id # อนุมัติ/ปฏิเสธคำขอ
```

## 🤝 การมีส่วนร่วม

เรายินดีรับ contribution จากทุกคน! กรุณา:

1. Fork โปรเจกต์
2. สร้าง feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit การเปลี่ยนแปลง (`git commit -m 'Add some AmazingFeature'`)
4. Push ไปยัง branch (`git push origin feature/AmazingFeature`)
5. เปิด Pull Request

## 📄 License

โปรเจกต์นี้อยู่ภายใต้ MIT License - ดูรายละเอียดใน [LICENSE](LICENSE) file

## 💬 ติดต่อและสนับสนุน

- 📧 **Email**: [your-email@example.com]
- 🐛 **Bug Reports**: [GitHub Issues](./issues)
- 💡 **Feature Requests**: [GitHub Discussions](./discussions)

---

**WernDee** - *Making nurse scheduling fair, transparent, and efficient* 🏥✨
