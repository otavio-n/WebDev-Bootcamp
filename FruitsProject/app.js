// getting-started.js

const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/fruitsDB", {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("It's working!");
});

const fruitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 10
    },
    review: String
});

const Fruit = mongoose.model("Fruit", fruitSchema);

const apple = new Fruit({
    name: "Apple",
    rating: 7,
    review: "Pretty good"
});

// apple.save();


const personSchema = new mongoose.Schema({
    name: String,
    age: Number,
    favoriteFruit: fruitSchema
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
    name: "John",
    age: 37,
    favoriteFruit: apple
});

person.save();


const kiwi = new Fruit({
    name: "Kiwi",
    rating: 7,
    review: "Best fruit."
});
const orange = new Fruit({
    name: "Orange",
    rating: 4,
    review: "Too sour."
});
const banana = new Fruit({
    name: "Banna",
    rating: 3,
    review: "Weird texture."
});

Fruit.updateOne({_id: "5fd219ced070b4346410b544"}, {favoriteFruit: kiwi}, function(err){
    if(err){
        console.log(err);
    } else {
        console.log("Succesfully updated.");
    }
});

Fruit.find(function(err, fruits){
    if(err){
        console.log(err);
    } else {

        mongoose.connection.close();

        fruits.forEach(function(element){
            console.log(element.name);
        });
    }
});