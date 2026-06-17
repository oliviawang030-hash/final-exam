function changeNum(btn,num){
    let number = btn.parentElement.querySelector("span");
    let value = Number(number.innerHTML);

    value += num;

    if(value < 1){
        value = 1;
    }

    number.innerHTML=value;

    saveCart();
    updatePrice();
}

function updatePrice(){

    let items = document.querySelectorAll(".car-item");

    let total=0;
    items.forEach(item=>{
        let priceElement = item.querySelector(".price");
        let price =Number(item.querySelector(".price").dataset.price);
        
        if (isNaN(price)) {
            price = Number(priceElement.innerHTML.replace(/[^0-9]/g, ''));
        }
        
        let num =Number(item.querySelector(".number span").innerHTML);
        
        let money = price*num;
        item.querySelector(".subtotal").innerHTML = "NT$"+money;
        total += money;

    });
    document.getElementById("total").innerHTML=total;
        
}


function deleteItem(btn){
    btn.parentElement.remove();
    updatePrice();
    saveCart();
}


function checkout(){
    alert("前往結帳頁面");
}



//顯示購物車

showCart();



function showCart(){


    let cart = JSON.parse(localStorage.getItem("cart")) || [];


    let list = document.getElementById("cartList");


    list.innerHTML="";



    cart.forEach(item=>{


        list.innerHTML += `


        <div class="car-item">


            <div class="product">


                <img src="${item.img}">


                <span>${item.name}</span>


            </div>



            <div class="price" data-price="${item.price}">

                NT$${item.price}

            </div>



            <div class="number">


                <button onclick="changeNum(this,-1)">
                    -
                </button>



                <span>
                    ${item.num}
                </span>



                <button onclick="changeNum(this,1)">
                    +
                </button>


            </div>




            <div class="subtotal">

                NT$${item.price * item.num}

            </div>




            <button class="delete" onclick="deleteItem(this)">
                ×
            </button>



        </div>



        `;


    });


    updatePrice();


}


function changeNum(btn,num){


    let number = btn.parentElement.querySelector("span");


    let value = Number(number.innerHTML);


    value += num;


    if(value < 1){

        value=1;

    }


    number.innerHTML=value;


    updatePrice();


}


function updatePrice(){


    let items=document.querySelectorAll(".car-item");


    let total=0;



    items.forEach(item=>{

        let price =  Number(item.querySelector(".price").dataset.price);
        let num = Number(item.querySelector(".number span").innerHTML);
        let money=price*num;

        item.querySelector(".subtotal").innerHTML=
        "NT$"+money;

        total+=money;

    });

    document.getElementById("total").innerHTML=total;
}

function deleteItem(btn){

    btn.parentElement.remove();
    updatePrice();
}

function checkout(){
    alert("前往結帳頁面");
}




//同步localStorage 
function saveCart(){ 
    let items=document.querySelectorAll(".car-item"); 
    let cart=[]; 
    items.forEach(item=>{ 
        let price = Number(item.querySelector(".price").dataset.price);
        if (isNaN(price)) {
            price = Number(item.querySelector(".price").innerHTML.replace(/[^0-9]/g, ''));
        }

        cart.push({ 
            name:item.querySelector(".product span").innerHTML, 
            img:item.querySelector("img").src, 
            price:Number(item.querySelector(".price").dataset.price), 
            num:Number(item.querySelector(".number span").innerHTML) 
        }); 
    }); 
    localStorage.setItem( "cart", JSON.stringify(cart) 
    ); 
}