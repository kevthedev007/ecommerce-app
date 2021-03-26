const findDiv = $("#clothes-box");
const findListOfItems = $(".list-of-items");

fetch("https://ecommerce-kmt.herokuapp.com/products")
.then(response => response.json())
.then(productsArray => renderAllProducts(productsArray))
.catch(error => console.log (error))

function done() {
    window.location.reload(false);
}

function renderAllProducts(productsArray) {
    productsArray.forEach(product => renderOneProduct(product))
}


function renderOneProduct(product, cartItem){
        const newElement = document.createElement("div")
        newElement.className= "content col-lg-5"
        newElement.innerHTML = ` 
        <div class="item-card">
            <div class="center">
                <div class="">
                <img src="${product.image_url}" class="image"> </div>
                <h5 class="text-center name-text mt-3">${product.name}</h5>
                <p class="text-center price-text">Price: $${product.price}</p>
                <div class="">
                <button class="add-item btn btn-primary btn-block">Add to Cart</button>
                </div>
                </div>
                </div>
                `
                findDiv.append(newElement);
                
                const addButton = newElement.querySelector(".add-item")
                
                function renderCartItem(cartItem){
                    const newLi = document.createElement("li")
                    newLi.innerHTML = `
                        <div id="lof2"> 
                        <p id="pTag"> ${product.name}: $${product.price}
                        </p>
                        <div class="rmv-btn d-flex justify-content-end">
                        <button class="delete-button btn btn-secondary mb-4">
                            <span>remove</span>
                        </button>
                        </div>
                        <hr>
                        </div>
                    `
                    
                    findListOfItems.append(newLi)
                    
                    
                    const removeButton = newLi.querySelector(".delete-button");
                    removeButton.addEventListener("click", event => {
                        newLi.remove()
                        fetch(`https://ecommerce-kmt.herokuapp.com/cart_items/${product.cart_id}`, {
                            method: "DELETE"
                        })
                        .then(response => response.json())
                        .then(results => {
                            cartArray = results
                            findListOfItems.innerHTML= ""
                            renderAllCartItems(cartArray)}
                            )
                            .catch(error => console.log (error))
                            
                        })
                        
                        
                    }

                    
           
                addButton.addEventListener("click", event => {
                    findListOfItems.innerText = ""
                    
                    fetch("https://ecommerce-kmt.herokuapp.com/cart_items", {
                        method: "POST",
                        headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        product_id: product.id
                    })
                })
                .then(response => response.json())
                .then(newCartItem => {
                    cartArray.push(newCartItem);
                    renderAllCartItems(cartArray)
                })
                .catch(error => console.log (error))
                
                renderCartItem(cartItem)
                
            })
    }
            

fetch("https://ecommerce-kmt.herokuapp.com/cart_items")
.then(response => response.json())
.then(cartItemsArray => {
    cartArray = cartItemsArray.Items;
    renderAllCartItems(cartArray)
})
.catch(error => console.log (error))

function renderAllCartItems(cartArray) {
    cartArray.forEach(cartItem => renderCartItem(cartItem))

    const checkOut = $("#checkout");
        const newDiv = document.createElement("div");
        newDiv.className= "text-center py-3"
        subTotal = cartArray.map(item => item.price);
        const subFloat = subTotal.map(num => parseFloat(num))  
        let sum = subFloat.reduce(function(accumulator, currentValue) {
            return accumulator + currentValue
        }, 0)
        let tax = sum * 0.08;
        checkOut.innerHTML = ""
        newDiv.innerHTML = `
            <p id ="total"> Total: $${(sum.toFixed(2))} </p>
            <button id="target-btn" class="btn btn-success">Check Out</button>
            `  
        checkOut.append(newDiv)


            const amount = sum.toString();
            const checkOutBtn = newDiv.querySelector("#target-btn")
            checkOutBtn.addEventListener("click", event => {
                fetch("https://ecommerce-kmt.herokuapp.com/post", {
                        method: "POST",
                        headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        amount: amount
                    })
                })
                .then(response => response.json())
                .then(url => window.location.href = url)
                .catch(error => console.log (error))
            })

    
}

function renderCartItem(cartItem){
    const newLi = document.createElement("li")
    newLi.innerHTML = `
        <div id="lof2"> 
        <p id="pTag"> ${cartItem.name}: $${cartItem.price}
        </p>
        <div class="rmv-btn d-flex justify-content-sm-end">
        <button class="delete-button btn btn-secondary mb-4">
            <span>remove</span>
        </button>
        </div>
        <hr>
        </div>
    `
    
    findListOfItems.append(newLi)
    
    
    const removeButton = newLi.querySelector(".delete-button");
    removeButton.addEventListener("click", event => {
        newLi.remove()
        fetch(`https://ecommerce-kmt.herokuapp.com/cart_items/${cartItem.cart_id}`, {
            method: "DELETE"
        })
        .then(response => response.json())
        .then(results => {
            cartArray = results
            findListOfItems.innerHTML= ""
            renderAllCartItems(cartArray)}
            )
            .catch(error => console.log (error))
            
        })
               
    }
    
    
    
