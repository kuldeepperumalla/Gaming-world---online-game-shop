"use strict";
//variables
const body = document.querySelector('body');
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");
const loginBtn = document.querySelector(".login-button")
const loginModal = document.querySelector('.login-modal')
const loginClose = document.querySelector('.login-close')
const forgotPass = document.querySelector('.pass');
const forgotPassClose = document.querySelector('.forgot-close')
const signupModal = document.querySelector(".signup_link");
const account = document.querySelector(".account_name");
const userName = document.querySelector(".userName");
const signoutbtn = document.querySelector('.signoutbtn');
const renderModalContent = document.querySelector('.modal-content')
// cart
let cart = [];
let buttonsDOM = [];
let loginStatus = false;
let singleProduct = [];

//end of test

// getting the products
class Products {
    async getProducts() {
        try {
            let result = await fetch('./games.json', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            let data = await result.json();
            let products = data.items;
            products = products.map(item => {
                const { id } = item.sys;
                const { Title, Price, Release_date, Game_file_size, Genre, Description } = item.fields;
                const image = item.fields.image.fields.file.url;
                return { Title, Price, id, image, Release_date, Game_file_size, Genre, Description }
            })
            return products
        } catch (error) {
            document.write(`<h1 style="margin-top: 40vh; text-align: center">Sorry! <br>File not found${error}</h1>`)
            console.log("File not found", error);
        }
    }


}

// display products
class UI {
    displayProducts(products) {
        let result = '';
        products.forEach(product => {
            result += `
            <article id="p-scroll" class="product">
            <div class="img-container">
                <img src=${product.image} alt="product" class="product-img">
                
               
                <div class="imageBtns">
                <button class="info-btn" onclick="productModal(${product.id})" data-id=${product.id}>
                <i class="fas fa-bars"></i>               
                </button>
                              
                </button>
                
                <button class="bag-btn" data-id=${product.id}>
                    <i class="fas fa-shopping-cart"></i>
                    add to cart
                </button>
                </div>
               
            </div>
            <div class="product-tile">
                <p>24/07/21</p>
                <h3>${product.Title}</h3>
                <h4>$${product.Price}</h4>
                <p>${product.Genre}</p>
            </div>
        </article>
            `
        });
        productsDOM.innerHTML = result;
    }
    addToCartBtns() {
        const buttons = [...document.querySelectorAll('.bag-btn')];
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if (inCart) {
                button.innerText = "In- Cart";
                button.disabled = true;
            }

            button.addEventListener('click', (e) => {
                e.target.innerText = "In cart";
                e.target.disabled = true;
                // getting product from products
                let cartItem = { ...Storage.getProducts(id), amount: 1 };
                // add the product to cart
                cart = [...cart, cartItem]
                // save cart in the local storage
                Storage.saveCart(cart);
                // set cart values
                this.setCartValues(cart);
                // display cart item
                this.addCartItem(cartItem)
                //show the cart
                this.showCart();
            })

        });
    }



    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.Price * item.amount;
            itemsTotal += item.amount
        })
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;

    }
    addCartItem(item) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
        <img src=${item.image}>
        <div>
            <h4>${item.Title}</h4>
            <h5>$${item.Price}</h5>
            <span class="remove-item" data-id=${item.id}>remove</span>
        </div>
        <div>
            <i class="fas fa-chevron-up" data-id=${item.id}> </i>
            <p class="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>
        
        `
        cartContent.appendChild(div);

    }

    showDescModal() {

    }
    showCart() {
        if (loginStatus) {
            cartOverlay.classList.add('transparentBcg');
            cartDOM.classList.add('showCart');
            body.style.overflow = "hidden"
        } else {
            login();
        }

    }

    setupAPP() {
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart)
    }
    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));
    }
    hideCart() {
        cartOverlay.classList.remove("transparentBcg");
        cartDOM.classList.remove("showCart");
        body.style.overflow = "auto"
    }
    cartLogic() {
        clearCartBtn.addEventListener('click', () => {
            this.clearCart();
        });
        cartContent.addEventListener('click', event => {
            if (event.target.classList.contains('remove-item')) {
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild
                    (removeItem.parentElement.parentElement);
                this.removeItem(id);

            }
            else if (event.target.classList.contains('fa-chevron-up')) {
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerHTML = tempItem.amount;
            }
            else if (event.target.classList.contains('fa-chevron-down')) {
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount - 1;
                if (tempItem.amount > 0) {
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                } else {
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id)
                }
            }
        })
    }
    clearCart() {
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        cartContent.innerHTML = ""
        this.hideCart()
    }

    removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`
    }
    getSingleButton(id) {
        return buttonsDOM.find(button => button.dataset.id === id);
    }
}

