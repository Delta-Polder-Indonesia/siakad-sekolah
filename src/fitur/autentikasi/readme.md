# maps folder file
```text
src/fitur/autentikasi/
├── LoginPage.tsx              					✅ Bersih & modular
├── TutorialModal.tsx
├── GoogleLoginButton.tsx
└── DataLogingPage/
    ├── index.ts               						✅ Barrel export
    ├── constants.ts           						✅ Konstanta + LOGIN_ILLUSTRATION
    ├── types.ts               						✅ Types + disabled prop
    ├── utils.ts               							✅ Validasi input
    ├── hooks.ts               						✅ useModalBehavior
    ├── BackgroundSlideshow.tsx			✅ Slideshow beranda
    ├── LoginPanel.tsx        					✅ Panel login + lockout
    ├── LoginIllustration.tsx  					✅ Foto full pengumuman
    ├── PpdbModal.tsx          					✅ Modal PPDB
    └── PerpustakaanModal.tsx  			✅ Modal Perpustakaan
	```
	
	# Struktur File `autentikasi` — Panduan Lengkap

```
src/
└── fitur/
    └── autentikasi/
        │
        ├── LoginPage.tsx
        │   ├── 📦 Import dari DataLogingPage/index.ts
        │   │   ├── BACKGROUND_IMAGES, MAIN_NAV, LOGO_SMP
        │   │   ├── SCHOOL_CONFIG, SLIDESHOW_INTERVAL_MS
        │   │   ├── MAX_LOGIN_ATTEMPTS, LOCKOUT_DURATION_MS
        │   │   ├── PpdbView, ValidRole (types)
        │   │   ├── validateLoginInput (utils)
        │   │   ├── BackgroundSlideshow (component)
        │   │   ├── LoginPanel (component)
        │   │   ├── PpdbModal (component)
        │   │   └── PerpustakaanModal (component)
        │   │
        │   ├── 📦 Import Lazy Modal (dari luar folder)
        │   │   ├── AdminMasterPanel  ← ../admin/PanelAdminModal
        │   │   ├── TutorialModal     ← ./TutorialModal
        │   │   └── ExpectationModal  ← ../halaman/ExpectationModal
        │   │
        │   └── 🧠 State & Logic
        │       ├── [form]      role, id, password, showPassword
        │       ├── [auth]      isLoading, error
        │       ├── [security]  loginAttempts, lockoutUntil
        │       ├── [modals]    isLoginOpen, showTutorial,
        │       │               showExpectation, showPPDB,
        │       │               ppdbView, showPerpustakaan,
        │       │               openAdminPanel, adminScope
        │       ├── [slide]     currentSlide
        │       └── [handlers]  handleSubmit, handleGoogleLogin,
        │                       handleNavClick, handleRoleChange,
        │                       handleOpenLogin, handleClosePPDB, ...
        │
        ├── TutorialModal.tsx          ← lazy loaded oleh LoginPage
        │
        └── DataLogingPage/
            │
            ├── index.ts
            │   └── 📤 Barrel export semua sub-modul
            │       ├── export * from './constants'
            │       ├── export * from './types'
            │       ├── export * from './utils'
            │       ├── export * from './hooks'
            │       ├── export { default as BackgroundSlideshow }
            │       ├── export { default as LoginPanel }
            │       ├── export { default as PpdbModal }
            │       └── export { default as PerpustakaanModal }
            │
            ├── constants.ts
            │   └── 📌 Semua nilai tetap
            │       ├── LOGO_SMP           (path asset)
            │       ├── SLIDESHOW_INTERVAL_MS = 6000
            │       ├── MAX_LOGIN_ATTEMPTS    = 5
            │       ├── LOCKOUT_DURATION_MS   = 30_000
            │       ├── SCHOOL_CONFIG        { name, systemTitle }
            │       ├── Z_INDEX              { overlay, loginPanel,
            │       │                          ppdbModal, perpustakaanModal }
            │       ├── BACKGROUND_IMAGES    [ { src, caption, description } ]
            │       ├── MAIN_NAV             [ { key, label } ]
            │       ├── VALID_ROLES          ['teacher','student',
            │       │                         'parent','guest']
            │       └── ROLE_CONFIG          { label, idLabel,
            │                                  idPlaceholder, passwordLabel,
            │                                  passwordPlaceholder, inputType }
            │
            ├── types.ts
            │   └── 📐 Semua tipe & interface TypeScript
            │       ├── ValidRole            (dari VALID_ROLES)
            │       ├── PpdbView             'landing'|'form'|'cek-kelulusan'
            │       ├── LoginPanelProps       { isOpen, onClose, role, id,
            │       │                          password, showPassword,
            │       │                          isLoading, hasError,
            │       │                          errorMessage, onRoleChange,
            │       │                          onIdChange, onPasswordChange,
            │       │                          onTogglePassword, onSubmit,
            │       │                          onHelpClick, onGoogleLogin }
            │       ├── PpdbModalProps        { view, onViewChange, onClose }
            │       ├── PerpustakaanModalProps { onClose }
            │       └── BackgroundSlideshowProps { images, currentSlide }
            │
            ├── utils.ts
            │   └── 🔧 Fungsi helper murni (pure functions)
            │       ├── isValidRole(value)
            │       │   └── returns value is ValidRole
            │       └── validateLoginInput(role, id, password)
            │           ├── cek id kosong
            │           ├── cek password kosong
            │           ├── teacher → NIP harus angka
            │           ├── student → NISN 10 digit
            │           ├── guest   → format email valid
            │           ├── parent  → nama min 3 karakter
            │           └── returns string | null
            │
            ├── hooks.ts
            │   └── 🪝 Custom React Hooks
            │       └── useModalBehavior(isOpen, onClose)
            │           ├── lock scroll → body.overflow = 'hidden'
            │           ├── listen Escape → onClose()
            │           └── cleanup saat unmount / isOpen berubah
            │
            ├── BackgroundSlideshow.tsx
            │   └── 🖼️  Komponen slideshow latar belakang
            │       ├── Props   : { images, currentSlide }
            │       ├── Render  : images.map() + opacity transition
            │       ├── Overlay : gradient hitam atas-bawah
            │       ├── memo    : ✅ (tidak re-render jika props sama)
            │       └── displayName = 'BackgroundSlideshow'
            │
            ├── LoginPanel.tsx
            │   └── 🔐 Panel login slide dari kanan
            │       ├── Props      : LoginPanelProps
            │       ├── Refs       : panelRef (deteksi klik luar)
            │       ├── useEffect  : Escape → onClose
            │       ├── useEffect  : klik luar panel → onClose
            │       ├── Overlay    : backdrop blur z-40
            │       ├── Panel      : slide right z-60, max-w-[440px]
            │       ├── [Header]   : Logo + nama sekolah + tombol ✕
            │       ├── [Form]
            │       │   ├── Select role   (VALID_ROLES)
            │       │   ├── Input ID      (dinamis per role)
            │       │   ├── Input Password (show/hide toggle)
            │       │   ├── Error message  (aria-live)
            │       │   ├── Tombol Submit
            │       │   └── GoogleLoginButton (hanya role=guest)
            │       ├── [Footer]   : link "Hubungi Admin"
            │       ├── memo       : ✅
            │       └── displayName = 'LoginPanel'
            │
            ├── PpdbModal.tsx
            │   └── 📋 Modal Penerimaan Peserta Didik Baru
            │       ├── Props       : { view, onViewChange, onClose }
            │       ├── Hook        : useModalBehavior
            │       ├── z-index     : 150
            │       ├── Lazy loads
            │       │   ├── LandingPage      ← view === 'landing'
            │       │   ├── PPDBForm         ← view === 'form'
            │       │   └── CekKelulusanPage ← view === 'cek-kelulusan'
            │       └── Fallback    : spinner putih fullscreen
            │
            └── PerpustakaanModal.tsx
                └── 📚 Modal Aplikasi Perpustakaan
                    ├── Props    : { onClose }
                    ├── Hook     : useModalBehavior
                    ├── z-index  : 200
                    ├── Lazy load: PerpustakaanApp
                    │             ← src/fitur/perpustakaan/PerpustakaanApp
                    └── Fallback : spinner putih fullscreen
```

