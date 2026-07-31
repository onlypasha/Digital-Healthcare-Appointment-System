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
  final signUpPhoneController = TextEditingController();
  final signUpPasswordController = TextEditingController();
  final signUpAddressController = TextEditingController();
  final signUpDobController = TextEditingController();

  // States
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
          "${picked.day.toString().padLeft(2, '0')}/${picked.month.toString().padLeft(2, '0')}/${picked.year}";
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

  // Validasi Setiap Langkah (3 Steps Bar)
  bool validateStep(BuildContext context, int step) {
    if (step == 1) {
      // Step 1: Nama, Email, No Telepon, Password
      final name = signUpNameController.text.trim();
      final email = signUpEmailController.text.trim();
      final phone = signUpPhoneController.text.trim();
      final password = signUpPasswordController.text;

      if (name.isEmpty || email.isEmpty || phone.isEmpty || password.isEmpty) {
        _showSnackBar(context, 'Semua bidang di Langkah 1 wajib diisi.');
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
      // Step 2: Alamat & Tanggal Lahir
      final address = signUpAddressController.text.trim();
      final dob = signUpDobController.text.trim();

      if (address.isEmpty || dob.isEmpty) {
        _showSnackBar(context, 'Alamat dan Tanggal Lahir wajib diisi.');
        return false;
      }
    } else if (step == 3) {
      // Step 3: Persetujuan Ketentuan & Privasi
      if (!isCheckedTerms) {
        _showSnackBar(context, 'Kamu harus menyetujui Ketentuan & Kebijakan Privasi.');
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

  // Logika Sign Up Final
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
      );

      if (context.mounted) {
        _showSnackBar(context, 'Akun berhasil dibuat! Silakan masuk.');
        resetSignUpStep();
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
    signUpPhoneController.dispose();
    signUpPasswordController.dispose();
    signUpAddressController.dispose();
    signUpDobController.dispose();
    super.dispose();
  }
}