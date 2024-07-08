const stock = io();
const role = document.getElementById("role").textContent;
const email = document.getElementById("email").textContent;

socket.on("products", (data) => {
    renderProducts(data)
})

const renderProducts =  (products) => {
    const containProducts = document.getElementById("containProducts");
    containProducts.innerHTML = "";

    products.docs.forEach(item => {
        const card = document.createElement("div") ;
        card.classList.add("card");

        card.innerHTML = `
                            <p> ${item.title} </p>
                            <p> ${item.price} </p>
                            <button> Delete </button>
                        `;

        containProducts.appendChild(card);
        card.querySelector("button").addEventListener("click", () => {
            if(role === "premium" && item.owner === email){
                deleteProduct(item._id);
            } else if(role === "admin"){
                deleteProduct(item._id);
            } else {
                Swal.fire({
                    title: "Error",
                    text: "You dont have permisson to deleted that product",
                })
            }
        })
    })

}

const deleteProduct = (id) => {
    socket.emit("deleteProduct", id);
}

document.getElementById("btnSend").addEventListener("click", () => {
    addProduct();
})

const addProduct = () => {
    const role = document.getElementById("role").textContent;
    const email = document.getElementById("email").textContent;

    const owner = role === "premium" ? email: "admin";

    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
        owner
    }
    
    socket.emit("addProduct", product);
}