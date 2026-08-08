# 📝 Panduan Fitur Feedback Portal Sekolah

## 🎯 Overview
Fitur feedback memungkinkan semua pengguna (guru, siswa, orang tua, admin, tamu) untuk mengirim masukan, keluhan, saran, atau pertanyaan langsung ke admin sekolah melalui tombol floating di pojok kanan bawah layar.

## ✨ Fitur Utama

### 1. **Floating Feedback Button**
- **Lokasi:** Pojok kanan bawah layar
- **Tampilan:** Tombol biru dengan icon "Feedback"
- **Tooltip:** "Kirim masukan & keluhan" saat di-hover
- **Animasi:** Scale effect saat hover dan click

### 2. **Form Feedback Komprehensif**
Form yang muncul saat tombol diklik berisi:

#### **Informasi Pengirim:**
- **Nama Lengkap** (Wajib) - Auto-filled dari user data
- **Email** (Opsional) - Untuk admin bisa menghubungi balik

#### **Kategori Feedback:**
- 🐛 **Bug/Error** - Masalah teknis di sistem
- 💡 **Saran Perbaikan** - Ide untuk improvement
- ⚠️ **Keluhan** - Kekhawatiran atau masalah layanan
- ❓ **Pertanyaan** - Pertanyaan seputar sistem
- 📋 **Lainnya** - Kategori lain

#### **Prioritas:**
- **Rendah** - Tidak urgent
- **Sedang** - Perlu perhatian
- **Tinggi** - Sangat urgent/urgent

#### **Detail Feedback:**
- **Subjek** (Wajib) - Ringkasan feedback
- **Pesan** (Wajib, min 10 karakter) - Detail feedback

### 3. **Status Pengiriman**
- **Loading State** - Menampilkan spinner saat mengirim
- **Success State** - Menampilkan pesan sukses dengan icon check
- **Error State** - Menampilkan pesan error jika gagal

### 4. **Auto-Close**
- Form otomatis tertutup setelah 3 detik jika berhasil
- Tombol "Batal" untuk menutup manual
- Tombol "X" di header untuk menutup

## 🔧 Konfigurasi Email

### Langkah 1: Setup EmailJS
1. Daftar di https://www.emailjs.com/
2. Buat account baru (gratis untuk penggunaan personal)
3. Buat Email Service (Gmail, Outlook, dll)
4. Buat Email Template dengan parameter:
   - `from_name` - Nama pengirim
   - `from_email` - Email pengirim
   - `role` - Role pengguna
   - `category` - Kategori feedback
   - `subject` - Subjek feedback
   - `message` - Isi feedback
   - `priority` - Prioritas feedback
   - `to_email` - Email admin
   - `submitted_at` - Waktu pengiriman

### Langkah 2: Update Environment Variables
Tambahkan ke file `.env.local`:

```env
# Email untuk menerima feedback
VITE_ADMIN_EMAIL=anda@email.com

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### Langkah 3: Template EmailJS Contoh
```
Subject: Feedback Portal Sekolah - {{category}} - {{priority}}

Dari: {{from_name}} ({{from_email}})
Role: {{role}}
Kategori: {{category}}
Prioritas: {{priority}}
Waktu: {{submitted_at}}

Subjek: {{subject}}

