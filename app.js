const _ = require("lodash");
const express = require("express");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

// mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });
mongoose.connect("mongodb://admin-bonus:199796@cluster0-shard-00-00.gkbnc.mongodb.net:27017,cluster0-shard-00-01.gkbnc.mongodb.net:27017,cluster0-shard-00-02.gkbnc.mongodb.net:27017/todolistDB?ssl=true&replicaSet=atlas-5qtmtj-shard-0&authSource=admin&retryWrites=true&w=majority", { useNewUrlParser: true });

// console.log(date);
const itemsSchema = new mongoose.Schema({
    name: String
})

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});

const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);

const buyFood = new Item({
    name: "Buy Food"
});

const cookFood = new Item({
    name: "Cook Food"
});

const eatFood = new Item({
    name: "Eat Food"
});

const defaultItems = [buyFood, cookFood, eatFood];


// const items = ["Buy food", "Cook Food", "Eat Food"];
// const workItems = [];




app.get("/", function(req, res) {
    // var currentDay = today.getDay();
    const day = date.getDate();

    Item.find({}, function(err, foundItems) {
        if (err) {
            console.log(err);
        } else {
            if (foundItems.length === 0) {
                Item.insertMany(defaultItems, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Successfully saved all the default items to todolistDB");
                    }
                });
                res.redirect("/");
            } else {
                res.render("list", { listTitle: day, newListItems: foundItems });
            }
        }
    })

});

app.post("/", function(req, res) {
    //  console.log(req.body);
    const itemName = req.body.newItem;
    const listName = req.body.list;

    var item = new Item({
        name: itemName
    });

    if (itemName.trimStart() !== "") {
        if (listName === date.getDate()) {
            item.save();
            res.redirect("/");
        } else {
            List.findOne({ name: listName }, function(err, foundList) {
                if (!err) {
                    foundList.items.push(item);
                    foundList.save();
                    //List.updateOne({ name: listName }, { items: foundList.items }, function(err) {});
                    res.redirect("/" + listName);
                }

            });
            //item.save();
        }
    }


});



// if (req.body.list === "Work") {
//     if (item.trimStart() !== "") { workItems.push(item); }
//     res.redirect('/work');
// } else {
//     if (item.trimStart() !== "") { items.push(item); }
//     res.redirect('/');
// }

// items.push(item);



app.post("/delete", function(req, res) {
    //console.log(req.body);
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    if (listName === date.getDate()) {
        Item.findByIdAndRemove(checkedItemId, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Successfully deleted checked item.");
            }
        });
        res.redirect("/");
    } else {
        // itemIndex = List.findOne({ name: checkedListName }).items.filter((item) => item._id !== checkedItemId);
        // console.log(itemIndex);
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function(err, foundList) {
            if (!err) {
                console.log("Successfully deleted checked item.");
                res.redirect("/" + listName);
            }
        });

    }


});

app.get("/:customListName", function(req, res) {
    // console.log(req.params.customListName);
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName }, function(err, foundList) {
        if (!err) {
            if (!foundList) {
                // console.log("doesn't exist.");
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            } else {
                // console.log("exist.");
                //console.log(foundList.items);
                //console.log(customListName);
                res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
            }
        }
    })


});

// app.get("/work", function(req, res) {
//     res.render("list", { listTitle: "Work List", newListItems: workItems });
// });

app.get("/about", function(req, res) {
    res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}

app.listen(port, function() {
    console.log("Sever started on port 3000");
});