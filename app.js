const { response } = require("express");
const express = require("express");
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

var items = ["Buy food", "Cook Food", "Eat Food"];
var workItems = [];

app.get("/", function(req, res) {
    var today = new Date();
    var currentDay = today.getDay();
    var day = "";

    options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    }

    day = today.toLocaleDateString("en-CN", options);

    res.render("list", { listTitle: day, newListItems: items });
});

app.post("/", function(req, res) {
    //  console.log(req.body);
    var item = req.body.newItem;

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



app.listen(3000, function() {
    console.log("Sever started on port 3000");
});