// const getMoviesCategories = async (number_of_movies) => {
//   fetch("http://127.0.0.1:8000/api/v1/genres/")
//     .then((response) => response.json())
//     .then((data) => {
//       const genres = data.results;
//       genres.forEach((genre) => {
//         console.log(genre.name);
//       });
//     })
//     .catch((error) => {
//       console.error("Une erreur s'est produite lors de la requête :", error);
//     });
// };

const getMoviesCategories = async () => {
  let url = "http://127.0.0.1:8000/api/v1/genres/";
  let categories = [];
  firstPageData = await fetchPage(url);
  categories = categories.concat(firstPageData.results);

  let nextPageUrl = firstPageData.next;

  while (nextPageUrl) {
    let nextPageData = await fetchPage(nextPageUrl);
    categories = categories.concat(nextPageData.results);
    nextPageUrl = nextPageData.next;
  }

  return categories;
};

// const getTopRatedMovie = async (number_of_movies) => {
//   fetch("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score")
//     .then((response) => response.json())
//     .then((data) => {
//       const sortedMovies = data.results;
//       const bestMovie = sortedMovies[0];
//       console.log("best movie:", bestMovie);
//       return bestMovie;
//     })
//     .catch((error) => {
//       console.error("Une erreur s'est produite lors de la requête :", error);
//     });
// };

const getTopRatedMovie = async (number_of_movies) => {
  url = "http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score";
  data = await fetchPage(url);

  const sortedMovies = data.results;
  const bestMovie = sortedMovies[0];

  data = await fetchPage(bestMovie.url);

  bestMovie["description"] = data.description;
  return bestMovie;
};

// Fonction pour effectuer une requête fetch à une page spécifique
const fetchPage = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erreur lors de la requête fetch pour l'URL : ${url}`, error);
    throw error;
  }
};

// Fonction pour récupérer les films les mieux notés à partir de toutes les pages
const getTopRatedMovies = async (number_of_movies) => {
  let topRatedMovies = [];

  // Récupération des films de la première page
  const firstPageUrl =
    "http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score";
  const firstPageData = await fetchPage(firstPageUrl);
  topRatedMovies = topRatedMovies.concat(firstPageData.results);

  // Récupération des films des pages suivantes jusqu'à avoir au moins 7 films
  let nextPageUrl = firstPageData.next;
  const nextPageData = await fetchPage(nextPageUrl);

  let i = 0;
  while (topRatedMovies.length < number_of_movies) {
    topRatedMovies = topRatedMovies.concat(nextPageData.results[i]);
    i++;
  }

  return topRatedMovies;
};

const getThreeRandomCategories = async () => {
  const categories = await getMoviesCategories();

  let indices = [...Array(categories.length).keys()]; // Création d'un tableau d'indices de 0 à n-1

  let categoryIndices = [];
  for (let i = 0; i < 3; i++) {
    let randomIndex = Math.floor(Math.random() * indices.length); // Sélection d'un indice aléatoire
    let selectedCategoryIndex = indices[randomIndex]; // Récupération de la catégorie correspondante à l'indice
    categoryIndices.push(selectedCategoryIndex);

    indices.splice(randomIndex, 1); // Suppression de l'indice sélectionné de la liste des indices disponibles
  }

  // Récupération des catégories correspondantes aux indices choisis
  let category1 = categories[categoryIndices[0]];
  let category2 = categories[categoryIndices[1]];
  let category3 = categories[categoryIndices[2]];

  return [category1, category2, category3];
};

// const getMoviesFromOneCategories = async (category) => {
//   console.log("getMoviesFromOneCategories");
//   let url =
//     "http://127.0.0.1:8000/api/v1/titles/?genre=Comedy&sort_by=-imdb_score";
//   let movies = [];
//   firstPageData = await fetchPage(url);
//   console.log("firstPageData", firstPageData);
//   movies = movies.concat(firstPageData.results);

//   let nextPageUrl = firstPageData.next;

//   while (nextPageUrl) {
//     let nextPageData = await fetchPage(nextPageUrl);
//     movies = movies.concat(nextPageData.results);
//     nextPageUrl = nextPageData.next;
//     console.log("test");
//   }
//   console.log("movies", movies);
//   return movies;
// };

