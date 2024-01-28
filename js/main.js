/// <reference types="../@types/jquery" />

function sidebar() {
  $(".menu-icon").toggleClass("bi-list bi-x", 500);
  if ($(".menu-icon").hasClass("bi-list")) {
    $(".nav-tab").animate({ width: "toggle", paddingInline: "toggle" }, 500);
    $(".links ul ").addClass("animate__animated animate__fadeOutDown");
    $(".links ul li").each(function (index) {
      $(this)
        .removeClass("animate__fadeInUp")
        .css("animation-delay", index * 200 + "ms");
    });


    if (innerWidth <= 600) {
      $("nav").animate({ height: '15vh' }, 500)
      $(".nav-footer").hide(500)
      $(".nav-icon img").hide(500)
      $(".nav-icon .flex-column i").hide(500)
       $(".navbar").css({ backgroundColor: "transparent" });
    }


  } else {

    $("nav").animate({ left: 0, height: '100vh' }, 500)
    $(".nav-footer").show(500)
    $(".nav-icon img").show(500)
    $(".nav-icon .flex-column i").show(500)
    $(".navbar").css({ backgroundColor: "#dc3545" });

    $(".nav-tab").animate({ width: "toggle", paddingInline: "toggle" }, 500);
    $(".links ul ").removeClass("animate__fadeOutDown");
    $(".links ul li").each(function (index) {
      $(this)
        .addClass("animate__animated animate__fadeInUp")
        .css("animation-delay", index * 200 + "ms");
    });
  }
}

$(".menu-icon").on("click", function () {
  sidebar();
});

async function getMeals(category = "s", name = "") {
  $(".loader").css({ display: "block" });
  $(".loading").css({ display: "flex" });
  $("body").css("overflow", "hidden");
  try {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?${category}=${name}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    if (response.ok) {
      let meals = await response.json();

      $(".loader").fadeOut(1500, function () {
        $(".loading").fadeOut(1500);
        $("body").css("overflow", "auto");
      });
      meals = meals.meals;
      displayMeals(meals);
    }
  } catch (error) {
    console.error("Error fetching meals:", error);
  }
}

function displayMeals(meals) {
  let allMeals = ``;
  for (let i = 0; i < meals.length; i++) {
    allMeals += `
    <div class="col-lg-3 col-md-4 col-sm-6 meal-item" onclick="getMealDetails('${meals[i].idMeal}')">
      <div class="card rounded-3 overflow-hidden border-0">
        <img src="${meals[i].strMealThumb}" class="w-100 " alt="meals">
        <div class="overlay d-flex align-items-center justify-content-center text-center">
          <h3>${meals[i].strMeal}</h3>
        </div>
      </div>
    </div>
  `;
  }

  $(".meal-items").html(allMeals);
  $(".back-button").css({ display: "none" });
}

async function getMealDetails(mealId) {
  $(".loader").css({ display: "block" });
  $(".loading").css({ display: "flex" });
  $("body").css("overflow", "hidden");
  try {
    let res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    if (res.ok) {
      res = await res.json();
      $(".loader").fadeOut(1500, function () {
        $(".loading").fadeOut(1500);
        $("body").css("overflow", "auto");
      });
      displayDetailsMeals(res.meals[0]);
    }
  } catch (error) {
    console.error("Error fetching meal details:", error);
  }
}



