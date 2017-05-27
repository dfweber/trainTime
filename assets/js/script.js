// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAL8mt9GKyurCTvLmMs-ONNv0qGW7YuPJg",
    authDomain: "train-time-7d3dd.firebaseapp.com",
    databaseURL: "https://train-time-7d3dd.firebaseio.com",
    projectId: "train-time-7d3dd",
    storageBucket: "train-time-7d3dd.appspot.com",
    messagingSenderId: "1090974728992"
  };
  firebase.initializeApp(config);


  var database = firebase.database();


  //define variables
  var trainName = "";
  var destination = "";
  var firstTrainTime = "";
  var frequency = 0;

  //create on click train submit function
  $("#submitBtn").on("click", function(event) {
    //assing each input value to a variable
  	trainName = $("#nameInput").val().trim();
  	destination = $("#destinationInput").val().trim();
  	firstTrainTime = $("#firstTrainTime").val().trim();
  	frequency = $("#frequencyInput").val().trim();

    //push values to firebase
  	database.ref().push({
  		trainName: trainName,
  		destination: destination,
  		firstTrainTime: firstTrainTime,
  		frequency: frequency
  	});
  });


//create snapshot function to pull values from firebase
database.ref().on("child_added", function(snapshot) {


	console.log(snapshot.val());

  //pull values from firebase and assign to variable
	var snapName = snapshot.val().trainName;
	var snapDestination = snapshot.val().destination;
	var snapFirstTime = snapshot.val().firstTrainTime;
	var snapFrequency = snapshot.val().frequency;

	console.log(snapName);
	console.log(snapDestination);

  //calculate time difference and assign to variable
  var timeDifference = moment().diff(moment.unix(snapFirstTime), "minutes");
  //calculate remainder time and assign to variable
  var timeRemainder = moment().diff(moment.unix(snapFirstTime), "minutes") % snapFrequency;

  //calculate times away
  var minutesAway = snapFrequency - timeRemainder;

  //calculate next arrival
  var nextArrival = moment().add(minutesAway, "m").format("hh:mm A");

  //push information to DOM, create tr and td
  $("#trainSchedule").append(
    "<tr id='removeTest'><td>" + snapName + 
    "</td><td>" + snapDestination + 
    "</td><td>" + snapFrequency + 
    "</td><td>" + nextArrival + 
    "</td><td>" + minutesAway + 
    "</td><td>" + "<button class='btn btn-primary' id='removeBtn'>Remove</button>" + 
    "</td></tr>");



}, function(errorObject) {
	console.log("The read failed: " + errorObject.code);
});


//Remove button **NOT FULLY WORKING WITH FireBase
$("body").on("click", "#removeBtn", function(){
     $(this).closest ('tr').remove();
});


var timeDisplay = function() {
  $("#currentTime").html(moment().format("MMMM D, YYYY H:mm:ss"));
}

setInterval(timeDisplay, 1000);