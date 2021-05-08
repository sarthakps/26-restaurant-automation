import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class AuthStorage{

  static saveAuthDetails(details, email) async {
    var data = json.decode(details);
    SharedPreferences preferences = await SharedPreferences.getInstance();
    preferences.setString('jwt', data['token']);
    preferences.setString('email_id', email);
    preferences.setInt('user_id', data['user_id']);
    preferences.setInt('restaurant_id', data['restaurant_id']);
    preferences.setString('username', data['user_name']);
  }

  static Future<int> getResId() async {
    SharedPreferences preferences = await SharedPreferences.getInstance();
    return preferences.getInt('restaurant_id');
  }

  static Future<String> getJWT() async {
    SharedPreferences preferences = await SharedPreferences.getInstance();
    return preferences.getString('jwt');
  }

  static Future<String> getEmail() async {
    SharedPreferences preferences = await SharedPreferences.getInstance();
    return preferences.getString('email_id');
  }

}