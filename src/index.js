let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});


document.addEventListener("DOMContentLoaded", function () {
  // Function to create a card element for a toy
  function createToyCard(toy) {
    let card = document.createElement("div");
    card.className = "card";

    let name = document.createElement("h2");
    name.textContent = toy.name;
    card.appendChild(name);

    let image = document.createElement("img");
    image.src = toy.image;
    image.className = "toy-avatar";
    card.appendChild(image);

    let likes = document.createElement("p");
    likes.textContent = "Likes: " + toy.likes;
    card.appendChild(likes);

    let likeButton = document.createElement("button");
    likeButton.className = "like-btn";
    likeButton.id = toy.id;
    likeButton.textContent = "Like";
    card.appendChild(likeButton);

    // Add event listener to like button
    likeButton.addEventListener("click", handleLikeButtonClick);

    return card;
  }

  // Function to handle like button click
  function handleLikeButtonClick(event) {
    let toyId = event.target.id;
    let likesElement = event.target.parentNode.querySelector("p");

    let currentLikes = parseInt(likesElement.textContent.split(":")[1].trim());
    let newLikes = currentLikes + 1;

    fetch("http://localhost:3000/toys/" + toyId, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        likes: newLikes,
      }),
    })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to update toy likes");
        }
      })
      .then(function (data) {
        likesElement.textContent = "Likes: " + data.likes;
      })
      .catch(function (error) {
        console.log("Error updating toy likes:", error);
      });
  }

  // Function to fetch toy objects
  function fetchToys() {
    fetch("http://localhost:3000/toys", {
      method: "GET",
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        let toyCollection = document.getElementById("toy-collection");

        data.forEach(function (toy) {
          let card = createToyCard(toy);
          toyCollection.appendChild(card);
        });
      })
      .catch(function (error) {
        console.log("Error fetching toys:", error);
      });
  }

  // Function to handle toy form submission
  function handleToyFormSubmit(event) {
    event.preventDefault();

    let nameInput = document.querySelector('input[name="name"]');
    let imageInput = document.querySelector('input[name="image"]');

    let newToy = {
      name: nameInput.value,
      image: imageInput.value,
      likes: 0,
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to create toy");
        }
      })
      .then(function (data) {
        let card = createToyCard(data);
        let toyCollection = document.getElementById("toy-collection");
        toyCollection.appendChild(card);
      })
      .catch(function (error) {
        console.log("Error creating toy:", error);
      });

    nameInput.value = "";
    imageInput.value = "";
  }

  // Call the fetchToys function to fetch and display toy objects
  fetchToys();

  // Add event listener to toy form submit event
  let toyForm = document.querySelector(".add-toy-form");
  toyForm.addEventListener("submit", handleToyFormSubmit);
});


