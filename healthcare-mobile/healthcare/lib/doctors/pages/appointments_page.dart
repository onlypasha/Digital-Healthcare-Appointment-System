import 'package:flutter/material.dart';
import 'package:healthcare/login/shared/shared.dart';
import '../widgets/filter_bottom_sheet.dart';
import '../widgets/detail_bottom_sheet.dart';

class AppointmentsPage extends StatefulWidget {
  const AppointmentsPage({super.key});

  @override
  State<AppointmentsPage> createState() => _AppointmentsPageState();
}

class _AppointmentsPageState extends State<AppointmentsPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _showFilterModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (context) => const FilterBottomSheet(),
    );
  }

  void _showDetailModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (context) => const DetailBottomSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        title: const Text('Appointments', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(icon: const Icon(Icons.filter_list, color: Colors.black), onPressed: _showFilterModal),
        ],
        bottom: TabBar(
          controller: _tabController,
          labelColor: primaryColor,
          unselectedLabelColor: secondaryTextColor,
          indicatorColor: primaryColor,
          tabs: const [Tab(text: 'Upcoming'), Tab(text: 'History')],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          ListView(
            padding: const EdgeInsets.all(16),
            children: [
              _buildCard(
                status: 'Confirmed',
                timeInfo: 'Tomorrow',
                doctorName: 'Dr. Sarah Jenkins',
                specialty: 'Cardiologist',
                date: 'Oct 24, 2026',
                time: '10:00 AM - 10:45 AM',
                onDetailPressed: _showDetailModal,
              ),
            ],
          ),
          const Center(child: Text('Belum ada riwayat janji temu')),
        ],
      ),
    );
  }

  Widget _buildCard({
    required String status,
    required String timeInfo,
    required String doctorName,
    required String specialty,
    required String date,
    required String time,
    required VoidCallback onDetailPressed,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Chip(
                label: Text(status, style: const TextStyle(fontSize: 10, color: Colors.blue)),
                backgroundColor: Colors.blue[50],
                visualDensity: VisualDensity.compact,
              ),
              Text(timeInfo, style: TextStyle(color: secondaryTextColor, fontSize: 12)),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              const CircleAvatar(radius: 20, child: Icon(Icons.person)),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(doctorName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                  Text(specialty, style: TextStyle(color: secondaryTextColor)),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.blue[50]?.withValues(alpha: 0.5),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Column(
              children: [
                Row(children: [const Icon(Icons.calendar_today, size: 14), const SizedBox(width: 8), Text(date, style: const TextStyle(fontSize: 12))]),
                const SizedBox(height: 4),
                Row(children: [const Icon(Icons.access_time, size: 14), const SizedBox(width: 8), Text(time, style: const TextStyle(fontSize: 12))]),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(child: OutlinedButton(onPressed: () {}, child: const Text('Reschedule'))),
              const SizedBox(width: 8),
              Expanded(
                child: ElevatedButton(
                  onPressed: onDetailPressed,
                  style: ElevatedButton.styleFrom(backgroundColor: primaryColor),
                  child: const Text('Details', style: TextStyle(color: Colors.white)),
                ),
              ),
            ],
          )
        ],
      ),
    );
  }
}