Pesan:
{{message}}
```

## 📊 Manajemen Feedback

### Local Storage
Feedback disimpan di localStorage dengan key `feedback_data`. Struktur data:

```typescript
interface Feedback {
  id: string;
  name: string;
  email?: string;
  role: string;
  category: 'bug' | 'saran' | 'keluhan' | 'pertanyaan' | 'lainnya';
  subject: string;
  message: string;
  priority: 'rendah' | 'sedang' | 'tinggi';
  status: 'pending' | 'dibaca' | 'diproses' | 'selesai';
  submittedAt: number;
  adminNotes?: string;
  processedAt?: number;
}
```

### Service Functions
Semua fungsi manajemen feedback tersedia di `src/data/services/feedbackService.ts`:

- `getFeedbacks()` - Mendapatkan semua feedback
- `addFeedback(data)` - Menambah feedback baru
- `updateFeedbackStatus(id, status, notes)` - Update status feedback
- `getFeedbacksByStatus(status)` - Filter berdasarkan status
- `getFeedbacksByCategory(category)` - Filter berdasarkan kategori
- `getFeedbacksByPriority(priority)` - Filter berdasarkan prioritas
- `deleteFeedback(id)` - Hapus feedback
- `getFeedbackStats()` - Mendapatkan statistik feedback

### Statistik yang Tersedia
```typescript
{
  total: number,
  pending: number,
  dibaca: number,
  diproses: number,
  selesai: number,
  byCategory: {
    bug: number,
    saran: number,
    keluhan: number,
    pertanyaan: number,
    lainnya: number
  },
  byPriority: {
    rendah: number,
    sedang: number,
    tinggi: number
  }
}
```

## 🎨 UI/UX Features

### Design System
- **Neubrutalism Style** - Border tebal 2px, shadow, bold typography
- **Color Coding** - Setiap kategori memiliki warna berbeda
- **Responsive** - Berfungsi baik di mobile dan desktop
- **Accessibility** - Keyboard navigation, screen reader friendly

### Animations
- **Button Hover** - Scale 1.05 dengan shadow
- **Button Click** - Scale 0.95 active state
- **Modal Open** - Fade in dengan backdrop blur
- **Success State** - Icon check dengan pulse animation

### Error Handling
- **Form Validation** - Real-time validation dengan error messages
- **Loading States** - Spinner saat submit
- **Error Messages** - Clear error messages jika gagal
- **Network Error** - Graceful handling jika EmailJS gagal

## 🚀 Mode Operasi

### Development Mode (Default)
- Feedback disimpan di localStorage
- Email tidak dikirim (mode simulasi)
- Data logged di console untuk debugging
- Tidak perlu EmailJS credentials

### Production Mode
- Feedback disimpan di localStorage
- Email dikirim ke admin menggunakan EmailJS
- Membutuhkan EmailJS credentials yang valid
- Real-time notification ke email admin

## 📝 Best Practices

### Untuk Pengguna
1. **Berikan Detail** - Jelaskan feedback secara detail dan spesifik
2. **Pilih Kategori Tepat** - Pilih kategori yang sesuai untuk faster response
3. **Tentukan Prioritas** - Gunakan prioritas "tinggi" hanya untuk issues urgent
4. **Sertakan Email** - Tambahkan email jika ingin admin menghubungi balik

### Untuk Admin
1. **Monitor Regularly** - Cek feedback setiap hari
2. **Update Status** - Update status feedback secara berkala
3. **Response Time** - Response feedback urgent dalam 24 jam
4. **Track Patterns** - Identifikasi pattern untuk improvement sistem

## 🔍 Troubleshooting

### Feedback tidak muncul di email
- **Cek EmailJS credentials** di environment variables
- **Verifikasi email template** di EmailJS dashboard
- **Cek browser console** untuk error messages
- **Test EmailJS service** di EmailJS dashboard

### Form tidak muncul saat tombol diklik
- **Cek React state** di browser dev tools
- **Verify FeedbackButton component** terpasang di App.tsx
- **Check z-index** apakah tertutup oleh element lain

### Data tidak tersimpan di localStorage
- **Cek browser permissions** untuk localStorage
- **Verify quota** localStorage tidak penuh
- **Check browser console** untuk storage errors

## 📈 Monitoring & Analytics

### Metrics yang Bisa Dilacak
- Jumlah feedback per hari/minggu/bulan
- Feedback by category (bug, saran, keluhan, dll)
- Feedback by priority
- Response time admin
- User satisfaction rate

### Dashboard Suggestions
Buat dashboard admin untuk:
- Real-time feedback counter
- Charts feedback trends
- Status feedback yang pending
- Priority queue untuk admin
- Export data ke CSV/Excel

## 🔒 Security Considerations

### Data Protection
- **No sensitive data** - Jangan kirim password/sensitive info via feedback
- **Rate limiting** - Tambahkan rate limiting untuk prevent spam
- **Input sanitization** - Sanitize user input untuk prevent XSS
- **Email validation** - Validate email format sebelum kirim

### Admin Access
- **Role-based access** - Hanya admin yang bisa lihat semua feedback
- **Audit logs** - Log semua actions admin pada feedback
- **Secure storage** - Consider encrypt sensitive feedback data

## 📞 Support

### Technical Issues
- Cek dokumentasi EmailJS: https://www.emailjs.com/docs/
- React documentation: https://react.dev/
- Tailwind CSS: https://tailwindcss.com/docs

### Feature Requests
- Kirim feedback melalui fitur feedback itu sendiri! 😄
- Contact development team untuk enhancement requests

---

**Catatan:** Fitur ini menggunakan pendekatan "Minimum Viable Product" dan dapat dikembangkan lebih lanjut sesuai kebutuhan sekolah. Feedback system ini adalah salah satu cara terbaik untuk mendapatkan input dari pengguna dan meningkatkan kualitas portal sekolah secara berkelanjutan.


1. Floating Feedback Button ✅

  • File: src/components/common/FeedbackButton.tsx
  • Lokasi: Pojok kanan bawah layar
  • Tampilan: Tombol biru dengan icon "Feedback" dan tooltip
  • Animasi: Hover dan click effects yang smooth

2. Feedback Form Modal ✅

  • File: src/fitur/FeedbackForm.tsx
  • Features:
    • Form validation lengkap
    • 5 kategori feedback (Bug, Saran, Keluhan, Pertanyaan, Lainnya)
    • 3 level prioritas (Rendah, Sedang, Tinggi)
    • Loading states dan error handling
    • Auto-close setelah sukses
    • Success message dengan animation

3. Feedback Service ✅

  • File: src/data/services/feedbackService.ts
  • Functions:
    • CRUD operations untuk feedback
    • Filter by status, category, priority
    • Statistik feedback
    • Email integration dengan EmailJS
    • Local storage management

4. EmailJS Integration ✅

  • Package: @emailjs/browser (telah diinstall)
  • Features:
    • Mode simulasi untuk development (tanpa credentials)
    • Production mode dengan EmailJS credentials
    • Template parameters lengkap
    • Error handling yang graceful

5. Environment Configuration ✅

  • File yang diupdate:
    • .env.example - Template konfigurasi
    • .env.local - Konfigurasi lokal
  • Variables:
    • VITE_ADMIN_EMAIL - Email admin penerima feedback
    • VITE_EMAILJS_SERVICE_ID - EmailJS service ID
    • VITE_EMAILJS_TEMPLATE_ID - EmailJS template ID
    • VITE_EMAILJS_PUBLIC_KEY - EmailJS public key

6. Integration ke App ✅

  • File yang diupdate: src/App.tsx
  • Features:
    • FeedbackButton terpasang di semua halaman
    • FeedbackForm modal management
    • State management untuk open/close

7. Documentation ✅

  • File: public/images/panduanFeedback.md
  • Isi:
    • Panduan lengkap fitur feedback
    • Setup EmailJS step-by-step
    • Troubleshooting guide
    • Best practices
    • Security considerations

🎨 UI/UX Features:

  • Neubrutalism Style - Border tebal, shadow, bold typography
  • Color Coding - Setiap kategori memiliki warna berbeda
  • Responsive Design - Berfungsi baik di mobile dan desktop
  • Accessibility - Keyboard navigation dan screen reader friendly
  • Animations - Smooth transitions dan micro-interactions

📊 Data Structure:

interface Feedback {
  id: string;
  name: string;
  email?: string;
  role: string;
  category: 'bug' | 'saran' | 'keluhan' | 'pertanyaan' | 'lainnya';
  subject: string;
  message: string;
  priority: 'rendah' | 'sedang' | 'tinggi';
  status: 'pending' | 'dibaca' | 'diproses' | 'selesai';
  submittedAt: number;
  adminNotes?: string;
  processedAt?: number;
}

🚀 Cara Menggunakan:

Untuk Pengguna:

  1. Klik tombol "Feedback" di pojok kanan bawah
  2. Isi form feedback yang muncul
  3. Pilih kategori dan prioritas yang sesuai
  4. Klik "Kirim Feedback"
  5. Feedback akan disimpan dan dikirim ke email admin

Untuk Admin (Setup Email):

  1. Daftar di https://www.emailjs.com/
  2. Buat email service dan template
  3. Update environment variables dengan EmailJS credentials
  4. Feedback akan otomatis dikirim ke email admin

✅ Testing Results:

  • TypeScript Check: ✅ Passed
  • Build Process: ✅ Successful
  • Code Quality: ✅ No errors
  • Integration: ✅ Properly integrated

📝 Langkah Selanjutnya (Opsional):

  1. Setup EmailJS - Ikuti panduan di panduanFeedback.md
  2. Custom Template - Buat email template yang lebih detailed
  3. Admin Dashboard - Buat halaman admin untuk manage feedback
  4. Analytics - Tambahkan tracking untuk feedback metrics
  5. Rate Limiting - Tambahkan protection untuk prevent spam

🎉 Fitur Ini Memberikan:

  • Kanal Komunikasi - Cara mudah pengguna mengirim feedback
  • Data Insights - Informasi berharga untuk improvement
  • User Engagement - Meningkatkan engagement pengguna
  • Quality Control - Monitoring quality sistem secara real-time
  • Professional Support - System support yang professional

Fitur feedback sekarang sudah aktif dan siap digunakan! Pengguna bisa langsung mengirim feedback dari pojok kanan bawah layar. Untuk mengaktifkan email notification,
Anda hanya perlu setup EmailJS credentials di environment variables. 🚀