---

## Alur Data Antar File

```
constants.ts ──────────────────────────────────────────┐
types.ts ──────────────────────────────────────────────┤
utils.ts ──────────────────────────────────────────────┤──▶ index.ts ──▶ LoginPage.tsx
hooks.ts ──────────────────────────────────────────────┤
BackgroundSlideshow.tsx ───────────────────────────────┤
LoginPanel.tsx ────────────────────────────────────────┤
PpdbModal.tsx ─────────────────────────────────────────┤
PerpustakaanModal.tsx ─────────────────────────────────┘


LoginPage.tsx
    │
    ├──[state]──▶ LoginPanel.tsx
    │               └──▶ GoogleLoginButton.tsx
    │
    ├──[state]──▶ BackgroundSlideshow.tsx
    │
    ├──[state]──▶ PpdbModal.tsx
    │               ├──▶ LandingPage.tsx
    │               ├──▶ PPDBForm.tsx
    │               └──▶ CekKelulusanPage.tsx
    │
    ├──[state]──▶ PerpustakaanModal.tsx
    │               └──▶ PerpustakaanApp.tsx
    │
    ├──[lazy]───▶ TutorialModal.tsx
    ├──[lazy]───▶ ExpectationModal.tsx
    └──[lazy]───▶ AdminMasterPanel.tsx
```

---

## Dependency Antar File di `DataLogingPage/`

```
constants.ts        (tidak ada dependency internal)
    ▲
    │
types.ts ──────────▶ constants.ts (import VALID_ROLES)
    ▲
    │
utils.ts ──────────▶ types.ts     (import ValidRole)
hooks.ts            (tidak ada dependency internal)
    ▲
    │
BackgroundSlideshow.tsx ──▶ types.ts     (BackgroundSlideshowProps)
LoginPanel.tsx          ──▶ types.ts     (LoginPanelProps)
                        ──▶ constants.ts (LOGO_SMP, SCHOOL_CONFIG, ...)
                        ──▶ utils.ts     (isValidRole)
PpdbModal.tsx           ──▶ types.ts     (PpdbModalProps)
                        ──▶ constants.ts (Z_INDEX)
                        ──▶ hooks.ts     (useModalBehavior)
PerpustakaanModal.tsx   ──▶ types.ts     (PerpustakaanModalProps)
                        ──▶ constants.ts (Z_INDEX)
                        ──▶ hooks.ts     (useModalBehavior)
    │
    ▼
index.ts  ◀── re-export semua file di atas
    │
    ▼
LoginPage.tsx
```

