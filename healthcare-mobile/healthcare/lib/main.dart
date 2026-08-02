import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'login/controllers/auth_controller.dart';
import 'login/pages/sign_in_page.dart';

import 'profile/controller/profile_controller.dart';
import 'home/controller/home_controller.dart';

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