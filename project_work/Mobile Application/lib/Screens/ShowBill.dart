import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../Services/FromServer.dart';
import '../Values/Design.dart';

class ShowBill extends StatefulWidget {

  final int _tableNo;

  ShowBill(this._tableNo);

  @override
  _ShowBillState createState() => _ShowBillState();
}

class _ShowBillState extends State<ShowBill> {

  List<dynamic> _dishes = [];
  int _grandTotal = 0;

  @override
  void initState() {
    getBill();
    super.initState();
  }

  void getBill() async {
    var response = await FromServer.generateBill(widget._tableNo);
    var data = json.decode(response.body);
    _dishes = data['ans'] as List;
    _grandTotal = data['grand_total'];
    print(_grandTotal.toString());
    setState(() {

    });
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Design.backgroundPrimary,
        title: Text(
          'Your Bill',
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
              _billItemsListView(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _billItemsListView(){
    return ListView.separated(
      itemCount: _dishes.length,
      shrinkWrap: true,
      separatorBuilder: (BuildContext context, int index) {
        return SizedBox(height: 15.0,);
      },
      itemBuilder: (BuildContext context, int index) {
        return _dishItem(index);
      },
    );
  }

  Widget _dishItem(int index){

    return ListTile(
      title: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: [
              Text(
                _dishes[index]['dish_name'],
                style: TextStyle(
                  color: Design.textPrimary,
                  fontSize: Design.textLarge,
                ),
              ),
            ],
          ),
          SizedBox(height: 5.0,),
          Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Text(
                'QTY = ' + _dishes[index]['dish_qty'].toString(),
                style: TextStyle(
                  fontSize: Design.textMedium,
                  color: Design.textPrimary,
                ),
              ),
              SizedBox(width: 10.0,),
            ],
          ),
        ],
      ),
      trailing: Text(
        (double.tryParse(_dishes[index]['dish_qty'].toString())*double.tryParse(_dishes[index]['dish_price'].toString())).toString(),
        style: TextStyle(
          color: Design.textPrimary,
          fontSize: 16.0,
        ),
      ),
    );
  }


  void _closeConfirmOrder(){

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
        Text(
          'Grand Total = ' + _grandTotal.toString(),
          style: TextStyle(
            color: Design.textPrimary,
            fontSize: 21.0,
          ),
        ),
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
                'MARK AS PAID',
              ),
              onPressed: () async {
                showDialog<void>(
                    context: context,
                    builder: (context){
                      return StatefulBuilder(
                        builder: (context, setStateOfQtySelectorPopup){
                          _closeConfirmOrder();
                          return AlertDialog(
                            contentPadding: EdgeInsets.zero,
                            content: Container(
                              color: Design.backgroundPrimary,
                              width: MediaQuery.of(context).size.width * 0.7,
                              height: 100.0,
                              padding: EdgeInsets.all(20),
                              child: Align(
                                  alignment: Alignment.center,
                                  child: Text(
                                    'Placed Successfully!',
                                    style: TextStyle(
                                      color: Design.accentPrimary,
                                      fontSize: 21.0,
                                    ),
                                  )
                              ),
                            ),
                          );
                        },
                      );
                    }
                );
              },
            ),
          ),
        ),
      ],
    );
  }
}
