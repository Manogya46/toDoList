const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://admin-manogya:1234@todolist.nzmsx.mongodb.net/todoListDB", { useNewUrlParser: true });

const itemSchema = {
  name: String
};

const Item = mongoose.model("Item" , itemSchema);

const item1 = new Item({
  name: "Welcome to our todoList!"
});

const item2 = new Item({
  name: "Hit the + button to add a new element"
});

const item3 = new Item({
  name: "<-- Hit this to delte an item"
});

const defaultItems = [item1 , item2 , item3];



app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){

  var today = new Date();
  var options = {
    weekday:"long",
    day :"numeric",
    month : "long",
    year : "numeric"
  };

  var day = today.toLocaleDateString("en-US",options);

  Item.find({},function(err,foundItems){

    if(foundItems.length===0){
      Item.insertMany(defaultItems , function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("Successfull");
        }
        res.redirect("/");
      })
    }
    else{
      res.render('lists',{kindOfDay: day , newItems : foundItems});
    }
  })
});

app.post("/delete",function(req,res){
  const checkedItemID = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemID , function(err){
    console.log(err);
  });
  res.redirect("/");
})

app.post("/",function(req,res){
  const itemName = req.body.Task1;
  const item = new Item({
    name:itemName
  });
  item.save();
  res.redirect("/");
})


app.listen(process.env.PORT || 3000,function(){
  console.log("Server is starting at port 3000");
});
