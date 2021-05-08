import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:restaurant_management/Screens/Homepage.dart';
import 'package:restaurant_management/Services/AuthStorage.dart';
import 'package:restaurant_management/Services/FromServer.dart';
import 'package:restaurant_management/Values/Design.dart';

class Login extends StatefulWidget {
  @override
  _LoginState createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final formKey = new GlobalKey<FormState>();

  String _email, _password;
  bool _passwordVisible = false;
  bool _isLoginAttemptActive = false;

  @override
  Widget build(BuildContext context) {

    final usernameField = TextFormField(
      autofocus: false,
      // validator: validateEmail,
      validator: (value) => value.isEmpty ? "Please enter your email" : null,
      onSaved: (value) => _email = value,
      style: TextStyle(color: Design.textPrimary),
      decoration: buildEmailInputDecoration("Email", Icons.email),
    );

    final passwordField = TextFormField(
      autofocus: false,
      obscureText: !_passwordVisible,
      style: TextStyle(color: Design.textPrimary),
      validator: (value) => value.isEmpty ? "Please enter your password" : null,
      onSaved: (value) => _password = value,
      decoration: buildPasswordInputDecoration("Password", Icons.lock),
    );

    var loading = Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        CircularProgressIndicator(),
        Text(" Authenticating ... Please wait")
      ],
    );

    var doLogin = () async {
      final form = formKey.currentState;
      setState(() {
        _isLoginAttemptActive = true;
      });

      if (form.validate()) {
        form.save();

        dynamic response = await FromServer.attemptLogin(_email, _password);
        setState(() {
          _isLoginAttemptActive = false;
        });

        AuthStorage.saveAuthDetails(response.body);

        if(response.statusCode == 200){
          Navigator.pushReplacement(context,
              MaterialPageRoute(
                  builder: (context) => Homepage()));
        }

        print(response.body.toString());
      }
    };

    return SafeArea(
      child: Scaffold(
        backgroundColor: Design.backgroundPrimary,
        body: Container(
          padding: EdgeInsets.all(40.0),
          child: Form(
            key: formKey,
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  SizedBox(height: 45.0),
                  _titleText(),
                  SizedBox(height: 84.0),
                  usernameField,
                  SizedBox(height: 30.0),
                  passwordField,
                  SizedBox(height: 30.0),
                  _isLoginAttemptActive ? Center(child: loading) : loginButton("Login", doLogin),
                  SizedBox(height: 5.0),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  MaterialButton loginButton(String title, Function fun,
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
            fontSize: 16.0,
            color: Design.textPrimary,
          ),
        ),
      ),
      height: 45,
      minWidth: 600,
      shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(10))),
    );
  }

  InputDecoration buildEmailInputDecoration(String hintText, IconData icon) {
    return InputDecoration(
      prefixIcon: Icon(icon, color: Design.accentSecondary),
      hintText: hintText,
      hintStyle: TextStyle(
        color: Design.textPrimary,
      ),
      contentPadding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
      enabledBorder: enabledCustomBorder(),
      focusedBorder: focusedCustomBorder(),
      errorBorder: enabledCustomBorder(),
      focusedErrorBorder: focusedCustomBorder(),
    );
  }

  Widget _titleText(){
    return Column(
      children: [
        Text(
          'Welcome',
          style: TextStyle(
            color: Design.accentPrimary,
            fontSize: 32.0,
          ),
        ),
        // SizedBox(height: 10.0,),
        Divider(height: 10.0, thickness: 2.0, color: Design.accentTertiaryBright, indent: 25.0, endIndent: 25.0,),
      ],
    );
  }

  InputDecoration buildPasswordInputDecoration(String hintText, IconData icon) {
    return InputDecoration(
      prefixIcon: Icon(icon, color: Design.accentSecondary),
      hintText: hintText,
      hintStyle: TextStyle(
        color: Design.textPrimary,
      ),
      suffixIcon: IconButton(
        icon: Icon(
          // Based on passwordVisible state choose the icon
          _passwordVisible
              ? Icons.visibility
              : Icons.visibility_off,
          color: Theme.of(context).primaryColorDark,
          size: 24.0,
        ),
        onPressed: () {
          // Update the state i.e. toggle the state of passwordVisible variable
          setState(() {
            _passwordVisible = !_passwordVisible;
          });
        },
      ),
      contentPadding: EdgeInsets.fromLTRB(20.0, 15.0, 20.0, 15.0),
      enabledBorder: enabledCustomBorder(),
      focusedBorder: focusedCustomBorder(),
      errorBorder: enabledCustomBorder(),
      focusedErrorBorder: focusedCustomBorder(),
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