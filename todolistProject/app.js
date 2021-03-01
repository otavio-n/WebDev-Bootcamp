//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-otavio:73test41@cluster0.uurvb.mongodb.net/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema); 

const item1 = new Item({
    name: "Wash your hands!"
});
const item2 = new Item({
    name: "Use a mask."
});
const item3 = new Item({
  name: "Stay safe."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {

  Item.find(function(err,foundItems){
    if(foundItems.length === 0){
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        } else {
          console.log("Succesfully inserted items.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  });  

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if(listName === "Today"){
    item.save(function(err){
      if(!err){
        res.redirect("/");
      }
    });
  } else {
    List.findOne({name: listName}, function(err, foundList){
      if(!err){
        foundList.items.push(item);
        foundList.save(function(err){
          if(!err){
            res.redirect("/"+listName);
          }
        });
      }
    });
  }
  

});

app.post("/delete", function(req, res){

  const listName = req.body.listName;
  const checkedboxId = req.body.checked;

  if(listName === "Today"){
    Item.deleteOne({_id: checkedboxId}, function(err){
      if(err){
        console.log(err);
      } else {
        res.redirect("/");
        console.log("Succesfully deleted item.");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedboxId}}}, function(err, foundList){
      if(!err){
        res.redirect("/"+listName);
      }
    });
  }

  
});

app.get("/:customList", function(req,res){
  const customListName = _.capitalize(req.params.customList);

  List.findOne({name: customListName}, function(err, result){
    if(!err){
      if(!result){
        console.log("This list does not exist. List " + customListName + " saved.");

        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save(function(err){
          if(!err){
            res.redirect("/" + customListName);
          }
        });

      } else {
        res.render("list", {listTitle: result.name, newListItems: result.items});
      }
    }  
  });

});

app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully.");
});