const getMoviesFromOneCategories = async (category, number_of_movies) => {
  let movies = [];
  const firstPageUrl = `http://127.0.0.1:8000/api/v1/titles/?genre=${category}&sort_by=-imdb_score`;
  const firstPageData = await fetchPage(firstPageUrl);
  movies = movies.concat(firstPageData.results);

  let nextPageUrl = firstPageData.next;
  const nextPageData = await fetchPage(nextPageUrl);

  let i = 0;
  while (movies.length < number_of_movies) {
    movies = movies.concat(nextPageData.results[i]);
    i++;
  }

  return movies;
};

// getTopRatedMovie()
//   .then((topMovie) => {
//     console.log("top movie :", topMovie);
//   })
//   .catch((error) => {
//     console.error("Une erreur s'est produite lors de la requête :", error);
//   });

// getTopRatedMovies(7)
//   .then((topMovies) => {
//     console.log("top movies :", topMovies);
//   })
//   .catch((error) => {
//     console.error("Une erreur s'est produite lors de la requête :", error);
//   });

// getMoviesCategories()
//   .then((categories) => {
//     console.log("categories : ", categories);
//   })
//   .catch((error) => {
//     console.error("Une erreur s'est produite lors de la requête :", error);
//   });

// getThreeRandomCategories()
//   .then((categories) => {
//     console.log("categories : ", categories);
//   })
//   .catch((error) => {
//     console.error("Une erreur s'est produite lors de la requête :", error);
//   });

// getMoviesFromOneCategories("Comedy", 7)
//   .then((movies) => {
//     console.log("movies : ", movies);
//   })
//   .catch((error) => {
//     console.error("Une erreur s'est produite lors de la requête :", error);
//   });

const createCategorySection = async (section_id, category_name) => {
  const movies = await getMoviesFromOneCategories(category_name, 7);
  const section = document.getElementById(`${section_id}`);
  const h1 = document.createElement("h1");
  h1.textContent = category_name;
  section.appendChild(h1);
  let bloc__images = document.createElement("div");
  bloc__images.classList.add("bloc__images");
  section.appendChild(bloc__images);

  display_images(movies, bloc__images);
};

const display_images = (movies, bloc__images) => {
  movies.forEach((movie, index) => {
    const imageUrl = movie.image_url;
    const image = document.createElement("img");
    image.src = imageUrl;
    image.classList.add("js-trigger-modal");
    // image.setAttribute("data-movie", movie);

    if (index > 3) {
      image.style.display = "none";
    }

    image.addEventListener("click", function () {
      console.log("triggered");
      // data_movie = this.getAttribute("data-movie");
      openModal(movie);
    });

    bloc__images.appendChild(image);
  });
};

//il faudrait idéalement fusionner cette focntion avec celle du haut car elle est un peu redondante
const create_popular_movies_section = async (movies) => {
  const section = document.getElementById("main_category_bloc");
  const h1 = document.createElement("h1");
  h1.textContent = "Les plus populaires";
  section.appendChild(h1);
  let bloc__images = document.createElement("div");
  let main_category_bloc_content = document.createElement("div");
  bloc__images.classList.add("bloc__images");
  main_category_bloc_content.appendChild(bloc__images);
  main_category_bloc_content.classList.add("main_category_bloc_content");

  section.appendChild(main_category_bloc_content);

  display_images(movies, bloc__images);

  createCarousel("main_category_bloc");
};

const bloc = [
  "main_category_bloc",
  "first_category_bloc",
  "second_category_bloc",
  "third_category_bloc",
];

getTopRatedMovie()
  .then((movie) => {
    let image = document.querySelector(".main__movie__img");
    image.src = movie.image_url;
    const title = document.querySelector(".main__movie__title");
    title.innerText = movie.title;
    const description = document.querySelector(".main__movie__description");
    description.innerText = movie.description;
    let button = document.querySelector(".main__movie__button");
    // button.setAttribute("data-movie", movie);
    image.addEventListener("click", function () {
      console.log("triggered");
      // data_movie = this.getAttribute("data-movie");
      console.log("movie1", movie);
      openModal(movie);
    });
  })
  .catch((error) => {
    console.error("Une erreur s'est produite lors de la requête :", error);
  });

