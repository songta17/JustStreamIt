const mainUrl = "http://localhost:8000/api/v1/titles"

/*
************************************************************
                        FETCH
************************************************************
*/

// Fetch The Best Movie
async function fetchTopMovie() {
  var topMovieTitle = document.getElementsByClassName('title-best-movie')[0]
  var topMovieImg = document.getElementsByClassName('best-movie-img')[0].getElementsByTagName("img")[0];
  await fetch(mainUrl + "?sort_by=-imdb_score")
    .then(response => response.json())
    .then(data => {
      topMovieTitle.innerHTML = data["results"][0]["title"];
      if (data["results"][0]["image_url"] != null)
        topMovieImg.src = data["results"][0]["image_url"];
        topMovieImg.onclick = function() {
          modalMovieDetails(data["results"][0]["id"])
        };      
      var url = data["results"][0]["url"];
      fetchTopMovieDescription(url)
      })
  }

// Fetch the description of a movie
async function fetchTopMovieDescription(url) {
  var topMovieDescription = document.getElementsByClassName('description-carousel')[0].getElementsByTagName("p")[0];

  await fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data["description"] != null)
        topMovieDescription.innerHTML = data["description"]
    })
}

// Fetch the image source of a movie
async function fetchMovieImg(id) {
  let urlImg = ""
  await fetch(mainUrl + "/" + id)
    .then(response => response.json())
    .then(data => {
      if (data["image_url"] != null)
        urlImg = data["image_url"]
    })
  return urlImg
}

// Fetch a category
async function fetchCategory(movieGenre, totalMovie = 7, moviePerPage = 5) { 
  datas = []
  for (let y = 0; y < totalMovie; y++) {
    let pageNumber = y + 2
    await fetch(mainUrl + "?page=" + pageNumber + "&sort_by=-imdb_score&genre=" + movieGenre)
    .then(response => response.json())
    .then(data => {
        for (let i= 0; i < moviePerPage; i++) {
          datas.push(data.results[i].id)
        };
      })
    .catch(error => console.error(error));
  }
  return datas.slice(0, totalMovie);
}

// Fetch a movie details
async function fetchModalData(id) {
  var modalContentImg = document.getElementsByClassName('img-inside-modal')[0]
  var modalContentRated = document.getElementsByClassName('rated-movie-details')[0]
  var modalContentTitle = document.getElementsByClassName('title-movie-details')[0];
  var modalContentDate = document.getElementsByClassName('date-movie-details')[0];
  var modalContentDuration = document.getElementsByClassName('duration-movie-details')[0];
  var modalContentGenre = document.getElementsByClassName('genre-movie-details')[0];
  var modalContentDirector = document.getElementsByClassName('director-movie-details')[0];
  var modalContentActors = document.getElementsByClassName('actors-movie-details')[0];
  var modalContentScoreImdb = document.getElementsByClassName('score-imdb-movie-details')[0];
  var modalContentCountry = document.getElementsByClassName('country-movie-details')[0];
  var modalContentWorldIncome = document.getElementsByClassName('world-income-movie-details')[0];
  var modalContentDescription = document.getElementsByClassName('description-movie-details')[0];

  await fetch(mainUrl + "/" + id)
  .then(response => response.json())
  .then(data => {
    if (data["image_url"] != null)
      modalContentImg.src = data["image_url"];
    if (data["avg_vote"] != null)
      modalContentRated.innerHTML = "Note: " + data["avg_vote"] + "/10";
    if (data["title"] != null)
      modalContentTitle.innerHTML = data["title"];
    if (data["date_published"] != null)
      modalContentDate.innerHTML = "<span>Date de sortie: </span>" + data["date_published"];
    if (data["duration"] != null)
      modalContentDuration.innerHTML = "<span>Durée: </span>" + data["duration"] + "min";
    if (data["genres"] != null)
      modalContentGenre.innerHTML = "<span>Genre: </span>" + data["genres"];
    if (data["directors"] != null)
      modalContentDirector.innerHTML = "<span>Réalisateur: </span>" + data["directors"];
    if (data["actors"] != null)
      modalContentActors.innerHTML = "<span>avec </span>" + data["actors"];
    if (data["imdb_score"] != null)
      modalContentScoreImdb.innerHTML = "<span>Score imdb: </span>" + data["imdb_score"];
    if (data["countries"] != null)
      modalContentCountry.innerHTML = "<span>Pays: </span>" + data["countries"];
    if (data["worldwide_gross_income"] != null)
      modalContentWorldIncome.innerHTML = "<span>Revenue au box office: </span>" + data["worldwide_gross_income"];
    if (data["long_description"] != null)
      modalContentDescription.innerHTML = "<h2>Synopsis</h2><p>" + data["long_description"] + "</p>";
  })
}