function displayDetailsMeals(meal) {
  console.log(meal);
  $("#showSearch").html(``);
  let detailsMeal = ``;
  let ingredients = ``;
  let tag = ``;
  let tagContainer = ``;
  let tags;
  if (meal.strTags != null) {
    tags = meal.strTags.split(",");
    for (let i = 0; i < tags.length; i++) {
      tag += `
            <li class="alert alert-danger me-2 my-1 p-2">${tags[i]}</li>
        `;
    }
    tagContainer += `
     <div class="d-flex flex-wrap align-items-center gap-2">
            <i class="bi bi-tags-fill fs-3 align-self-start"></i>
            <p class=" fs-3 align-self-start">:</p>
            <ul class="d-flex flex-wrap">
              ${tag}
            </ul>
          </div>
    `;
  }

  for (i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info me-2 my-1 p-2">${meal[`strMeasure${i}`]
        } ${meal[`strIngredient${i}`]}</li>`;
    }
  }
  detailsMeal += `
            <div class="col-lg-5 col-md-6">
              <img src="${meal.strMealThumb}" class="w-100 rounded-2" alt="">
            <div class="d-flex align-items-center gap-2 pt-2">
              <i class="fa-solid fa-utensils"></i>
              <h3>: ${meal.strMeal}</h3>
            </div>
              <div class="d-flex align-items-center gap-2">
              <i class="fa-solid fa-location-pin"></i>
              <h3>: ${meal.strArea}</h3>
            </div>
            <div class="d-flex align-items-center gap-2">
              <i class="bi bi-bookmark-fill"></i>
              <h3>: ${meal.strCategory}</h3>
          </div>
        </div>
          <div class="col-lg-7 col-md-6">
          <p>${meal.strInstructions}</p>
          <h2>Ingredients</h2>
          <ul class="d-flex flex-wrap">
          ${ingredients}
          </ul>
          ${tagContainer}
          <div>
            <a target="_blank" class="btn btn-success"
              href="${meal.strSource}">
              Source
            </a>
            <a target="_blank" class="btn btn-danger" href="${meal.strYoutube}">
              Youtube
            </a>
          </div>
        </div>
    `;
  $(".meal-items").html(detailsMeal);
  $(".back-button").css({ display: "block" });
}

getMeals();

function showSearch() {
  $("#showSearch").html(
    `
    <div class='my-5 row g-2'>
        <div class="col-md-6">
            <input type="search" placeholder="Search by Name" class="searchName form-control bg-transparent text-white ">
          </div>
          <div class="col-md-6">
            <input type="search" maxlength="1" placeholder="Search by first Litter"
              class="form-control bg-transparent text-white searchLetter">
          </div>
    </div>
    `
  );

  $(".meal-items").html(``);
}

async function getCategory() {
  $(".loader").css({ display: "block" });
  $(".loading").css({ display: "flex" });
  $("body").css("overflow", "hidden");
  let res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  if (res.ok) {
    res = await res.json();
    $(".loader").fadeOut(1500, function () {
      $(".loading").fadeOut(1500);
      $("body").css("overflow", "auto");
    });
    displayCategory(res.categories);
  }
}

function displayCategory(categories) {
  $("#showSearch").html(``);
  console.log(categories);

  let categoryCards = ``;
  for (i = 0; i < categories.length; i++) {
    categoryCards += `
     <div class="col-lg-3 col-md-4" onclick="getCategoryMeals('c','${categories[i].strCategory
      }')">
                    <div class="position-relative category overflow-hidden rounded-2">
                        <img src="${categories[i].strCategoryThumb
      }" class="w-100" alt="">
                        <div class="overlay d-flex flex-column align-items-center justify-content-center text-center p-1">
                            <h3>${categories[i].strCategory}</h3>
                            <p>${categories[i].strCategoryDescription
        .split(" ")
        .slice(0, 20)
        .join(" ")}</p>
                        </div>
                    </div>
                </div>
    `;
  }
  $(".meal-items").html(categoryCards);
}

async function getCategoryMeals(key, category) {
  $(".loader").css({ display: "block" });
  $(".loading").css({ display: "flex" });
  $("body").css("overflow", "hidden");
  console.log(category);
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?${key}=${category}`
  );
  if (res.ok) {
    res = await res.json();
    $(".loader").fadeOut(1500, function () {
      $(".loading").fadeOut(1500);
      $("body").css("overflow", "auto");
    });
    displayMeals(res.meals.slice(0, 20));
  }
}

