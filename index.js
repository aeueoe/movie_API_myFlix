const express = require("express");
app = express();
bodyParser = require("body-parser");
uuid = require("uuid");

app.use(bodyParser.json());

let users = [
  {
    id: 1,
    name: "Jerry",
    favoriteFilms: [],
  },
  {
    id: 2,
    name: "Elaine",
    favoriteFilms: ["The Big Lebowski"],
  },
];

let films = [
  {
    Title: "Groundhog Day",
    Description:
      "A narcissistic, self-centered weatherman finds himself in a time loop on Groundhog Day.",
    Genre: {
      Name: "Comedy",
      Description:
        "Comedy film is a film genre that emphasizes humor. These films are designed to amuse audiences and make them laugh.",
    },
    Director: {
      Name: "Harold Ramis",
      Bio: "Harold Allen Ramis got his start in comedy as Playboy magazine's joke editor and reviewer.",
      Birth: "November 21, 1944",
    },
    ImageURL:
      "https://www.imdb.com/title/tt0107048/mediaviewer/rm2069922816/?ref_=tt_md_4",
    Featured: false,
  },
  {
    Title: "The Big Lebowski",
    Description:
      'Jeff "The Dude" Lebowski, mistaken for a millionaire of the same name, seeks restitution for his ruined rug and enlists his bowling buddies to help get it.',
    Genre: {
      Name: "Comedy",
      Description:
        "Comedy film is a film genre that emphasizes humor. These films are designed to amuse audiences and make them laugh.",
    },
    Director: {
      Name: "Joel Coen",
      Bio: "Joel Daniel Coen is an American filmmaker who regularly collaborates with his younger brother Ethan.",
      Birth: "November 29, 1954",
    },
    ImageURL:
      "https://www.imdb.com/title/tt0118715/mediaviewer/rm1912899584/?ref_=tt_md_5",
    Featured: false,
  },
  {
    Title: "Casablanca",
    Description:
      "A cynical expatriate American cafe owner struggles to decide whether or not to help his former lover and her fugitive husband escape the Nazis in French Morocco.",
    Genre: {
      Name: "Drama",
      Description:
        "A genre that focuses on serious presentations or stories with settings or life situations that portray realistic characters in conflict with either themselves, others, or forces of nature.",
    },
    Director: {
      Name: "Michael Curtiz",
      Bio: "Curtiz began acting in and then directing films in his native Hungary in 1912. After WWI, he continued his filmmaking career in Austria and Germany and into the early 1920s when he directed films in other countries in Europe. Moving to the US in 1926, he started making films in Hollywood for Warner Bros. and became thoroughly entrenched in the studio system.",
      Birth: "December 24, 1886",
    },
    ImageURL:
      "https://www.imdb.com/title/tt0034583/mediaviewer/rm3367915520/?ref_=ext_shr_lnk",
    Featured: false,
  },
  {
    Title: "Anatomy of a Fall",
    Description:
      "A woman is suspected of murder after her husband's death; their half-blind son faces a moral dilemma as the main witness.",
    Genre: {
      Name: "Crime",
      Description:
        "A genre that focuses on criminal activities or the criminal lifestyle.",
    },
    Director: {
      Name: "Justine Triet",
      Bio: "Justine Triet is a graduate from the Paris National School of Fine Arts.",
      Birth: "July 17, 1978",
    },
    ImageURL:
      "https://www.imdb.com/title/tt17009710/mediaviewer/rm3574749441/?ref_=ext_shr_lnk",
    Featured: false,
  },
  {
    Title: "Lost In Translation",
    Description:
      "A faded movie star and a neglected young woman form an unlikely bond after crossing paths in Tokyo.",
    Genre: {
      Name: "Drama",
      Description:
        "A genre that focuses on serious presentations or stories with settings or life situations that portray realistic characters in conflict with either themselves, others, or forces of nature.",
    },
    Director: {
      Name: "Sofia Coppola",
      Bio: "Sofia Coppola was born on May 14, 1971 in New York City, New York, USA as Sofia Carmina Coppola. She is the daughter of Francis Ford Coppola and collaborated with Kirsten Dunst.",
      Birth: "May 14, 1971",
    },
    ImageURL:
      "https://www.imdb.com/title/tt0335266/mediaviewer/rm4142465536/?ref_=tt_md_8",
    Featured: false,
  },
  {
    Title: "Sunset Boulevard",
    Description:
      "A screenwriter develops a dangerous relationship with a faded film star determined to make a triumphant return.",
    Genre: {
      Name: "Drama",
      Description:
        "A genre that focuses on serious presentations or stories with settings or life situations that portray realistic characters in conflict with either themselves, others, or forces of nature.",
    },
    Director: {
      Name: "Billy Wilder",
      Bio: "Billy Wilder is an Austrian-born American film director and screenwriter whose career spanned more than five decades. He is regarded as one of the most brilliant and versatile filmmakers of the Hollywood Golden Age of cinema.",
      Birth: "June 22, 1906",
    },
    ImageURL:
      "https://www.imdb.com/title/tt0043014/mediaviewer/rm3803821568/?ref_=tt_md_2",
    Featured: false,
  },
  {
    Title: "Poor Things",
    Description:
      "An account of the fantastical evolution of Bella Baxter, a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter.",
    Genre: {
      Name: "Comedy",
      Description:
        "Comedy film is a film genre that emphasizes humor. These films are designed to amuse audiences and make them laugh.",
    },
    Director: {
      Name: "Yorgos Lanthimos",
      Bio: "Yorgos Lanthimos was born in Athens, Greece. He studied directing for Film and Television at the Stavrakos Film School in Athens. He has directed a number of dance videos in collaboration with Greek choreographers, in addition to TV commercials, music videos, short films and theater plays.",
      Birth: "September 23, 1973",
    },
    ImageURL:
      "https://www.imdb.com/title/tt14230458/mediaviewer/rm2912637185/?ref_=tt_md_1",
    Featured: false,
  },
  {
    Title: "Some Like It Hot",
    Description:
      "After two male musicians witness a mob hit, they flee the state in an all-female band disguised as women, but further complications set in.",
    Genre: {
      Name: "Comedy",
      Description:
        "Comedy film is a film genre that emphasizes humor. These films are designed to amuse audiences and make them laugh.",
    },
    Director: {
      Name: "Billy Wilder",
      Bio: "Billy Wilder is an Austrian-born American film director and screenwriter whose career spanned more than five decades. He is regarded as one of the most brilliant and versatile filmmakers of the Hollywood Golden Age of cinema.",
      Birth: "June 22, 1906",
    },
    ImageURL:
      "https://www.imdb.com/title/tt0053291/mediaviewer/rm979618816/?ref_=tt_md_8",
    Featured: false,
  },
  {
    Title: "The Royal Tenenbaums",
    Description:
      "The eccentric members of a dysfunctional family reluctantly gather under the same roof for various reasons.",
    Genre: {
      Name: "Comedy",
      Description:
        "Comedy film is a film genre that emphasizes humor. These films are designed to amuse audiences and make them laugh.",
    },
    Director: {
      Name: "Wes Anderson",
      Bio: "Wesley Wales Anderson is an American filmmaker. His films are known for their eccentricity, distinctive visual and narrative styles, and frequent use of ensemble casts.",
      Birth: "May 1, 1969",
    },
    ImageURL:
      "https://www.imdb.com/title/tt0265666/mediaviewer/rm2029606144/?ref_=tt_md_1",
    Featured: false,
  },
  {
    Title: "La dolce vita",
    Description:
      "A series of stories following a week in the life of a philandering tabloid journalist living in Rome.",
    Genre: {
      Name: "Drama",
      Description:
        "A genre that focuses on serious presentations or stories with settings or life situations that portray realistic characters in conflict with either themselves, others, or forces of nature.",
    },
    Director: {
      Name: "Federico Fellini",
      Bio: "Federico Fellini was an Italian film director and screenwriter. He is known for his distinctive style, which blends fantasy and baroque images with earthiness. He is recognized as one of the greatest and most influential filmmakers of all time",
      Birth: "January 20, 1920",
    },
    ImageURL:
      "https://www.imdb.com/title/tt0053779/mediaviewer/rm1661339648/?ref_=tt_md_6",
    Featured: false,
  },
];