```
// E:\guthub\projeck-portal-siswa\src\fitur\autentikasi\DataLogingPage\constants.ts

// ── Ganti path ini untuk mengubah foto pengumuman ──
export const LOGIN_ILLUSTRATION = `${import.meta.env.BASE_URL}images/Dashboard/login-illustration.jpg`;

// Contoh ganti dengan pengumuman lain:
// export const LOGIN_ILLUSTRATION = `${import.meta.env.BASE_URL}images/Dashboard/pengumuman-libur.jpg`;
// export const LOGIN_ILLUSTRATION = `${import.meta.env.BASE_URL}images/Dashboard/info-ujian.png`;
// export const LOGIN_ILLUSTRATION = `${import.meta.env.BASE_URL}images/Dashboard/banner-ppdb-2025.jpg`;
```
```
┌───────────────────────────────────────────────────────────────────┐
│  ╔══════════════════════════════════════════╗  ┌──────────────┐  │
│  ║                                          ║  │              │  │
│  ║                                          ║  │  Login       │  │
│  ║                                          ║  │              │  │
│  ║           FOTO PENGUMUMAN                ║  │  [NISN]      │  │
│  ║           (full cover)                   ║  │              │  │
│  ║                                          ║  │  [Password]  │  │
│  ║                                          ║  │              │  │
│  ║                                          ║  │  [Masuk]     │  │
│  ║                                          ║  │              │  │
│  ╚══════════════════════════════════════════╝  └──────────────┘  │
│         calc(100vw - 440px)                       440px           │
└───────────────────────────────────────────────────────────────────┘

```

# 📐 DIAGRAM ARSITEKTUR - Fitur Autentikasi

Dokumentasi lengkap sistem login untuk **Portal Siswa SMA Negeri 1 Medan**.

---