// local storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products))
    }
    static getProducts(id) {
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id)
    }
    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart))
    }

    static getCart() {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
    }
    static singleProduct(singleProduct) {
        localStorage.setItem('description', JSON.stringify(singleProduct))
    }
}

// log in
$(document).ready(function () {

    $("#signup-form").submit(function () {
        var nm1 = $("#name1").val().trim();
        var ps1 = $("#pass1").val().trim();
        var email = $("#email").val().trim();
        var ps1confirm = $("#confirmPass").val().trim();
        var patternEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}\b/;
        var patternUsername = /^[A-Za-z0-9]{3,30}$/;
        var patternPassword = /^[a-zA-Z0-9!@#$%^&*]{6,20}$/;
        var isValid = true;
        if (email == "") {
            document.querySelector('.signup-error').style.display = "block";
            document.querySelector('.signup-error').innerHTML = "Email is Required";
            setTimeout(function () {
                document.querySelector('.signup-error').style.display = "none"
            }, 3000)
            isValid = false;
        }
        else if (!patternEmail.test(email)) {
            document.querySelector('.signup-error').style.display = "block";
            document.querySelector('.signup-error').innerHTML = "Invalid Email";
            setTimeout(function () {
                document.querySelector('.signup-error').style.display = "none"
            }, 3000)
            isValid = false;
        }
        if (isValid) {
            if (nm1 == "") {
                document.querySelector('.signup-error').style.display = "block";
                document.querySelector('.signup-error').innerHTML = "Name Required";
                setTimeout(function () {
                    document.querySelector('.signup-error').style.display = "none"
                }, 3000)
                isValid = false;
            }
            else if (!patternUsername.test(nm1)) {
                document.querySelector('.signup-error').style.display = "block";
                document.querySelector('.signup-error').innerHTML = "Invalid Name";
                setTimeout(function () {
                    document.querySelector('.signup-error').style.display = "none"
                }, 3000)
                isValid = false;
            }
        }
        if (isValid) {
            if (ps1 == "") {
                document.querySelector('.signup-error').style.display = "block";
                document.querySelector('.signup-error').innerHTML = "Password Required";
                setTimeout(function () {
                    document.querySelector('.signup-error').style.display = "none"
                }, 3000)
                isValid = false;
            }
            else if (!patternPassword.test(ps1)) {
                document.querySelector('.signup-error').style.display = "block";
                document.querySelector('.signup-error').innerHTML = "Invalid Password. Length Should be atleast 6 Characters";
                setTimeout(function () {
                    document.querySelector('.signup-error').style.display = "none"
                }, 3000)
                isValid = false;
            }
            else if (ps1 !== ps1confirm) {
                document.querySelector('.signup-error').style.display = "block";
                document.querySelector('.signup-error').innerHTML = "Passwords do not match";
                setTimeout(function () {
                    document.querySelector('.signup-error').style.display = "none"
                }, 3000)
                isValid = false;
            }
        }
        if (isValid) {
            document.getElementById('signup-form').innerHTML = "";
            document.getElementById('signupHead').innerHTML = `<p>Signup successful</p><br><p>Please login!</p> `
            setTimeout(function () {
                login()
            }, 1500)
            localStorage.setItem("username", nm1);
            localStorage.setItem("password", ps1);
            localStorage.setItem("email", email);
        }



    });
    $("#login-form").submit(function () {
        var enteredName = $("#name2").val();
        var enteredPass = $("#pass2").val();
        var storedName = localStorage.getItem("username");
        var storedPass = localStorage.getItem("password");

        if (enteredName == storedName && enteredPass == storedPass) {
            loginBtn.style.display = "none";
            account.style.display = "flex";
            userName.innerHTML = enteredName;
            loginStatus = true;
            closeLogin();

        }
        else {

            document.querySelector('.error').style.display = "block"
            setTimeout(function () {
                document.querySelector('.error').style.display = "none"
            }, 3000)
        }

    });
    $("#forgotPassword").submit(function () {
        var RegisteredEmail = localStorage.getItem("email")
        var ForgotPassEmail = $("#forgotPasswordEmail").val();
        if (ForgotPassEmail == RegisteredEmail) {
            document.querySelector('.displayMsg').innerHTML = "password has been sent to your email!"
            setTimeout(function () {
                closeForgotPass();
            }, 1200)
        } else {
            document.querySelector('.displayMsg').innerHTML = ForgotPassEmail, "Please check your Email and try again!"
        }
    })
});

