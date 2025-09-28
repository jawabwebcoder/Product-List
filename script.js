// Default products agar localStorage khali ho
let products = JSON.parse(localStorage.getItem("products")) || [
  { name: "Keyboard", price: 1500, gst: 18, discount: 5 },
  { name: "Mouse", price: 800, gst: 12, discount: 0 },
  { name: "Monitor", price: 10000, gst: 18, discount: 10 },
  { name: "USB Cable", price: 300, gst: 5, discount: 0 }
];

function renderTable() {
  const tbody = document.querySelector("#productTable tbody");
  tbody.innerHTML = "";
  products.forEach((p, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${p.name}</td>
        <td>${p.price}</td>
        <td>${p.gst}%</td>
        <td>${p.discount || 0}%</td>
        <td>${calculateFinalPrice(p).toFixed(2)}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editProduct(${i})">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteProduct(${i})">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
  localStorage.setItem("products", JSON.stringify(products));
}

function calculateFinalPrice(product) {
  let gstAmount = (product.price * product.gst) / 100;
  let discountAmount = (product.price * (product.discount || 0)) / 100;
  return product.price + gstAmount - discountAmount;
}

document.getElementById("productForm").addEventListener("submit", function(e) {
  e.preventDefault();
  let id = document.getElementById("productId").value;
  let name = document.getElementById("productName").value;
  let price = parseFloat(document.getElementById("productPrice").value);
  let gst = parseFloat(document.getElementById("gst").value);
  let discount = parseFloat(document.getElementById("discount").value) || 0;

  let product = { name, price, gst, discount };

  if (id === "") {
    products.push(product);
  } else {
    products[id] = product;
  }

  renderTable();
  document.getElementById("productForm").reset();
  document.getElementById("productId").value = "";
  bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
});

function editProduct(index) {
  let p = products[index];
  document.getElementById("productId").value = index;
  document.getElementById("productName").value = p.name;
  document.getElementById("productPrice").value = p.price;
  document.getElementById("gst").value = p.gst;
  document.getElementById("discount").value = p.discount;
  new bootstrap.Modal(document.getElementById("productModal")).show();
}

function deleteProduct(index) {
  if (confirm("Are you sure?")) {
    products.splice(index, 1);
    renderTable();
  }
}

// Search
document.getElementById("searchInput").addEventListener("keyup", function() {
  let filter = this.value.toLowerCase();
  let rows = document.querySelectorAll("#productTable tbody tr");
  rows.forEach(row => {
    let text = row.innerText.toLowerCase();
    row.style.display = text.includes(filter) ? "" : "none";
  });
});

document.getElementById("clearSearch").addEventListener("click", function() {
  document.getElementById("searchInput").value = "";
  renderTable();
});

// Initial render
renderTable();