## 📄 DOKUMEN 1 — Overview Arsitektur Sistem

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║          🎓  PORTAL SISWA — MODUL AUTENTIKASI (LOGIN SYSTEM)                 ║
║                                                                              ║
║          Version    : 1.0.0                                                  ║
║          Framework  : React 18 + TypeScript + Vite + TailwindCSS             ║
║          Pattern    : Feature-Based Modular Architecture                     ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

                          ┌─────────────────────────┐
                          │      🌐  BROWSER        │
                          │      (End User)         │
                          └────────────┬────────────┘
                                       │
                                       │  HTTP Request
                                       ▼
                          ┌─────────────────────────┐
                          │   📱  React App Shell   │
                          │   (Vite + Router)       │
                          └────────────┬────────────┘
                                       │
                                       ▼
       ┌───────────────────────────────────────────────────────────────┐
       │                                                                │
       │              🎯  LOGINPAGE.TSX  (CONTROLLER)                   │
       │                                                                │
       │   ┌────────────────────────────────────────────────────────┐  │
       │   │  Responsibilities:                                      │  │
       │   │   • Orchestrator (mengatur semua komponen)              │  │
       │   │   • State Manager (form, modal, security, slide)        │  │
       │   │   • Business Logic (auth, validation, lockout)          │  │
       │   │   • Event Handler (Google OAuth, keyboard, mouse)       │  │
       │   └────────────────────────────────────────────────────────┘  │
       │                                                                │
       └────────┬────────┬─────────┬────────┬────────┬─────────────────┘
                │        │         │        │        │
        ┌───────┘        │         │        │        └────────┐
        │                │         │        │                 │
        ▼                ▼         ▼        ▼                 ▼
   ┌─────────┐    ┌──────────┐  ┌─────┐  ┌──────┐      ┌──────────┐
   │ SLIDE   │    │ ILLUS-   │  │LOGIN│  │ PPDB │      │ PERPUS-  │
   │ SHOW    │    │ TRATION  │  │PANEL│  │MODAL │      │ TAKAAN   │
   │ (BG)    │    │ (FOTO)   │  │(FORM│  │      │      │ MODAL    │
   └─────────┘    └──────────┘  └──┬──┘  └───┬──┘      └────┬─────┘
                                    │        │              │
                              ┌─────┴────┐   │              │
                              ▼          ▼   ▼              ▼
                          ┌───────┐  ┌──────────┐    ┌──────────────┐
                          │Google │  │ Landing  │    │ Perpustakaan │
                          │Login  │  │  PPDB    │    │     App      │
                          │Button │  │  Form    │    │              │
                          │       │  │  Cek     │    │              │
                          │       │  │Kelulusan │    │              │
                          └───────┘  └──────────┘    └──────────────┘
```

---

## 📄 DOKUMEN 2 — Component Hierarchy Tree

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                    HIERARKI KOMPONEN (COMPONENT TREE)                        ║
╚══════════════════════════════════════════════════════════════════════════════╝

📦 src/fitur/autentikasi/
│
├─🎯 LoginPage.tsx  ══════════════════ [PARENT / SMART COMPONENT]
│  │
│  ├─🧩 <BackgroundSlideshow />        [PRESENTATIONAL]
│  │   └─ Menampilkan gambar background bergantian
│  │
│  ├─🖼️ <LoginIllustration />          [PRESENTATIONAL]
│  │   └─ Menampilkan foto pengumuman sebelah kiri
│  │
│  ├─🔐 <LoginPanel />                 [PRESENTATIONAL]
│  │   └─🌐 <GoogleLoginButton />      [SHARED]
│  │       └─ Tombol OAuth Google (role: guest)
│  │
│  ├─📋 <PpdbModal />                  [LAZY LOADED]
│  │   ├─🏫 <LandingPage />            [LAZY]
│  │   ├─📝 <PPDBForm />               [LAZY]
│  │   └─🔍 <CekKelulusanPage />       [LAZY]
│  │
│  ├─📚 <PerpustakaanModal />          [LAZY LOADED]
│  │   └─📖 <PerpustakaanApp />        [LAZY]
│  │
│  ├─❓ <TutorialModal />              [LAZY LOADED]
│  │   └─ Bantuan lupa password
│  │
│  ├─💡 <ExpectationModal />           [LAZY LOADED]
│  │   └─ Info tentang sekolah
│  │
│  └─👨‍💼 <AdminMasterPanel />          [LAZY LOADED]
│      └─ Panel admin (opsional)
│
└─🧠 DataLogingPage/                   [MODUL PENDUKUNG]
    │
    ├─📤 index.ts                     ← Pintu masuk (barrel export)
    ├─📌 constants.ts                 ← Semua nilai tetap
    ├─📐 types.ts                     ← Definisi tipe TypeScript
    ├─🔧 utils.ts                     ← Fungsi validasi
    ├─🪝 hooks.ts                     ← Custom React hooks
    └─🧩 [Semua komponen di atas]

Legenda:
  🎯 SMART       = Punya state & logic
  🧩 PRESENTATIONAL = Hanya menerima props & menampilkan UI
  🌐 SHARED      = Bisa digunakan komponen lain
  ⏳ LAZY LOADED = Di-load saat dibutuhkan (code splitting)
```

---

## 📄 DOKUMEN 3 — Data Flow Diagram

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                          ALUR DATA (DATA FLOW)                               ║
╚══════════════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  👤 USER                                                                     │
│   │                                                                          │
│   │ 1. Klik tombol "Masuk"                                                   │
│   ▼                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  LoginPage.tsx                                                       │   │
│  │  ─────────────────────                                               │   │
│  │  handleOpenLogin() → setIsLoginOpen(true)                            │   │
│  └──────────────────┬──────────────────────────────────────────────────┘   │
│                     │                                                        │
│                     │ 2. Props: isOpen={true}                                │
│                     ▼                                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  <LoginIllustration isOpen={true} />                                 │   │
│  │  <LoginPanel isOpen={true} ... />                                    │   │
│  └──────────────────┬──────────────────────────────────────────────────┘   │
│                     │                                                        │
│                     │ 3. User mengisi form & submit                          │
│                     ▼                                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  onSubmit → handleSubmit()                                           │   │
│  │  ─────────────────────                                               │   │
│  │  a) Cek lockoutUntil (apakah masih dikunci?)                         │   │
│  │  b) validateLoginInput() ← import dari utils.ts                      │   │
│  │  c) await login(id, password, role) ← dari AuthContext              │   │
│  │  d) Jika gagal → loginAttempts++                                     │   │
│  │  e) Jika ≥ MAX_LOGIN_ATTEMPTS → aktifkan lockout                    │   │
│  └──────────────────┬──────────────────────────────────────────────────┘   │
│                     │                                                        │
│                     ▼                                                        │
│              ┌──────────────┐                                                │
│              │  BERHASIL?   │                                                │
│              └──────┬───────┘                                                │
│                     │                                                        │
│         ┌───────────┴───────────┐                                            │
│         │                       │                                            │
│         ▼                       ▼                                            │
│    ✅ YES                   ❌ NO                                            │
│    ─────                    ─────                                            │
│    Redirect ke              Tampilkan error                                  │
│    Dashboard                Increment attempts                               │
│                             Jika attempts≥5 → LOCK                           │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 📄 DOKUMEN 4 — State Management Map

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                    PETA STATE (STATE MANAGEMENT)                             ║
╚══════════════════════════════════════════════════════════════════════════════╝

                        📦 LoginPage.tsx (State Owner)
                                    │
        ┌───────────┬───────────┬───┴───┬──────────┬───────────┐
        │           │           │       │          │           │
        ▼           ▼           ▼       ▼          ▼           ▼
   ┌─────────┐ ┌─────────┐ ┌────────┐ ┌───────┐ ┌────────┐ ┌────────┐
   │  FORM   │ │  AUTH   │ │SECURITY│ │ MODAL │ │ SLIDE  │ │ ADMIN  │
   └────┬────┘ └────┬────┘ └───┬────┘ └───┬───┘ └───┬────┘ └───┬────┘
        │           │          │          │         │          │
        │           │          │          │         │          │
   ┌────┴────┐ ┌────┴────┐ ┌───┴────┐ ┌───┴────┐ ┌──┴───┐ ┌────┴────┐
   │ role    │ │isLoading│ │login   │ │isLogin │ │curr  │ │openAdmin│
   │ id      │ │  error  │ │Attempts│ │  Open  │ │Slide │ │Panel    │
   │password │ │         │ │lockout │ │showPPDB│ │      │ │adminSco │
   │showPass │ │         │ │  Until │ │ppdbView│ │      │ │pe       │
   └─────────┘ └─────────┘ └────────┘ │showLib │ └──────┘ └─────────┘
                                       │showTut │
                                       │showExp │
                                       └────────┘

