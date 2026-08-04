import 'package:flutter/material.dart';

class AppointmentController extends ChangeNotifier {
  // State Jadwal Dokter
  int selectedDateIndex = 2; // Default Wed 25
  String selectedTime = '10:30 AM';
  double selectedDistance = 12.0;
  String selectedSpecialty = 'Umum';

  // Master Data Pilihan
  final List<String> dates = ['MON 23', 'TUE 24', 'WED 25', 'THU 26'];
  final List<String> availableTimes = [
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '01:00 PM',
    '01:30 PM',
  ];
  final List<String> specialties = ['Umum', 'Gigi', 'Jantung', 'Anak'];

  // Methods Setters
  void setDateIndex(int index) {
    selectedDateIndex = index;
    notifyListeners();
  }

  void setTime(String time) {
    selectedTime = time;
    notifyListeners();
  }

  void setDistance(double distance) {
    selectedDistance = distance;
    notifyListeners();
  }

  void setSpecialty(String specialty) {
    selectedSpecialty = specialty;
    notifyListeners();
  }

  // Simulasi Proses Booking
  Future<bool> confirmAppointment() async {
    await Future.delayed(const Duration(milliseconds: 500));
    return true;
  }
}