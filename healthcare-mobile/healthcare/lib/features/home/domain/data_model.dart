class UserModel {
  final String name;
  final String greeting;

  UserModel({required this.name, required this.greeting});
}

class Doctor {
  final String name;
  final String specialty;
  final String imageUrl;

  Doctor({
    required this.name,
    required this.specialty,
    required this.imageUrl,
  });
}

class Appointment {
  final Doctor doctor;
  final String dateDescription;
  final String time;

  Appointment({
    required this.doctor,
    required this.dateDescription,
    required this.time,
  });
}

class VitalSign {
  final String title;
  final String value;
  final String unit;
  final String iconAssetName;

  VitalSign({
    required this.title,
    required this.value,
    required this.unit,
    required this.iconAssetName,
  });
}

// Data Dummy
final UserModel currentUser = UserModel(
  name: "Alex Johnson",
  greeting: "Selamat datang,",
);

final Appointment mockUpcomingAppointment = Appointment(
  doctor: Doctor(
    name: "Dr. Sarah Chen",
    specialty: "Cardiologist",
    imageUrl: "https://i.pravatar.cc/150?u=sarah",
  ),
  dateDescription: "Tomorrow",
  time: "10:00 AM",
);

final List<VitalSign> mockVitalSigns = [
  VitalSign(
    title: "Heart Rate",
    value: "72",
    unit: "bpm",
    iconAssetName: "heart rate.png",
  ),
  VitalSign(
    title: "Blood Pressure",
    value: "120/80",
    unit: "mmHg",
    iconAssetName: "statistik.png",
  ),
  VitalSign(
    title: "Weight",
    value: "165",
    unit: "lbs",
    iconAssetName: "weight.png",
  ),
];
