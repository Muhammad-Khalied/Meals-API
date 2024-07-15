$(document).ready(function () {
    let sideStart = $('.items').outerWidth();
    let listPosition = 300;
    let api = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    const toggleButtons = $('.toggle-btn i');
    const listItems = $('.list li');
    const searchBtn = $('#search');
    const categoryBtn = $('#categories');
    const areBtn = $('#area');
    const ingredientsBtn = $('#ingredients');
    const contactBtn = $('#contact');




    // Event Listeners

    toggleButtons.on('click', toggleButton);
    searchBtn.on('click', searchPage);
    categoryBtn.on('click', categoryPage);
    areBtn.on('click', areaPage);
    ingredientsBtn.on('click', ingredientPage);
    contactBtn.on('click', contactPage)



    // Functions implementation

    function init() {
        $('.sidebar').css('left', `-${sideStart}px`);
        listItems.css('top', `${listPosition}px`);
        sideStart = 0;
        listPosition = 0;
        finishLoading()
        searchByName('');
    }

    function toggleButton() {
        $(toggleButtons).toggleClass('d-none');
        $('.sidebar').css('left', `-${sideStart}px`);
        sideStart = sideStart === 0 ? $('.items').outerWidth() : 0;
        if(listPosition == 0)
        {
            listItems.each(function(index) {
                $(this).delay(index * 75).animate({
                    top: `${listPosition}`
                }, 0);
            });
        }
        else
        {
            listItems.animate({
                top: `${listPosition}`
            }, 50, "swing");
        }

        listPosition = listPosition === 0 ? 300 : 0;
    }

    function startLoading()
    {
        $('.loading-screen').css('display', 'flex');
    }

    function finishLoading()
    {
        $('.loading-screen').fadeOut(500)
    }

    async function callApi(api)
    {
        startLoading();
        try {
            const result = await fetch(api);
            const response = await result.json();
            finishLoading();
            return response;
        } catch (error) {
            console.log(error);
            finishLoading();
        }
    }

    // Search functions

    async function searchByName(name)
    {
        if(name == '')
        {
            $('.loading-screen').css('z-index', '990');
            $('.inner-loading-screen').css('z-index', '990');
            $('.sidebar').css('z-index', '995');
        }
        let myApi = api + name;
        let response = await callApi(myApi);
        if(response != null)
            displayMeals(response['meals']);
    }

    async function searchById(id)
    {
        let myApi = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id;
        let response = await callApi(myApi);
        // console.log(response['meals'][0]);
        if(response != null)
            return response['meals'][0];
    }

    async function searchByChar(char)
    {
        if(char == '' || char == null)
            return;
        let myApi = "https://www.themealdb.com/api/json/v1/1/search.php?f=" + char;
        let response = await callApi(myApi);
        // console.log(response);
        if(response != null)
            displayMeals(response['meals']);
    }

    function searchNameBtn()
    {
        // console.log('searchNameBtn');
        let name = $('#searchName').val();
        searchByName(name);
    }

    function searchCharBtn()
    {
        if($('#searchChar').val().length > 1)
        {
            $('#searchChar').val($('#searchChar').val().slice(0, 1));
        }
        let char = $('#searchChar').val();
        searchByChar(char);
    }

    async function searchByCategory(category)
    {
        let myApi = "https://www.themealdb.com/api/json/v1/1/filter.php?c=" + category;
        let response = await callApi(myApi);
        if(response != null)
            displayMeals(response['meals'], false);
    }

    async function searchCategories()
    {
        const response = await callApi("https://www.themealdb.com/api/json/v1/1/categories.php");
        // console.log(response);
        if(response != null)
            displayCategories(response['categories']);
    }


    async function searchByArea(area)
    {
        let myApi = "https://www.themealdb.com/api/json/v1/1/filter.php?a=" + area;
        let response = await callApi(myApi);
        if(response != null)
            displayMeals(response['meals'], false);
    }

    async function searchByIngredient(ingredient)
    {
        let myApi = "https://www.themealdb.com/api/json/v1/1/filter.php?i=" + ingredient;
        let response = await callApi(myApi);
        if(response != null)
            displayMeals(response['meals'], false);
    }

    async function searchAreas()
    {
        const response = await callApi("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
        // console.log(response);
        if(response != null)
            displayAreas(response['meals']);
    }

    async function searchIngredients()
    {
        const response = await callApi("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
        // console.log(response);
        if(response != null)
            displayIngredients(response['meals']);
    }


    // Display Functions

    function displayCategories(data)
    {
        if(data == null)
            return;
        let bBox = '';
        startLoading();
        for(let i = 0; i < data.length; i++)
        {
            let item = data[i];
            
            bBox += `
            <div class="col-md-3">
                <div class="meal category position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${item.strCategoryThumb}" alt="${item.strCategory}">
                    <div class="meal-layer position-absolute d-flex flex-column align-items-center text-black p-2">
                        <h3>${item.strCategory}</h3>
                        <p class="text-center">${item.strCategoryDescription.split(' ').slice(0, 20).join(' ')}</p>
                    </div>
                </div>
            </div>
            `;
            $('#menu').html(bBox);
        }
        categoriesEventListeners();
        finishLoading();
    }

    function displayAreas(data)
    {
        if(data == null)
            return;
        let bBox = '';
        startLoading();
        for(let i = 0; i < data.length; i++)
        {
            let item = data[i];
            bBox += `
                <div class="col-md-3">
                    <div class="area rounded-2 text-center cursor-pointer">
                        <i class="fas fa-house-laptop fa-4x"></i>
                        <h3>${item.strArea}</h3>
                    </div>
                </div>
            `;
            $('#menu').html(bBox);
        }
        areasEventListeners();
        finishLoading();
    }

    function displayIngredients(data)
    {
        if(data == null)
            return;
        let bBox = '';
        let length = data.length;
        length = Math.min(20, length);
        startLoading();
        for(let i = 0; i < length; i++)
        {
            let item = data[i];
            bBox += `
                <div class="col-md-3">
                    <div class="ingredient rounded-2 text-center cursor-pointer">
                        <i class="fas fa-drumstick-bite fa-4x"></i>
                        <h3>${item.strIngredient}</h3>
                        <p>${item.strDescription.split(' ').slice(0, 20).join(' ')}</p>
                    </div>
                </div>
            `;
            $('#menu').html(bBox);
        }
        ingredientsEventListeners();
        finishLoading();
    }

    function displayMeals(data, all = true)
    {
        let bBox = '';
        if(data == null)
            return;
        let length = data.length;
        startLoading();
        if(!all)
            length = Math.min(20, length);
        for(let i = 0; i < length; i++)
        {
            let item = data[i];
            bBox += `
            <div class="col-md-3">
                <div class="meal position-relative overflow-hidden rounded-2 cursor-pointer" id="${item.idMeal}">
                    <img class="w-100" src="${item.strMealThumb}" alt="${item.strMeal}">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${item.strMeal}</h3>
                    </div>
                </div>
            </div>
            `;
        }
        $('#menu').html(bBox);
        mealsEventListeners(data);
        finishLoading();
    }

    function displayMeal(meal)
    {
        startLoading();
        let measuresList = '';
        for(let i = 0 ; i < 20; i++)
        {
            let measure = meal[`strMeasure${i + 1}`];
            let ingredient = meal[`strIngredient${i + 1}`];
            if(measure != ' ' && measure != null && measure != '' && ingredient != ' ' && ingredient != null && ingredient != '')
            {
                measuresList += `
                <li class="alert alert-info m-2 p-1">${measure} ${ingredient}</li>
                `;
            }
            else
            {
                break;
            }
        }

        let tags = meal.strTags;
        if(tags != null)
        {
            tags = tags.split(',');
            // console.log(tags);
            tags = tags.map(tag => `<li class="alert alert-danger m-2 p-1">${tag}</li>`);
            // console.log(tags);
            tags = tags.join('');
        }
        else
        {
            tags = '';
        }

        let bBox = `
            <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${measuresList}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tags}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>
        `;
        $('#menu').html(bBox);
        finishLoading();
    }

    function mealsEventListeners()
    {
        $('.meal').on('click',async function () {
            let id = $(this).attr('id');
            let meal = await searchById(id);
            // console.log(meal);
            closeMenu()
            displayMeal(meal);
        });
    }

    function categoriesEventListeners()
    {
        $('.category').on('click', function (e) {
            let category = e.currentTarget;
            category = category.children[1].children[0].innerText;
            // console.log(category);
            closeMenu()
            searchByCategory(category);
        });
    }

    function areasEventListeners()
    {
        $('.area').on('click', function (e) {
            let area = e.currentTarget;
            area = area.children[1].innerText;
            closeMenu()
            searchByArea(area);
        });
    }

    function ingredientsEventListeners()
    {
        $('.ingredient').on('click', function (e) {
            let ingredient = e.currentTarget;
            ingredient = ingredient.children[1].innerText;
            // console.log(ingredient);
            closeMenu()
            searchByIngredient(ingredient);
        });
    }

    function closeMenu()
    {
        if(sideStart != 0)
            toggleButton();
    }

    function searchPage()
    {
        closeMenu();
        let content = `
        <div class="mx-auto position-relative" id="searchContainer">
            <div class="row py-4 ">
                <div class="col-md-6 ">
                    <input class="form-control bg-transparent text-white" type="text" id="searchName" placeholder="Search By Name">
                </div>
                <div class="col-md-6">
                    <input class="form-control bg-transparent text-white" type="text" id="searchChar" placeholder="Search By First Letter">
                </div>
            </div>
        </div>
        `;
        $('#menu').html('');
        $('.search-part').html(content);
        $('#searchContainer').css('z-index', '994');
        // console.log($('#searchContainer'));

        const searchName = $('#searchName');
        const searchChar = $('#searchChar');
        searchName.on('input', searchNameBtn);
        searchChar.on('input', searchCharBtn);
    }

    function categoryPage()
    {
        closeMenu();
        $('#menu').html('');
        $('.search-part').html('');
        searchCategories();
    }

    function areaPage()
    {
        closeMenu();
        $('#menu').html('');
        $('.search-part').html('');
        searchAreas();
    }

    function ingredientPage()
    {
        closeMenu();
        $('#menu').html('');
        $('.search-part').html('');
        
        searchIngredients();
    }

    function contactPage()
    {
        closeMenu();
        $('#menu').html('');
        $('.search-part').html('');
        let content = `
            <div class="container w-75 text-center">
                <div class="row g-4">
                    <div class="col-md-6">
                        <input id="nameInput" type="text" class="form-control" placeholder="Enter Your Name">
                        <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Special characters and numbers not allowed
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="emailInput" type="email" class="form-control " placeholder="Enter Your Email">
                        <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Email not valid *exemple@yyy.zzz
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="phoneInput" type="text" class="form-control " placeholder="Enter Your Phone">
                        <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid Phone Number
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="ageInput" type="number" class="form-control " placeholder="Enter Your Age">
                        <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid age
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="passwordInput" type="password" class="form-control " placeholder="Enter Your Password">
                        <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid password *Minimum eight characters, at least one letter and one number:*
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="repasswordInput" type="password" class="form-control " placeholder="Repassword">
                        <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                            The passwords don't match *Re-enter the password*
                        </div>
                    </div>
                </div>
                <button id="submitBtn" disabled="" class="btn btn-outline-danger px-2 mt-3">Submit</button>
            </div>
        `;
        $('#menu').html(content);
        contactEventListeners();
    }

    function contactEventListeners()
    {
        $('.form-control').on('input', function (e) {
            inputsValidation(e.target);
            if(validateAll())
            {
                $('#submitBtn').removeAttr('disabled');

            }
            else
            {
                $('#submitBtn').attr('disabled', '');
            }
        });
        $('#submitBtn').on('click', function () {
            alert('Form Submitted');
            $('#submitBtn').attr('disabled', '');
            let inputs = $('.form-control');
            inputs.each(function(index) {
                $(this).val('');
            });
        });
    }

    function inputsValidation(target)
    {
        regex = {
            nameInput : /^[a-zA-Z]{3,30}$/,
            emailInput : /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/,
            phoneInput : /^(?:\+20|0)?1[0125][0-9]{8}$/,
            ageInput : /^[1-9][0-9]{0,2}$/,
            passwordInput : /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
        }

        let id = target.getAttribute('id');
        if(id == 'repasswordInput')
            return validatePasswordMatch();
        let input = $(`#${id}`);
        let value = input.val();
        let alert = input.siblings()[0];

        if(!regex[id].test(value))
        {
            if($(alert).hasClass('d-none'))
                $(alert).removeClass('d-none');
            return false;
        }
        else if(!$(alert).hasClass('d-none'))
        {
            $(alert).addClass('d-none');
        }
        return true;


    }

    function validateAll()
    {
        regex = {
            nameInput : /^[a-zA-Z]{3,30}$/,
            emailInput : /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/,
            phoneInput : /^(?:\+20|0)?1[0125][0-9]{8}$/,
            ageInput : /^[1-9][0-9]{0,2}$/,
            passwordInput : /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
        }

        let valid = true;
        let inputs = $('.form-control');
        // console.log(inputs);
        for(let i = 0; i < inputs.length - 1; i++)
        {
            let input = $(inputs[i]);
            let id = input.attr('id');
            let value = input.val();
            if(!regex[id].test(value))
            {
                valid = false;
                break;
            }
        }
        
        return valid && validatePasswordMatch();
    }

    function validatePasswordMatch()
    {
        let password = $('#passwordInput').val();
        let repassword = $('#repasswordInput').val();
        let alert = $('#repasswordAlert');
        if(password != repassword)
        {
            if(alert.hasClass('d-none'))
                alert.removeClass('d-none');
            return false;
        }
        else if(!alert.hasClass('d-none'))
        {
            alert.addClass('d-none');
        }
        return true;
    }


    // Function Calls

    init();
    
    
});





