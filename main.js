//Variables
const favListDOM = document.querySelector(".favourite-list");
const favouriteItems = document.querySelector(".favourite-items");
const favList = document.querySelector(".favourite-list");
const cardsDOM = document.querySelector(".cards-wrapper");
const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-content");
const genreSelect = document.querySelector("#genre");

let favouriteList = [];
let popupList = [];
let buttonsDOM = [];

let categoryGroup = [];

//Api
const APIURL = "http://my-json-server.typicode.com/moviedb-tech/movies/list";

//Getting movies
class Movies {
  async getMovies() {
    try {
      let result = await fetch(APIURL);
      let data = await result.json();
      let movies = data;
      const ui = new UI();
      ui.getAllGenres(movies);
      //   getAllGenres();

      console.log(movies);
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

  getMovieDetails(id) {
    fetch(`http://my-json-server.typicode.com/moviedb-tech/movies/list/${id}`)
      .then((response) => {
        const data = response.json();
        return data;
      })
      .then((data) => {
        let arr = [];
        arr.push(data);
        arr.forEach((item) => {
          Storage.savePopupInfo(item);
        });
        console.log(arr);
        return arr;
      })
      .then((item) => {
        item = JSON.parse(localStorage.getItem("cards"));
        Storage.getPopupInfo(item);
        const ui = new UI();
        ui.addPopupInfo(item);
      });
  }
}
//Display movies
class UI {
  // <i class="fa fa-star main-star" data-id=${movie.id}></i>
  displayMovies(movies) {
    let result = "";
    movies.forEach((movie) => {
      result += `
        <div class="card">
        <img 
          src=${movie.img}
          alt="Avatar" />
        <i class="fa fa-star main-star" data-id=${movie.id}></i>
        <div class="container">
          <h4 class="card-name"><b>${movie.name}</b></h4>
          <p>${movie.year}</p>
        </div>
      </div>
        `;
    });
    cardsDOM.innerHTML = result;
  }

  getItemBy(id) {
    favouriteList = favouriteList.filter((item) => item.id === id);
    console.log(favouriteList);
  }

  getStarButtons() {
    const starButtons = [...document.querySelectorAll(".main-star")];
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

  getRemoveBtns() {
    favList.addEventListener("click", (event) => {
      if (event.target.classList.contains("item-remove")) {
        let removeItem = event.target.parentElement;
        favList.removeChild(removeItem);
        console.log(favouriteList);
      }
    });
  }

  displayModalPopup() {
    const cards = [...document.querySelectorAll(".card")];
    cards.forEach((card, idx) => {
      let id = idx + 1;
      card.addEventListener("click", (event) => {
        if (!event.target.classList.contains("main-star")) {
          modal.classList.toggle("display-modal");
          const details = new Movies();
          details.getMovieDetails(id);
        }
      });
    });
  }

  hideModalPopup() {
    modal.addEventListener("click", (event) => {
      if (event.target.classList.contains("close")) {
        modal.classList.toggle("display-modal");
        console.log("test close");
      }
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

  addPopupInfo(item) {
    modalContent.innerHTML = `
    <img src="${item.img}" alt="" />
    <i class="fa fa-star detail-star"></i>
     <span class="close">&times;</span>
     <p>${item.name}</p>
     <p>${item.director}</p>
     <p>${item.description}</p>
 `;
    modal.appendChild(modalContent);
  }

  setupApp() {
    // favouriteList = Storage.getFavouriteList();
    this.populateFavourite(favouriteList);
    // favouriteList = Storage.getFavouriteList();
  }
  populateFavourite(list) {
    list.forEach((item) => {
      this.addFavouriteItem(item);
    });
  }

  getAllGenres(movies) {
    genreSelect.addEventListener("change", (event) => {
      movies.filter((movie) => {
         if(movie) {
            movie.genres.forEach(item => {
               if(item === event.target.value) {
                   
               }
            });
         }
      });
    });
  }

  sortMoviesByGenre() {}
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
  static savePopupInfo(card) {
    localStorage.setItem("cards", JSON.stringify(card));
  }
  static getPopupInfo(card) {
    card = JSON.parse(localStorage.getItem("cards"));
    return card;
  }
  static saveFavouriteList(movies) {
    localStorage.setItem("favourite-list", JSON.stringify(movies));
  }
  static getFavouriteList() {
    return localStorage.getItem("favourite-list")
      ? JSON.parse(localStorage.getItem("favourite-list"))
      : [];
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
      ui.getRemoveBtns();
      ui.sortMoviesByGenre();
      ui.displayModalPopup();
      ui.hideModalPopup();
    });
});
