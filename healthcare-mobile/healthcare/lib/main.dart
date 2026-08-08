import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'features/auth/presentation/controllers/auth_controller.dart';
import 'features/auth/presentation/pages/sign_in_page.dart';
import 'features/profile/presentation/controllers/profile_controller.dart';
import 'features/home/presentation/controllers/home_controller.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthController()),
        ChangeNotifierProvider(create: (_) => ProfileController()),
        ChangeNotifierProvider(create: (_) => HomeController()),
      ],
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'CareConnect',
        theme: ThemeData(
          useMaterial3: true,
        ),
        home: const SignInPage(),
      ),
    );
  }
}