import 'package:flutter/material.dart';
import 'package:healthcare/login/controllers/auth_controller.dart';
import 'package:provider/provider.dart';
import '../model/patient_profile_model.dart';
import '../service/profile_service.dart';
import '/login/pages/sign_in_page.dart';

class ProfileController extends ChangeNotifier {
  final ProfileService _profileService = ProfileService();

  PatientProfileModel? _profile = mockPatientProfile;
  bool _isLoading = false;

  PatientProfileModel? get profile => _profile;
  bool get isLoading => _isLoading;

  ProfileController();

  Future<void> fetchProfile([String? token]) async {
    _isLoading = true;
    notifyListeners();

    try {
      if (token != null && token.isNotEmpty) {
        _profile = await _profileService.getProfile(token);
      } else {
        _profile = mockPatientProfile;
      }
    } catch (_) {
      _profile = mockPatientProfile;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout(BuildContext context) async {
    final bool? confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Konfirmasi Keluar'),
        content: const Text('Apakah Anda yakin ingin keluar dari akun Anda?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Batal', style: TextStyle(color: Colors.grey)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFD92D20),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Keluar', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );

    if (confirm == true && context.mounted) {
      Provider.of<AuthController>(context, listen: false).clearToken();
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (context) => const SignInPage()),
        (route) => false,
      );
    }
  }
}