async function getData(key, callback) {
  $(".loader").css({ display: "block" });
  $(".loading").css({ display: "flex" });
  $("body").css("overflow", "hidden");
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?${key}=list`
  );
  if (res.ok) {
    res = await res.json();
    $(".loader").fadeOut(1500, function () {
      $(".loading").fadeOut(1500);
      $("body").css("overflow", "auto");
    });
    callback(res.meals);
  }
}

function displayArea(arr) {
  $("#showSearch").html(``);
  let area = ``;
  for (let i = 0; i < arr.length; i++) {
    area += `
          <div class="col-lg-3 col-md-4" onclick="getCategoryMeals('a','${arr[i].strArea}')">
                   <div class="country position-relative category overflow-hidden rounded-2 text-center p-3">
                    <i class="fa-solid fa-globe"></i>
                    <h3>${arr[i].strArea}</h3>
                   </div>
                </div>
    `;
  }
  $(".meal-items").html(area);
}

function displayIngredients(arr) {
  $("#showSearch").html(``);
  arr = arr.slice(0, 20);
  console.log(arr);

  let ingredient = ``;
  for (let i = 0; i < arr.length; i++) {
    ingredient += `
          <div class="col-md-3" onclick="getCategoryMeals('i','${arr[i].strIngredient
      }')">
                   <div class="ingredient text-center p-3">
                    <i class="fa-solid fa-drumstick-bite"></i>
                    <h3>${arr[i].strIngredient}</h3>
                    <p>${arr[i].strDescription
        .split(" ")
        .slice(0, 25)
        .join(" ")}<p/>
                   </div>
                </div>
    `;
  }
  $(".meal-items").html(ingredient);
}

function contact() {
  $("#showSearch").html(``);
  contactInputs = `
                <div class="col-md-6">
                    <input type="text" name="inputName" class="form-control" id="inputName" placeholder="Enter Your Name">
                    <p id="nameMessage" class="m-1 p-1 text-danger d-none text-start">
                          Enter a valid username
                    </p>
                </div>

                <div class="col-md-6">
                    <input type="email" name="inputEmail" class="form-control" id="inputEmail" placeholder="Enter Your Email">
                    <p id="emailMessage" class="m-1 p-1 text-danger d-none text-start">
                          Enter a valid email
                    </p>
                </div>
                <div class="col-md-6">
                    <input type="tel" name="inputPhone" class="form-control" id="inputPhone" placeholder="Enter Your Phone">
                      <p id="phoneMessage" class="m-1 p-1 text-danger d-none text-start">
                          enter a valid Egypt phone number
                    </p>
                </div>
                <div class="col-md-6">
                    <input type="number" name="inputAge" class="form-control" id="inputAge" placeholder="Enter Your Age">
                    <p id="ageMessage" class="m-1 p-1 text-danger d-none text-start">
                          enter a valid age between 1 and 100.
                    </p>
                </div>
                <div class="col-md-6">
                    <input type="password" name="password" class="form-control" id="password" placeholder="Enter Your Password">
                    <p id="passwordMessage" class="m-1 p-1 text-danger d-none text-start">
                          Password must be 8+ characters with a letter, digit, and special character.
                    </p>
                </div>
                <div class="col-md-6">
                    <input type="password" name="cPassword" class="form-control" id="cPassword" placeholder="Confirm Password">
                    <p id="cPasswordMessage" class="m-1 p-1 text-danger d-none text-start">
                          Password didn't match 
                    </p>
                </div>
                <div class="col-12 text-center">
                <button id="contactBtn" class="btn btn-danger" disabled>Submit</button>
            </div>
  `;
  $(".meal-items").html(contactInputs);
}

function validation(regex, userInput, message) {
  if (regex.test(userInput.val())) {
    userInput.addClass("is-valid");
    userInput.removeClass("is-invalid");
    message.addClass("d-none");
    message.removeClass("d-block");
    return true;
  } else {
    userInput.addClass("is-invalid");
    userInput.removeClass("is-valid");
    message.addClass("d-block");
    message.removeClass("d-none");
    return false;
  }
}

function checkPasswordMatch() {
  if (
    $("#cPassword").val() === $("#password").val() &&
    $("#password").val() != ""
  ) {
    $("#cPassword").addClass("is-valid");
    $("#cPassword").removeClass("is-invalid");
    $("#cPasswordMessage").addClass("d-none");
    $("#cPasswordMessage").removeClass("d-block");
    return true;
  } else {
    $("#cPassword").addClass("is-invalid");
    $("#cPassword").removeClass("is-valid");
    $("#cPasswordMessage").addClass("d-block");
    $("#cPasswordMessage").removeClass("d-none");
    return false;
  }
}

$(".links ul li:first-child").on("click", function () {
  showSearch();
  sidebar();
});

$(document).on("input", ".searchName", function () {
  getMeals("s", this.value);
});

$(document).on("input", ".searchLetter", function () {
  getMeals("f", this.value);
});

$(".links ul li:nth-child(2)").on("click", function () {
  getCategory();
  sidebar();
});
$(".links ul li:nth-child(3)").on("click", function () {
  getData("a", displayArea);
  sidebar();
});

$(".links ul li:nth-child(4)").on("click", function () {
  getData("i", displayIngredients);
  sidebar();
});

$(".links ul li:nth-child(5)").on("click", function () {
  contact();
  sidebar();
});

let nameRegex = /^(\w){3,20}$/;
$(document).on("blur", "#inputName", function () {
  validation(nameRegex, $("#inputName"), $("#nameMessage"));
  checkBtn();
});

let emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
$(document).on("blur", "#inputEmail", function () {
  validation(emailRegex, $("#inputEmail"), $("#emailMessage"));
  checkBtn();
});

let PhoneRegex = /^(012|011|010|015)\d{8}$/;
$(document).on("blur", "#inputPhone", function () {
  validation(PhoneRegex, $("#inputPhone"), $("#phoneMessage"));
  checkBtn();
});

let ageRegex = /^[1-9][0-9]?$|^100$/;
$(document).on("blur", "#inputAge", function () {
  validation(ageRegex, $("#inputAge"), $("#ageMessage"));
  checkBtn();
});
let passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

$(document).on("blur", "#password", function () {
  validation(passwordRegex, $("#password"), $("#passwordMessage"));
  checkBtn();
});

$(document).on("blur", "#cPassword", function () {
  checkPasswordMatch();
  checkBtn();
});

function checkBtn() {
  if (
    validation(nameRegex, $("#inputName"), $("#nameMessage")) &&
    validation(emailRegex, $("#inputEmail"), $("#emailMessage")) &&
    validation(PhoneRegex, $("#inputPhone"), $("#phoneMessage")) &&
    validation(ageRegex, $("#inputAge"), $("#ageMessage")) &&
    validation(passwordRegex, $("#password"), $("#passwordMessage")) &&
    checkPasswordMatch()
  ) {
    $("#contactBtn").removeAttr("disabled");
  } else {
    $("#contactBtn").attr("disabled");
  }
}

$(document).on("click", "#contactBtn", function () {
  Swal.fire({
    icon: "success",
    title: "Done",
    showConfirmButton: false,
    timer: 1500,
  });
});

