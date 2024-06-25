const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Movie, User } = require("./models");

app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/myFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Return a list of ALL users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().exec();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
});

// Return a list of ALL films
app.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find().exec();
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
});

// Return data about a single film by title
app.get("/movies/:title", async (req, res) => {
  try {
    const movie = await Movie.findOne({ Title: req.params.title });
    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(400).send("Movie not found");
    }
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
});

// Return data about a genre by name/title
app.get("/movies/genres/:genreName", async (req, res) => {
  try {
    const genre = await Movie.findOne(
      { "Genre.Name": req.params.genreName },
      "Genre"
    );
    if (genre) {
      res.status(200).json(genre.Genre);
    } else {
      res.status(400).send("Genre not found");
    }
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
});

// Return data about a director by name
app.get("/movies/directors/:directorName", async (req, res) => {
  try {
    const directorName = req.params.directorName;
    const movie = await Movie.findOne({ "Director.Name": directorName });

    if (movie) {
      res.status(200).json(movie.Director);
    } else {
      res.status(404).send("Director not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
});

// Allow new user to register
app.post("/users", async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      birthday: req.body.birthday,
    });
    const user = await newUser.save();
    res.status(201).json({
      message: "User added successfully",
      user: user,
    });
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
});

// Allow user to update info
app.put("/users/:name", async (req, res) => {
  try {
    const userName = req.params.name;

    const updatedUser = await User.findOneAndUpdate(
      { name: userName },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          birthday: req.body.birthday,
        },
      },
      { new: true }
    ).exec();

    if (updatedUser) {
      res.status(200).json({
        message: "User info updated successfully",
        user: updatedUser,
      });
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
});

// Allow users to add a film to their list of favorites
app.post("/users/:name/favoriteMovies/:movieId", async (req, res) => {
  try {
    const userName = req.params.name;
    const movieId = req.params.movieId;

    const user = await User.findOne({ name: userName }).exec();
    if (user) {
            if (mongoose.Types.ObjectId.isValid(movieId)) {
        const movie = await Movie.findById(movieId).exec();
        if (movie) {
                  if (user.favoriteMovies.includes(movieId)) {
            res.status(400).send("Movie already exists in favorites");
          } else {
            user.favoriteMovies.push(movieId);
            await user.save();
            res.status(200).send(`${movie.Title} has been added to favorites`);
          }
        } else {
          res.status(404).send("Movie not found");
        }
      } else {
        res.status(400).send("Invalid movie ID");
      }
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
});

// Allow users to remove a film from their list of favorites
app.delete("/users/:name/favoriteMovies/:movieId", async (req, res) => {
  try {
    const userName = req.params.name;
    const movieId = req.params.movieId;

    const user = await User.findOne({ name: userName }).exec();

    if (user) {
      if (user.favoriteMovies.includes(movieId)) {
        const movie = await Movie.findById(movieId).exec();
        user.favoriteMovies.pull(movieId);
        await user.save();
        res.status(200).send(`${movie.Title} has been removed from favorites`);
      } else {
        res.status(404).send("Movie not found in favorites");
      }
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
});

// Allow existing users to deregister
app.delete("/users/:name", async (req, res) => {
  try {
    await User.findOneAndDelete(req.params.name);
    res.status(200).send(`User ${req.params.name} has been deleted`);
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
});

app.listen(8080, () => console.log("Server listening on port 8080"));
