const express = require("express");
const app = express();
const morgan = require("morgan");

let topFilms = [
  { title: "Past Lives", year: "2023" },
  { title: "Everything Everywhere All at Once", year: "2022" },
  { title: "Groundhog Day", year: "1993" },
  { title: "Lost In Translation", year: "2003" },
  { title: "Rear Window", year: "1954" },
  { title: "The Big Lebowski", year: "1998" },
  { title: "Casablanca", year: "1942" },
  { title: "Anatomy of a Fall", year: "2023" },
  { title: "Fargo", year: "1996" },
  { title: "Sunset Blvd.", year: "1950" },
];

app.use(morgan("combined"));

app.get("/", (req, res) => {
  res.send("Welcome to my App");
});

app.use(express.static("public"));

app.get("/movies", (req, res) => {
  res.json(topFilms);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
