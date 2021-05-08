import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../Services/FromServer.dart';
import '../Values/Design.dart';

class TakeFeedback extends StatefulWidget {
  @override
  _TakeFeedbackState createState() => _TakeFeedbackState();
}

class _TakeFeedbackState extends State<TakeFeedback> {

  List<dynamic> questions = [];
  List<int> scores = [];

  @override
  void initState() {
    getFeedbackForm();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {

    return SafeArea(
      child: Scaffold(
        appBar: AppBar(
          title: Text('Feedback',
            style: TextStyle(
              fontSize: 24.0,
            ),
          ),
          backgroundColor: Design.accentSecondary,
        ),
        backgroundColor: Design.backgroundPrimary,
        bottomNavigationBar: _sendFeedbackButton(),
        body: Container(
          padding: EdgeInsets.symmetric(horizontal: 20.0, vertical: 15.0),
          child: SingleChildScrollView(
            child: _feedbackListView(),
          ),
        ),
      ),
    );
  }

  void getFeedbackForm() async {
    questions = await FromServer.getFeedbackForm();

    for(int i = 0; i < questions.length; i++){
      scores.add(0);
    }

    setState(() {
      print(questions);
    });
  }

  Widget _feedbackListView(){
    return ListView.separated(
      itemCount: questions.length,
      shrinkWrap: true,
      separatorBuilder: (BuildContext context, int index) {
        return SizedBox(height: 15.0,);
      },
      itemBuilder: (BuildContext context, int index) {
        return Column(
          mainAxisAlignment: MainAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Align(
              alignment: Alignment.centerLeft,
              child: Text(questions[index]['question'].toString(),
                style: TextStyle(
                  color: Design.textPrimary,
                  fontSize: 21.0,
                ),
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                _scoreField(index, 1),
                SizedBox(width: 4,),
                _scoreField(index, 2),
                SizedBox(width: 4,),
                _scoreField(index, 3),
                SizedBox(width: 4,),
                _scoreField(index, 4),
                SizedBox(width: 4,),
                _scoreField(index, 5),
              ],
            ),
          ],
        );
      },
    );
  }

  Widget _scoreField(int indexOfQues, int scorePos){
    return Row(
      children: [
        Text(
          scorePos.toString(),
          style: TextStyle(
            color: Design.accentPrimary,
            fontSize: 18.0,
          ),
        ),
        Theme(
          data: ThemeData(unselectedWidgetColor: Design.accentSecondary),
          child: Checkbox(
            tristate: false,
            value: scores[indexOfQues] == scorePos ? true : false,
            activeColor: Design.accentSecondary,
            onChanged: (value){
              setState(() {
                scores[indexOfQues] = scorePos;
              });
            },
          ),
        ),
      ],
    );
  }

  Widget _sendFeedbackButton(){
    return Container(
      width: MediaQuery.of(context).size.width,
      color: Design.backgroundPrimary,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 6.0),
        decoration: BoxDecoration(
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
            'SEND FEEDBACK',
          ),
          onPressed: () async {
          },
        ),
      ),
    );
  }

}
