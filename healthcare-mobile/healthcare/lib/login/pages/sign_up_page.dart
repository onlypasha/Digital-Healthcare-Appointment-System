import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:healthcare/login/shared/shared.dart';
import '../controllers/auth_controller.dart';

class SignUpPage extends StatelessWidget {
  const SignUpPage({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Provider.of<AuthController>(context);

    return Scaffold(
      backgroundColor: backgroundColor,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
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
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Center(
                    child: Image.asset(
                      'assets/images/Margin.png',
                      width: 60,
                      height: 60,
                      fit: BoxFit.contain,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Daftar CareConnect',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: primaryColor),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _getStepSubtitle(controller.signUpStep),
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 13, color: secondaryTextColor),
                  ),
                  const SizedBox(height: 20),

                  // 3-Step Progress Indicators Bar
                  Row(
                    children: [
                      Expanded(
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 300),
                          height: 6,
                          decoration: BoxDecoration(
                            color: controller.signUpStep >= 1 ? primaryColor : primaryColor.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(3),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 300),
                          height: 6,
                          decoration: BoxDecoration(
                            color: controller.signUpStep >= 2 ? primaryColor : primaryColor.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(3),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 300),
                          height: 6,
                          decoration: BoxDecoration(
                            color: controller.signUpStep >= 3 ? primaryColor : primaryColor.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(3),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  Text(
                    'Langkah ${controller.signUpStep} dari 3',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: primaryColor),
                  ),
                  const SizedBox(height: 24),

                  // Form Dynamic Sesuai Step
                  AnimatedSwitcher(
                    duration: const Duration(milliseconds: 300),
                    child: _buildStepContent(context, controller),
                  ),
                  const SizedBox(height: 20),

                  // Kembali ke Sign In
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text("Sudah punya akun? ", style: TextStyle(color: secondaryTextColor, fontSize: 13)),
                      GestureDetector(
                        onTap: () {
                          controller.resetSignUpStep();
                          Navigator.pop(context);
                        },
                        child: Text('Masuk', style: TextStyle(color: primaryColor, fontWeight: FontWeight.bold, fontSize: 13)),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  String _getStepSubtitle(int step) {
    switch (step) {
      case 1:
        return 'Langkah 1: Masukkan nama lengkap dan alamat email Anda.';
      case 2:
        return 'Langkah 2: Masukkan nomor HP dan buat kata sandi.';
      case 3:
        return 'Langkah 3: Konfirmasi data dan setujui ketentuan layanan.';
      default:
        return 'Buat akun Anda untuk menjadwalkan janji temu medis.';
    }
  }

  Widget _buildStepContent(BuildContext context, AuthController controller) {
    switch (controller.signUpStep) {
      case 1:
        return _buildStep1(context, controller);
      case 2:
        return _buildStep2(context, controller);
      case 3:
        return _buildStep3(context, controller);
      default:
        return _buildStep1(context, controller);
    }
  }

  // --- STEP 1: INFORMASI DIRI ---
  Widget _buildStep1(BuildContext context, AuthController controller) {
    return Column(
      key: const ValueKey(1),
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text('Nama Lengkap', style: TextStyle(fontWeight: FontWeight.w600, color: textColor)),
        const SizedBox(height: 6),
        TextField(
          controller: controller.signUpNameController,
          textInputAction: TextInputAction.next,
          decoration: InputDecoration(
            prefixIcon: const Icon(Icons.person_outline, size: 20),
            hintText: 'Jane Doe',
            filled: true,
            fillColor: inputFillColor,
            contentPadding: const EdgeInsets.symmetric(vertical: 12),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide(color: borderColor)),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide(color: borderColor)),
          ),
        ),
        const SizedBox(height: 16),
        Text('Alamat Email', style: TextStyle(fontWeight: FontWeight.w600, color: textColor)),
        const SizedBox(height: 6),
        TextField(
          controller: controller.signUpEmailController,
          keyboardType: TextInputType.emailAddress,
          textInputAction: TextInputAction.next,
          decoration: InputDecoration(
            prefixIcon: const Icon(Icons.email_outlined, size: 20),
            hintText: 'jane.doe@contoh.com',
            filled: true,
            fillColor: inputFillColor,
            contentPadding: const EdgeInsets.symmetric(vertical: 12),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide(color: borderColor)),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide(color: borderColor)),
          ),
        ),const SizedBox(height: 16),
        Text('Password', style: TextStyle(fontWeight: FontWeight.w600, color: textColor)),
        const SizedBox(height: 6),
        TextField(
          controller: controller.signUpPasswordController,
          obscureText: controller.isObscure,
          textInputAction: TextInputAction.done,
          decoration: InputDecoration(
            prefixIcon: const Icon(Icons.lock_outline, size: 20),
            suffixIcon: IconButton(
              icon: Icon(controller.isObscure ? Icons.visibility_off_outlined : Icons.visibility_outlined, size: 20),
              onPressed: () => controller.toggleObscure(),
            ),
            hintText: '••••••••',
            filled: true,
            fillColor: inputFillColor,
            contentPadding: const EdgeInsets.symmetric(vertical: 12),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide(color: borderColor)),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide(color: borderColor)),
          ),
        ),
        const SizedBox(height: 24),
        ElevatedButton(
          onPressed: () => controller.nextSignUpStep(context),
          style: ElevatedButton.styleFrom(
            backgroundColor: primaryColor,
            elevation: 0,
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          ),
          child: const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Lanjut', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white)),
              SizedBox(width: 8),
              Icon(Icons.arrow_forward_rounded, size: 20, color: Colors.white),
            ],
          ),
        ),
      ],
    );
  }

  // --- STEP 2: KONTAK & KEAMANAN ---
  Widget _buildStep2(BuildContext context, AuthController controller) {
    return Column(
      key: const ValueKey(2),
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text('Tanggal Lahir', style: TextStyle(fontWeight: FontWeight.w600, color: textColor)),
        const SizedBox(height: 6),
        TextField(
          controller: controller.signUpDobController,
          readOnly: true,
          onTap: () => controller.selectDob(context),
          decoration: InputDecoration(
            prefixIcon: const Icon(Icons.calendar_today_outlined, size: 20),
            suffixIcon: const Icon(Icons.arrow_drop_down, size: 20),
            hintText: 'DD/MM/YYYY',
            filled: true,
            fillColor: inputFillColor,
            contentPadding: const EdgeInsets.symmetric(vertical: 12),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide(color: borderColor)),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide(color: borderColor)),
          ),
        ),
        const SizedBox(height: 16),
        Text('Nomor HP', style: TextStyle(fontWeight: FontWeight.w600, color: textColor)),
        const SizedBox(height: 6),
        TextField(
          controller: controller.signUpPhoneController,
          keyboardType: TextInputType.phone,
          textInputAction: TextInputAction.next,
          decoration: InputDecoration(
            prefixIcon: const Icon(Icons.phone_outlined, size: 20),
            hintText: '(62) 812-3456-7890',
            filled: true,
            fillColor: inputFillColor,
            contentPadding: const EdgeInsets.symmetric(vertical: 12),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide(color: borderColor)),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide(color: borderColor)),
          ),
        ),
        const SizedBox(height: 24),
        Row(
          children: [
            Expanded(
              child: OutlinedButton(
                onPressed: () => controller.previousSignUpStep(),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  side: BorderSide(color: borderColor),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.arrow_back_rounded, size: 18, color: textColor),
                    const SizedBox(width: 6),
                    Text('Kembali', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: textColor)),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: ElevatedButton(
                onPressed: () => controller.nextSignUpStep(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: primaryColor,
                  elevation: 0,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('Lanjut', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: Colors.white)),
                    SizedBox(width: 6),
                    Icon(Icons.arrow_forward_rounded, size: 18, color: Colors.white),
                  ],
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  // --- STEP 3: KONFIRMASI & KETENTUAN ---
  Widget _buildStep3(BuildContext context, AuthController controller) {
    return Column(
      key: const ValueKey(3),
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Card Ringkasan Data
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: inputFillColor,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: borderColor),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Ringkasan Data Akun', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: primaryColor)),
              const Divider(height: 16),
              _buildSummaryRow(Icons.person, 'Nama', controller.signUpNameController.text),
              const SizedBox(height: 8),
              _buildSummaryRow(Icons.email, 'Email', controller.signUpEmailController.text),
              const SizedBox(height: 8),
              _buildSummaryRow(Icons.calendar_today, 'Tanggal Lahir', controller.signUpDobController.text),
              const SizedBox(height: 8),
              _buildSummaryRow(Icons.phone, 'Nomor HP', controller.signUpPhoneController.text),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Checkbox Terms
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              width: 24,
              height: 24,
              child: Checkbox(
                value: controller.isCheckedTerms,
                onChanged: (val) => controller.toggleTerms(val),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: RichText(
                text: TextSpan(
                  style: TextStyle(fontSize: 12, color: secondaryTextColor),
                  children: [
                    const TextSpan(text: 'Saya setuju dengan '),
                    TextSpan(text: 'Ketentuan Layanan', style: TextStyle(color: primaryColor, fontWeight: FontWeight.w600)),
                    const TextSpan(text: ' dan '),
                    TextSpan(text: 'Kebijakan Privasi', style: TextStyle(color: primaryColor, fontWeight: FontWeight.w600)),
                    const TextSpan(text: '.'),
                  ],
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 24),

        Row(
          children: [
            Expanded(
              child: OutlinedButton(
                onPressed: controller.isLoading ? null : () => controller.previousSignUpStep(),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  side: BorderSide(color: borderColor),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.arrow_back_rounded, size: 18, color: textColor),
                    const SizedBox(width: 6),
                    Text('Kembali', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: textColor)),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: ElevatedButton(
                onPressed: controller.isLoading ? null : () => controller.signUp(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: primaryColor,
                  elevation: 0,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                child: controller.isLoading
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Text('Buat Akun', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: Colors.white)),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildSummaryRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 16, color: secondaryTextColor),
        const SizedBox(width: 8),
        Text('$label: ', style: TextStyle(fontSize: 12, color: secondaryTextColor, fontWeight: FontWeight.w500)),
        Expanded(
          child: Text(
            value.isEmpty ? '-' : value,
            style: TextStyle(fontSize: 12, color: textColor, fontWeight: FontWeight.w600),
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}