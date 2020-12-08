//Variables
const favListDOM = document.querySelector(".favourite-list");
const favouriteItems = document.querySelector(".favourite-items");
const favList = document.querySelector(".favourite-list");
const cardsDOM = document.querySelector(".cards-wrapper");
const modal = document.querySelector(".modal");
const closeBtn = document.querySelector(".close");

//Api
const APIURL = "http://my-json-server.typicode.com/moviedb-tech/movies/list";

const getMovieDetails = function (id) {
  fetch(`http://my-json-server.typicode.com/moviedb-tech/movies/list/${id}`)
    .then((response) => {
      const data = response.json();
      return data;
    })
    .then((data) => {
      console.log(data);
    });
};

getMovieDetails(5);

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
    movies.forEach(movie => {
        
    })
  }

  createDetailsCard(cards) {
    let result = "";
    cards.forEach((card) => {
      result += `
          <div class="modal-content">
          <img src="${card.src}" alt="" />
          <span class="close">&times;</span>
          <p>${card.name}</p>
          <p>${card.description}</p>
          <p>${card.year}</p>
          <p>genre</p>
        </div>
          `;
      modal.innerHTML = result;
    });
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
      const cards = [...document.querySelectorAll('.card')];
      cards.forEach(card => {
          card.addEventListener('click', (event) => {
            if(!event.target.classList.contains('main-star')) {
                modal.classList.toggle('display-modal');
            }
          })
      });
    // cardsDOM.addEventListener("click", (event) => {
    //     if(event.target.classList.contains('card')) {
    //         modal.classList.toggle('display-modal');
    //     }
    // });
  }

  hideModalPopup() {
    closeBtn.addEventListener("click", () => {
        modal.classList.toggle('display-modal');
    });
  }

  //   removeFavouriteItem(id) {
  //     favouriteList = favouriteList.filter((item) => item.id !== id);
  //     Storage.saveFavouriteList(favouriteList);
  //   }

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
    // favouriteList = Storage.getFavouriteList();
    this.populateFavourite(favouriteList);
    // favouriteList = Storage.getFavouriteList();
  }
  populateFavourite(list) {
    list.forEach((item) => {
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
    })
    .then(() => {
      ui.displayModalPopup();
    })
    .then(() => {
      ui.hideModalPopup();
    });
});
