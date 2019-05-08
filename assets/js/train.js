var firebaseConfig = {
    apiKey: "AIzaSyBHjPzxfSjcsk1WOA1t9rXx1hj902wkB-w",
    authDomain: "train-6d9c0.firebaseapp.com",
    databaseURL: "https://train-6d9c0.firebaseio.com",
    projectId: "train-6d9c0",
    storageBucket: "train-6d9c0.appspot.com",
    messagingSenderId: "1060692871277",
    appId: "1:1060692871277:web:0f4ceb8a06b5a0c6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// A variable to reference the database.
var database = firebase.database();

// Variables for the onClick event
var name = "";
var destination = "";
var firstTrain = "";
var frequency = 0;

$("#add-train").on("click", function () {
    event.preventDefault();
    // Storing and retreiving new train data
    name = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstTrain = $("#first-train").val().trim();
    frequency = $("#frequency").val().trim();

    // Pushing to database
    database.ref().push({
        name: name,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    $("form")[0].reset();
});

database.ref().on("child_added", function (childSnapshot) {
    var nextArr;
    var minAway;
    // Chang year so first train comes before now
    var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
    // Difference between the current and firstTrain
    var diffTime = moment().diff(moment(firstTrainNew), "minutes");
    var remainder = diffTime % childSnapshot.val().frequency;
    // Minutes until next train
    var minAway = childSnapshot.val().frequency - remainder;
    // Next train time
    var nextTrain = moment().add(minAway, "minutes");
    nextTrain = moment(nextTrain).format("hh:mm");

    $("#add-row").append("<tr><td>" + childSnapshot.val().name +
        "</td><td>" + childSnapshot.val().destination +
        "</td><td>" + childSnapshot.val().frequency +
        "</td><td>" + nextTrain +
        "</td><td>" + minAway + "</td></tr>");

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});


// });




