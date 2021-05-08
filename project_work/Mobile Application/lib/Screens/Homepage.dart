import 'dart:async';
import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:mdi/mdi.dart';
import 'package:restaurant_management/Objects/Dish.dart';
import 'package:restaurant_management/Screens/ConfirmOrder.dart';
import 'package:restaurant_management/Services/FromServer.dart';
import 'package:restaurant_management/Values/Design.dart';

class Homepage extends StatefulWidget {

  List<Dish> _retrievedDishes;

  Homepage(this._retrievedDishes);

  @override
  _HomepageState createState() => _HomepageState();
}

class Debouncer {
  final int milliseconds;
  VoidCallback action;
  Timer _timer;

  Debouncer({this.milliseconds});

  run(VoidCallback action) {
    if (null != _timer) {
      _timer.cancel();
    }
    _timer = Timer(Duration(milliseconds: milliseconds), action);
  }
}

class _HomepageState extends State<Homepage> {

  TextEditingController _filter = TextEditingController();
  TextEditingController _foodAmountController = TextEditingController();
  final FocusNode _searchFocusNode = FocusNode();
  ValueNotifier<bool> searchFocus = ValueNotifier<bool>(false);
  bool isJainWanted = false;

  List<Dish> _dishesList = List<Dish>();
  List<Dish> _filteredDishesList = List<Dish>();

  final _debouncer = Debouncer(milliseconds: 500);

  @override
  void initState() {
    _searchFocusNode.addListener(() {
      print('has focus: ' + _searchFocusNode.hasFocus.toString());
      searchFocus = ValueNotifier<bool>(_searchFocusNode.hasFocus);
    });

    _retrieveMenuFromServer();
    _foodAmountController.text = '0';

    super.initState();
  }

