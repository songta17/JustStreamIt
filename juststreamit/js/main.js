const mainUrl = "http://localhost:8000/api/v1/titles"

fetchTopMovie()

// Fetch The Best Movie

function fetchTopMovie() {

  var topMovieTitle = document.getElementsByClassName('title-carousel')[0]
  var topMovieImg = document.getElementsByClassName('best-movie-img')[0].getElementsByTagName("img")[0];
  
  fetch(mainUrl)//+ "?sort_by=imdb_score")
    .then(response => response.json())
    .then(data => {
      topMovieTitle.innerHTML = data["results"][0]["title"];
      if (data["results"][0]["image_url"] != null)
        topMovieImg.src = data["results"][0]["image_url"];
        
      var url = data["results"][0]["url"];
      fetchTopMovieDescription(url)
      })
  }

// Fetch the descriptioon of a movie
function fetchTopMovieDescription(url) {
  var topMovieDescription = document.getElementsByClassName('description-carousel')[0].getElementsByTagName("p")[0];

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data["description"])
      if (data["description"] == "Add a Plot")
        topMovieDescription.innerHTML = data["description"]
    })
}

// Open a modal to get details about the movie
function modalMovieDetails() {
  alert("you clicked on the picture to use a modal!")
}
