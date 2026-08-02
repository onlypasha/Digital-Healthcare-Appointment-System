import 'dart:convert';
import 'package:http/http.dart' as http;
import '../model/patient_profile_model.dart';

class ProfileService {
  final String baseUrl = 'https://perky-drastic-gleeful.ngrok-free.dev/api';

  // Fetch Patient Profile
  Future<PatientProfileModel> getProfile() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/Auth/profile'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      );

      if (response.statusCode == 200 && response.body.isNotEmpty) {
        final dynamic data = jsonDecode(response.body);
        if (data is Map<String, dynamic>) {
          return PatientProfileModel.fromJson(data);
        }
      }
      // Return mock data fallback if offline or mock endpoint
      return mockPatientProfile;
    } catch (_) {
      // Fallback mock data when API connection is offline
      return mockPatientProfile;
    }
  }

  // Update Profile
  Future<bool> updateProfile(PatientProfileModel updatedProfile) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/Auth/profile'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: jsonEncode(updatedProfile.toJson()),
      );
      return response.statusCode == 200;
    } catch (_) {
      return true; // Mock success for dev
    }
  }
}