/*
************************************************************
                        MODAL
************************************************************
*/

// Open a modal to get details about the movie
function modalMovieDetails(id = "best") { 
  let modalContainer = document.querySelector(".modal-container");
  if (id == "best") { id }
  fetchModalData(id)
  modalContainer.classList.toggle("active")
}

// Close the modal
function closeModal(){
  var modalContainer = document.querySelector(".modal-container");
  modalContainer.classList.toggle("active")
}

/*
************************************************************
                        Generate a category
************************************************************
*/
async function generate_category(categoryName, totalMovie = 7) {
    var categoryList = document.getElementsByClassName(categoryName)[0];
    let idsList = ""
    if (categoryName == "list-best-rated-movies") {
      idsList = await fetchCategory("")
    } else if (categoryName == "list-best-action-movies") {
      idsList = await fetchCategory("Action")
    } else if (categoryName == "list-best-adventure-movies") {
      idsList = await fetchCategory("Adventure")
    } else if (categoryName == "list-best-animation-movies") {
      idsList = await fetchCategory("Animation")
    } else {
      idsList = await fetchCategory("")
    }

    let imgList = []
  
    for (let i = 0; i < totalMovie; i++ ) {
      let imgUrl = await fetchMovieImg(idsList[i])
      // fetch(imgUrl)
      //   .then(response => {
      //     if (response.status === 404) {
      //       console.long_description('non');
      //       imgUrl = "img/background-cinema.jpg";
      //     }
      //     console.log(response.status)
      //   .catch(error => {
      //       console.error(error);
      //     });
      // })

      imgList.push(imgUrl)
      let image = document.createElement("img");
      image.src = imgList[i];
      image.alt = "Movie illustration";
      image.onclick = function() {
        modalMovieDetails(idsList[i])
      }
      categoryList.appendChild(image);

    }
  return imgList
}

/*
************************************************************
                     CAROUSSEL TOGGLE
************************************************************
*/

// Best Action TOGGLE
function carousselToggleBestAction() { 
  let carousselAction = document.querySelector(".list-best-action-movies");
  carousselAction.classList.toggle("active")
}

// Best Animation TOGGLE
function carousselToggleBestAnimation() { 
  let carousselAction = document.querySelector(".list-best-animation-movies");
  carousselAction.classList.toggle("active")
}

// Best Adventure TOGGLE
function carousselToggleBestAdventure() { 
  let carousselAction = document.querySelector(".list-best-adventure-movies");
  carousselAction.classList.toggle("active")
}

// Best Best Rated Movie TOGGLE
function carousselToggleBestRated() { 
  let carousselBestRated = document.querySelector(".list-best-rated-movies");
  carousselBestRated.classList.toggle("active")
}

/*
************************************************************
                     LOADER
************************************************************
*/

// DATA LOADER 
window.addEventListener('load', () => {
  loadData()
});

// Waiting for Data
async function loadData() {
  await fetchTopMovie();
  await generate_category("list-best-rated-movies");
  await generate_category("list-best-action-movies");
  await generate_category("list-best-animation-movies");
  await generate_category("list-best-adventure-movies");
}