// Application State (Saving data under Mzedu Data keys)
let inventory = JSON.parse(localStorage.getItem('mzedu_inventory')) || [];
let salesHistory = JSON.parse(localStorage.getItem('mzedu_sales')) || [];

// DOM Elements
const productForm = document.getElementById('product-form');
const prodNameInput = document.getElementById('prod-name');
const prodQtyInput = document.getElementById('prod-qty');
const prodPriceInput = document.getElementById('prod-price');
const inventoryList = document.getElementById('inventory-list');

// Metric Elements
const totalRevenueEl = document.getElementById('total-revenue');
const totalItemsEl = document.getElementById('total-items');
const lowStockCountEl = document.getElementById('low-stock-count');

// Initialize App
function init() {
    updateMetrics();
    renderInventory();
}

// Add/Edit Product Handler
productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newProduct = {
        id: Date.now(),
        name: prodNameInput.value.trim(),
        qty: parseInt(prodQtyInput.value),
        price: parseFloat(prodPriceInput.value)
    };

    inventory.push(newProduct);
    saveData();
    init();

    // Reset Form
    productForm.reset();
});

// Sell Product Handler
function sellItem(id) {
    const product = inventory.find(p => p.id === id);
    if (product && product.qty > 0) {
        product.qty -= 1;
        
        // Log Sale
        salesHistory.push({
            id: Date.now(),
            productId: product.id,
            pricePaid: product.price,
            date: new Date().toISOString()
        });

        saveData();
        init();
    } else {
        alert("Out of stock!");
    }
}

// Delete Product Handler
function deleteItem(id) {
    inventory = inventory.filter(p => p.id !== id);
    saveData();
    init();
}

// Update Dashboard Statistics
function updateMetrics() {
    // Total Revenue
    const revenue = salesHistory.reduce((acc, sale) => acc + sale.pricePaid, 0);
    totalRevenueEl.innerText = `$${revenue.toFixed(2)}`;

    // Total Items
    const totalItems = inventory.reduce((acc, product) => acc + product.qty, 0);
    totalItemsEl.innerText = totalItems;

    // Low Stock Alerts (Items with <= 3 remaining)
    const lowStockItems = inventory.filter(p => p.qty <= 3).length;
    lowStockCountEl.innerText = lowStockItems;
}

// Render dynamic rows to Table
function renderInventory() {
    inventoryList.innerHTML = '';

    if (inventory.length === 0) {
        inventoryList.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted)">No inventory added yet.</td></tr>`;
        return;
    }

    inventory.forEach(product => {
        const row = document.createElement('tr');
        const rowTotal = product.qty * product.price;

        row.innerHTML = `
            <td><strong>${product.name}</strong></td>
            <td>
                <span class="badge" style="background-color: ${product.qty <= 3 ? 'var(--warning)' : 'var(--success)'}">
                    ${product.qty} left
                </span>
            </td>
            <td>$${product.price.toFixed(2)}</td>
            <td>$${rowTotal.toFixed(2)}</td>
            <td>
                <button class="action-btn btn-sell" onclick="sellItem(${product.id})" title="Register 1 Sale">
                    <i class="fa-solid fa-cart-plus"></i> Sell 1
                </button>
                <button class="action-btn btn-delete" onclick="deleteItem(${product.id})" title="Delete Product">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        inventoryList.appendChild(row);
    });
}

// Save to LocalStorage
function saveData() {
    localStorage.setItem('mzedu_inventory', JSON.stringify(inventory));
    localStorage.setItem('mzedu_sales', JSON.stringify(salesHistory));
}

// Kick it off!
init();