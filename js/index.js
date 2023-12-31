// Fonction pour effectuer une requête fetch à une page spécifique
const fetchPage = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erreur lors de la requête fetch pour l'URL : ${url}`, error);
  }
};

// Fonction qui renvoie les différentes catégories de films
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

// Fonction qui renvoie le film le mieux noté
const getTopRatedMovie = async () => {
  url = "http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score";
  data = await fetchPage(url);

  const sortedMovies = data.results;
  const bestMovie = sortedMovies[0];

  // aller récupérer la description du film
  data = await fetchPage(bestMovie.url);
  bestMovie["description"] = data.description;

  return bestMovie;
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

//Fonction pour récupérer les films d'une catégorie donné trié en fonction de la score imdb
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

// Fonction pour afficher la section des films les plus populaires
const create_popular_movies_section = async (movies) => {
  const section = document.getElementById("main_category_bloc");
  const h1 = document.createElement("h1");
  h1.textContent = "Les plus populaires";
  section.appendChild(h1);
  let bloc__images = document.createElement("div");
  let main_category_bloc_content = document.createElement("div");
  bloc__images.classList.add("bloc__images");
  main_category_bloc_content.appendChild(bloc__images);
  main_category_bloc_content.classList.add("main_bloc_content");

  section.appendChild(main_category_bloc_content);

  display_images(movies, bloc__images);

  if (document.querySelector("main").offsetWidth > 920) {
    initSwiper("main_category_bloc", movies);
  }
};

// Fonction pour afficher les films d'une catégories donnée
const createCategorySection = async (section_id, category_name) => {
  const movies = await getMoviesFromOneCategories(category_name, 7);
  const section = document.getElementById(`${section_id}`);
  const h1 = document.createElement("h1");
  h1.textContent = category_name;
  section.appendChild(h1);

  let bloc__images = document.createElement("div");
  let main_category_bloc_content = document.createElement("div");
  bloc__images.classList.add("bloc__images");
  main_category_bloc_content.appendChild(bloc__images);
  main_category_bloc_content.classList.add("main_bloc_content");
  section.appendChild(main_category_bloc_content);

  display_images(movies, bloc__images);

  if (document.querySelector("main").offsetWidth > 920) {
    initSwiper(section_id, movies);
  }
};

// Créer les 3 section avec une catégorie donnée
const createCategorieSections = async (categories) => {
  createCategorySection(bloc[1], categories[0]);
  createCategorySection(bloc[2], categories[1]);
  createCategorySection(bloc[3], categories[2]);
};

//Fonction pour afficher les images
const display_images = (
  movies,
  bloc__images,
  movieIndicesToDisplay = [0, 1, 2, 3]
) => {
  bloc__images.innerHTML = "";
  let selectedMovies;

  //Pour les tailles d'écran inférieur à 920px on n'affiche tous les films et on gère le swiper directement avec du css
  if (document.querySelector("main").offsetWidth <= 920) {
    // If the screen width is less than or equal to 920px (mobile), set selectedMovies to movies
    selectedMovies = movies;
  } else {
    // If the screen width is greater than 920px (not mobile), select movies based on the indices
    selectedMovies = movieIndicesToDisplay.map((index) => movies[index]);//Permet d'extraire un sous ensemble du tableau movies
  }

  selectedMovies.forEach((movie) => {
    const imageUrl = movie.image_url;
    const image = document.createElement("img");
    image.src = imageUrl;
    image.classList.add("js-trigger-modal", "appear");

    bloc__images.appendChild(image);
    image.classList.add("appear");
    image.addEventListener("click", function () {
      openModal(movie);
    });
  });
};

function initSwiper(containerId, movies) {
  const category = document.getElementById(containerId);
  const container = category.querySelector(".main_bloc_content");

  const bloc_images = container.querySelector(".bloc__images");
  const images = container.getElementsByTagName("img");

  // Créer les flèches gauche et droite
  const leftArrow = document.createElement("div");
  leftArrow.classList.add("swiper-arrow", "left-arrow");
  leftArrow.innerHTML = '<i class="fas fa-arrow-left"></i>';
  container.prepend(leftArrow);

  const rightArrow = document.createElement("div");
  rightArrow.classList.add("swiper-arrow", "right-arrow");
  rightArrow.innerHTML = '<i class="fas fa-arrow-right"></i>';
  container.appendChild(rightArrow);

  let currentStartIndex = 0;
  let currentEndIndex = 3;

  // Fonction pour afficher l'image suivante
  function showNextImage() {
    currentStartIndex = currentStartIndex + 1;
    currentEndIndex = currentStartIndex - 4;

    display_images(movies, bloc_images, [
      currentStartIndex % 7,
      (currentStartIndex + 1) % 7,
      (currentStartIndex + 2) % 7,
      (currentStartIndex + 3) % 7,
    ]);
  }

  // Fonction pour afficher l'image précédente
  function showPreviousImage() {
    currentEndIndex = currentEndIndex - 1;
    if (currentEndIndex == -5) {
      currentEndIndex = 2;
    }
    currentStartIndex = currentEndIndex + 4;

    display_images(movies, bloc_images, [
      (currentEndIndex - 3 + 7) % 7,
      (currentEndIndex - 2 + 7) % 7,
      (currentEndIndex - 1 + 7) % 7,
      (currentEndIndex + 7) % 7,
    ]);
  }

  // Ajouter les événements click sur les flèches
  leftArrow.addEventListener("click", showPreviousImage);
  rightArrow.addEventListener("click", showNextImage);
}

//Fonction utile pour la modal qui permet de retourner un div contenant une information(genres, descriptions etc...) sur un film
const createWrapper = (elementType, value, labelText, isList = false) => {
  let wrapper = document.createElement("div");
  wrapper.className = "wrapper";
  if (labelText != false) {
    let label = document.createElement("div");
    label.className = "label";
    label.innerText = labelText;
    wrapper.appendChild(label);
  }

  let content = document.createElement(elementType);
  if (!isList) {
    content.innerText = value;
  } else {
    content.innerText = value.join(",  ");
  }
  wrapper.appendChild(content);

  return wrapper;
};

// Fonction pour créer puis afficher la modal
const openModal = async (movie) => {
  movie = await fetchPage(movie.url);

  let modal = document.getElementById("myModal");
  let modal_content = document.querySelector(".modal-content");
  modal_content.innerHTML = "";
  let modal_left_content = document.createElement("div");
  modal_left_content.className = "modal-left-content";
  let modal_right_content = document.createElement("div");
  modal_right_content.className = "modal-right-content";
  modal_content.appendChild(modal_left_content);
  modal_content.appendChild(modal_right_content);

  let modalTitle = document.createElement("h2");
  modalTitle.innerText = movie.title;
  modal_left_content.appendChild(modalTitle);

  const imageUrl = movie.image_url;
  const image = document.createElement("img");
  image.src = imageUrl;
  modal_left_content.appendChild(image);

  let date_and_rating_container = document.createElement("div");
  date_and_rating_container.className = "date-and-rating-container";

  modalDatePublished = createWrapper("span", movie.year, false);
  date_and_rating_container.appendChild(modalDatePublished);

  modalImdbScore = createWrapper("span", movie.imdb_score, false);
  date_and_rating_container.appendChild(modalImdbScore);

  modal_left_content.appendChild(date_and_rating_container);

  modalDescription = createWrapper("p", movie.description, "Description");
  modal_left_content.appendChild(modalDescription);

  modalAvgVote = createWrapper("span", movie.avg_vote, "Vote");
  modal_right_content.appendChild(modalAvgVote);

  modalGenres = createWrapper("div", movie.genres, "Genres", true);
  modal_right_content.appendChild(modalGenres);

  let modalDirectors = createWrapper(
    "div",
    movie.directors,
    "Directeurs",
    true
  );
  modal_right_content.appendChild(modalDirectors);

  if (movie.duration) {
    modalDuration = createWrapper("div", movie.duration, "Durée", false);
    modal_right_content.appendChild(modalDuration);
  }

  if (movie.countries) {
    modalCountries = createWrapper("div", movie.countries, "Pays", true);
    modal_right_content.appendChild(modalCountries);
  }

  if (movie.long_description) {
    modalLongDescription = createWrapper(
      "div",
      movie.long_description,
      "Résumé",
      false
    );
    modal_right_content.appendChild(modalLongDescription);
  }

  if (movie.actors) {
    modalActors = createWrapper("div", movie.actors, "Acteurs", true);
    modal_right_content.appendChild(modalActors);
  }

  modal.style.display = "block";
  modal.classList.add("visible");
  document.querySelector("main").style.opacity = 0.3;
};

// Fonction pour masquer la modale
const closeModal = () => {
  let modal = document.getElementById("myModal");
  modal.style.display = "none";
  let modal_content = document.querySelector(".modal-content");
  modal_content.innerHTML = "";
  document.querySelector("main").style.opacity = 1;
};

const bloc = [
  "main_category_bloc",
  "first_category_bloc",
  "second_category_bloc",
  "third_category_bloc",
];

// Main movie Section
// Récupère le film le mieux noté puis affiche l'afffiche
getTopRatedMovie()
  .then((movie) => {
    let container = document.querySelector(".main__movie__img__container");
    var image = document.createElement("img");
    image.setAttribute("alt", "Film principal");
    image.classList.add("main__movie__img");
    image.src = movie.image_url;
    container.prepend(image);

    image.src = movie.image_url;
    const title = document.querySelector(".main__movie__title");
    title.innerText = movie.title;
    const description = document.querySelector(".main__movie__description");
    description.innerText = movie.description;

    image.addEventListener("click", function () {
      openModal(movie);
    });
  })
  .catch((error) => {
    console.error("Une erreur s'est produite lors de la requête :", error);
  });

// Most popular movies section
// Récupère les 7 films les mieux noté puis les affichent
getTopRatedMovies(7)
  .then((movies) => {
    create_popular_movies_section(movies);
  })
  .catch((error) => {
    console.error("Une erreur s'est produite lors de la requête :", error);
  });

// Categories sections
let categories = ["Drama", "History", "Comedy"];
createCategorieSections(categories);

// Modal Section
let close_modal = document.querySelector(".js-close-modal");
close_modal.addEventListener("click", function () {
  closeModal();
});

let modal = document.getElementById("myModal");

// Ajoutez un gestionnaire d'événements au clic sur le body
document.body.addEventListener("click", function (event) {
  // Vérifiez si l'élément cliqué est en dehors de la modal(et des enfants)
  if (event.target !== modal && !modal.contains(event.target)) {
    closeModal();
  }
});
