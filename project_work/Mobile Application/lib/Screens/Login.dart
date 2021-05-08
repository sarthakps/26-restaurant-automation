import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:restaurant_management/Values/Design.dart';

class Login extends StatefulWidget {
  @override
  _LoginState createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final formKey = new GlobalKey<FormState>();

  String _username, _password;

  @override
  Widget build(BuildContext context) {

    final usernameField = TextFormField(
      autofocus: false,
      // validator: validateEmail,
      onSaved: (value) => _username = value,
      decoration: buildInputDecoration("Email", Icons.email),
    );

    final passwordField = TextFormField(
      autofocus: false,
      obscureText: true,
      validator: (value) => value.isEmpty ? "Please enter password" : null,
      onSaved: (value) => _password = value,
      decoration: buildInputDecoration("Password", Icons.lock),
    );

    var loading = Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        CircularProgressIndicator(),
        Text(" Authenticating ... Please wait")
      ],
    );

    var doLogin = () {
      final form = formKey.currentState;

      if (form.validate()) {
        form.save();

        //   final Future<Map<String, dynamic>> successfulMessage =
        //   auth.login(_username, _password);
        //
        //   successfulMessage.then((response) {
        //     if (response['status']) {
        //       User user = response['user'];
        //       Provider.of<UserProvider>(context, listen: false).setUser(user);
        //       Navigator.pushReplacementNamed(context, '/dashboard');
        //     } else {
        //       Flushbar(
        //         title: "Failed Login",
        //         message: response['message']['message'].toString(),
        //         duration: Duration(seconds: 3),
        //       ).show(context);
        //     }
        //   });
        // } else {
        //   print("form is invalid");
        // }
      }
    };

    return SafeArea(
      child: Scaffold(
        backgroundColor: Design.backgroundPrimary,
        body: Container(
          padding: EdgeInsets.all(40.0),
          child: Form(
            key: formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                SizedBox(height: 45.0),
                usernameField,
                SizedBox(height: 30.0),
                passwordField,
                SizedBox(height: 30.0),
                longButtons("Login", doLogin),
                SizedBox(height: 5.0),
              ],
            ),
          ),
        ),
      ),
    );
  }

  MaterialButton longButtons(String title, Function fun,
      {Color color: const Color(0xfff063057), Color textColor: Colors.white}) {
    return MaterialButton(
      onPressed: fun,
      textColor: textColor,
      color: color,
      child: SizedBox(
        width: double.infinity,
        child: Text(
          title,
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 16.0
          ),
        ),
      ),
      height: 45,
      minWidth: 600,
      shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(10))),
    );
  }

  InputDecoration buildInputDecoration(String hintText, IconData icon) {
    return InputDecoration(
      prefixIcon: Icon(icon, color: Design.accentSecondary),
      hintText: hintText,
      hintStyle: TextStyle(
        color: Design.textPrimary,
      ),
      contentPadding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
      enabledBorder: enabledCustomBorder(),
      focusedBorder: focusedCustomBorder(),
    );
  }

  OutlineInputBorder enabledCustomBorder() {
    return OutlineInputBorder(
      borderRadius: BorderRadius.circular(Design.radiusMedium),
      borderSide: BorderSide(
        color: Design.accentPrimary,
        width: 1.5,
      ),
    );
  }

  OutlineInputBorder focusedCustomBorder() {
    return OutlineInputBorder(
      borderRadius: BorderRadius.circular(Design.radiusMedium),
      borderSide: BorderSide(
        color: Design.accentPrimary,
        width: 1.5,
      ),
    );
  }
}