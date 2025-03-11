document.addEventListener("DOMContentLoaded", () => {
    const orderForm = document.getElementById("orderForm");
    const ordersList = document.getElementById("ordersList");
    const productsContainer = document.getElementById("products");

    const chickenPartPrices = {
        Ala: 8,
        Pierna: 10,
        Encuentro: 10,
        Pecho: 10,
        Mostrito: 13,
        Aguadito: 4,
        Caldo_de_Gallina: 8,
        Cebada_Litro: 4,
        CebadaChica: 1.5,
        Chicha: 4,
        Chicha_Chica: 1.5,
        Agua_Mineral: 2,
        Gaseosa: 3,
        InkaKola: 4,
        CocaCola: 4,
        Fanta: 4,
        Sprite: 4
    };

    function loadOrders() {
        const storedOrders = localStorage.getItem("orders");
        if (storedOrders) {
            return JSON.parse(storedOrders);
        }
        return [];
    }

    function saveOrders(orders) {
        localStorage.setItem("orders", JSON.stringify(orders));
    }

    function renderProducts() {
        productsContainer.innerHTML = "";
        Object.keys(chickenPartPrices).forEach(part => {
            const div = document.createElement("div");
            div.classList.add("product-item");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = part;

            const label = document.createElement("label");
            label.textContent = `${part} (S/${chickenPartPrices[part]})`;

            const quantityInput = document.createElement("input");
            quantityInput.type = "number";
            quantityInput.value = 1;
            quantityInput.min = 1;
            quantityInput.style.display = "none";

            checkbox.addEventListener("change", () => {
                quantityInput.style.display = checkbox.checked ? "inline-block" : "none";
            });

            div.appendChild(checkbox);
            div.appendChild(label);
            div.appendChild(quantityInput);
            productsContainer.appendChild(div);
        });
    }

    function renderOrders() {
        ordersList.innerHTML = "";
        const orders = loadOrders();

        orders.forEach(order => {
            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = order.customerName;
            row.appendChild(nameCell);

            const productsCell = document.createElement("td");
            productsCell.textContent = order.chickenParts.map(p => `${p.part} x ${p.quantity}`).join(", ");
            row.appendChild(productsCell);

            const priceCell = document.createElement("td");
            priceCell.textContent = `S/${order.totalPrice}`;
            row.appendChild(priceCell);

            const statusCell = document.createElement("td");
            const statusSelect = document.createElement("select");
            ["Pendiente", "Llevar", "Cancelado"].forEach(status => {
                const option = document.createElement("option");
                option.value = status;
                option.textContent = status;
                if (order.status === status) option.selected = true;
                statusSelect.appendChild(option);
            });

            statusSelect.addEventListener("change", () => {
                order.status = statusSelect.value;
                saveOrders(orders);
            });

            statusCell.appendChild(statusSelect);
            row.appendChild(statusCell);

            ordersList.appendChild(row);
        });
    }

    orderForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const customerName = document.getElementById("customerName").value;
        if (!customerName) return;

        const selectedParts = [];
        document.querySelectorAll("#products input[type=checkbox]").forEach(checkbox => {
            if (checkbox.checked) {
                const quantity = checkbox.parentElement.querySelector("input[type=number]").value;
                selectedParts.push({ part: checkbox.value, quantity: Number(quantity) });
            }
        });

        if (selectedParts.length === 0) return;

        const totalPrice = selectedParts.reduce((total, part) => total + chickenPartPrices[part.part] * part.quantity, 0);
        const newOrder = { id: Date.now(), customerName, chickenParts: selectedParts, totalPrice, status: "Pendiente" };

        const orders = loadOrders();
        orders.push(newOrder);
        saveOrders(orders);

        orderForm.reset();
        renderOrders();
    });

    renderProducts();
    renderOrders();
});
