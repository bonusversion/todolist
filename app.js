const { response } = require("express");
const express = require("express");
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

var items = ["Buy food", "Cook Food", "Eat Food"];

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

    res.render("list", { kindOfDay: day, newListItems: items });
});

app.post("/", function(req, res) {
    var item = req.body.newItem;
    if (item.trimStart() !== "") { items.push(item); }
    // items.push(item);
    res.redirect('/');
});

app.listen(3000, function() {
    console.log("Sever started on port 3000");
});