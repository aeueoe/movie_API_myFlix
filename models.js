const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

// Movie Schema
const movieSchema = new Schema({
  id: { type: Schema.Types.ObjectId },
  title: { type: String, required: true },
  description: { type: String, required: true },
  countryOfOrigin: { type: String },
  imagePath: { type: String },
  featured: { type: Boolean },
  releaseYear: { type: String },
  iMDb_Rating: { type: String },
  rottenTomatoesRating: { type: String },
  runtime: { type: String },
  language: { type: String },
  genre: {
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  director: { name: { type: String, required: true } },
  actors: [
    {
      actor: { type: Schema.Types.ObjectId, ref: "Actor" },
      character: { type: String },
    },
  ],
  awards: [
    {
      name: { type: String },
      year: { type: String },
      wins: { type: String },
      nominations: { type: String },
      description: { type: String },
    },
  ],
});

// Director Schema
const directorSchema = new Schema({
  name: { type: String, required: true },
  birth: { type: String },
  death: { type: String },
  country: { type: String },
  bio: { type: String, required: true },
  otherFilms: [{ type: String }],
});

// Actor Schema
const actorSchema = new Schema({
  id: { type: Schema.Types.ObjectId },
  name: { type: String, required: true },
  birth: { type: String },
  death: { type: String },
  bio: { type: String, required: true },
  movies: [
    {
      movie: { type: Schema.Types.ObjectId, ref: "Movie" },
      character: { type: String },
    },
  ],
  awards: [
    {
      name: { type: String },
      year: { type: String },
      description: { type: String },
    },
  ],
});

// User Schema
const userSchema = new Schema({
  Username: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Birthday: { type: Date },
  Favorite: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

const Actor = mongoose.model("Actor", actorSchema);
const Director = mongoose.model("Director", directorSchema);
const Movie = mongoose.model("Movie", movieSchema);
const User = mongoose.model("User", userSchema);

module.exports = { Actor, Director, Movie, User };
