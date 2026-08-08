import 'dart:convert';
import 'package:http/http.dart' as http;
import '../model/patient_profile_model.dart';

class ProfileService {
  final String baseUrl = 'https://perky-drastic-gleeful.ngrok-free.dev/api';

  // Fetch Patient Profile
  Future<PatientProfileModel> getProfile(String? token) async {
    if (token == null || token.isEmpty) {
      return mockPatientProfile;
    }

    try {
      final response = await http.get(
        Uri.parse('$baseUrl/patients/profile'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200 && response.body.isNotEmpty) {
        final dynamic data = jsonDecode(response.body);
        if (data is Map<String, dynamic>) {
          final profileJson = data.containsKey('data') && data['data'] is Map<String, dynamic>
              ? data['data']
              : data;
          return PatientProfileModel.fromJson(profileJson);
        }
      }
      // Return mock data fallback if status code is not 200
      return mockPatientProfile;
    } catch (_) {
      // Fallback mock data when API connection is offline
      return mockPatientProfile;
    }
  }

  // Update Profile
  Future<bool> updateProfile(PatientProfileModel updatedProfile, {String? token}) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/patients/profile'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          if (token != null && token.isNotEmpty)
            'Authorization': 'Bearer $token',
        },
        body: jsonEncode(updatedProfile.toJson()),
      );
      return response.statusCode == 200;
    } catch (_) {
      return true; // Mock success for dev
    }
  }
}

