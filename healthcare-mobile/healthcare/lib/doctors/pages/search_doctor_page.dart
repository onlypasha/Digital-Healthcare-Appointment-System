import 'package:flutter/material.dart';
import '../models/doctor_model.dart';
import '../../home/page/healthcare_home_page.dart'; // Untuk navigasi balik ke Home jika ditekan
import '../../profile/page/patient_profile_page.dart'; // Untuk navigasi ke Profile Pasien

class SearchDoctorPage extends StatefulWidget {
  const SearchDoctorPage({super.key});

  @override
  State<SearchDoctorPage> createState() => _SearchDoctorPageState();
}

class _SearchDoctorPageState extends State<SearchDoctorPage> {
  // Warna Utama Sesuai Desain
  static const Color primaryColor = Color(0xFF0052CC);
  static const Color backgroundColor = Color(0xFFF8FAFC);
  static const Color textColorMain = Color(0xFF1D2939);
  static const Color textColorSecondary = Color(0xFF667085);
  static const Color slotBgColor = Color(0xFFF0F5FF);

  // Controller untuk fitur pencarian
  final TextEditingController _searchController = TextEditingController();
  List<DoctorModel> _filteredDoctors = mockDoctorList;
  int _selectedNavIndex = 1; // Tab 'Search' aktif

  void _filterDoctors(String query) {
    setState(() {
      if (query.isEmpty) {
        _filteredDoctors = mockDoctorList;
      } else {
        _filteredDoctors = mockDoctorList
            .where((doc) =>
                doc.name.toLowerCase().contains(query.toLowerCase()) ||
                doc.specialty.toLowerCase().contains(query.toLowerCase()) ||
                doc.hospital.toLowerCase().contains(query.toLowerCase()))
            .toList();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        backgroundColor: backgroundColor,
        elevation: 0,
        title: const Text(
          "Cari Dokter",
          style: TextStyle(
            color: textColorMain,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSearchBar(),
            const SizedBox(height: 16),
            _buildFilterChips(),
            const SizedBox(height: 20),
            _buildDoctorList(),
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomNavigationBar(),
    );
  }

  // Widget Search Bar
  Widget _buildSearchBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.black.withValues(alpha: 0.1)),
      ),
      child: TextField(
        controller: _searchController,
        onChanged: _filterDoctors,
        decoration: const InputDecoration(
          hintText: "Search doctors, specialties, or symptoms...",
          hintStyle: TextStyle(color: textColorSecondary, fontSize: 13),
          prefixIcon: Icon(Icons.search, color: textColorSecondary, size: 20),
          border: InputBorder.none,
          contentPadding: EdgeInsets.symmetric(vertical: 14),
        ),
      ),
    );
  }

  // Widget Horisontal Filter Chips
  Widget _buildFilterChips() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: primaryColor,
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Text(
              "Specialty",
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
            ),
          ),
          const SizedBox(width: 8),
          _buildOutlinedChip(Icons.calendar_today_outlined, "Availability"),
          const SizedBox(width: 8),
          _buildOutlinedChip(Icons.star_border, "Rating 4.0+"),
        ],
      ),
    );
  }

  Widget _buildOutlinedChip(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.black.withValues(alpha: 0.15)),
      ),
      child: Row(
        children: [
          Icon(icon, size: 16, color: textColorMain),
          const SizedBox(width: 6),
          Text(
            label,
            style: const TextStyle(color: textColorMain, fontSize: 13, fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }

  // Widget List Dokter
  Widget _buildDoctorList() {
    if (_filteredDoctors.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.symmetric(vertical: 40),
          child: Text("Dokter tidak ditemukan.", style: TextStyle(color: textColorSecondary)),
        ),
      );
    }

    return ListView.builder(
      physics: const NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      itemCount: _filteredDoctors.length,
      itemBuilder: (context, index) {
        final doctor = _filteredDoctors[index];
        return _buildDoctorCard(doctor);
      },
    );
  }

  // Card Dokter Individual
  Widget _buildDoctorCard(DoctorModel doctor) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.black.withValues(alpha: 0.08)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CircleAvatar(
                radius: 28,
                backgroundImage: NetworkImage(doctor.imageUrl),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      doctor.name,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: textColorMain,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      doctor.specialty,
                      style: const TextStyle(
                        color: textColorSecondary,
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      doctor.hospital,
                      style: const TextStyle(
                        color: textColorSecondary,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: primaryColor.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.star, color: primaryColor, size: 14),
                    const SizedBox(width: 4),
                    Text(
                      doctor.rating.toString(),
                      style: const TextStyle(
                        color: primaryColor,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              )
            ],
          ),
          const SizedBox(height: 14),
          
          // Next Available Slots Section
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: slotBgColor.withValues(alpha: 0.5),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Next Available",
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: textColorSecondary,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: doctor.availableSlots.map((slot) {
                    final bool isHighlighted = slot.contains("Thu"); // Contoh slot aktif seperti pada gambar
                    return Expanded(
                      child: Container(
                        margin: const EdgeInsets.only(right: 8),
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        decoration: BoxDecoration(
                          color: isHighlighted ? primaryColor.withValues(alpha: 0.12) : Colors.white,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(
                            color: isHighlighted ? primaryColor : Colors.grey.withValues(alpha: 0.2),
                          ),
                        ),
                        child: Center(
                          child: Text(
                            slot,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: isHighlighted ? FontWeight.bold : FontWeight.w500,
                              color: isHighlighted ? primaryColor : textColorMain,
                            ),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),
          
          // Tombol Book Appointment
          SizedBox(
            width: double.infinity,
            height: 44,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: primaryColor,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              onPressed: () {
                // Tambahkan logika pemesanan di sini
              },
              child: const Text(
                "Book Appointment",
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Navigation Bar Bawah
  Widget _buildBottomNavigationBar() {
    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      backgroundColor: Colors.white,
      selectedItemColor: primaryColor,
      unselectedItemColor: textColorSecondary,
      currentIndex: _selectedNavIndex,
      selectedFontSize: 11,
      unselectedFontSize: 11,
      onTap: (index) {
        if (index == 0) {
          // Pindah balik ke Dashboard Home
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const HealthcareHomePage()),
          );
        } else if (index == 3) {
          // Pindah ke Halaman Profil Pasien
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const PatientProfilePage()),
          );
        } else {
          setState(() {
            _selectedNavIndex = index;
          });
        }
      },
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: "Home"),
        BottomNavigationBarItem(icon: Icon(Icons.search), label: "Search"),
        BottomNavigationBarItem(icon: Icon(Icons.calendar_today_outlined), label: "Appointments"),
        BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: "Profile"),
      ],
    );
  }
}