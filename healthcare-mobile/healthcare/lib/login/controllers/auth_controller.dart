import 'package:flutter/material.dart';
import 'package:healthcare/login/pages/pages.dart';
import '../services/auth_service.dart';
import '../../home/page/healthcare_home_page.dart';

class AuthController extends ChangeNotifier {
  final AuthService _authService = AuthService();

  // Controller Input Sign In
  final signInEmailController = TextEditingController();
  final signInPasswordController = TextEditingController();

  // Controller Input Sign Up
  final signUpNameController = TextEditingController();
  final signUpEmailController = TextEditingController();
  final signUpPhoneController = TextEditingController();
  final signUpPasswordController = TextEditingController();
  final signUpAddressController = TextEditingController();
  final signUpDobController = TextEditingController();

  // Controller Input Forgot Password
  final forgotPasswordEmailController = TextEditingController();
  // States
  String? _token;
  String? _userName;
  String? _userEmail;

  String? get token => _token;
  String? get jwt => _token;
  String? get userName => _userName;
  String? get userEmail => _userEmail;
  bool get isAuthenticated => _token != null && _token!.isNotEmpty;

  void setToken(String? newToken, {String? userName, String? userEmail}) {
    _token = newToken;
    if (userName != null) _userName = userName;
    if (userEmail != null) _userEmail = userEmail;
    notifyListeners();
  }

  void clearToken() {
    _token = null;
    _userName = null;
    _userEmail = null;
    notifyListeners();
  }

  DateTime? signUpDob;
  String? selectedBloodType;
  String? selectedGender;
  bool isObscure = true;
  bool isCheckedTerms = false;
  bool isLoading = false;
  int signUpStep = 1;

  void toggleObscure() {
    isObscure = !isObscure;
    notifyListeners();
  }

  void toggleTerms(bool? value) {
    isCheckedTerms = value ?? false;
    notifyListeners();
  }

  void setBloodType(String? val) {
    selectedBloodType = val;
    notifyListeners();
  }

  void setGender(String? val) {
    selectedGender = val;
    notifyListeners();
  }

