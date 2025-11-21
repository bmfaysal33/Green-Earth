// All trees shown

const loadTrees = () => {

  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/plants`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayTrees(data.plants));
};

const displayTrees = (trees) => {
  // console.log(trees);

  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";

  trees.forEach((tree) => {
    // console.log(tree);
    const treeCard = document.createElement("div");

    treeCard.innerHTML = `   
        <div class="card bg-base-100 w-full shadow-sm">
            <figure class="p-2">
              <img
                src='${tree.image}'
                alt="Tree"
                class="rounded-xl object-cover h-48 w-full"
              />
            </figure>
            <div class="card-body items-start text-left ">
              <div class = "w-full"> 
              <h2 onclick="loadModalDesc(${tree.id})" class="card-title cursor-pointer">${tree.name}</h2>
              <p class = " line-clamp-4">
                ${tree.description}
              </p>
              </div>
              <div
                class="flex flex-row justify-between items-center w-full my-2"
              >
                <button class="btn rounded-full bg-green-200 text-green-700">
                  ${tree.category}
                </button>
                <div><p class="font-semibold"> $${tree.price}</p></div>
              </div>
              <div class="card-actions w-full mx-auto">
                <button onClick="cartBtn(${tree.id})" class="btn rounded-full bg-green-400 w-full">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
                    `;

    cardContainer.appendChild(treeCard);
  });
  manageSpinner(false);
};

// Spinner effect

const manageSpinner = (status) => {
  if (status == true) {
    const spinner = document
      .getElementById("spinner")
      .classList.remove("hidden");

    const cardContainer = document
      .getElementById("main-section")
      .classList.add("hidden");
  } else {
    const spinner = document.getElementById("spinner").classList.add("hidden");
    const cardContainer = document
      .getElementById("main-section")
      .classList.remove("hidden");
  }
};

// Modal description

const loadModalDesc = (id) => {
  const url = `https://openapi.programming-hero.com/api/plant/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayModalInfo(data.plants));
};

const displayModalInfo = (modalNo) => {
  // console.log(modalNo);

  const modalInfoContainer = document.getElementById("myModal");
  modalInfoContainer.innerHTML = `
   <div class="modal-box">
              <h1 class="text-3xl font-bold mb-2">${modalNo.name}</h1>
              <div class="p-2 w-full">
                <img
                  class="rounded-xl object-cover h-52 w-full"
                  src="${modalNo.image}"
                  alt=""
                />
              </div>

              <div class="flex items-center mb-2">
                <h3 class="font-bold mr-1">Category:</h3>
                <p>${modalNo.category}</p>
              </div>


              <div class="flex items-center mb-2">
                <h3 class="font-bold mr-1">Price:</h3>
                <p>$${modalNo.price}</p>
              </div>


              <div class="flex ">
                <h3 class="font-bold mr-1">Description:</h3>
                <br>
                <p>${modalNo.description}</p>
              </div>


              <div class="modal-action">
                <form method="dialog">
                  <!-- if there is a button in form, it will close the modal -->
                  <button class="btn">Close</button>
                </form>
              </div>
            </div>
  `;

  modalInfoContainer.showModal();
};

// Left side --- Category

// Show active

const removeActive = () => {
  const activeClass = document.querySelectorAll(" .trees-category");
  activeClass.forEach((category) => {
    console.log(category);
    category.classList.remove("active");
  });
};

const loadCategory = () => {
  const url = "https://openapi.programming-hero.com/api/categories";
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      displayCategory(data.categories);
    });
};

const displayCategory = (category) => {
  // console.log(category);

  const categoryContainer = document.getElementById("category-container");
  categoryContainer.innerHTML = "";

  category.forEach((name) => {
    const showCategory = document.createElement("ul");

    showCategory.innerHTML = `
         <li onClick="treesByCategory(${name.id})" id="category-num-${name.id}" class="hover:bg-green-300 hover:rounded-xl trees-category"><a>${name.category_name}</a></li> `;

    categoryContainer.appendChild(showCategory);
  });
};

// Category wise trees load

const treesByCategory = (id) => {
  fetch(`https://openapi.programming-hero.com/api/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      removeActive(); // Removes active class from all category

      displayTrees(data.plants); // Displays trees based on category

      // Adds active class to clicked category
      const clickCategory = document.getElementById(`category-num-${id}`);
      clickCategory.classList.add("active");
    });
};

// Show category active function

// Right side ---- Cart history

const cartBtn = (id) => {
  fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
    .then((res) => res.json())
    .then((data) => showCartBtn(data.plants));
};

const showCartBtn = (id) => {
  // console.log(id);

  const cartContainer = document.getElementById("cartContainer");
  // console.log(cartContainer);
  // cartContainer.innerHTML = "";

  const div = document.createElement("div");
  div.innerHTML = `
  
              <div id="cart-${id.id}"
                class="w-full h-16 p-3 bg-white rounded-xl my-3 flex justify-between items-center"
              >
                <div>
                  <h1 class="font-semibold">${id.name}</h1>
                  <p>$${id.price} * 1</p>
                </div>
                <div>
                  <i id="cut-price-${id.id}" class="fa-solid fa-xmark cursor-pointer"></i>
                </div>
              </div>
  `;
  cartContainer.appendChild(div);

  // Total Price Calculation

  const totalPrice = document.getElementById("total-price");
  const previousTotal = parseFloat(totalPrice.innerText);
  const newTotal = previousTotal + id.price;
  totalPrice.innerText = newTotal.toFixed(2);

  // Remove item + deduct price

  document
    .getElementById(`cut-price-${id.id}`)
    .addEventListener("click", () => {
      const price = parseFloat(id.price);
      const currentTotal = parseFloat(totalPrice.innerText);
      const updatedTotal = currentTotal - price;
      totalPrice.innerText = updatedTotal.toFixed(2);

      // Remove item from cart
      const secificCart = document.getElementById(`cart-${id.id}`);
      secificCart.remove();
    });
};

loadCategory();
loadTrees();
