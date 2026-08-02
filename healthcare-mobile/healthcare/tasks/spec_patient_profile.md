# Spec: Patient Profile Page (Halaman Profil Pasien)

## Objective
Membangun halaman **Profil Pasien (Patient Profile Page)** untuk aplikasi mobile **CareConnect** yang memungkinkan pasien melihat detail biodata diri (Nama, Email, No. HP, Tanggal Lahir, Alamat, Golongan Darah, Jenis Kelamin), statistik kesehatan ringkas, opsi pengeditan profil, serta tombol Keluar (Logout).

## Assumptions (Asumsi)
1. Halaman Profil Pasien diakses melalui item menu "Profile" pada `BottomNavigationBar` (Indeks ke-3).
2. Tampilan menggunakan desain konsisten dengan Material Design 3 dan skema warna CareConnect (`#2A5EE5` / `#0052CC`).
3. State dipelihara menggunakan `Provider` (`ChangeNotifier`).

## Tech Stack
- **Framework**: Flutter (Dart SDK `^3.12.2`)
- **State Management**: `provider` (`^6.1.2`)
- **Design System**: Material 3

## Commands
- Build / Analyze: `flutter analyze`
- Test: `flutter test`
- Dev Run: `flutter run`

## Project Structure
```
lib/
├── profile/
│   ├── model/
│   │   └── patient_profile_model.dart  # Data model profil pasien
│   ├── controller/
│   │   └── profile_controller.dart     # State manager profil (ChangeNotifier)
│   ├── service/
│   │   └── profile_service.dart        # Service API profil
│   └── page/
│       └── patient_profile_page.dart   # Tampilan UI Halaman Profil
```

## Code Style & Pattern
```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class PatientProfilePage extends StatelessWidget {
  const PatientProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profil Pasien')),
      body: Consumer<ProfileController>(
        builder: (context, controller, child) {
          if (controller.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          return SingleChildScrollView(
            child: Column(
              children: [
                // Header Profil & Avatar
                // Detail Informasi Pasien
                // Action Buttons (Edit Profile & Logout)
              ],
            ),
          );
        },
      ),
    );
  }
}
```

## Testing Strategy
- Unit & Widget Test pada `test/patient_profile_test.dart` untuk memverifikasi komponen elemen profil (Nama Pasien, Email, No HP, Golongan Darah, Tanggal Lahir) ter-render dengan benar.

## Boundaries
- **Always**: Gunakan `context.mounted` sebelum navigasi pasca `async`, gunakan `Color.withValues()` untuk transparansi warna.
- **Ask first**: Mengubah struktur endpoint backend Laravel yang sudah ada.
- **Never**: Menyimpan data sensitif secara plain-text tanpa penanganan state yang aman.

## Success Criteria
- [ ] Pengguna dapat melihat avatar profil pasien, Nama Lengkap, dan Email di header utama profil.
- [ ] Kartu informasi detail menampilkan Tanggal Lahir, Nomor HP, Alamat, Golongan Darah, dan Jenis Kelamin.
- [ ] Menu `BottomNavigationBar` pada `HealthcareHomePage`, `SearchDoctorPage`, dan `PatientProfilePage` terintegrasi secara mulus.
- [ ] Terdapat dialog konfirmasi saat menekan tombol Keluar (Logout) yang mengembalikan pengguna ke `SignInPage`.
- [ ] Perintah `flutter analyze` dan `flutter test` lulus tanpa error.