//CREATE
app.post("/users", (req, res) => {
  const newUser = req.body;
  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send("users need names");
  }
});

//UPDATE
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;
  let user = users.find((user) => user.id == id);
  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send("No such user");
  }
});

//CREATE
app.post("/users/:id/:filmTitle", (req, res) => {
  const { id, filmTitle } = req.params;
  let user = users.find((user) => user.id == id);
  if (user) {
    user.favoriteFilms.push(filmTitle);
    res.status(200).send(`${filmTitle} has been added to user ${id}`);
  } else {
    res.status(400).send("no such users");
  }
});

//DELETE
app.delete("/users/:id/:filmTitle", (req, res) => {
  const { id, filmTitle } = req.params;
  let user = users.find((user) => user.id == id);
  if (user) {
    user.favoriteFilms = user.favoriteFilms.filter(
      (title) => title !== filmTitle
    );
    res.status(200).send(`${filmTitle} has been removed from user ${id}`);
  } else {
    res.status(400).send("No such user");
  }
});

//DELETE
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  let user = users.find((user) => user.id == id);
  if (user) {
    users = users.filter((user) => user.id != id);
    res.status(200).send(`${id} has been removed from user list`);
  } else {
    res.status(400).send("No such user");
  }
});

//READ
app.get("/users", (req, res) => {
  res.status(200).json(users);
});

//READ
app.get("/films", (req, res) => {
  res.status(200).json(films);
});

//READ
app.get("/films/:title", (req, res) => {
  const { title } = req.params;
  const film = films.find((film) => film.Title === title);
  if (film) {
    res.status(200).json(film);
  } else {
    res.status(400).send("no such film");
  }
});

//READ
app.get("/films/genre/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = films.find((film) => film.Genre.Name === genreName).Genre;
  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("no such genre");
  }
});

//READ
app.get("/films/directors/:directorName", (req, res) => {
  const { directorName } = req.params;
  const director = films.find(
    (film) => film.Director.Name === directorName
  ).Director;
  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("no such director name");
  }
});

app.listen(8080, () => console.log("Server listening on port 8080"));
