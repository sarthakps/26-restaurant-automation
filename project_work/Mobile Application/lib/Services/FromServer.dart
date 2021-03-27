import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:restaurant_management/Objects/Dish.dart';

class FromServer {

  static Future<List<Dish>> getDishes() async {

    final response = await http.get('http://192.168.1.17:5000/restaurantmanager/viewmenu');

    var data = json.decode(response.body);
    var rest = data['dishes'] as List;

    List<Dish> dishes = List<Dish>();
    for(final dish in rest){
      dishes.add(Dish.fromJSONobject(dish));
    }
    return dishes;
  }

}