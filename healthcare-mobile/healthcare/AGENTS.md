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

## Project Structure & Modules
```
lib/
├── main.dart                      # App entry point & MultiProvider setup
├── login/
│   ├── controllers/
│   │   └── auth_controller.dart   # Auth state & Form Controllers (ChangeNotifier)
│   ├── services/
│   │   └── auth_service.dart      # HTTP Service for login/register API calls
│   ├── pages/
│   │   ├── sign_in_page.dart      # Sign In UI screen
│   │   ├── sign_up_page.dart      # Sign Up UI screen
│   │   └── pages.dart             # Barrel export
│   └── shared/
│       ├── theme_shared.dart      # Common styles, colors & typography
│       └── shared.dart            # Shared utilities export
├── home/
│   ├── data_model.dart            # Models for User, Doctor, Appointment, VitalSign & mock data
│   └── healthcare_home_page.dart  # Home Dashboard UI
└── doctors/
    ├── doctor_model.dart          # Doctor model & mockDoctorList
    └── search_doctor_page.dart    # Search & Doctor listing UI
```

## Code Conventions & Guidelines
- **State Management**: Use `Provider` with `ChangeNotifier` (e.g. `AuthController`).
- **Form Handling**: Text field controllers should be managed in the controller and disposed in `dispose()`.
- **API Calls**: Keep HTTP requests inside dedicated service classes in `lib/*/services/` and catch errors gracefully using `try/catch`.
- **Color Opacity**: Prefer `Color.withValues(alpha: ...)` instead of deprecated `Color.withOpacity(...)`.
- **Context Checks**: Use `if (context.mounted)` before using `BuildContext` across async gaps.

## Boundaries & Constraints
- Never commit `.env` or sensitive API keys.
- Always run `flutter analyze` before declaring code changes complete.
- Verify API URL configuration when deploying to device vs emulator (`10.0.2.2` vs IP address / ngrok).
