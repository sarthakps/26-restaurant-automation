import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:restaurant_management/Objects/Dish.dart';
import 'package:restaurant_management/Services/AuthStorage.dart';

import '../Objects/Dish.dart';

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

  static void placeOrder(List<Dish> dishes, int tableNo, int noOfOccupants) async {
    Map payload = Map();
    payload['email_id'] = await AuthStorage.getEmail();
    payload['token'] = await AuthStorage.getJWT();
    print(payload['token']);
    payload['restaurant_id'] = await AuthStorage.getResId();
    payload['table_no'] = tableNo;
    payload['no_of_occupants'] = noOfOccupants;

    List<int> id = [];
    List<double> qty = [];
    List<bool> isJainWanted = [];
    for(Dish dish in dishes){
      id.add(dish.id);
      qty.add(dish.quantity);
      isJainWanted.add(dish.isJainWanted);
    }

    payload['dish_id'] = id;
    payload['dish_qty'] = qty;
    payload['is_jain_wanted'] = isJainWanted;

    String body = json.encode(payload);
    final response = await http.post('https://restaurant-automation-sen.herokuapp.com/waiter/insert_order',
        headers: {"Content-Type": "application/json"}, body: body);
    print(response.body);
  }

}