// event click
loginBtn.addEventListener("click", login);
signupModal.addEventListener("click", signUp);
forgotPass.addEventListener('click', forgotPassModal);
signoutbtn.addEventListener('click', signout)

// event close
loginClose.addEventListener("click", closeLogin);
document.querySelector('.signup-close').addEventListener("click", closesignUp);
forgotPassClose.addEventListener("click", closeForgotPass);

// close modal
function closeLogin() {
    loginModal.style.display = "none";
    document.querySelector('.pass-modal').style.display = "none";
    body.style.overflow = "auto";
    document.querySelector('.products').style.display = 'block';
}
function closeForgotPass() {

    document.querySelector('.pass-modal').style.display = "none";
    body.style.overflow = "auto";
    document.querySelector('.products').style.display = 'block';
}
function closesignUp() {
    document.querySelector('.signup-modal').style.display = "none";
    body.style.overflow = "auto";
    document.querySelector('.products').style.display = 'block';
}
// login modal
function login() {
    loginModal.style.display = "flex";
    document.querySelector('.signup-modal').style.display = "none";
    body.style.overflow = "hidden";
    document.querySelector('.products').style.display = 'none';
}
// 
function signUp() {
    body.style.overflow = "none";
    loginModal.style.display = "none";
    document.querySelector('.pass-modal').style.display = "none";
    document.querySelector('.products').style.display = 'none';
    document.querySelector('.signup-modal').style.display = "flex";
}

// forgot pass modal
function forgotPassModal() {
    loginModal.style.display = "none";
    document.querySelector('.pass-modal').style.display = "flex";
}

function signout() {
    loginBtn.style.display = "flex";
    account.style.display = "none";
    loginStatus = false;
}
// Description modal

function productModal(elementId) {

    const products = new Products();

    products.getProducts().then((allProducts) => {
        for (let i = 0; i < allProducts.length; i++) {
            if (allProducts[i].id == elementId) {
                // singleProduct.push(allProducts[i]);
                console.log('allProducts[i]', allProducts[i]);
                const productID = allProducts[i].id;
                const productTitle = allProducts[i].Title;
                const productDesc = allProducts[i].Description;
                const productImage = allProducts[i].image;
                const productPrice = allProducts[i].Price;
                const productSize = allProducts[i].Game_file_size;
                singleProduct.push(allProducts[i])

                let result = "";
                result += `
                <span class="close" onclick="descriptionModalClose()">&times;</span>
                        <h2 class="titleDescrition">${productTitle}</h2>
                        <div class="details">
            
                            <img src=${productImage} alt="">
            
                            <div class="content">
            
                                <h4>Description:</h4>
                                <br>
                                <p>${productDesc}</p>
                                <br>
                                <h4>Size: <span class="size">${productSize}</span></h4>
                                <br>
                                <!--  
                                <p>Price: $${productPrice}</p>
                                <br>
                                           
                <button onclick="addToCartBtnsModal()" class="bag-btn second" data-id=${productID}>
                <i class="fas fa-shopping-cart"></i>
                add to cart
            </button>
            -->
                            </div>
                        </div>                                                                      
                        `
                renderModalContent.innerHTML = result;
            }
        }

    })
    descriptionModalShow();
    console.log(singleProduct);
}
// function addToCartBtnsModal() {
//     const modalUI = new UI()
//     const buttons = [...document.querySelectorAll('.bag-btn ')];
//     buttonsDOM = buttons;
//     buttons.forEach(button => {
//         let id = button.dataset.id;
//         let inCart = cart.find(item => item.id === id);
//         if (inCart) {
//             button.innerText = "In- Cart";
//             button.disabled = true;
//         }

//         button.addEventListener('click', (e) => {
//             e.target.innerText = "In cart";
//             e.target.disabled = true;
//             getting product from products
//             let cartItem = { ...Storage.getProducts(id), amount: 1 };
//             cart = [...cart, cartItem];
//             Storage.saveCart(cart);
//             modalUI.setCartValues(cart);
//             modalUI.addCartItem(cartItem)
//             modalUI.showCart();
//             descriptionModalClose();
//         })

//     });
// }

var modal = document.getElementById("modal-description");


function descriptionModalShow() {
    modal.style.display = "flex";
}

function descriptionModalClose() {
    modal.style.display = "none";
    singleProduct.pop()
    console.log(singleProduct);
}



// DOM Content loader

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI()
    const products = new Products();
    ui.setupAPP();

    products.getProducts().then(products => {
        ui.displayProducts(products)

        Storage.saveProducts(products)
    }).then(() => {

        ui.addToCartBtns();

        ui.cartLogic()


    })

})