═══════════════════════════════════════════════════════════════════════════════
STATE                DIALIRKAN KE          TUJUAN
═══════════════════════════════════════════════════════════════════════════════
role, id,        ──▶ <LoginPanel />      → Isi form login
password             
                     
isLoading        ──▶ <LoginPanel />      → Disable input saat proses
error            ──▶ <LoginPanel />      → Tampilkan pesan error

lockoutUntil     ──▶ <LoginPanel />      → Disable form saat terkunci
                       (disabled prop)

isLoginOpen      ──▶ <LoginPanel />      → Kontrol slide animation
                 ──▶ <LoginIllustration />

currentSlide     ──▶ <BackgroundSlide../> → Ganti gambar background

showPPDB,        ──▶ <PpdbModal />       → Buka/tutup modal PPDB
ppdbView

showLibrary      ──▶ <PerpustakaanModal/>→ Buka/tutup modal perpus
```

---

## 📄 DOKUMEN 5 — Layer Architecture

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                    ARSITEKTUR BERLAPIS (LAYERED)                             ║
╚══════════════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  🎨  LAYER 1 — PRESENTATION LAYER (UI)                                       │
│  ─────────────────────────────────────────                                   │
│  • BackgroundSlideshow.tsx                                                   │
│  • LoginIllustration.tsx                                                     │
│  • LoginPanel.tsx                                                            │
│  • PpdbModal.tsx                                                             │
│  • PerpustakaanModal.tsx                                                     │
│                                                                              │
│  Tugas: Menampilkan UI, animasi, styling, interaksi user                     │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                    ▲
                                    │  Props & Events
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  🧠  LAYER 2 — CONTAINER LAYER (LOGIC)                                       │
│  ────────────────────────────────────────                                    │
│  • LoginPage.tsx                                                             │
│                                                                              │
│  Tugas: State management, event handling, orchestration                      │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                    ▲
                                    │  Import
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  🔧  LAYER 3 — UTILITY LAYER (HELPER)                                        │
│  ────────────────────────────────────────                                    │
│  • utils.ts       → validateLoginInput(), isValidRole()                      │
│  • hooks.ts       → useModalBehavior()                                       │
│                                                                              │
│  Tugas: Fungsi murni, custom hooks, reusable logic                           │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                    ▲
                                    │  Import
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  📐  LAYER 4 — CONTRACT LAYER (TYPES)                                        │
│  ────────────────────────────────────────                                    │
│  • types.ts       → LoginPanelProps, PpdbModalProps, ValidRole, ...          │
│                                                                              │
│  Tugas: Definisi kontrak antar layer (TypeScript interfaces)                 │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                    ▲
                                    │  Import
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  📌  LAYER 5 — CONFIG LAYER (CONSTANTS)                                      │
│  ────────────────────────────────────────                                    │
│  • constants.ts   → BACKGROUND_IMAGES, ROLE_CONFIG, Z_INDEX, ...             │
│                                                                              │
│  Tugas: Konfigurasi statis, magic numbers, path assets                       │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                    ▲
                                    │  Barrel Export
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  📤  LAYER 6 — MODULE INTERFACE (BARREL)                                     │
│  ────────────────────────────────────────                                    │
│  • index.ts       → Re-export semua modul                                    │
│                                                                              │
│  Tugas: Single entry point untuk import                                      │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 📄 DOKUMEN 6 — Security Flow (Lockout Mechanism)

```
╔══════════════════════════════════════════════════════════════════════════════╗
║               🔒 FLOW KEAMANAN — LOCKOUT MECHANISM                           ║
╚══════════════════════════════════════════════════════════════════════════════╝

    ┌─────────────────┐
    │  User Submit    │
    │     Login       │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────────────┐
    │  Cek lockoutUntil       │◄──── STATE: lockoutUntil
    │  masih aktif?           │
    └────────┬────────────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼ YES         ▼ NO
   ❌ TOLAK      Lanjut...
   Show error       │
   "tunggu Xs"      ▼
                ┌─────────────────────────┐
                │ validateLoginInput()    │◄──── UTIL: utils.ts
                │ (cek format ID & pass)  │
                └────────┬────────────────┘
                         │
                  ┌──────┴──────┐
                  ▼ INVALID     ▼ VALID
              ❌ Show           │
              validation        ▼
              error         ┌───────────────────┐
                            │  login(id, pass)  │◄──── API: AuthContext
                            │  (call backend)   │
                            └────────┬──────────┘
                                     │
                              ┌──────┴──────┐
                              ▼ SUCCESS     ▼ FAILED
                          ✅ Reset          │
                          attempts=0        ▼
                          lockout=null   ┌────────────────────┐
                          → Dashboard    │ loginAttempts++    │
                                         └─────────┬──────────┘
                                                   │
                                          ┌────────┴────────┐
                                          ▼                 ▼
                                    attempts<5         attempts≥5
                                    Show "sisa X"      ─────────
                                    percobaan          🔒 LOCK!
                                                       lockoutUntil=
                                                         now + 30s
                                                       Show "dikunci"

