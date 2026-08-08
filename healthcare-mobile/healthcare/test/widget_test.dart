import 'package:flutter_test/flutter_test.dart';
import 'package:healthcare/main.dart';
import 'package:healthcare/features/auth/presentation/controllers/auth_controller.dart';

void main() {
  testWidgets('SignInPage renders initial UI', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());
    expect(find.textContaining('Sign In'), findsAtLeast(1));
  });

  test('AuthController multi-step sign up logic', () {
    final controller = AuthController();
    expect(controller.signUpStep, equals(1));

    // Reset test
    controller.resetSignUpStep();
    expect(controller.signUpStep, equals(1));
    expect(controller.isCheckedTerms, isFalse);
  });
}
