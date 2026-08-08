import 'package:flutter/material.dart';
import 'package:healthcare/login/controllers/auth_controller.dart';
import 'package:provider/provider.dart';
import '../controller/profile_controller.dart';
import '../model/patient_profile_model.dart';
import '/home/page/healthcare_home_page.dart';
import '../../doctors/pages/search_doctor_page.dart';

class PatientProfilePage extends StatefulWidget {
  const PatientProfilePage({super.key});

  @override
  State<PatientProfilePage> createState() => _PatientProfilePageState();
}

class _PatientProfilePageState extends State<PatientProfilePage> {
  static const Color primaryColor = Color(0xFF2A5EE5);
  static const Color backgroundColor = Color(0xFFF8FAFC);
  static const Color textColorMain = Color(0xFF1D2939);
  static const Color textColorSecondary = Color(0xFF667085);
  static const Color accentRed = Color(0xFFD92D20);
  static const Color cardFillColor = Colors.white;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final token = Provider.of<AuthController>(context, listen: false).token;
      Provider.of<ProfileController>(context, listen: false).fetchProfile(token);
    });
  }

  @override
  Widget build(BuildContext context) {
    final profileController = Provider.of<ProfileController>(context);
    final authController = Provider.of<AuthController>(context, listen: false);
    final patient = profileController.profile;

    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        backgroundColor: backgroundColor,
        elevation: 0,
        title: const Text(
          'Profil Saya',
          style: TextStyle(
            color: textColorMain,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit_outlined, color: primaryColor),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Fitur Edit Profil akan segera hadir!'),
                ),
              );
            },
          ),
        ],
      ),
      body: profileController.isLoading
          ? const Center(child: CircularProgressIndicator(color: primaryColor))
          : RefreshIndicator(
              onRefresh: () => profileController.fetchProfile(authController.token),
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.symmetric(
                  horizontal: 20.0,
                  vertical: 12.0,
                ),
                child: Column(
                  children: [
                    // --- HEADER PROFIL & AVATAR ---
                    _buildProfileHeader(patient),
                    const SizedBox(height: 20),

                    // --- STATISTIK SINGKAT MEDIS ---
                    _buildQuickStatsCard(patient),
                    const SizedBox(height: 20),

                    // --- INFORMASI PRIBADI ---
                    _buildSectionTitle('Informasi Pribadi & Kontak'),
                    const SizedBox(height: 10),
                    _buildInfoCard([
                      _buildInfoTile(
                        Icons.calendar_today_outlined,
                        'Tanggal Lahir',
                        patient?.birthDate ?? '-',
                      ),
                      const Divider(height: 1),
                      _buildInfoTile(
                        Icons.phone_outlined,
                        'Nomor HP',
                        patient?.phone ?? '-',
                      ),
                      const Divider(height: 1),
                      _buildInfoTile(
                        Icons.location_on_outlined,
                        'Alamat',
                        patient?.address ?? '-',
                      ),
                    ]),
                    const SizedBox(height: 20),

                    // --- PENGATURAN & AKSI ---
                    _buildSectionTitle('Pengaturan & Akses'),
                    const SizedBox(height: 10),
                    _buildInfoCard([
                      _buildActionTile(Icons.lock_outline, 'Ubah Kata Sandi', () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text(
                              'Fitur Ubah Kata Sandi akan segera hadir!',
                            ),
                          ),
                        );
                      }),
                      const Divider(height: 1),
                      _buildActionTile(
                        Icons.history_outlined,
                        'Riwayat Medis & Janji Temu',
                        () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text(
                                'Fitur Riwayat Medis akan segera hadir!',
                              ),
                            ),
                          );
                        },
                      ),
                    ]),
                    const SizedBox(height: 28),

                    // --- TOMBOL LOGOUT ---
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton.icon(
                        onPressed: () => profileController.logout(context),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          side: const BorderSide(color: accentRed),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                        icon: const Icon(
                          Icons.logout_rounded,
                          color: accentRed,
                          size: 20,
                        ),
                        label: const Text(
                          'Keluar Akun',
                          style: TextStyle(
                            color: accentRed,
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
      bottomNavigationBar: _buildBottomNavigationBar(context),
    );
  }

  Widget _buildProfileHeader(PatientProfileModel? patient) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: cardFillColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          CircleAvatar(
            radius: 42,
            backgroundColor: primaryColor.withValues(alpha: 0.1),
            child: const Icon(Icons.person, size: 44, color: primaryColor),
          ),
          const SizedBox(height: 12),
          Text(
            patient?.name ?? 'Nama Pasien',
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: textColorMain,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            patient?.email ?? 'email@contoh.com',
            style: const TextStyle(fontSize: 13, color: textColorSecondary),
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: primaryColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.verified, size: 14, color: primaryColor),
                SizedBox(width: 4),
                Text(
                  'Pasien Terverifikasi',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: primaryColor,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickStatsCard(PatientProfileModel? patient) {
    return Row(
      children: [
        Expanded(
          child: _buildStatItem(
            'ID Pasien',
            patient?.id ?? '-',
            Icons.badge_outlined,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildStatItem(
            'Gol. Darah',
            patient?.bloodType ?? '-',
            Icons.bloodtype_outlined,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildStatItem(
            'Gender',
            patient?.gender ?? '-',
            Icons.person_outline,
          ),
        ),
      ],
    );
  }

  Widget _buildStatItem(String label, String value, IconData icon) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 10),
      decoration: BoxDecoration(
        color: cardFillColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.black.withValues(alpha: 0.05)),
      ),
      child: Column(
        children: [
          Icon(icon, size: 22, color: primaryColor),
          const SizedBox(height: 6),
          Text(
            value,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: textColorMain,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: const TextStyle(fontSize: 11, color: textColorSecondary),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 15,
          fontWeight: FontWeight.bold,
          color: textColorMain,
        ),
      ),
    );
  }

  Widget _buildInfoCard(List<Widget> children) {
    return Material(
      color: cardFillColor,
      borderRadius: BorderRadius.circular(14),
      clipBehavior: Clip.antiAlias,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: Colors.black.withValues(alpha: 0.05)),
        ),
        child: Column(children: children),
      ),
    );
  }

  Widget _buildInfoTile(IconData icon, String title, String subtitle) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: primaryColor.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, size: 20, color: primaryColor),
      ),
      title: Text(
        title,
        style: const TextStyle(fontSize: 12, color: textColorSecondary),
      ),
      subtitle: Text(
        subtitle,
        style: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          color: textColorMain,
        ),
      ),
    );
  }

  Widget _buildActionTile(IconData icon, String title, VoidCallback onTap) {
    return ListTile(
      onTap: onTap,
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: primaryColor.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, size: 20, color: primaryColor),
      ),
      title: Text(
        title,
        style: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          color: textColorMain,
        ),
      ),
      trailing: const Icon(Icons.chevron_right, color: textColorSecondary),
    );
  }

  Widget _buildBottomNavigationBar(BuildContext context) {
    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      backgroundColor: Colors.white,
      selectedItemColor: primaryColor,
      unselectedItemColor: textColorSecondary,
      currentIndex: 3,
      selectedFontSize: 11,
      unselectedFontSize: 11,
      onTap: (index) {
        if (index == 0) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const HealthcareHomePage()),
          );
        } else if (index == 1) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const SearchDoctorPage()),
          );
        }
      },
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.home), label: "Home"),
        BottomNavigationBarItem(icon: Icon(Icons.search), label: "Search"),
        BottomNavigationBarItem(
          icon: Icon(Icons.calendar_today_outlined),
          label: "Appointments",
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.person_outline),
          label: "Profile",
        ),
      ],
    );
  }
}
