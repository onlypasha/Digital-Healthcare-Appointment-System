class DoctorModel {
  final String id;
  final String name;
  final String specialty;
  final String hospital;
  final double rating;
  final String imageUrl;
  final List<String> availableSlots;

  DoctorModel({
    required this.id,
    required this.name,
    required this.specialty,
    required this.hospital,
    required this.rating,
    required this.imageUrl,
    required this.availableSlots,
  });
}

// --- MOCK DATA UNTUK DOKTER ---
final List<DoctorModel> mockDoctorList = [
  DoctorModel(
    id: "1",
    name: "Dr. Adrian Smith",
    specialty: "Cardiologist",
    hospital: "Downtown Medical Center",
    rating: 4.8,
    imageUrl: "https://i.pravatar.cc/150?u=adrian",
    availableSlots: ["Today, 2:30 PM", "Tmrw, 9:00 AM"],
  ),
  DoctorModel(
    id: "2",
    name: "Dr. Sarah Chen",
    specialty: "Dermatologist",
    hospital: "Westside Clinic",
    rating: 4.9,
    imageUrl: "https://i.pravatar.cc/150?u=sarah",
    availableSlots: ["Wed, 10:15 AM", "Wed, 1:00 PM"],
  ),
  DoctorModel(
    id: "3",
    name: "Dr. James Wilson",
    specialty: "Neurologist",
    hospital: "Central Hospital",
    rating: 4.7,
    imageUrl: "https://i.pravatar.cc/150?u=james",
    availableSlots: ["Today", "Thu, 11:30 AM"],
  ),
];