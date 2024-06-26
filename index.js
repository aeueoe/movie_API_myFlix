const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Movie, User } = require("./models");

mongoose.connect("mongodb://localhost:27017/myFlixDB");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

let auth = require("./auth")(app);

const passport = require("passport");
require("./passport");

// Return a list of ALL users
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const users = await User.find().exec();
      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    }
  }
);

// Return a list of ALL films
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movie.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// Return data about a single film by title
app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const movie = await Movie.findOne({ Title: req.params.title });
      if (movie) {
        res.status(200).json(movie);
      } else {
        res.status(400).send("Movie not found");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    }
  }
);

// Return data about a genre by name/title
app.get(
  "/movies/genres/:genreName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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
      console.error(err);
      res.status(500).send("Error: " + err);
    }
  }
);

// Return data about a director by name
app.get(
  "/movies/directors/:directorName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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
  }
);

// Allow new user to register
app.post("/users", async (req, res) => {
  try {
    const newUser = new User({
      Username: req.body.Username,
      Email: req.body.Email,
      Password: req.body.Password,
      Birthday: req.body.Birthday,
    });
    const user = await newUser.save();
    res.status(201).json({
      message: "User added successfully",
      user: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
});

// Allow user to update info
app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("Permission denied");
    }
    await User.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }
    )
      .then((updatedUser) => {
        res.json({
          user: updatedUser,
          message: "User info updated successfully",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error: " + err);
      });
  }
);
// Allow users to add a film to their list of favorites
app.post(
  "/users/:Username/favoriteMovies/:movieId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userName = req.params.Username;
      const movieId = req.params.movieId;

      const user = await User.findOne({ Username: userName }).exec();
      if (user) {
        if (mongoose.Types.ObjectId.isValid(movieId)) {
          const movie = await Movie.findById(movieId).exec();
          if (movie) {
            if (user.favoriteMovies.includes(movieId)) {
              res.status(400).send("Movie already exists in favorites");
            } else {
              user.favoriteMovies.push(movieId);
              await user.save();
              res
                .status(200)
                .send(`${movie.Title} has been added to favorites`);
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
  }
);

// Allow users to remove a film from their list of favorites
app.delete(
  "/users/:Username/favoriteMovies/:movieId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userName = req.params.Username;
      const movieId = req.params.movieId;

      const user = await User.findOne({ Username: userName }).exec();

      if (user) {
        if (user.favoriteMovies.includes(movieId)) {
          const movie = await Movie.findById(movieId).exec();
          user.favoriteMovies.pull(movieId);
          await user.save();
          res
            .status(200)
            .send(`${movie.Title} has been removed from favorites`);
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
  }
);

// Allow existing users to deregister
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      await User.findOneAndDelete({ Username: req.params.Username });
      res.status(200).send(`User ${req.params.Username} has been deleted`);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    }
  }
);

app.listen(8080, () => console.log("Server listening on port 8080"));
