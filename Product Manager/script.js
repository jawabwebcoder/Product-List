let products = [
  { name: 'Wireless Mouse', price: 1200.00, gst: 18, discount: 0 },
  { name: 'Mechanical Keyboard', price: 4500.00, gst: 18, discount: 0 },
  { name: '27" Monitor', price: 22000.00, gst: 18, discount: 0 }
];

if (localStorage.getItem('products_v1')) {
  try { 
    products = JSON.parse(localStorage.getItem('products_v1')).map(p => ({ ...p, discount: p.discount || 0 }));
  } catch(e) {}
}

const tbody = document.querySelector('#productTable tbody');
const totalCountEl = document.getElementById('totalCount');
const productModal = new bootstrap.Modal(document.getElementById('productModal'));

function calculateTotal(price, gst, discount) {
  const gstTotal = Number(price) + (Number(price) * Number(gst) / 100);
  const finalTotal = gstTotal - (gstTotal * Number(discount) / 100);
  return Number(finalTotal.toFixed(2));
}

function renderTable(list = products) {
  tbody.innerHTML = '';
  list.forEach((p, idx) => {
    const discount = p.discount || 0;
    const finalPrice = calculateTotal(p.price, p.gst, discount);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${escapeHtml(p.name)}</td>
      <td class="text-end">${Number(p.price).toLocaleString()}</td>
      <td class="text-end">${Number(p.gst)}</td>
      <td class="text-end">${Number(discount)}</td>
      <td class="text-end">${finalPrice.toLocaleString()}</td>
      <td class="table-actions">
        <button class="btn btn-sm btn-outline-primary" data-action="edit" data-index="${idx}" title="Edit"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-outline-danger" data-action="delete" data-index="${idx}" title="Delete"><i class="bi bi-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  totalCountEl.textContent = list.length;
  saveToStorage();
}

function escapeHtml(str) {
  return String(str).replace(/[&<>\"]/g, function(tag) {
    const charsToReplace = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
    return charsToReplace[tag] || tag;
  });
}

function saveToStorage() {
  localStorage.setItem('products_v1', JSON.stringify(products));
}

const form = document.getElementById('productForm');
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const idx = document.getElementById('productIndex').value;
  const name = document.getElementById('productName').value.trim();
  const price = parseFloat(document.getElementById('productPrice').value) || 0;
  const gst = parseFloat(document.getElementById('productGst').value) || 0;
  const discount = parseFloat(document.getElementById('productDiscount').value) || 0;

  const record = { name, price, gst, discount };

  if (idx === '') {
    products.push(record);
  } else {
    products[Number(idx)] = record;
  }

  renderTable();
  productModal.hide();
  form.reset();
  document.getElementById('productIndex').value = '';
});

tbody.addEventListener('click', function(e) {
  const btn = e.target.closest('button');
  if (!btn) return;
  const action = btn.getAttribute('data-action');
  const idx = Number(btn.getAttribute('data-index'));
  if (action === 'edit') {
    openEditModal(idx);
  } else if (action === 'delete') {
    if (confirm('Delete this product?')) {
      products.splice(idx, 1);
      renderTable();
    }
  }
});

function openEditModal(idx) {
  const p = products[idx];
  document.getElementById('productIndex').value = idx;
  document.getElementById('productName').value = p.name;
  document.getElementById('productPrice').value = p.price;
  document.getElementById('productGst').value = p.gst;
  document.getElementById('productDiscount').value = p.discount || 0;
  document.getElementById('productModalLabel').textContent = 'Edit Product';
  productModal.show();
}

document.getElementById('btnAdd').addEventListener('click', () => {
  form.reset();
  document.getElementById('productIndex').value = '';
  document.getElementById('productModalLabel').textContent = 'Add Product';
});

document.getElementById('btnDownload').addEventListener('click', () => {
  const dataStr = JSON.stringify(products, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'products.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// Search functionality
document.getElementById('btnSearch').addEventListener('click', () => {
  const term = document.getElementById('searchInput').value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(term));
  renderTable(filtered);
});

document.getElementById('btnClear').addEventListener('click', () => {
  document.getElementById('searchInput').value = '';
  renderTable();
});

renderTable();