getTopRatedMovies(7)
  .then((movies) => {
    create_popular_movies_section(movies);
  })
  .catch((error) => {
    console.error("Une erreur s'est produite lors de la requête :", error);
  });

//le problème de cette fonction c'est que pas pour certaine catégories(celle qui ont moins d'une page ça fait un pug je crois)
// getThreeRandomCategories()
//   .then((categories) => {
//     console.log("categories:", categories);
//     createCategorySection(bloc[1], categories[0].name);
//     createCategorySection(bloc[2], categories[1].name);
//     createCategorySection(bloc[3], categories[2].name);
//   })
//   .catch((error) => {
//     console.error("Une erreur s'est produite lors de la requête :", error);
//   });

const createCategorieSections = async (categories) => {
  createCategorySection(bloc[1], categories[0]);
  createCategorySection(bloc[2], categories[1]);
  createCategorySection(bloc[3], categories[2]);
};

// const add_modal_events = async () => {
//   let modal_triggers = document.querySelectorAll(".js-trigger-modal");
//   console.log(modal_triggers);
//   for (trigger of modal_triggers) {
//     console.log("trigger", trigger);
//     trigger.addEventListener("click", function (event) {
//       console.log("triggered");
//       data_movie = this.getAttribute("data-movie");
//       let title = data_movie.title;
//       let description = data_movie.description;
//       openModal(title, description);
//     });
//   }
// };

const createWrapper = (elementType, letiable, labelText, isList = false) => {
  let wrapper = document.createElement("div");
  wrapper.className = "wrapper";
  let label = document.createElement("div");
  label.className = "label";
  label.innerText = labelText;

  let content = document.createElement(elementType);
  if (!isList) {
    content.innerText = letiable;
  } else {
    content.innerText = letiable.join(",  ");
  }

  wrapper.appendChild(label);
  wrapper.appendChild(content);

  return wrapper;
};

const openModal = async (movie) => {
  console.log("movie", movie);
  movie = await fetchPage(movie.url);

  let modal = document.getElementById("myModal");
  let modal_content = document.querySelector(".modal-content");
  modal_content.innerHTML = "";

  let modalTitle = document.createElement("h2");
  modalTitle.innerText = movie.title;
  modal_content.appendChild(modalTitle);

  // let modalDescription = document.createElement("p");
  // modalDescription.innerText = movie.description;
  // let modalTitleWrapper = document.createElement("div"); // Élément conteneur pour le préfixe
  // modalTitleWrapper.className = "label"; // Ajout de la classe "label" à l'élément conteneur
  // modalTitleWrapper.innerText = "Titre : "; // Préfixe "Titre :"

  modalDescription = createWrapper("p", movie.description, "Description");
  modal_content.appendChild(modalDescription);

  //genre, attention c'est un tableau
  modalDatePublished = createWrapper("span", movie.year, "Date de publication");
  modal_content.appendChild(modalDatePublished);

  modalImdbScore = createWrapper("span", movie.imdb_score, "Rating");
  modal_content.appendChild(modalImdbScore);

  modalAvgVote = createWrapper("span", movie.avg_vote, "Vote");
  modal_content.appendChild(modalAvgVote);

  modalGenres = createWrapper("div", movie.genres, "Genres", true);
  modal_content.appendChild(modalGenres);

  let modalDirectors = createWrapper(
    "div",
    movie.directors,
    "Directeurs",
    true
  );
  modal_content.appendChild(modalDirectors);

  if (movie.duration) {
    modalDuration = createWrapper("div", movie.duration, "Durée", false);
    modal_content.appendChild(modalDuration);
  }

  if (movie.countries) {
    modalCountries = createWrapper("div", movie.countries, "Pays", true);
    modal_content.appendChild(modalCountries);
  }

  if (movie.long_description) {
    modalLongDescription = createWrapper(
      "div",
      movie.long_description,
      "Description détaillée",
      false
    );
    modal_content.appendChild(modalLongDescription);
  }

  // let modalActors = document.createElement("ul");
  // console.log("actors:", movie.actors);
  // for (let actor of movie.actors) {
  //   let li = document.createElement("li");
  //   console.log(actor);
  //   li.innerText = actor;
  //   modalActors.appendChild(li);
  // }
  // modal_content.appendChild(modalActors);

  if (movie.actors) {
    modalActors = createWrapper("div", movie.actors, "Acteurs", true);
    modal_content.appendChild(modalActors);
  }

  modal.style.display = "block";
};

