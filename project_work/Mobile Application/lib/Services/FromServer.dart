import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:restaurant_management/Objects/Dish.dart';
import 'package:restaurant_management/Services/AuthStorage.dart';

class FromServer {

  static Future<List<Dish>> getDishes() async {

    Map payload = {
      'restaurant_id': await AuthStorage.getResId(),
      'token': await AuthStorage.getJWT(),
      'email_id': '1waiter@res.com'
    };
    String body = json.encode(payload);
    final response = await http.post('https://restaurant-automation-sen.herokuapp.com/waiter/viewmenu',
        headers: {"Content-Type": "application/json"}, body: body);

    print(response.body);

    var data = json.decode(response.body);
    var rest = data['dishes'] as List;

    List<Dish> dishes = List<Dish>();
    for(final dish in rest){
      dishes.add(Dish.fromJSONobject(dish));
    }
    return dishes;
  }

  static dynamic attemptLogin(email, password) async {
    Map payload = {
      'email_id': email,
      'password': password,
    };
    String body = json.encode(payload);
    final response = await http.post('https://restaurant-automation-sen.herokuapp.com/waiter/login',
        headers: {"Content-Type": "application/json"}, body: body);
    return response;
  }

}