═══════════════════════════════════════════════════════════════════════════════

  📊 STATE TRANSITION DIAGRAM
  
       [IDLE]
          │  submit
          ▼
      [TRYING] ──────success──────▶ [AUTHENTICATED]
          │
          │ failed
          ▼
    [ATTEMPT_1..4] ──failed──▶ (loop hingga 5)
          │
          │ attempt 5 failed
          ▼
      [LOCKED] ────30 detik────▶ [IDLE]
```

---

## 📄 DOKUMEN 7 — Deployment & Build Artifact

```
╔══════════════════════════════════════════════════════════════════════════════╗
║               🚀 BUILD ARTIFACT & LAZY LOAD STRATEGY                         ║
╚══════════════════════════════════════════════════════════════════════════════╝

📦 dist/assets/
│
├─🎯 index-*.js (280 KB)              ← MAIN BUNDLE
│   └─ LoginPage.tsx                     Loaded pada halaman pertama
│      DataLogingPage/*
│      React, ReactDOM
│
├─⏳ LandingPage-*.js (35 KB)         ← LAZY (klik "Pendaftaran")
├─⏳ PPDBForm-*.js (22 KB)            ← LAZY (klik "Daftar")
├─⏳ CekKelulusanPage-*.js (9 KB)     ← LAZY (klik "Cek")
├─⏳ PerpustakaanApp-*.js (66 KB)     ← LAZY (klik "Perpustakaan")
├─⏳ TutorialModal-*.js (16 KB)       ← LAZY (klik "Lupa sandi")
├─⏳ ExpectationModal-*.js (18 KB)    ← LAZY (klik "Tentang Kami")
└─⏳ PanelAdminModal-*.js (180 KB)    ← LAZY (khusus admin)

═══════════════════════════════════════════════════════════════════════════════

  💡 KEUNTUNGAN LAZY LOAD:
  
  ┌──────────────────────────────────────────────┐
  │  Halaman pertama load:  ± 280 KB (main)      │
  │  Vs tanpa lazy load:    ± 700 KB (bundled)   │
  │                                              │
  │  💚 Hemat 60% bandwidth pada load awal!      │
  └──────────────────────────────────────────────┘
```

---

## 📄 DOKUMEN 8 — Cheat Sheet Editing

```
╔══════════════════════════════════════════════════════════════════════════════╗
║          📝 CHEAT SHEET — KALAU MAU UBAH APA, EDIT DI MANA?                  ║
╚══════════════════════════════════════════════════════════════════════════════╝

┌────────────────────────────────────┬─────────────────────────────────────────┐
│  MAU UBAH APA                      │  EDIT FILE                              │
├────────────────────────────────────┼─────────────────────────────────────────┤
│                                    │                                         │
│  🖼️ Ganti foto pengumuman          │  constants.ts                           │
│     kiri panel                     │  → LOGIN_ILLUSTRATION                   │
│                                    │                                         │
│  🎞️ Ganti gambar background        │  constants.ts                           │
│     slideshow                      │  → BACKGROUND_IMAGES                    │
│                                    │                                         │
│  ⏱️ Ubah durasi slideshow          │  constants.ts                           │
│                                    │  → SLIDESHOW_INTERVAL_MS                │
│                                    │                                         │
│  🔒 Ubah waktu lockout             │  constants.ts                           │
│                                    │  → LOCKOUT_DURATION_MS                  │
│                                    │                                         │
│  🎯 Ubah maksimal percobaan        │  constants.ts                           │
│     login                          │  → MAX_LOGIN_ATTEMPTS                   │
│                                    │                                         │
│  🏫 Ganti nama sekolah             │  constants.ts                           │
│                                    │  → SCHOOL_CONFIG                        │
│                                    │                                         │
│  📱 Ubah menu navigasi             │  constants.ts                           │
│                                    │  → MAIN_NAV                             │
│                                    │                                         │
│  👤 Tambah role baru               │  constants.ts + types.ts + utils.ts     │
│     (contoh: 'admin')              │  → VALID_ROLES, ROLE_CONFIG             │
│                                    │                                         │
│  ✅ Ubah validasi input            │  utils.ts                               │
│                                    │  → validateLoginInput()                 │
│                                    │                                         │
│  📐 Ubah lebar panel login         │  LoginPanel.tsx                         │
│                                    │  → max-w-[440px] + LoginIllustration    │
│                                    │                                         │
│  🖼️ Ubah cara foto ditampilkan     │  LoginIllustration.tsx                  │
│     (cover/contain)                │  → className object-cover               │
│                                    │                                         │
│  🎨 Ubah warna tombol Masuk        │  LoginPanel.tsx                         │
│                                    │  → className tombol submit              │
│                                    │                                         │
│  ✏️ Ubah teks tombol lockout       │  LoginPanel.tsx                         │
│                                    │  → '🔒 Akun Terkunci Sementara'         │
│                                    │                                         │
│  🎭 Ubah animasi fade slideshow    │  BackgroundSlideshow.tsx                │
│                                    │  → duration-[2000ms]                    │
│                                    │                                         │
│  🎯 Ubah logic setelah login       │  LoginPage.tsx                          │
│     berhasil                       │  → handleSubmit()                       │
│                                    │                                         │
│  🌐 Ubah endpoint OAuth Google     │  LoginPage.tsx                          │
│                                    │  → useEffect OAuth redirect             │
│                                    │                                         │
└────────────────────────────────────┴─────────────────────────────────────────┘
```

---

## 💾 Cara Menyimpan Dokumentasi Ini

Simpan sebagai file dokumentasi di project Anda:

**Path:** `E:\guthub\projeck-portal-siswa\src\fitur\autentikasi\ARCHITECTURE.md`

Cara membuat:
1. Buka VS Code
2. Klik kanan folder `autentikasi` → **New File**
3. Nama file: `ARCHITECTURE.md`
4. Copy-paste **seluruh dokumen di atas** ke dalamnya
5. Save (Ctrl+S)

VS Code otomatis akan bisa preview markdown dengan `Ctrl+Shift+V`.

---

## 🎓 Manfaat Dokumentasi Ini

| Untuk Siapa | Manfaat |
|-------------|---------|
| 👨‍💻 **Anda sendiri** | Ingat struktur saat kembali coding 3 bulan lagi |
| 👥 **Tim baru** | Onboarding cepat, paham arsitektur dalam 15 menit |
| 🏫 **Sekolah/Client** | Bukti profesionalisme & dokumentasi lengkap |
| 🎓 **Portofolio** | Nilai plus saat menunjukkan project ini |
| 🔧 **Maintenance** | Cepat cari file yang mau diedit |


# 📝 Cara Mengatur Ukuran Text di Background Slideshow

Text yang muncul di atas background (seperti **"Kegiatan Ekstrakurikuler"** dan deskripsinya) diatur di file **`LoginPage.tsx`**.

---

## 📍 Lokasi File

```
E:\guthub\projeck-portal-siswa\src\fitur\autentikasi\LoginPage.tsx
```

---

## 🔍 Cari Bagian Ini (Sekitar Baris 300-320)

```tsx
{/* ═══ HERO CONTENT ═══ */}
<div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-12 sm:px-10 sm:pb-16">
  <div className="mx-auto max-w-[1400px]">
    
    {/* 🍞 BREADCRUMB → "Beranda / Kegiatan Ekstrakurikuler" */}
    <div className="mb-6 flex items-center gap-2 text-xs text-white/70">
      <span>Beranda</span>
      <span>/</span>
      <span className="text-white">{currentImage.caption}</span>
    </div>

    {/* 📰 JUDUL BESAR → "Kegiatan Ekstrakurikuler" */}
    <h1 className="mb-5 max-w-3xl text-4xl leading-tight font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl">
      {currentImage.caption}
    </h1>

    {/* 📝 DESKRIPSI → "Beragam kegiatan pengembangan diri..." */}
    <p className="mb-10 max-w-2xl text-sm leading-8 text-white/90 sm:text-base">
      {currentImage.description}
    </p>

    {/* 🔘 SLIDE INDICATORS (garis-garis putih) */}
    <div className="flex items-center gap-2">
      ...
    </div>
  </div>
