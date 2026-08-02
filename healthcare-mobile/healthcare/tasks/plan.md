# Implementation Plan - Patient Profile Page

## Phase 1: Model & Service Setup
- Buat `PatientProfileModel` di `lib/profile/model/patient_profile_model.dart` dengan field: name, email, phone, birthDate, address, bloodType, gender, avatarUrl.
- Buat `ProfileService` di `lib/profile/service/profile_service.dart` untuk fetch data profil pasien.

## Phase 2: Controller & Provider Registration
- Buat `ProfileController` di `lib/profile/controller/profile_controller.dart` (`ChangeNotifier`).
- Daftarkan `ProfileController` di `main.dart` (`MultiProvider`).

## Phase 3: Profile UI Page & Components
- Buat `PatientProfilePage` di `lib/profile/page/patient_profile_page.dart`:
  - Profile Header (Avatar, Nama, Email, Badge Pasien)
  - Medical & Personal Info Cards (Tanggal Lahir, No. HP, Alamat, Golongan Darah, Jenis Kelamin)
  - Quick Action Buttons (Edit Profil, Pengaturan Akun, Logout)

## Phase 4: Navigation & Integration
- Hubungkan `BottomNavigationBar` di `HealthcareHomePage`, `SearchDoctorPage`, dan `PatientProfilePage` (Indeks ke-3 `Profile`).
- Sambungkan tombol Logout ke `SignInPage` dengan dialog konfirmasi.

## Phase 5: Verification & Testing
- Buat widget test `test/patient_profile_test.dart`.
- Jalankan `flutter analyze` dan `flutter test`.
