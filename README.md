# Space Division Game

لعبة تعليمية عربية مبنية بـ React + TypeScript + Vite مع Supabase.

## تشغيل المشروع

```bash
npm install
cp .env.example .env
npm run dev
```

ثم ضع بيانات Supabase داخل `.env`.

## إعداد Supabase

1. أنشئ Project جديد.
2. افتح SQL Editor.
3. شغّل ملف `supabase-schema.sql`.
4. من Project Settings > API انسخ URL و anon key إلى `.env`.

## Deploy على Vercel

1. ارفع المشروع على GitHub.
2. Import Project في Vercel.
3. أضف Environment Variables:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
4. Deploy.

## الشاشات الحالية

- Start
- Login
- Intro
- Map
- Tutorial
- Level 0 / Stage 1 Drag & Drop
- Level 0 / Stage 2
- Result

## ملاحظة

شاشة الفيديو حاليًا Placeholder لحين إضافة الفيديو النهائي.
