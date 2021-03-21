import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:mdi/mdi.dart';
import 'package:restaurant_management/Objects/Dish.dart';
import 'package:restaurant_management/Values/Design.dart';

class Homepage extends StatefulWidget {
  @override
  _HomepageState createState() => _HomepageState();
}

class _HomepageState extends State<Homepage> {

  TextEditingController _filter = TextEditingController();
  TextEditingController _foodAmountController = TextEditingController();


  List<Dish> _dishesList = List<Dish>();
  List<Dish> _filteredDishesList = List<Dish>();

  @override
  void initState() {
    _dishesList.add(Dish('Paneer Tikka Masala', 'abcdefghijk', 145.0, true, false));
    _dishesList.add(Dish('Malai Kofta', 'abcdefghijk', 105.0, true, true));
    _dishesList.add(Dish('Paneer Bhurji', 'abcdefghijk', 160.0, true, false));
    _dishesList.add(Dish('Butter Naan', 'abcdefghijk', 90.0, true, true));
    _dishesList.add(Dish('Paneer Lababdar', 'abcdefghijk', 145.0, true, false));
    _dishesList.add(Dish('Masala Papad', 'abcdefghijk', 105.0, true, true));
    _dishesList.add(Dish('Butter Milk', 'abcdefghijk', 160.0, true, false));
    _dishesList.add(Dish('Fulka Roti', 'abcdefghijk', 90.0, true, true));
    _dishesList.add(Dish('Veg Jaipuri', 'abcdefghijk', 145.0, true, false));
    _dishesList.add(Dish('Lassi', 'abcdefghijk', 105.0, true, true));
    _dishesList.add(Dish('Manchurian', 'abcdefghijk', 160.0, true, false));
    _dishesList.add(Dish('Baked Macaroni', 'abcdefghijk', 90.0, true, true));
    _dishesList.add(Dish('Cheese Sandwich', 'abcdefghijk', 90.0, true, false));

    _filteredDishesList = _dishesList;

    _filter.addListener(_filterDishes);
    _foodAmountController.text = '0';

    super.initState();
  }

  @override
  Widget build(BuildContext context) {

    print(_dishesList);

    return Scaffold(
      backgroundColor: Design.backgroundPrimary,
      bottomSheet: _placeOrderButton(),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _searchBar(),
              _dishesListView(),
            ],
          ),
        ),
      ),
    );
  }

  void _filterDishes(){
    if (!(_filter.text.isEmpty)) {
      List<Dish> tempList = new List<Dish>();
      for (int i = 0; i < _dishesList.length; i++) {
        if (_dishesList[i].name.toLowerCase().trim().contains(_filter.text.toLowerCase().trim())) {
          tempList.add(_dishesList[i]);
        }
      }
      _filteredDishesList = tempList;
    } else {
      _filteredDishesList = _dishesList;
    }
    setState(() {
      print(_filteredDishesList);
    });
  }

  Widget _dishesListView(){
    return ListView.builder(
      itemCount: _filteredDishesList.length,
      shrinkWrap: true,
      itemBuilder: (context, index){
        return _dishItem(context, index);
      },
    );
  }

  Widget _dishItem(BuildContext context, int index){
    return ExpansionTile(
      childrenPadding: EdgeInsets.symmetric(horizontal: 10.0),
      tilePadding: EdgeInsets.symmetric(vertical: 0.0, horizontal: 4.0),
      onExpansionChanged: (isExpanded){
        _showQtySelectorDialog(index);
      },
      title: Row(
        children: [
          Text(
            _filteredDishesList[index].name,
            style: TextStyle(
              color: Design.textPrimary,
              fontSize: Design.textMedium,
            ),
          ),
          SizedBox(width: 4.0,),
          _filteredDishesList[index].isJainAvailable ? Icon(Mdi.alphaJCircleOutline, color: Colors.yellow, size: 20.0,) : Container(height: 0, width: 0,),
        ],
      ),
      trailing: Text(
        _filteredDishesList[index].price.toString(),
        style: TextStyle(
          color: Design.textPrimary,
          fontSize: Design.textMedium,
        ),
      ),
      children: [
      ],
    );
  }

  Widget _searchBar(){
    return TextField(
      controller: _filter,
      style: TextStyle(
        color: Design.textPrimary,
        fontSize: Design.textMedium,
      ),
      decoration: InputDecoration(
        contentPadding: EdgeInsets.symmetric(horizontal: 5.0, vertical: 6.0),
        hintText: 'Search dishes...',
        hintStyle: TextStyle(color: Design.textPrimary),
        prefixIcon: Icon(Icons.search, size: 30.0, color: Design.accentPrimary,),
        enabledBorder: enabledCustomBorder(),
        focusedBorder: focusedCustomBorder(),
      ),
    );
  }

  Widget _placeOrderButton(){
    return Container(
      width: MediaQuery.of(context).size.width,
      color: Design.backgroundPrimary,
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 8.0, vertical: 6.0),
        decoration: BoxDecoration(
          // color: Design.accentSecondary,
          borderRadius: BorderRadius.vertical(
            top: Radius.circular(Design.radiusLarge),
          ),
        ),
        child: FlatButton(
          height: 40.0,
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20.0)
          ),
          color: Design.accentPrimary,
          child: Text(
            'PLACE ORDER',
          ),
          onPressed: (){},
        ),
      ),
    );
  }

  Future<void> _showQtySelectorDialog(int index){
    return showDialog<void>(
      context: context,
      builder: (context){
        return StatefulBuilder(
          builder: (context, setStateOfQtySelectorPopup){
            return AlertDialog(
              contentPadding: EdgeInsets.zero,
              content: Container(
                width: MediaQuery.of(context).size.width * 0.7,
                padding: EdgeInsets.zero,
                child: _test(index),
              ),
            );
          },
        );
      }
    );
  }

  Widget _test(int index){

    double initAmount = _dishesList[index].quantity;
    _foodAmountController.text = initAmount.toString();

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          _filteredDishesList[index].description,
          style: TextStyle(
            color: Design.textPrimary,
            fontSize: Design.textSmall,
          ),
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // IconButton to increase food amount by 0.1
            IconButton(
              icon: Icon(Icons.add_circle_outline_sharp, size: 30.0,),
              onPressed: (){
                double amt = double.parse(_foodAmountController.text);
                amt = amt + 1;
                setState(() {
                  _foodAmountController.text = amt.toStringAsFixed(1);
                });
              },
            ),
            // TextField for food amount
            Container(
              height: 30.0,
              width: MediaQuery.of(context).size.width * 0.3,
              child: TextField(
                controller: _foodAmountController,
                keyboardType: TextInputType.number,
                textAlign: TextAlign.center,
                onChanged: (data){
                  if (data == ""){
                    _foodAmountController.text = '0';
                  }
                },
              ),
            ),
            // IconButton to decrease food amount by 0.1
            IconButton(
              icon: Icon(Icons.remove_circle_outline_sharp, size: 30.0,),
              onPressed: (){
                double amt = double.parse(_foodAmountController.text);
                amt = amt>0 ? amt - 1 : 0;
                setState(() {
                  _foodAmountController.text = amt.toStringAsFixed(1);
                });
              },
            ),
          ],
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            FlatButton(
              child: Text('Confirm'),
              materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
              onPressed: (){
                _dishesList[index].quantity = double.tryParse(_foodAmountController.text);
                Navigator.pop(context);
              },
            ),
            FlatButton(
              child: Text('Cancel'),
              materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
              onPressed: (){
                Navigator.pop(context);
              },
            ),
          ],
        ),
      ],
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
