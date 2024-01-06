let containerTag = document.querySelector(".container");
let inputTag = document.querySelector("input");
let productContainerTag = document.querySelector(".productContainer");
let addedProductContainerTag = document.querySelector(".addedProductContainer");
let showFilteredProductsTag = document.querySelector(".showFilteredProducts");
let unorderListTag = document.querySelector("ul");
let homeTag = document.querySelector(".home");
let cartTag = document.querySelector(".cart");
let searchTag = document.querySelector(".search");
let closeTag = document.querySelector(".close");
let alertTag = document.querySelector(".alert");
let listTag = document.querySelectorAll("li");
let totalQuantityNum = document.querySelector(".totalQuantity");

let addIconTag;
let addedProducts = localStorage.getItem("addedProducts")
  ? JSON.parse(localStorage.getItem("addedProducts"))
  : [];

let deleteIconClass = "delete icon fa-regular fa-trash-can";
let addIconClass = "add icon fa-solid fa-plus";

let filteredProducts = [];

/* ===== FETCH API ===== */
let products;
let url = "https://dummyjson.com/products";
let fetchdata = async () => {
  let response = fetch(url);
  let productData = (await response).json();
  let productList = await productData;
  products = productList.products;
  inputTag.disabled = false;
  showProducts();
};
fetchdata().catch((error) => {
  console.log(error);
});

/* ===== REUSEABLE FUNCTIONS ===== */
let showQuantity = () => {
  totalQuantityNum.innerHTML = `
      <div>${addedProducts.length}</div>`;
};

let madeProductHolder = (product, icon, i, className, title) => {
  return `<div class="${className}">
    <img src=${product[i].thumbnail} alt="product thumbnail">
    <span>${product[i].title}</span>
    <span class = "price">Price: $${product[i].price}</span>
    <i class="${icon}" title= "${title}"></i>
  </div>`;
};

let showAddedProducts = () => {
  addedProductContainerTag.innerHTML = "";
  for (let i = 0; i < addedProducts.length; i++) {
    addedProductContainerTag.innerHTML += madeProductHolder(
      addedProducts,
      deleteIconClass,
      i,
      "productHolder",
      "Delete from Cart"
    );

    /* ===== DELETE PRODUCTS LISTENER ===== */
    deleteProductFunction();
  }
};

let addToCartFunction = (product) => {
  addIconTag = document.querySelectorAll(".add");
  addIconTag.forEach((addIcon, i) => {
    addIcon.addEventListener("click", () => {
      /* ===== SET TO LOCALSTORAGE ===== */
      addedProducts.push({
        thumbnail: product[i].thumbnail,
        title: product[i].title,
        price: product[i].price,
      });
      setToLocalStorage();

      /* ===== DISPLAY ALERT ===== */
      addIcon.style.backgroundColor = "tomato";
      setTimeout(() => {
        addIcon.style.backgroundColor = "#6b6a6a";
        alertTag.style.top = "0";
      }, 300);
      setTimeout(() => {
        alertTag.style.top = "-62px";
      }, 1000);

      /* ===== SHOW QUANTITY ===== */
      showQuantity();
      showAddedProducts();
    });
  });
};

let deleteProductFunction = () => {
  let deleteIconTag = document.querySelectorAll(".delete");
  deleteIconTag.forEach((deleteIcon, i) => {
    deleteIcon.addEventListener("click", () => {
      addedProducts.splice(i, 1);
      /* ===== SET TO LOCALSTORAGE ===== */
      setToLocalStorage();

      /* ===== SHOW ADDED PRODUCTS ===== */
      showAddedProducts();

      /* ===== SHOW QUANTITY ===== */
      showQuantity();
    });
  });
};

let setToLocalStorage = () => {
  localStorage.setItem("addedProducts", JSON.stringify(addedProducts));
};

let closeInputXFilterContainer = () => {
  searchTag.style.display = "block";
  inputTag.style.display = "none";
  closeTag.style.display = "none";
  containerTag.style.marginTop = "3.6rem";
};

/* ===== SHOW PRODUCTS ON HOME ===== */
let showProducts = () => {
  for (let i = 0; i < products.length; i++) {
    productContainerTag.innerHTML += madeProductHolder(
      products,
      addIconClass,
      i,
      "productHolder",
      "Add to Cart"
    );

    /* ===== SHOW QUANTITY ===== */
    showQuantity();
  }

  /* ===== ADD PRODUCTS TO CART ===== */
  addToCartFunction(products);
};

/* ===== EVENT LISTENER ===== */
homeTag.addEventListener("click", () => {
  location.reload();
  homeTag.classList.add("active");
  cartTag.classList.remove("active");
  addedProductContainerTag.style.display = "none";
  productContainerTag.style.display = "grid";
  showFilteredProductsTag.style.display = "none";
  closeInputXFilterContainer();
});

cartTag.addEventListener("click", () => {
  homeTag.classList.remove("active");
  cartTag.classList.add("active");
  productContainerTag.style.display = "none";
  addedProductContainerTag.style.display = "grid";
  showFilteredProductsTag.style.display = "none";
  closeInputXFilterContainer();
});

searchTag.addEventListener("click", () => {
  inputTag.value = "";
  inputTag.style.display = "block";
  searchTag.style.display = "none";
  closeTag.style.display = "block";
  showFilteredProductsTag.innerHTML = "";
  containerTag.style.marginTop = "6.6rem";
  showFilteredProductsTag.style.display = "flex";
  productContainerTag.style.display = "none";
  addedProductContainerTag.style.display = "none";
  inputTag.focus();
});

closeTag.addEventListener("click", () => {
  showFilteredProductsTag.style.display = "none";
  closeInputXFilterContainer();
  if (homeTag.classList.contains("active")) {
    productContainerTag.style.display = "grid";
  } else {
    addedProductContainerTag.style.display = "grid";
  }
});

/* ===== SEARCH BAR ===== */
inputTag.addEventListener("keyup", (event) => {
  let searchText = event.target.value.toLowerCase();
  filteredProducts = products.filter((product) => {
    return product.title.toLowerCase().includes(searchText);
  });

  /* ===== SHOW FILTERED PRODUCTS ===== */
  if (filteredProducts.length > 0) {
    showFilteredProductsTag.innerHTML = "";

    for (let i = 0; i < filteredProducts.length; i++) {
      if (searchText.length === 0) {
        return;
      }
      showFilteredProductsTag.innerHTML += madeProductHolder(
        filteredProducts,
        addIconClass,
        i,
        "filteredProductsHolder",
        "Add to Cart"
      );
    }

    /* ===== ADD PRODUCTS TO CART ===== */
    addToCartFunction(filteredProducts);
  }
});

window.onload = () => {
  showAddedProducts();
  showQuantity();
};
