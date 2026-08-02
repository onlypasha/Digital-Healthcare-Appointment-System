import 'package:flutter_test/flutter_test.dart';
import 'package:healthcare/home/controller/home_controller.dart';

void main() {
  group('HomeController Unit Tests', () {
    test('HomeController initializes and fetches data from HomeService', () async {
      final controller = HomeController();
      expect(controller.isLoading, isTrue);

      await controller.fetchHomeData();

      expect(controller.isLoading, isFalse);
      expect(controller.upcomingAppointment, isNotNull);
      expect(controller.specialties, isNotEmpty);
      expect(controller.vitalSigns, isNotEmpty);
    });
  });
}
