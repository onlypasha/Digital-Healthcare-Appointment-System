# Task List: Patient Profile Page

- [x] Task 1: Create PatientProfileModel & ProfileService
  - Acceptance: Data model pasien terdefinisi lengkap dengan mock data & converter
  - Verify: `flutter analyze`
  - Files: `lib/profile/model/patient_profile_model.dart`, `lib/profile/service/profile_service.dart`

- [x] Task 2: Create ProfileController & Register Provider
  - Acceptance: ProfileController mengelola state data profil & metode logout
  - Verify: `flutter analyze`
  - Files: `lib/profile/controller/profile_controller.dart`, `lib/main.dart`

- [x] Task 3: Build PatientProfilePage UI
  - Acceptance: UI Profil Pasien lengkap dengan header, kartu info medis/pribadi, tombol Edit & Logout
  - Verify: `flutter analyze`
  - Files: `lib/profile/page/patient_profile_page.dart`

- [x] Task 4: Integrate Navigation across App
  - Acceptance: BottomNavigationBar pada keduabelah halaman (Home, Search, Profile) dapat saling berpindah
  - Verify: `flutter analyze`
  - Files: `lib/home/page/healthcare_home_page.dart`, `lib/doctors/search_doctor_page.dart`, `lib/profile/page/patient_profile_page.dart`

- [x] Task 5: Automated Testing & Final Verification
  - Acceptance: Unit & Widget test lulus 100%
  - Verify: `flutter test`
  - Files: `test/patient_profile_test.dart`