</div>
```

---

## 🎯 3 Text Yang Bisa Anda Atur

### 1️⃣ **BREADCRUMB** ("Beranda / Kegiatan Ekstrakurikuler")

```tsx
<div className="mb-6 flex items-center gap-2 text-xs text-white/70">
                                            ▲
                                            └─── UKURAN TEXT
```

| Class | Ukuran |
|-------|--------|
| `text-xs` | 12px (SEKARANG) |
| `text-sm` | 14px |
| `text-base` | 16px |
| `text-lg` | 18px |

**Contoh ganti jadi lebih besar:**
```tsx
<div className="mb-6 flex items-center gap-2 text-sm text-white/70">
```

---

### 2️⃣ **JUDUL BESAR** ("Kegiatan Ekstrakurikuler")

```tsx
<h1 className="mb-5 max-w-3xl text-4xl leading-tight font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl">
                              ▲                                                                    ▲              ▲
                              │                                                                    │              │
                              └─ Mobile (default)                            Tablet (sm) ─────────┘              │
                                                                                                  Desktop (md) ──┘
```

**Ukuran Sekarang:**
| Layar | Class | Ukuran |
|-------|-------|--------|
| Mobile | `text-4xl` | 36px |
| Tablet (≥640px) | `sm:text-5xl` | 48px |
| Desktop (≥768px) | `md:text-6xl` | 60px |

**Pilihan Ukuran:**
| Class | Ukuran (pixel) |
|-------|---------------|
| `text-3xl` | 30px |
| `text-4xl` | 36px |
| `text-5xl` | 48px |
| `text-6xl` | 60px |
| `text-7xl` | 72px |
| `text-8xl` | 96px |
| `text-9xl` | 128px |

**Contoh ingin JUDUL LEBIH BESAR:**
```tsx
<h1 className="mb-5 max-w-3xl text-5xl leading-tight font-bold tracking-tight text-white drop-shadow-lg sm:text-6xl md:text-7xl">
  {currentImage.caption}
