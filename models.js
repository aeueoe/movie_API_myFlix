const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Movie Schema
const movieSchema = new Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: { type: String, required: true },
    Description: { type: String, required: true },
  },
  Director: {
    Name: { type: String, required: true },
    Bio: { type: String, required: true },
    Birth: { type: Date },
    Death: { type: Date },
  },
  ImagePath: { type: String },
  Featured: { type: Boolean },
  ReleaseYear: { type: Number },
  Rating: { type: String },
  Actors: [{ Name: String, Character: String }],
});

// User Schema

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  birthday: { type: Date },
  favoriteMovies: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
});

const Movie = mongoose.model("Movie", movieSchema);
const User = mongoose.model("User", userSchema);

module.exports = { Movie, User };
