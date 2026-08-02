class PatientProfileModel {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String birthDate;
  final String address;
  final String bloodType;
  final String gender;
  final String avatarUrl;

  PatientProfileModel({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.birthDate,
    required this.address,
    required this.bloodType,
    required this.gender,
    required this.avatarUrl,
  });

  factory PatientProfileModel.fromJson(Map<String, dynamic> json) {
    return PatientProfileModel(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      birthDate: json['birthDate'] ?? json['birth_date'] ?? '',
      address: json['address'] ?? '',
      bloodType: json['bloodType'] ?? json['blood_type'] ?? '-',
      gender: json['gender'] ?? '-',
      avatarUrl: json['avatarUrl'] ?? json['avatar_url'] ?? 'https://i.pravatar.cc/150?u=patient',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'birthDate': birthDate,
      'address': address,
      'bloodType': bloodType,
      'gender': gender,
      'avatarUrl': avatarUrl,
    };
  }
}

// Mock Patient Profile Data
final PatientProfileModel mockPatientProfile = PatientProfileModel(
  id: "P-1002",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "+62 812-3456-7890",
  birthDate: "15/08/1995",
  address: "Jl. Sudirman No. 45, Jakarta Pusat",
  bloodType: "O+",
  gender: "Laki-laki",
  avatarUrl: "https://i.pravatar.cc/150?u=alex_johnson",
);