</h1>
```

**Contoh ingin JUDUL LEBIH KECIL:**
```tsx
<h1 className="mb-5 max-w-3xl text-2xl leading-tight font-bold tracking-tight text-white drop-shadow-lg sm:text-3xl md:text-4xl">
  {currentImage.caption}
</h1>
```

---

### 3️⃣ **DESKRIPSI** ("Beragam kegiatan pengembangan diri...")

```tsx
<p className="mb-10 max-w-2xl text-sm leading-8 text-white/90 sm:text-base">
                              ▲                                    ▲
                              │                                    │
                              └─ Mobile                            └─ Tablet+
```

**Ukuran Sekarang:**
| Layar | Class | Ukuran |
|-------|-------|--------|
| Mobile | `text-sm` | 14px |
| Tablet+ | `sm:text-base` | 16px |

**Contoh ingin DESKRIPSI LEBIH BESAR:**
```tsx
<p className="mb-10 max-w-2xl text-base leading-8 text-white/90 sm:text-lg md:text-xl">
  {currentImage.description}
</p>
```

---

## 🎨 Tabel Referensi Ukuran Tailwind

| Class | Ukuran (px) | Cocok untuk |
|-------|-------------|-------------|
| `text-xs` | 12px | Label kecil, breadcrumb |
| `text-sm` | 14px | Text deskripsi |
| `text-base` | 16px | Text body |
| `text-lg` | 18px | Text penekanan |
| `text-xl` | 20px | Subheading |
| `text-2xl` | 24px | Heading 6 |
| `text-3xl` | 30px | Heading 5 |
| `text-4xl` | 36px | Heading 4 |
| `text-5xl` | 48px | Heading 3 |
| `text-6xl` | 60px | Heading 2 |
| `text-7xl` | 72px | Heading 1 besar |
| `text-8xl` | 96px | Judul hero |
| `text-9xl` | 128px | Super jumbo |

---

## 📱 Prefix Responsive

| Prefix | Aktif Pada Layar |
|--------|------------------|
| (tanpa prefix) | Semua ukuran (mobile default) |
| `sm:` | ≥ 640px (tablet kecil) |
| `md:` | ≥ 768px (tablet besar) |
| `lg:` | ≥ 1024px (laptop) |
| `xl:` | ≥ 1280px (desktop) |
| `2xl:` | ≥ 1536px (layar besar) |

**Cara membaca:**
```tsx
text-4xl sm:text-5xl md:text-6xl lg:text-7xl
   ▲          ▲            ▲            ▲
   │          │            │            │
Mobile    Tablet      Tablet       Desktop
 36px      kecil       besar        1024px+
           48px         60px          72px
```

---

## 💡 Contoh Skenario

### Skenario A: Text di HP terlalu kecil, PC pas
```tsx
<h1 className="text-5xl sm:text-5xl md:text-6xl">
     ▲
     └─ Naikkan ini (dari text-4xl → text-5xl)
```

### Skenario B: Text di PC terlalu besar
```tsx
<h1 className="text-4xl sm:text-5xl md:text-5xl">
                                    ▲
                                    └─ Turunkan (dari text-6xl → text-5xl)
```

### Skenario C: Ingin SEMUA text seragam (tidak responsive)
```tsx
<h1 className="text-5xl">
  {/* Hilangkan sm: dan md: */}
```

---

## 🎯 Bonus — Atur Ketebalan Text

Selain ukuran, Anda juga bisa atur ketebalan:

```tsx
font-thin       → 100 (sangat tipis)
font-light      → 300 (tipis)
font-normal     → 400 (normal)
font-medium     → 500 (medium)
font-semibold   → 600 (agak tebal)
font-bold       → 700 (tebal) ← SEKARANG
font-extrabold  → 800 (sangat tebal)
font-black      → 900 (paling tebal)
```

**Contoh:**
```tsx
<h1 className="text-6xl font-extrabold ...">
  {currentImage.caption}
</h1>
```

---

## 🎨 Bonus — Atur Warna Text

```tsx
text-white           → Putih penuh
text-white/90        → Putih 90% (agak transparan)
text-white/70        → Putih 70% (lebih transparan)
text-yellow-300      → Kuning
text-blue-200        → Biru muda
text-red-500         → Merah
```

**Contoh warna kuning seperti pengumuman:**
```tsx
<h1 className="text-6xl font-bold text-yellow-300 ...">
```

---

## 🎬 Setelah Edit

1. **Save file** (Ctrl+S)
2. Kalau `npm run dev` sedang jalan → otomatis refresh
3. Kalau tidak → jalankan lagi:
   ```bash
   npm run dev
   ```
4. Lihat perubahan di browser 🎉

---