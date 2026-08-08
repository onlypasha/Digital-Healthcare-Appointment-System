# Project: CareConnect Mobile (healthcare-mobile)

## Tech Stack
- **Framework**: Flutter (Dart SDK `^3.12.2`)
- **State Management**: `provider` (^6.1.2)
- **HTTP Client**: `http` (^1.2.1)
- **Design System**: Material Design 3 (`useMaterial3: true`)
- **Backend API**: Laravel API (`healthcare-api` on `http://10.0.2.2:8000/api` for Android Emulator)

## Key Commands
- **Install Dependencies**: `flutter pub get`
- **Analyze / Lint**: `flutter analyze`
- **Run Tests**: `flutter test`
- **Run App**: `flutter run`
- **Check Outdated Dependencies**: `flutter pub outdated`

## Project Structure & Modules (Clean Architecture)
```
lib/
├── main.dart                          # App entry point & MultiProvider setup
└── features/
    ├── auth/                          # Authentication Feature
    │   ├── data/
    │   │   └── auth_service.dart      # HTTP API calls for login/register
    │   ├── presentation/
    │   │   ├── controllers/
    │   │   │   └── auth_controller.dart # Auth state & form logic (ChangeNotifier)
    │   │   └── pages/                 # Sign In, Sign Up, Forgot Password screens
    │   └── shared/
    │       └── theme_shared.dart      # Common styles & color tokens
    ├── doctors/                       # Doctors & Appointment Feature
    │   ├── domain/
    │   │   └── doctor_model.dart      # Doctor model & mock data
    │   └── presentation/
    │       ├── controllers/           # AppointmentController
    │       ├── pages/                 # SearchDoctorPage, AppointmentsPage, DoctorSchedulePage
    │       └── widgets/               # Detail & Filter bottom sheets
    ├── home/                          # Home Dashboard Feature
    │   ├── data/
    │   │   └── home_service.dart      # Dashboard API & mock data fetcher
    │   ├── domain/
    │   │   └── data_model.dart        # User, Doctor, Appointment, VitalSign entities
    │   └── presentation/
    │       ├── controllers/           # HomeController
    │       └── pages/                 # HealthcareHomePage UI
    └── profile/                       # Patient Profile Feature
        ├── data/
        │   └── profile_service.dart   # Profile API service
        ├── domain/
        │   └── patient_profile_model.dart # PatientProfileModel & mock data
        └── presentation/
            ├── controllers/           # ProfileController
            └── pages/                 # PatientProfilePage UI
```

## Code Conventions & Guidelines
- **State Management**: Use `Provider` with `ChangeNotifier` (e.g. `AuthController`, `ProfileController`, `HomeController`).
- **Clean Architecture Layers**: Keep data logic in `data/`, domain models in `domain/`, and UI/State in `presentation/`.
- **Form Handling**: Text field controllers should be managed in the controller and disposed in `dispose()`.
- **API Calls**: Keep HTTP requests inside dedicated service classes in `lib/features/*/data/` and catch errors gracefully using `try/catch`.
- **Color Opacity**: Prefer `Color.withValues(alpha: ...)` instead of deprecated `Color.withOpacity(...)`.
- **Context Checks**: Use `if (context.mounted)` before using `BuildContext` across async gaps.

## Boundaries & Constraints
- Never commit `.env` or sensitive API keys.
- Always run `flutter analyze` before declaring code changes complete.
- Verify API URL configuration when deploying to device vs emulator (`10.0.2.2` vs IP address / ngrok).
