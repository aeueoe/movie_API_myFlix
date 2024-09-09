const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const { Movie, User, Actor, Director } = require("./models");

const { check, validationResult } = require("express-validator");

mongoose
  .connect(process.env.CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.error("Error connecting to DB", err);
  });

const cors = require("cors");

let allowedOrigins = [
  "http://localhost:8080",
  "http://testsite.com",
  "http://localhost:1234",
  "https://myflix-morefilms.netlify.app",
  "http://localhost:4200",
  "https://myflix-five.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If a specific origin isn’t found on the list of allowed origins
        let message =
          "The CORS policy for this application doesn’t allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

// Middleware
app.use(morgan("common"));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

let auth = require("./auth")(app);

const passport = require("passport");
require("./passport");

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Serve the documentation.html file at the '/documentation.html' route
app.get("/documentation.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "documentation.html"));
});

// Default text when "/"
app.get("/", (req, res) => {
  res.send("Hello from myFlix!");
});

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
      const title = req.params.title;
      const movie = await Movie.findOne({ Title: title });

      if (movie) {
        res.status(200).json(movie);
      } else {
        res.status(404).send("Movie not found");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    }
  }
);

app.get(
  "/movies/genres",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      console.log("Fetching all genres");
      const genres = await Movie.distinct("genre");
      if (genres) {
        console.log(`Found ${genres.length} genres: ${JSON.stringify(genres)}`);
        res.status(200).json(genres);
      } else {
        console.log("No genres found");
        res.status(404).send("No genres found");
      }
    } catch (err) {
      console.error("Error fetching genres: ", err);
      res.status(500).send("Error fetching genres: " + err);
    }
  }
);

// Return data about a genre by name/title
app.get(
  "/movies/genres/:name",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      console.log(`Fetching genre: ${req.params.name}`);
      const movie = await Movie.findOne({
        "genre.name": req.params.name,
      });

      if (movie) {
        const genre = movie.genre;
        console.log(`Genre found: ${JSON.stringify(genre)}`);
        res
          .status(200)
          .json({ name: genre.name, description: genre.description });
      } else {
        console.log("Genre not found");
        res.status(404).send("Genre not found");
      }
    } catch (err) {
      console.error("Error: ", err);
      res.status(500).send("Error: " + err);
    }
  }
);

// Return data about a director by name
app.get(
  "/directors/:directorName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const directorName = req.params.directorName;

      const director = await Director.findOne({
        name: directorName,
      });

      if (director) {
        res.status(200).json(director);
      } else {
        res.status(404).send("Director not found");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    }
  }
);

// Return data about an actor  by name
app.get(
  "/actors/:actorName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const actorName = req.params.actorName;

      const actor = await Actor.findOne({
        name: actorName,
      });

      if (actor) {
        res.status(200).json(actor);
      } else {
        res.status(404).send("Actor not found");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    }
  }
);

app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(`Received request for user ${req.params.Username}`);
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        console.log(`Found user: ${user}`);
        res.json(user);
      })
      .catch((err) => {
        console.error(`Error fetching user: ${err}`);
        res.status(500).send("Error: " + err);
      });
  }
);

// Allow new user to register
app.post(
  "/users",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Password", "Password must be at least 6 characters long.").isLength({
      min: 6,
    }),
    check("Email", "Email address is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid.").isEmail(),
  ],
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = User.hashPassword(req.body.Password);
    await User.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          User.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json({
                message: "User added successfully",
                user: user,
              });
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);
// Allow user to update info
app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  [
    check("Username", "Username is required").optional().isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non-alphanumeric characters - not allowed."
    )
      .optional()
      .isAlphanumeric(),
    check("Password", "Password must be at least 6 characters long.")
      .optional()
      .isLength({ min: 6 }),
    check("Email", "Email address is not valid.").optional().isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("Permission denied");
    }

    const updateFields = {};
    if (req.body.Username) updateFields.Username = req.body.Username;
    if (req.body.Password) updateFields.Password = req.body.Password;
    if (req.body.Email) updateFields.Email = req.body.Email;
    if (req.body.Birthday) updateFields.Birthday = req.body.Birthday;

    try {
      const updatedUser = await User.findOneAndUpdate(
        { Username: req.params.Username },
        { $set: updateFields },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        user: updatedUser,
        message: "User info updated successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err.message);
    }
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
              res.status(200).send("Movie has been added to favorites");
            }
          } else {
            res.status(404).send("Movie not found");
          }
        } else {
          res.status(404).send("Invalid movie ID");
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
          res.status(200).send("Movie has been removed from favorites");
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


// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error");
});


const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