const closeModal = () => {
  let modal = document.getElementById("myModal");
  console.log("modal closed");
  modal.style.display = "none"; // Cache la modal
  let modal_content = document.querySelector(".modal-content");
  modal_content.innerHTML = "";
};

function createCarousel(containerId) {
  const category = document.getElementById(containerId);
  const container = category.querySelector(".main_category_bloc_content");
  const bloc_images = container.querySelector(".bloc__images");
  console.log("container", container);
  const images = container.getElementsByTagName("img");

  // Créer les flèches gauche et droite
  const leftArrow = document.createElement("div");
  leftArrow.classList.add("carousel-arrow", "left-arrow");
  leftArrow.innerHTML = "<";
  container.prepend(leftArrow);

  const rightArrow = document.createElement("div");
  rightArrow.classList.add("carousel-arrow", "right-arrow");
  rightArrow.innerHTML = ">";
  container.appendChild(rightArrow);

  console.log("images : ", images);

  let currentIndex = 0;
  const totalImages = images.length;
  console.log("totalImages : ", totalImages);

  // Fonction pour afficher l'image suivante
  function showNextImage() {
    images[(currentIndex + 4) % 7].style.display = "block";
    console.log("current index block", currentIndex);
    console.log("current index  + 4 % 7 none", (currentIndex + 4) % 7);
    images[currentIndex].style.display = "none";
    currentIndex = (currentIndex + 1) % 7;
    console.log("newwww index", currentIndex);
  }

  // Fonction pour afficher l'image précédente
  function showPreviousImage() {
    console.log("current index block", currentIndex);
    images[currentIndex].style.display = "block";
    console.log("current index + 4 % 7 none", (currentIndex + 4) % 7);
    images[(currentIndex + 4) % 7].style.display = "none";
    currentIndex = (currentIndex - 1 + totalImages) % 7;
    console.log("newwww index", currentIndex);
  }

  // function showNextImage() {
  //   if (currentIndex + 4 >= 7) {
  //     // Insérer l'élément en premier dans la liste des images
  //     bloc_images.appendChild(images[0]);
  //     images[6].style.display = "block";
  //     // Supprimer le dernier élément de la liste (la dernière image)

  //     bloc_images.removeChild(images[0]);
  //   } else {
  //     images[(currentIndex + 4) % 7].style.display = "block";
  //   }

  //   console.log("current index + 4 % 7 block", (currentIndex + 4) % 7);
  //   console.log("current index none", currentIndex);
  //   images[currentIndex].style.display = "none";
  //   currentIndex = (currentIndex + 1) % 7;
  //   console.log("newwww index", currentIndex);
  // }

  // // Fonction pour afficher l'image précédente
  // function showPreviousImage() {
  //   console.log("current index block", currentIndex);
  //   images[currentIndex].style.display = "block";
  //   console.log("current index + 4 % 7 none", (currentIndex + 4) % 7);
  //   images[(currentIndex + 4) % 7].style.display = "none";
  //   currentIndex = (currentIndex - 1 + totalImages) % 7;
  //   console.log("newwww index", currentIndex);
  // }

  // Ajouter les événements click sur les flèches
  leftArrow.addEventListener("click", showPreviousImage);
  rightArrow.addEventListener("click", showNextImage);
}

let categories = ["Drama", "History", "Comedy"];
createCategorieSections(categories);
let close_modal = document.querySelector(".js-close-modal");
console.log(close_modal);
close_modal.addEventListener("click", function () {
  closeModal();
});

// Sélectionnez la modal
let modal = document.getElementById("myModal");

// Ajoutez un gestionnaire d'événements au clic sur le body
document.body.addEventListener("click", function (event) {
  console.log("test", event.target);
  // Vérifiez si l'élément cliqué est en dehors de la modal
  if (event.target != modal) {
    modal.style.display = "none"; // Masquer la modal
  }
});
////////////: