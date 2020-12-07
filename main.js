//Variables
const favListDOM = document.querySelector(".favourite-list");
const favouriteItems = document.querySelector(".favourite-items");
const favList = document.querySelector(".favourite-list");
const cardsDOM = document.querySelector(".cards-wrapper");

//Api
const APIURL = "http://my-json-server.typicode.com/moviedb-tech/movies/list";

let favouriteList = [];
//Buttons
let buttonsDOM = [];

//Getting movies
class Movies {
  async getMovies() {
    try {
      let result = await fetch(APIURL);
      let data = await result.json();
      let movies = data;
      movies = movies.map((item) => {
        const name = item.name;
        const year = item.year;
        const id = item.id;
        const img = item.img;
        return { name, year, id, img };
      });
      return movies;
    } catch (error) {
      console.log(error);
    }
  }
}
//Display movies
class UI {
  // <i class="fa fa-star main-star" data-id=${movie.id}></i>
  displayMovies(movies) {
    console.log(movies);
    let result = "";
    movies.forEach((movie) => {
      result += `
        <div class="card">
        <img 
          src=${movie.img}
          alt="Avatar" />
        <i class="fa fa-star main-star"></i>
        <div class="container">
          <h4 class="card-name"><b>${movie.name}</b></h4>
          <p>${movie.year}</p>
        </div>
      </div>
        
        `;
    });
    cardsDOM.innerHTML = result;
  }
  getStarButtons() {
    const starButtons = [...document.querySelectorAll(".main-star")];
    buttonsDOM = starButtons;
    starButtons.forEach((button, idx) => {
      let id = idx + 1;
      let inFavList = favouriteList.find((item) => item.id === id);
      if (inFavList) {
        button.classList.add("favourite-color");
      }
      button.addEventListener("click", (event) => {
        event.target.classList.toggle("favourite-color");
        //Get movie from movies
        let movieItem = Storage.getMovie(id);
        //Add movie to favourite list
        if (event.target.classList.contains("favourite-color")) {
          favouriteList = [...favouriteList, movieItem];
          //Save list in local storage
          Storage.saveFavouriteList(favouriteList);
          //Display movie item
          this.addFavouriteItem(movieItem);
        } else {
          console.log("empty array");
        }
      });
    });
  }
  
  addFavouriteItem(item) {
    const listItem = document.createElement("li");
    listItem.classList.add("favourite-list__item");
    listItem.innerHTML = `
        <i class="fa fa-star list-star"></i>
        <span class="list-icon">${item.name}</span>
        <a class="item-remove">remove</a>
      `;
    favList.appendChild(listItem);
  }
  setupApp() {
      favouriteList = Storage.getFavouriteList();
      this.populateFavourite(favouriteList);
  }
  populateFavourite(list) {
     list.forEach(item => {
         this.addFavouriteItem(item);
     });
  }
}
//Local Storage
class Storage {
  static saveMovies(movies) {
    localStorage.setItem("movies", JSON.stringify(movies));
  }
  static getMovie(id) {
    let movies = JSON.parse(localStorage.getItem("movies"));
    return movies.find((movie) => movie.id === id);
  }
  static saveFavouriteList(movies) {
    localStorage.setItem("favourite-list", JSON.stringify(movies));
  }
  static getFavouriteList() {
      return localStorage.getItem('favourite-list') ? JSON.parse(localStorage.getItem('favourite-list')) : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const movies = new Movies();
  
  //Setup aap
  ui.setupApp();
  //Get all movies
  movies
    .getMovies()
    .then((movies) => {
      ui.displayMovies(movies);
      Storage.saveMovies(movies);
    })
    .then(() => {
      ui.getStarButtons();
    });
});
