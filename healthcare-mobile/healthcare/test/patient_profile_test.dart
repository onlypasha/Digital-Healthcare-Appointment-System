import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:healthcare/profile/model/patient_profile_model.dart';
import 'package:healthcare/profile/controller/profile_controller.dart';
import 'package:healthcare/profile/page/patient_profile_page.dart';

void main() {
  group('Patient Profile Tests', () {
    test('PatientProfileModel json parsing test', () {
      final json = {
        'id': 'P-123',
        'name': 'Budi Santoso',
        'email': 'budi@example.com',
        'phone': '08123456789',
        'birthDate': '01/01/1990',
        'address': 'Jakarta',
        'bloodType': 'A+',
        'gender': 'Laki-laki',
        'avatarUrl': 'https://example.com/avatar.jpg'
      };

      final profile = PatientProfileModel.fromJson(json);

      expect(profile.id, equals('P-123'));
      expect(profile.name, equals('Budi Santoso'));
      expect(profile.email, equals('budi@example.com'));
      expect(profile.bloodType, equals('A+'));
    });

    testWidgets('PatientProfilePage renders profile header and widgets correctly', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: MultiProvider(
            providers: [
              ChangeNotifierProvider(create: (_) => ProfileController()),
            ],
            child: const PatientProfilePage(),
          ),
        ),
      );

      await tester.pumpAndSettle();

      expect(find.text('Profil Saya'), findsOneWidget);
      expect(find.text('Alex Johnson'), findsOneWidget);
      expect(find.text('alex.johnson@example.com'), findsOneWidget);
      expect(find.text('Pasien Terverifikasi'), findsOneWidget);
      expect(find.text('Informasi Pribadi & Kontak'), findsOneWidget);
      expect(find.text('Keluar Akun'), findsOneWidget);
    });
  });
}
