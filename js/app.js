const createSpan  = (tag) => {return document.createElement(tag)};
const addClass    = (html, text) => {html.classList.add(text)};
const changeHTML  = (html, text) => {html.textContent = text};
const appendChild = (parent, child) => {parent.appendChild(child)};
let totalPrice = 0;

function addToCart() {
    // Getting the HTML elements that need to be manipulate
    let product     = document.getElementById('produto').value;
    let quantity    = parseInt(document.getElementById('quantidade').value);
    let list        = document.getElementById('lista-produtos');
    let newEntry    = document.createElement('section');
    let total       = document.getElementById('valor-total');
    // Verify if the quantity field is valid
    if(isNaN(quantity) || quantity === '' || quantity <= 0) {
        alert('Quantidade inválida! Por favor, insira um número válido.'); 
        return;
    } 

    // Creating new span to add products to cart
    let spanQty   = createSpan('span');
    let spanProd  = createSpan('span');
    let spanPrice = createSpan('span');
    // Getting product name
    let prodName  = product.split('-')[0].trim();

    // Converting the price to a float value and in case the value have a comma swap to dot and accept values with 2 decimals for proper functionality
    // Although .trim() .replace() and .toFixed() is not really necessary here i'm just simulating a case where i would need to ensure i would have to properly check and parse the input value
    let price = parseFloat(product.split('R$')[1].trim().replace(',', '.'));
    // Getting the total price for the product select and quantity
    price = price * quantity;

    // My new section receveis the same style as the one that is static in the HTML
    addClass(newEntry, 'carrinho__produtos__produto');
    // Adding style and product qty for the span 
    addClass(spanQty,'texto-azul');
    changeHTML(spanQty, `${quantity}x`);
    // Created a new style to provide a margin space between the product name and other info
    addClass(spanProd, 'produto-nome')
    changeHTML(spanProd, prodName);
    // Adding style and price for the span 
    addClass(spanPrice,'texto-azul');
    changeHTML(spanPrice, `R$${price}`);
    // Appending the new span to the new section created into the list that already exist in the HTML file
    appendChild(newEntry, spanQty);
    appendChild(newEntry, spanProd);
    appendChild(newEntry, spanPrice);

    let existingItem = findExistingItem(list, prodName);
    //Check if existingItem is defined meaning receive the html values
    if (existingItem) {
        updateExistingItem(existingItem, price, quantity, totalPrice, total);
    }
    else {
        addNewItemCart(list, newEntry, price, totalPrice, total);
    }

    document.getElementById('quantidade').value = '';
}
// Clear the cart of all items
function clearCart() {
    // Get the relevant html elements to be cleared.
    document.getElementById('lista-produtos').textContent ='';
    document.getElementById('valor-total').textContent = '';
    document.getElementById('quantidade').value = '';
    totalPrice = 0;
}

// Check if the product already exists in the cart by converting the html to an array from list.children getting all relevants elements inside List
// Uses the method find to search the whole array trying to find a matching product
function findExistingItem(list, prodName) {   
    return Array.from(list.children).find(item => {
            // In the HTML file both quantity and price have the texto-azul CSS class but the product name doesn't so it searchs for it selecting the element that doesn't have that CSS
            const productNameElement = item.querySelector('span:not(.texto-azul)');
            // Check if produtNameElement is not null and then proceeds to check if one of such product is already on cart.
            return productNameElement && productNameElement.textContent.trim() === prodName;
        });
}    

function addNewItemCart(list, newEntry, price, updateTotal, total) {
    appendChild(list, newEntry);
    // Update cart total
    totalPrice = updateTotal + price;
    changeHTML(total, `R$ ${totalPrice.toFixed(2)}`);
}

function updateExistingItem(existingItem, price, quantity, updateTotal, total) {

    // Get the elements where both quantity and price are in the HTML
    const quantitySpan = existingItem.querySelector('.texto-azul');
    const priceSpan = existingItem.querySelector('.texto-azul:last-child');
    // Convert the value existing in the HTML to a integer number and adds with the quantity on screen finally changing the content in the HTML
    let currentQuantity = parseInt(quantitySpan.textContent);
    currentQuantity += quantity;
    quantitySpan.textContent = `${currentQuantity}x`;
    // Convert the value existing in the HTML to a integer number and adds with the price calculate previously and change the HTML
    let currentPrice = parseFloat(priceSpan.textContent.replace('R$', ''));
    currentPrice += price;
    priceSpan.textContent = `R$${currentPrice.toFixed(2)}`;
    
    // Even if we didn't append a new item we need to add the price of the amount of the same item that was added.
    totalPrice = updateTotal + price;
    changeHTML(total, `R$ ${totalPrice.toFixed(2)}`);    
}