import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../shared/theme_shared.dart';
import '../controllers/auth_controller.dart';

class ForgotPasswordPage extends StatefulWidget {
  const ForgotPasswordPage({super.key});

  @override
  State<ForgotPasswordPage> createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage> {
  final TextEditingController _emailController = TextEditingController();
  bool _isEmailSent = false;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final controller = Provider.of<AuthController>(context);

    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_rounded, color: textColor),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.04),
                    blurRadius: 16,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                child: _isEmailSent
                    ? _buildEmailSentSuccessView(context)
                    : _buildEmailInputForm(context, controller),
              ),
            ),
          ),
        ),
      ),
    );
  }

  // --- TAMPILAN FORM INPUT EMAIL ---
  Widget _buildEmailInputForm(BuildContext context, AuthController controller) {
    return Column(
      key: const ValueKey('FormInput'),
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Center(
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: primaryColor.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.mark_email_unread_outlined,
              size: 40,
              color: primaryColor,
            ),
          ),
        ),
        const SizedBox(height: 20),
        Text(
          'Lupa Kata Sandi?',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.bold,
            color: primaryColor,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          'Masukkan alamat email terdaftar Anda. Kami akan mengirimkan instruksi dan tautan reset kata sandi ke email Anda.',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 13, color: secondaryTextColor, height: 1.4),
        ),
        const SizedBox(height: 24),
        Text('Alamat Email', style: TextStyle(fontWeight: FontWeight.w600, color: textColor)),
        const SizedBox(height: 6),
        TextField(
          controller: _emailController,
          keyboardType: TextInputType.emailAddress,
          textInputAction: TextInputAction.done,
          decoration: InputDecoration(
            prefixIcon: const Icon(Icons.email_outlined, size: 20),
            hintText: 'jane.doe@contoh.com',
            filled: true,
            fillColor: inputFillColor,
            contentPadding: const EdgeInsets.symmetric(vertical: 12),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: borderColor),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: borderColor),
            ),
          ),
        ),
        const SizedBox(height: 24),
        ElevatedButton(
          onPressed: controller.isLoading
              ? null
              : () async {
                  final success = await controller.sendResetPasswordEmail(
                    context,
                    _emailController.text,
                  );
                  if (success && mounted) {
                    setState(() {
                      _isEmailSent = true;
                    });
                  }
                },
          style: ElevatedButton.styleFrom(
            backgroundColor: primaryColor,
            elevation: 0,
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          ),
          child: controller.isLoading
              ? const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                )
              : const Text(
                  'Kirim Email Reset',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: Colors.white),
                ),
        ),
        const SizedBox(height: 16),
        GestureDetector(
          onTap: () => Navigator.pop(context),
          child: Center(
            child: Text(
              'Batal dan Kembali',
              style: TextStyle(
                color: secondaryTextColor,
                fontWeight: FontWeight.w600,
                fontSize: 13,
              ),
            ),
          ),
        ),
      ],
    );
  }

  // --- TAMPILAN INSTRUKSI CEK EMAIL ---
  Widget _buildEmailSentSuccessView(BuildContext context) {
    return Column(
      key: const ValueKey('SentSuccess'),
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Center(
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.green.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.mark_email_read_rounded,
              size: 48,
              color: Colors.green,
            ),
          ),
        ),
        const SizedBox(height: 20),
        Text(
          'Periksa Email Anda',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.bold,
            color: textColor,
          ),
        ),
        const SizedBox(height: 12),
        RichText(
          textAlign: TextAlign.center,
          text: TextSpan(
            style: TextStyle(fontSize: 13, color: secondaryTextColor, height: 1.4),
            children: [
              const TextSpan(text: 'Kami telah mengirimkan tautan reset kata sandi ke email:\n'),
              TextSpan(
                text: _emailController.text,
                style: TextStyle(fontWeight: FontWeight.bold, color: primaryColor, height: 1.6),
              ),
              const TextSpan(
                text: '\n\nSilakan buka email Anda dan ikuti petunjuk yang diberikan untuk membuat kata sandi baru.',
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        ElevatedButton(
          onPressed: () => Navigator.pop(context),
          style: ElevatedButton.styleFrom(
            backgroundColor: primaryColor,
            elevation: 0,
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          ),
          child: const Text(
            'Kembali ke Halaman Masuk',
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: Colors.white),
          ),
        ),
      ],
    );
  }
}
