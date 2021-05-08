import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:mdi/mdi.dart';
import 'package:restaurant_management/Objects/Dish.dart';
import 'package:restaurant_management/Values/Design.dart';

class ConfirmOrder extends StatefulWidget {

  final List<Dish> _orderedDishes;

  ConfirmOrder(this._orderedDishes);

  @override
  _ConfirmOrderState createState() => _ConfirmOrderState();
}

class _ConfirmOrderState extends State<ConfirmOrder> {

  int _selectedTableNumber = 1;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Design.backgroundPrimary,
        title: Text(
            'Confirm Order',
          style: TextStyle(
            color: Design.accentPrimary,
            fontSize: Design.textLarge,
          ),
        ),
      ),
      backgroundColor: Design.backgroundPrimary,
      bottomNavigationBar: _placeOrderButton(),
      body: SafeArea(
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
    );
  }

  Widget _dishesListView(){
    return ListView.builder(
      itemCount: widget._orderedDishes.length,
      physics: const ScrollPhysics(),
      shrinkWrap: true,
      itemBuilder: (context, index){
        return _dishItem(context, index);
      },
    );
  }

  Widget _dishItem(BuildContext context, int index){

    ValueNotifier<double> priceListenable = ValueNotifier<double>(widget._orderedDishes[index].price * widget._orderedDishes[index].quantity);
    ValueNotifier<bool> isJainWanted = ValueNotifier<bool>(widget._orderedDishes[index].isJainWanted);
    TextEditingController _foodAmountController = TextEditingController();
    _foodAmountController.text = widget._orderedDishes[index].quantity.toString();

    return ListTile(
      title: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: [
              Text(
                widget._orderedDishes[index].name,
                style: TextStyle(
                  color: Design.textPrimary,
                  fontSize: Design.textMedium,
                ),
              ),
            ],
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // IconButton to increase food amount by 0.1
                  InkWell(
                    borderRadius: BorderRadius.circular(24.0),
                    child: Icon(Icons.add_circle_outline_sharp, size: 25.0, color: Design.accentPrimary,),
                    onTap: (){
                      double amt = double.parse(_foodAmountController.text);
                      amt = amt + 1;
                      _foodAmountController.text = amt.toStringAsFixed(1);
                      widget._orderedDishes[index].quantity = amt;
                      priceListenable.value = widget._orderedDishes[index].price * widget._orderedDishes[index].quantity;
                    },
                  ),
                  Container(
                    width: 40.0,
                    child: Align(
                      alignment: Alignment.center,
                      child: TextField(
                        controller: _foodAmountController,
                        keyboardType: TextInputType.number,
                        textAlign: TextAlign.center,
                        decoration: InputDecoration(
                          border: InputBorder.none,
                        ),
                        style: TextStyle(
                          fontSize: Design.textMedium,
                          color: Design.textPrimary,
                        ),
                        onChanged: (data){
                          if (data == ""){
                            _foodAmountController.text = '0';
                          }
                        },
                      ),
                    ),
                  ),
                  InkWell(
                    borderRadius: BorderRadius.circular(24.0),
                    child: Icon(Icons.remove_circle_outline_sharp, size: 25.0, color: Design.accentPrimary,),
                    onTap: (){
                      double amt = double.parse(_foodAmountController.text);
                      amt = amt>0 ? amt - 1 : 0;
                      _foodAmountController.text = amt.toStringAsFixed(1);
                      widget._orderedDishes[index].quantity = amt;
                      priceListenable.value = widget._orderedDishes[index].price * widget._orderedDishes[index].quantity;
                    },
                  ),
                ],
              ),
              SizedBox(width: 10.0,),
              widget._orderedDishes[index].isJainAvailable ?
              Container(
                width: 1.5,
                height: 27.0,
                child: VerticalDivider(
                  thickness: 1.5,
                  color: Design.accentSecondary,
                ),
              ) : SizedBox(width: 0, height: 0,),
              SizedBox(width: 10.0,),
              widget._orderedDishes[index].isJainAvailable ?
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
                    child: ValueListenableBuilder(
                      valueListenable: isJainWanted,
                      builder: (BuildContext context, bool value, Widget child) {
                        return Checkbox(
                          tristate: false,
                          value: isJainWanted.value,
                          activeColor: Design.accentSecondary,
                          onChanged: (value){
                            isJainWanted.value = value;
                          },
                        );
                      },
                    ),
                  ),
                ],
              ) : SizedBox(height: 0, width: 0,),
            ],
          ),
        ],
      ),
      trailing: ValueListenableBuilder(
        valueListenable: priceListenable,
        builder: (BuildContext context, double value, Widget child) {
          return Text(
            priceListenable.value.toString(),
            style: TextStyle(
              color: Design.textPrimary,
              fontSize: Design.textMedium,
            ),
          );
        },
      ),
    );
  }

  Widget _tableNumberListView(){
    return ListView.separated(
      scrollDirection: Axis.horizontal,
      itemCount: 50,
      itemBuilder: (BuildContext context, int index) {
        // return Icon(Icons.clear, size: 24.0, color: Design.accentPrimary,);

        return Container(
          padding: EdgeInsets.symmetric(horizontal: 15.0),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(24.0),
            color: (_selectedTableNumber-1) == index ? Design.accentTertiary : Colors.transparent,
          ),
          child: InkWell(
            child: Center(
              child: Text(
                index.toString(),
                style: TextStyle(
                  color: Design.textPrimary,
                  fontSize: Design.textLarge,
                ),
              ),
            ),
            onTap: (){
              _selectedTableNumber = index + 1;
              setState(() {
              });
            },
          ),
        );
      },
      separatorBuilder: (BuildContext context, int index) {
        return Container(
          width: 13.5,
          padding: EdgeInsets.only(left: 6, right: 6, top: 12.0, bottom: 12.0),
          child: Container(
            width: 1.5,
            color: Design.accentTertiary,
          ),
        );
      },
    );
  }

  Widget _placeOrderButton(){
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Divider(
          color: Design.accentSecondary,
          thickness: 1.5,
          // indent: 12.0,
          // endIndent: 12.0,
        ),
        Container(child: _tableNumberListView(), height: 40.0,),
        // Divider(
        //   color: Design.accentSecondary,
        //   thickness: 1.5,
        //   indent: 12.0,
        //   endIndent: 12.0,
        // ),
        Container(
          width: MediaQuery.of(context).size.width,
          color: Design.backgroundPrimary,
          child: Container(
            height: 52.0,
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
                'CONFIRM ORDER',
              ),
              onPressed: (){},
            ),
          ),
        ),
      ],
    );
  }
}
