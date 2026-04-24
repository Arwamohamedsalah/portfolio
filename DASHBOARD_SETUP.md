# Dashboard Setup Guide

## نظرة عامة
تم إنشاء نظام داشبورد كامل لإدارة محتوى الموقع مع:
- نظام مصادقة (Authentication)
- إدارة المشاريع (CRUD)
- إدارة الأقسام (About, Education, Reviews)
- اتصال بـ MongoDB Atlas

## الإعداد الأولي

### 1. تشغيل Backend
```bash
cd backend
npm install
npm run dev
```

الخادم سيعمل على `http://localhost:9999`

### 2. إنشاء حساب Admin
عند أول تشغيل، يمكنك إنشاء حساب Admin من خلال:
```bash
POST http://localhost:9999/api/auth/register
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "yourpassword"
}
```

**ملاحظة:** يمكن إنشاء حساب Admin فقط إذا لم يكن هناك مستخدمين موجودين.

### 3. تشغيل Frontend
```bash
npm install
npm run dev
```

الموقع سيعمل على `http://localhost:5173`

## استخدام الداشبورد

### تسجيل الدخول
1. اذهب إلى `/login`
2. أدخل البريد الإلكتروني وكلمة المرور
3. بعد تسجيل الدخول، سيتم توجيهك إلى `/dashboard`

### إدارة المشاريع
1. في الداشبورد، اختر تبويب "Projects"
2. اضغط "Add Project" لإضافة مشروع جديد
3. املأ البيانات:
   - Title (العنوان)
   - Description (الوصف)
   - Image URL (رابط الصورة)
   - Technologies (التقنيات - مفصولة بفواصل)
   - Type (نوع المشروع: web أو mobile)
   - GitHub Link (رابط GitHub)
   - Live Demo Link (رابط العرض المباشر)
   - Featured (مشروع مميز)
   - Order (الترتيب)

4. يمكنك تعديل أو حذف المشاريع الموجودة

### API Endpoints

#### Authentication
- `POST /api/auth/register` - إنشاء حساب Admin (فقط عند عدم وجود مستخدمين)
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/me` - الحصول على معلومات المستخدم الحالي

#### Projects
- `GET /api/projects` - جلب جميع المشاريع (عام)
- `GET /api/projects/:id` - جلب مشروع محدد
- `POST /api/projects` - إنشاء مشروع جديد (يتطلب مصادقة)
- `PUT /api/projects/:id` - تحديث مشروع (يتطلب مصادقة)
- `DELETE /api/projects/:id` - حذف مشروع (يتطلب مصادقة)

#### Sections
- `GET /api/sections/about` - جلب قسم About
- `PUT /api/sections/about` - تحديث قسم About (يتطلب مصادقة)
- `GET /api/sections/education` - جلب قسم Education
- `POST /api/sections/education` - إنشاء مدخل Education (يتطلب مصادقة)
- `PUT /api/sections/education/:id` - تحديث مدخل Education (يتطلب مصادقة)
- `DELETE /api/sections/education/:id` - حذف مدخل Education (يتطلب مصادقة)
- `GET /api/sections/reviews` - جلب جميع Reviews
- `POST /api/sections/reviews` - إنشاء Review (يتطلب مصادقة)
- `PUT /api/sections/reviews/:id` - تحديث Review (يتطلب مصادقة)
- `DELETE /api/sections/reviews/:id` - حذف Review (يتطلب مصادقة)

## MongoDB Connection
تم إعداد الاتصال بـ MongoDB Atlas باستخدام:
- Cluster: `cluster0.dzf1tgl.mongodb.net`
- Database: `portfolio`

يمكنك تغيير الاتصال من خلال متغير البيئة `MONGODB_URI` في ملف `.env`

## ملاحظات مهمة
1. جميع عمليات التعديل والحذف تتطلب تسجيل الدخول
2. Token يتم حفظه في localStorage
3. Token صالح لمدة 7 أيام
4. عند انتهاء Token، سيتم توجيهك تلقائياً لصفحة تسجيل الدخول

## الخطوات التالية
- [ ] إضافة إدارة كاملة لقسم About
- [ ] إضافة إدارة كاملة لقسم Education
- [ ] إضافة إدارة كاملة لقسم Reviews
- [ ] إضافة رفع الصور
- [ ] إضافة إحصائيات في الداشبورد

