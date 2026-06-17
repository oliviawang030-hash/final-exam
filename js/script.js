function toggleReview(title) {
    const content = title.nextElementSibling;
    const arrow = title.querySelector(".arrow");

    if (content.style.display === "block") {
        content.style.display = "none";
        arrow.innerHTML = ">";
    } else {
        content.style.display = "block";
        arrow.innerHTML = "˅";
    }
}

//新增評論
function addReview(){
    // 【已修正】：將原本錯誤的反斜線 \\" 移除，改回正確的 "rating"
    let star = document.querySelector('input[name=\"rating\"]:checked');
    let comment = document.getElementById("comment").value;

    if(star == null || comment==""){
        alert("請完成評價");
        return;
    }

    // 發表評論前先檢查是否有會員登入
    let savedUser = localStorage.getItem('loggedInUser');
    if (!savedUser) {
        alert("請先登入會員才能發表評論！");
        return;
    }
    
    let userObj = JSON.parse(savedUser);

    // 1. 撈出網頁上的商品名稱
    let pName = document.getElementById("productName") ? document.getElementById("productName").innerText : "經典原木質感衣架(10入)";
    
    // 2. 打包要傳到的會員中心的 reviewData (評論)
    let reviewData = {
        productName: pName,
        rating: Number(star.value), // 確保傳過去的是數字星等
        comment: comment    
    };

    // 3. 用目前登入會員專屬的電話號碼當作 Key 名稱，精準區隔每位會員的評論箱
    let reviewKey = 'userReviews_' + userObj.phone;
    let currentReviews = JSON.parse(localStorage.getItem(reviewKey)) || [];

    // 4. 把這筆新發表的評論資料塞進個人陣列中
    currentReviews.push(reviewData);

    // 5. 重新裝箱放回資料庫
    localStorage.setItem(reviewKey, JSON.stringify(currentReviews));

    // 6. 網頁商品當前畫面上即時顯示（這裡保留你原本的前端呈現邏輯）
    let name = userObj.name || "王小美"; 
    let date = new Date().toLocaleDateString();
    let number = 6 - star.value;
    let review = document.createElement("div");

    review.className="review";

    review.innerHTML=`

        <div class="review-star">
            ${"★".repeat(number)}
        </div>

        <div class="review-info">

            <div class="review-name">
                ${name}
            </div>

            <div class="review-date">
                ${date}
            </div>

        </div>

        <p>
            ${comment}
        </p>

    `;

    document.getElementById("reviewList").appendChild(review);
    document.getElementById("comment").value="";
    alert("評論發表成功！已同步儲存至您的會員紀錄。");
}

//數量鍵
let num = 1;
function plus(){
    num++;
    document.getElementById("num").innerHTML=num;
}

function minus(){
    if(num > 1){
        num--;
    }
    document.getElementById("num").innerHTML=num;
}

/*已加入購物車*/
function cartClick(){

    let product = {

        name:document.getElementById("productName").innerText,

        price:Number(
            document
            .getElementById("productPrice")
            .innerText
            .replace(/[^0-9]/g,"")
        ),

        img:document.getElementById("productImg").src,

        num:num

    };


    let cart = JSON.parse(localStorage.getItem("cart")) || [];


    cart.push(product);


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    alert("已加入購物車！");

}

//直接購買功能
function buyClick() {
    let savedUser = localStorage.getItem('loggedInUser');
    if (!savedUser) {
        alert("請先登入會員才能購買！");
        window.location.href = "membership.html";
        return;
    }

    let pName = document.getElementById("productName") ? document.getElementById("productName").innerText : "經典原木質感衣架(10入)";
    let priceElement = document.querySelector(".price");
    let price = priceElement ? Number(priceElement.innerText.replace(/[^0-9]/g, '')) : 1190;
    let quantity = document.getElementById("num") ? Number(document.getElementById("num").innerHTML) : 1;
    let imgElement = document.querySelector(".item-img");
    let imgScr = imgElement ? imgElement.getAttribute("src") : "";

    let directBuyItem = [{
        productName: pName,
        price: price,
        num: quantity,
        img: imgScr
    }];

    localStorage.setItem('checkoutType', 'direct');
    localStorage.setItem('checkoutItems', JSON.stringify(directBuyItem));

    alert("即將前往結帳頁面！");
    window.location.href = "checkout.html";
}

function initTopButton() {
    //回到頂部//
    const topBtn = document.getElementById("topBtn");

    // 顯示/隱藏
    window.addEventListener("scroll", () => {
    topBtn.style.display = window.scrollY > 50 ? "block" : "none";
    });

    // 回到最上面
    topBtn.addEventListener("click", () => {
    window.scrollTo(0, 0);
    });
}
initTopButton();

//推薦商品
let recIdx = 1;
let recAutoPlay;

function changeRecSlide(ctrl){
    showRecSlides(recIdx + ctrl);
}

function showRecSlides(idx){
    recIdx = idx;
    let slides = document.getElementsByClassName("rec-slide");
    let dots = document.getElementsByClassName("rec-dot");

    if(recIdx > slides.length){
        recIdx = 1;
    }else if(recIdx == 0){
        recIdx = slides.length;
    }

    for(let i=0;i<slides.length;i++){
        slides[i].className = slides[i].className.replace(" rec-show","");
        dots[i].className = dots[i].className.replace(" rec-active","");
    }

    slides[recIdx-1].className += " rec-show";
    dots[recIdx-1].className += " rec-active";
    setRecAutoPlay();
}

function setRecAutoPlay(){
    if(recAutoPlay != undefined)
        clearInterval(recAutoPlay);
    recAutoPlay = setInterval(function(){
        changeRecSlide(1);
    },2500);
}
showRecSlides(recIdx);