  Future<void> selectDob(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: signUpDob ?? DateTime(2000, 1, 1),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
      helpText: 'Pilih Tanggal Lahir',
      cancelText: 'Batal',
      confirmText: 'Pilih',
    );
    if (picked != null) {
      signUpDob = picked;
      signUpDobController.text =
          "${picked.year}-${picked.month.toString().padLeft(2, '0')}-${picked.day.toString().padLeft(2, '0')}";
      notifyListeners();
    }
  }

  void resetSignUpStep() {
    signUpStep = 1;
    isCheckedTerms = false;
    signUpDob = null;
    selectedBloodType = null;
    selectedGender = null;

    signUpNameController.clear();
    signUpEmailController.clear();
    signUpPhoneController.clear();
    signUpPasswordController.clear();
    signUpAddressController.clear();
    signUpDobController.clear();

    notifyListeners();
  }

  // Validasi Setiap Langkah Sign Up
  bool validateStep(BuildContext context, int step) {
    if (step == 1) {
      final name = signUpNameController.text.trim();
      final email = signUpEmailController.text.trim();
      final password = signUpPasswordController.text;

      if (name.isEmpty || email.isEmpty || password.isEmpty) {
        _showSnackBar(context, 'Semua field di Langkah 1 wajib diisi.');
        return false;
      }
      if (!email.contains('@')) {
        _showSnackBar(context, 'Format email tidak valid.');
        return false;
      }
      if (password.length < 6) {
        _showSnackBar(context, 'Kata sandi minimal 6 karakter.');
        return false;
      }
    } else if (step == 2) {
      final address = signUpAddressController.text.trim();
      final dob = signUpDobController.text.trim();
      final phone = signUpPhoneController.text.trim();

      if (address.isEmpty || dob.isEmpty || phone.isEmpty) {
        _showSnackBar(context, 'Semua field di Langkah 2 wajib diisi');
        return false;
      }
    } else if (step == 3) {
      final genderSelected = selectedGender?.trim();
      if (!isCheckedTerms || genderSelected == null) {
        _showSnackBar(context, 'Kamu harus mengisi Jenis kelamin & menyetujui Ketentuan & Kebijakan Privasi.');
        return false;
      }
    }
    return true;
  }

  void nextSignUpStep(BuildContext context) {
    if (validateStep(context, signUpStep)) {
      if (signUpStep < 3) {
        signUpStep++;
        notifyListeners();
      }
    }
  }

  void previousSignUpStep() {
    if (signUpStep > 1) {
      signUpStep--;
      notifyListeners();
    }
  }

  // Logika Sign In
  Future<void> signIn(BuildContext context) async {
    final email = signInEmailController.text.trim();
    final password = signInPasswordController.text;

    if (email.isEmpty || password.isEmpty) {
      _showSnackBar(context, 'Email dan Kata Sandi wajib diisi.');
      return;
    }

    isLoading = true;
    notifyListeners();

    try {
      final data = await _authService.login(email, password);

      // Simpan JWT token dan info pengguna ke state global AuthController
      String? extractedToken;
      String? extractedName;
      String? extractedEmail = email;

      extractedToken = data['token']?.toString();
      extractedName = data['user']?['name']?.toString();
      extractedEmail = data['user']?['email']?.toString();

      setToken(extractedToken, userName: extractedName, userEmail: extractedEmail);

      if (context.mounted) {
        _showSnackBar(context, 'Sign In Berhasil!');
        signInEmailController.clear();
        signInPasswordController.clear();

        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => const HealthcareHomePage(),
          ),
        );
      }
    } catch (e) {
      if (context.mounted) {
        _showSnackBar(context, e.toString().replaceAll('Exception: ', ''));
      }
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  // Logika Sign Up
  Future<void> signUp(BuildContext context) async {
    if (!validateStep(context, 3)) return;

    isLoading = true;
    notifyListeners();

    try {
      await _authService.register(
        fullName: signUpNameController.text.trim(),
        email: signUpEmailController.text.trim(),
        phone: signUpPhoneController.text.trim(),
        password: signUpPasswordController.text,
        address: signUpAddressController.text.trim(),
        bloodType: selectedBloodType?.trim(),
        gender: selectedGender?.trim(),
        birthDate: signUpDobController.text.trim()
      );

      if (context.mounted) {
        _showSnackBar(context, 'Akun berhasil dibuat! Silakan masuk.');
        SignInPage();
        Navigator.pop(context);
      }
    } catch (e) {
      if (context.mounted) {
        _showSnackBar(context, e.toString().replaceAll('Exception: ', ''));
      }
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  // Logika Forgot Password
  Future<bool> sendResetPasswordEmail(BuildContext context, String email) async {
    final cleanEmail = email.trim();

    if (cleanEmail.isEmpty) {
      _showSnackBar(context, 'Silakan masukkan alamat email Anda.');
      return false;
    }

    if (!cleanEmail.contains('@')) {
      _showSnackBar(context, 'Format email tidak valid.');
      return false;
    }

    isLoading = true;
    notifyListeners();

    try {
      // Memanggil method di AuthService
      await _authService.sendPasswordResetEmail(cleanEmail);

      isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      isLoading = false;
      notifyListeners();

      if (context.mounted) {
        _showSnackBar(context, e.toString().replaceAll('Exception: ', ''));
      }
      return false;
    }
  }

  void _showSnackBar(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  void dispose() {
    signInEmailController.dispose();
    signInPasswordController.dispose();
    signUpNameController.dispose();
    signUpEmailController.dispose();
    signUpPhoneController.dispose();
    signUpPasswordController.dispose();
    signUpAddressController.dispose();
    signUpDobController.dispose();
    forgotPasswordEmailController.dispose();
    super.dispose();
  }
}