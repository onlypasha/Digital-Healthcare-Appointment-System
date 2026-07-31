import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import '../../home/healthcare_home_page.dart'; 

class AuthController extends ChangeNotifier {
  final AuthService _authService = AuthService();

  // Controller Input Sign In
  final signInEmailController = TextEditingController();
  final signInPasswordController = TextEditingController();

  // Controller Input Sign Up
  final signUpNameController = TextEditingController();
  final signUpEmailController = TextEditingController();
  final signUpDobController = TextEditingController();
  final signUpPhoneController = TextEditingController();
  final signUpPasswordController = TextEditingController();

  // States
  DateTime? signUpDob;
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
      signUpDobController.text = "${picked.day.toString().padLeft(2, '0')}/${picked.month.toString().padLeft(2, '0')}/${picked.year}";
      notifyListeners();
    }
  }

  void resetSignUpStep() {
    signUpStep = 1;
    isCheckedTerms = false;
    signUpDob = null;
    signUpDobController.clear();
    notifyListeners();
  }

  bool validateStep(BuildContext context, int step) {
    if (step == 1) {
      final name = signUpNameController.text.trim();
      final email = signUpEmailController.text.trim();
      if (name.isEmpty || email.isEmpty) {
        _showSnackBar(context, 'Nama dan Email wajib diisi.');
        return false;
      }
      if (!email.contains('@')) {
        _showSnackBar(context, 'Format email tidak valid.');
        return false;
      }
    } else if (step == 2) {
      final dob = signUpDobController.text.trim();
      final phone = signUpPhoneController.text.trim();
      final password = signUpPasswordController.text;
      if (dob.isEmpty || phone.isEmpty || password.isEmpty) {
        _showSnackBar(context, 'Tanggal Lahir, Nomor HP, dan Password wajib diisi.');
        return false;
      }
      if (password.length < 6) {
        _showSnackBar(context, 'Password minimal 6 karakter.');
        return false;
      }
    } else if (step == 3) {
      if (!isCheckedTerms) {
        _showSnackBar(context, 'Kamu harus menyetujui Ketentuan & Privasi.');
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
      _showSnackBar(context, 'Email dan Password wajib diisi.');
      return;
    }

    isLoading = true;
    notifyListeners();

    try {
      await _authService.login(email, password);
      
      if (context.mounted) {
        _showSnackBar(context, 'Sign In Berhasil!');

        // Bersihkan inputan
        signInEmailController.clear();
        signInPasswordController.clear();

        // NAVIGASI LANGSUNG KE DASHBOARD HEALTHCARE
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
    final name = signUpNameController.text.trim();
    final email = signUpEmailController.text.trim();
    final phone = signUpPhoneController.text.trim();
    final password = signUpPasswordController.text;

    if (name.isEmpty || email.isEmpty || phone.isEmpty || password.isEmpty) {
      _showSnackBar(context, 'Semua kolom input wajib diisi.');
      return;
    }

    if (!isCheckedTerms) {
      _showSnackBar(context, 'Kamu harus menyetujui Terms & Privacy Policy.');
      return;
    }

    isLoading = true;
    notifyListeners();

    try {
      await _authService.register(
        fullName: name,
        email: email,
        phone: phone,
        password: password,
      );

      if (context.mounted) {
        _showSnackBar(context, 'Akun berhasil dibuat! Silakan masuk.');

        // Bersihkan inputan setelah register
        signUpNameController.clear();
        signUpEmailController.clear();
        signUpPhoneController.clear();
        signUpPasswordController.clear();
        isCheckedTerms = false;
        signUpStep = 1;

        Navigator.pop(context); // Kembali ke halaman Sign In
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

  void _showSnackBar(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  void dispose() {
    signInEmailController.dispose();
    signInPasswordController.dispose();
    signUpNameController.dispose();
    signUpEmailController.dispose();
    signUpDobController.dispose();
    signUpPhoneController.dispose();
    signUpPasswordController.dispose();
    super.dispose();
  }
}