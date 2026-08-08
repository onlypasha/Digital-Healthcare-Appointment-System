import 'package:flutter/material.dart';
import '../../domain/data_model.dart';
import '../../data/home_service.dart';
import '../../../doctors/presentation/pages/search_doctor_page.dart';
import '../../../profile/presentation/pages/patient_profile_page.dart';

class HomeController extends ChangeNotifier {
  final HomeService _homeService = HomeService();

  Appointment? _upcomingAppointment;
  List<Map<String, String>> _specialties = [];
  List<VitalSign> _vitalSigns = [];
  bool _isLoading = false;
  final int _selectedNavIndex = 0;

  Appointment? get upcomingAppointment => _upcomingAppointment;
  List<Map<String, String>> get specialties => _specialties;
  List<VitalSign> get vitalSigns => _vitalSigns;
  bool get isLoading => _isLoading;
  int get selectedNavIndex => _selectedNavIndex;

  HomeController({String? token}) {
    fetchHomeData(token: token);
  }

  Future<void> fetchHomeData({String? token}) async {
    _isLoading = true;
    notifyListeners();

    try {
      final results = await Future.wait([
        _homeService.getUpcomingAppointment(token: token),
        _homeService.getSpecialties(),
        _homeService.getVitalSigns(token: token),
      ]);

      _upcomingAppointment = results[0] as Appointment;
      _specialties = results[1] as List<Map<String, String>>;
      _vitalSigns = results[2] as List<VitalSign>;
    } catch (_) {
      _upcomingAppointment = mockUpcomingAppointment;
      _specialties = const [
        {'name': 'General', 'icon': 'stetoskop.png'},
        {'name': 'Dentist', 'icon': 'gigi.png'},
        {'name': 'Cardiology', 'icon': 'hati.png'},
        {'name': 'Pediatrics', 'icon': 'suntikan.png'},
      ];
      _vitalSigns = mockVitalSigns;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void handleNavigation(BuildContext context, int index) {
    if (index == 1) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const SearchDoctorPage()),
      );
    } else if (index == 3) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const PatientProfilePage()),
      );
    }
  }
}
