import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../model/data_model.dart';
import '../controller/home_controller.dart';
import '../../doctors/pages/search_doctor_page.dart';
import '/login/controllers/auth_controller.dart';

class HealthcareHomePage extends StatelessWidget {
  const HealthcareHomePage({super.key});

  static const Color primaryColor = Color(0xFF2A5EE5);
  static const Color secondaryBg = Color(0xFFEAEEFC);
  static const Color accentRed = Color(0xFFD92D20);
  static const Color backgroundColor = Color(0xFFF8FAFC);
  static const Color textColorMain = Color(0xFF1D2939);
  static const Color textColorSecondary = Color(0xFF667085);

  @override
  Widget build(BuildContext context) {
    final homeController = Provider.of<HomeController>(context);

    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: _buildAppBar(context),
      body: homeController.isLoading
          ? const Center(child: CircularProgressIndicator(color: primaryColor))
          : SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildSearchBar(context),
                  const SizedBox(height: 24),
                  _buildUpcomingAppointmentSection(homeController.upcomingAppointment),
                  const SizedBox(height: 24),
                  _buildSpecialtiesSection(homeController.specialties),
                  const SizedBox(height: 24),
                  _buildHealthOverviewSection(homeController.vitalSigns),
                  const SizedBox(height: 16),
                ],
              ),
            ),
      bottomNavigationBar: _buildBottomNavigationBar(context, homeController),
    );
  }

  PreferredSizeWidget _buildAppBar(BuildContext context) {
    final authController = Provider.of<AuthController>(context);
    final displayName = (authController.userName != null && authController.userName!.isNotEmpty)
        ? authController.userName!
        : currentUser.name;

    return AppBar(
      backgroundColor: backgroundColor,
      elevation: 0,
      titleSpacing: 20,
      title: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            currentUser.greeting,
            style: const TextStyle(color: textColorSecondary, fontSize: 13, fontWeight: FontWeight.normal),
          ),
          Text(
            displayName,
            style: const TextStyle(color: textColorMain, fontSize: 20, fontWeight: FontWeight.bold),
          ),
        ],
      ),
      actions: [
        Padding(
          padding: const EdgeInsets.only(right: 20.0),
          child: Stack(
            alignment: Alignment.topRight,
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.black.withValues(alpha: 0.06)),
                ),
                child: const Icon(Icons.notifications_outlined, color: primaryColor, size: 22),
              ),
              Positioned(
                right: 2,
                top: 2,
                child: Container(
                  width: 9,
                  height: 9,
                  decoration: const BoxDecoration(color: accentRed, shape: BoxShape.circle),
                ),
              )
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSearchBar(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const SearchDoctorPage()),
        );
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.black.withValues(alpha: 0.08)),
        ),
        child: const Row(
          children: [
            Icon(Icons.search, color: textColorSecondary, size: 20),
            SizedBox(width: 10),
            Text(
              "Search doctors, specialties, or symptoms...",
              style: TextStyle(color: textColorSecondary, fontSize: 13),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildUpcomingAppointmentSection(Appointment? apData) {
    final ap = apData ?? mockUpcomingAppointment;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Upcoming Appointment",
          style: TextStyle(color: textColorMain, fontSize: 17, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.black.withValues(alpha: 0.06)),
          ),
          child: Column(
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 30,
                    backgroundColor: primaryColor.withValues(alpha: 0.1),
                    child: const Icon(Icons.person, color: primaryColor, size: 30),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          ap.doctor.name,
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: textColorMain),
                        ),
                        const SizedBox(height: 2),
                        Row(
                          children: [
                            Image.asset('assets/images/stetoskop.png', width: 14, height: 14, color: Colors.teal),
                            const SizedBox(width: 4),
                            Text(ap.doctor.specialty, style: const TextStyle(color: Colors.teal, fontSize: 13, fontWeight: FontWeight.w500)),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(color: secondaryBg, borderRadius: BorderRadius.circular(8)),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(Icons.calendar_today_outlined, color: primaryColor, size: 14),
                              const SizedBox(width: 6),
                              Text(ap.dateDescription, style: const TextStyle(color: primaryColor, fontWeight: FontWeight.bold, fontSize: 12)),
                              const SizedBox(width: 8),
                              Text(ap.time, style: const TextStyle(color: textColorMain, fontWeight: FontWeight.bold, fontSize: 13)),
                            ],
                          ),
                        )
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              Divider(color: Colors.black.withValues(alpha: 0.06), height: 1),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        side: BorderSide(color: primaryColor.withValues(alpha: 0.5)),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      onPressed: () {},
                      child: const Text("Reschedule", style: TextStyle(color: primaryColor, fontSize: 13, fontWeight: FontWeight.w600)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: TextButton(
                      onPressed: () {},
                      child: const Text("Cancel", style: TextStyle(color: accentRed, fontSize: 13, fontWeight: FontWeight.w600)),
                    ),
                  ),
                ],
              )
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSpecialtiesSection(List<Map<String, String>> specialtiesData) {
    final specialties = specialtiesData.isEmpty
        ? const [
            {'name': 'General', 'icon': 'stetoskop.png'},
            {'name': 'Dentist', 'icon': 'gigi.png'},
            {'name': 'Cardiology', 'icon': 'hati.png'},
            {'name': 'Pediatrics', 'icon': 'suntikan.png'},
          ]
        : specialtiesData;

    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text("Specialties", style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: textColorMain)),
            GestureDetector(
              onTap: () {},
              child: const Text("View All", style: TextStyle(color: primaryColor, fontSize: 13, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
        const SizedBox(height: 12),
        GridView.builder(
          physics: const NeverScrollableScrollPhysics(),
          shrinkWrap: true,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 1.5,
          ),
          itemCount: specialties.length,
          itemBuilder: (context, index) {
            final spec = specialties[index];
            return Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.black.withValues(alpha: 0.06)),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: const BoxDecoration(
                      color: secondaryBg,
                      shape: BoxShape.circle,
                    ),
                    // [FIXED]: Warna color dihapus agar gambar asli muncul tanpa tertimpa warna biru
                    child: Image.asset(
                      'assets/images/${spec['icon']!}', 
                      width: 20, 
                      height: 20,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(spec['name']!, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: textColorMain)),
                ],
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildHealthOverviewSection(List<VitalSign> vitalsData) {
    final vitals = vitalsData.isEmpty ? mockVitalSigns : vitalsData;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Health Overview", style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: textColorMain)),
        const SizedBox(height: 12),
        ...vitals.map((vital) => _buildVitalCard(vital)),
        const SizedBox(height: 8),
        SizedBox(
          width: double.infinity,
          height: 44,
          child: OutlinedButton.icon(
            style: OutlinedButton.styleFrom(
              side: BorderSide(color: Colors.black.withValues(alpha: 0.12)),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: () {},
            icon: const Icon(Icons.add, size: 18, color: primaryColor),
            label: const Text("Log New Vitals", style: TextStyle(color: primaryColor, fontWeight: FontWeight.bold, fontSize: 13)),
          ),
        ),
      ],
    );
  }

  Widget _buildVitalCard(VitalSign vital) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.black.withValues(alpha: 0.06)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: const BoxDecoration(
              color: Color(0xFFFEEEEE),
              shape: BoxShape.circle,
            ),
            child: Image.asset(
              'assets/images/${vital.iconAssetName}', 
              width: 20, 
              height: 20,
            ),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(vital.title, style: const TextStyle(fontSize: 12, color: textColorSecondary)),
              Row(
                crossAxisAlignment: CrossAxisAlignment.baseline,
                textBaseline: TextBaseline.alphabetic,
                children: [
                  Text(vital.value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: textColorMain)),
                  const SizedBox(width: 4),
                  Text(vital.unit, style: const TextStyle(fontSize: 12, color: textColorSecondary)),
                ],
              ),
            ],
          ),
          const Spacer(),
          Image.asset('assets/images/statistik.png', width: 20, height: 16, color: Colors.teal),
        ],
      ),
    );
  }

  Widget _buildBottomNavigationBar(BuildContext context, HomeController homeController) {
    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      backgroundColor: Colors.white,
      selectedItemColor: primaryColor,
      unselectedItemColor: textColorSecondary,
      currentIndex: homeController.selectedNavIndex,
      selectedFontSize: 11,
      unselectedFontSize: 11,
      onTap: (index) => homeController.handleNavigation(context, index),
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.home), label: "Home"),
        BottomNavigationBarItem(icon: Icon(Icons.search), label: "Search"),
        BottomNavigationBarItem(icon: Icon(Icons.calendar_today_outlined), label: "Appointments"),
        BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: "Profile"),
      ],
    );
  }
}