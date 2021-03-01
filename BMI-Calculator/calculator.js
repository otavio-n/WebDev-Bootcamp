const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/bmiCalculator.html");
});

app.post("/", function(req, res){
    var ht = Number(req.body.height);
    var wt = Number(req.body.weight);

    var result = wt/(ht*ht);

    res.send("Your BMI is " + result);
});

app.listen(3000, function(){
    console.log("Server started on port 3000.");
});