  Future<void> _retrieveMenuFromServer() async {
    if(widget._retrievedDishes.length == 0){
      _dishesList = await FromServer.getDishes();
      widget._retrievedDishes = _dishesList;
      setState(() {
        _filteredDishesList = _dishesList;
      });
      print('Dishes not fetched!');
    } else {
      _dishesList = widget._retrievedDishes;
      setState(() {
        _filteredDishesList = _dishesList;
      });
      print('Dishes already fetched!');
    }
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      backgroundColor: Design.backgroundPrimary,
      bottomNavigationBar: _placeOrderButton(),
      appBar: AppBar(
        title: _searchBar(),
        backgroundColor: Colors.transparent,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(8.0, 4.0, 8.0, 0.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _dishesListView(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _filterDishes() async {

    String query = _filter.text.toLowerCase().trim();
    if (query.isNotEmpty){

      List<Dish> tempList = new List<Dish>();
      for (int i = 0; i < _dishesList.length; i++) {
        if (_dishesList[i].name.toLowerCase().trim().contains(query)) {
          tempList.add(_dishesList[i]);
        }
      }
      _filteredDishesList = tempList;
    } else {
      _filteredDishesList = _dishesList;
    }
    setState(() {});
  }

  Widget _dishesListView(){
    return ListView.builder(
      itemCount: _filteredDishesList.length,
      physics: const ScrollPhysics(),
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
      onChanged: (query){
        _debouncer.run(() {
          _filterDishes();
        });
      },
      focusNode: _searchFocusNode,
      style: const TextStyle(
        color: Design.textPrimary,
        fontSize: Design.textMedium,
      ),
      decoration: InputDecoration(
        contentPadding: const EdgeInsets.symmetric(horizontal: 5.0, vertical: 6.0),
        hintText: 'Search dishes...',
        hintStyle: const TextStyle(color: Design.textPrimary),
        prefixIcon: Icon(Icons.search, size: 30.0, color: Design.accentPrimary,),
        // suffixIcon: _searchFocusNode.hasFocus ? Icon(Icons.clear, size: 24.0, color: Design.accentTertiaryBright,) : null,
        suffixIcon: ValueListenableBuilder(
          valueListenable: searchFocus,
          builder: (context, isFocused, child){
            if(isFocused){
              return InkWell(
                borderRadius: BorderRadius.circular(24.0),
                child: Icon(Icons.clear, size: 24.0, color: Design.accentTertiaryBright),
                onTap: (){
                  print('x pressed');
                  _filter.text = '';
                  _searchFocusNode.unfocus();
                },
              );
            }
            return SizedBox(height: 0, width: 0,);
          },
        ),
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
        padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 6.0),
        decoration: BoxDecoration(
          // color: Design.accentSecondary,
          borderRadius: const BorderRadius.vertical(
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
          onPressed: () async {

            List<Dish> orderedDishes = List<Dish>();
            _dishesList.forEach((dish) {
              if(dish.quantity > 0){
                orderedDishes.add(dish);
              }
            });

            Navigator.push(context,
                MaterialPageRoute(
                    builder: (context) => ConfirmOrder(orderedDishes, widget._retrievedDishes)));
          },
        ),
      ),
    );
  }

  Future<void> _showQtySelectorDialog(int index){
    return showDialog<void>(
      context: context,
      builder: (context){
        isJainWanted = _filteredDishesList[index].isJainWanted;
        _foodAmountController.text = _filteredDishesList[index].quantity.toString();
        print(_dishesList[index].isJainAvailable);
        print(_dishesList[index].isAvailable);
        return StatefulBuilder(
          builder: (context, setStateOfQtySelectorPopup){
            return AlertDialog(
              contentPadding: EdgeInsets.zero,
              content: Container(
                color: Design.backgroundPrimary,
                width: MediaQuery.of(context).size.width * 0.7,
                padding: EdgeInsets.zero,
                child: _test(index, setStateOfQtySelectorPopup),
              ),
            );
          },
        );
      }
    );
  }

  Widget _test(int index, Function setStateOfQtySelectorPopup){

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(8.0, 8.0, 6.0, 0.0),
          child: Text(
            'About the dish',
            style: const TextStyle(
              color: Design.textPrimaryBright,
              fontSize: Design.textMedium,
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 5.0, horizontal: 10.0),
          child: Text(
            _filteredDishesList[index].description,
            style: const TextStyle(
              color: Design.textPrimary,
              fontSize: Design.textSmall,
            ),
            textAlign: TextAlign.justify,
          ),
        ),
        SizedBox(height: 16.0,),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // IconButton to increase food amount by 0.1
            IconButton(
              icon: Icon(Icons.add_circle_outline_sharp, size: 30.0, color: Design.accentPrimary,),
              onPressed: (){
                double amt = double.parse(_foodAmountController.text);
                amt = amt + 1;
                _foodAmountController.text = amt.toStringAsFixed(1);
                setStateOfQtySelectorPopup(() {
                  print('amt = ' + _foodAmountController.text);
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
                decoration: InputDecoration(
                  border: InputBorder.none,
                ),
                style: TextStyle(
                  fontSize: Design.textLarge,
                  color: Design.textPrimary,
                ),
                onChanged: (data){
                  if (data == ""){
                    _foodAmountController.text = '0';
                  }
                },
              ),
            ),
            // IconButton to decrease food amount by 0.1
            IconButton(
              icon: Icon(Icons.remove_circle_outline_sharp, size: 30.0, color: Design.accentPrimary,),
              onPressed: (){
                double amt = double.parse(_foodAmountController.text);
                amt = amt>0 ? amt - 1 : 0;
                setStateOfQtySelectorPopup(() {
                  _foodAmountController.text = amt.toStringAsFixed(1);
                });
              },
            ),
          ],
        ),
        SizedBox(height: _filteredDishesList[index].isJainAvailable ? 8.0 : 8.0,),
        _filteredDishesList[index].isJainAvailable ?
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
                'Jain',
              style: TextStyle(
                color: Design.textPrimary,
                fontSize: Design.textMedium,
              ),
            ),
            Theme(
              data: ThemeData(unselectedWidgetColor: Design.accentSecondary),
              child: Checkbox(
                tristate: false,
                value: isJainWanted,
                activeColor: Design.accentSecondary,
                onChanged: (value){
                  isJainWanted = value;
                  print(value);
                  setStateOfQtySelectorPopup((){});
                },
              ),
            ),
          ],
        ) : SizedBox(height: 0, width: 0,),
        // Container(
        //   height: 1.5,
        //   child: Divider(
        //     color: Design.backgroundPrimary,
        //   ),
        // ),
        Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: FlatButton(
                  child: Text('CONFIRM'),
                  textColor: Design.accentPrimary,
                  height: 40.0,
                  materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  onPressed: (){
                    _filteredDishesList[index].quantity = double.tryParse(_foodAmountController.text);
                    _filteredDishesList[index].isJainWanted = isJainWanted;
                    Navigator.pop(context);
                  },
                ),
              ),
              // Container(
              //   height: 40.0,
              //   width: 1.5,
              //   child: VerticalDivider(
              //     color: Design.backgroundPrimary,
              //   ),
              // ),
              Expanded(
                child: FlatButton(
                  child: Text('CANCEL'),
                  textColor: Design.accentTertiaryBright,
                  height: 40.0,
                  materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  onPressed: (){
                    Navigator.pop(context);
                  },
                ),
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
