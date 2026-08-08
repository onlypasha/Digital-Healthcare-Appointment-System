import 'dart:convert';
import 'package:http/http.dart' as http;
import '../domain/data_model.dart';

class HomeService {
  final String baseUrl = 'https://perky-drastic-gleeful.ngrok-free.dev/api';

  Future<Appointment> getUpcomingAppointment({String? token}) async {
    try {
      if (token != null && token.isNotEmpty) {
        final response = await http.get(
          Uri.parse('$baseUrl/Appointment'),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer $token',
          },
        );

        if (response.statusCode == 200 && response.body.isNotEmpty) {
          final dynamic data = jsonDecode(response.body);
          if (data is Map<String, dynamic>) {
            // Parsing data appointment dari API jika backend siap
          }
        }
      }
      return mockUpcomingAppointment;
    } catch (_) {
      return mockUpcomingAppointment;
    }
  }

  Future<List<Map<String, String>>> getSpecialties() async {
    return const [
      {'name': 'General', 'icon': 'stetoskop.png'},
      {'name': 'Dentist', 'icon': 'gigi.png'},
      {'name': 'Cardiology', 'icon': 'hati.png'},
      {'name': 'Pediatrics', 'icon': 'suntikan.png'},
    ];
  }

  Future<List<VitalSign>> getVitalSigns({String? token}) async {
    try {
      if (token != null && token.isNotEmpty) {
        final response = await http.get(
          Uri.parse('$baseUrl/vitals'),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer $token',
          },
        );

        if (response.statusCode == 200 && response.body.isNotEmpty) {
          // Parsing data tanda vital jika backend siap
        }
      }
      return mockVitalSigns;
    } catch (_) {
      return mockVitalSigns;
    }
  }
}
