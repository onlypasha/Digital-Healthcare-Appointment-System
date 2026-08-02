import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:healthcare/login/controllers/auth_controller.dart';
import 'package:healthcare/home/page/healthcare_home_page.dart';
import 'package:healthcare/profile/controller/profile_controller.dart';

import 'package:healthcare/home/controller/home_controller.dart';

void main() {
  group('JWT Global Token Integration Tests', () {
    test('AuthController stores global JWT token and user data', () {
      final controller = AuthController();
      expect(controller.token, isNull);
      expect(controller.jwt, isNull);
      expect(controller.isAuthenticated, isFalse);

      controller.setToken('sample_jwt_token_123', userName: 'John Doe', userEmail: 'john@example.com');

      expect(controller.token, equals('sample_jwt_token_123'));
      expect(controller.jwt, equals('sample_jwt_token_123'));
      expect(controller.userName, equals('John Doe'));
      expect(controller.userEmail, equals('john@example.com'));
      expect(controller.isAuthenticated, isTrue);

      controller.clearToken();
      expect(controller.token, isNull);
      expect(controller.jwt, isNull);
      expect(controller.isAuthenticated, isFalse);
    });

    testWidgets('HealthcareHomePage displays user name from global AuthController JWT state', (WidgetTester tester) async {
      final authController = AuthController();
      authController.setToken('mock_jwt_token', userName: 'Jane Smith');

      await tester.pumpWidget(
        MaterialApp(
          home: MultiProvider(
            providers: [
              ChangeNotifierProvider<AuthController>.value(value: authController),
              ChangeNotifierProvider(create: (_) => ProfileController()),
              ChangeNotifierProvider(create: (_) => HomeController()),
            ],
            child: const HealthcareHomePage(),
          ),
        ),
      );

      await tester.pumpAndSettle();

      expect(find.text('Jane Smith'), findsOneWidget);
    });
  });
}
