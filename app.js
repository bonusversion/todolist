const { response } = require("express");
const express = require("express");
const date = require(__dirname + "/date.js");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

// console.log(date);

const items = ["Buy food", "Cook Food", "Eat Food"];
const workItems = [];

app.get("/", function(req, res) {
    // var currentDay = today.getDay();
    const day = date.getDate();

    res.render("list", { listTitle: day, newListItems: items });
});

app.post("/", function(req, res) {
    //  console.log(req.body);
    const item = req.body.newItem;

    if (req.body.list === "Work") {
        if (item.trimStart() !== "") { workItems.push(item); }
        res.redirect('/work');
    } else {
        if (item.trimStart() !== "") { items.push(item); }
        res.redirect('/');
    }

    // items.push(item);

});

app.get("/work", function(req, res) {
    res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function(req, res) {
    res.render("about");
})



app.listen(3000, function() {
    console.log("Sever started on port 3000");
});