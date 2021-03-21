class Dish {

  int _id;
  String _name;
  String _description;
  double _price;
  double _quantity = 0;
  bool _isJainAvailable;
  bool _isAvailable;

  Dish(String name, String description, double price, bool isAvailable, bool isJainAvailable)
      : _name = name,
        _description = description,
        _price = price,
        _isAvailable = isAvailable,
        _isJainAvailable = isJainAvailable;

  int get id => _id;

  String get name => _name;

  String get description => _description;

  double get price => _price;

  double get quantity => _quantity;

  set quantity(double value) {
    _quantity = value;
  }

  bool get isJainAvailable => _isJainAvailable;

  bool get isAvailable => _isAvailable;
}
