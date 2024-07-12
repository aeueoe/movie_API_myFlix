const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

// Movie Schema
const movieSchema = new Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: { type: String, required: true },
    Description: { type: String, required: true },
  },
  Director: { type: Schema.Types.ObjectId, ref: "Director" },
  ImagePath: { type: String },
  Featured: { type: Boolean },
  ReleaseYear: { type: Number },
  Rating: { type: String },
  Actors: [{ type: Schema.Types.ObjectId, ref: "Actor" }],
});

// Director Schema
const directorSchema = new Schema({
  Name: { type: String, required: true },
  Bio: { type: String, required: true },
  Birth: { type: Date },
  Death: { type: Date },
  Movies: [{ Title: String }],
});

// Actor Schema
const actorSchema = new Schema({
  Name: { type: String, required: true },
  Bio: { type: String, required: true },
  Birth: { type: Date },
  Death: { type: Date },
  Awards: [{ Name: String, Year: Number, Wins: Number, Nominations: Number, Description: String }],
  Movies: [{ Title: String, Character: String }],
});

// User Schema

const userSchema = new Schema({
  Username: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Birthday: { type: Date },
  favoriteMovies: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
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