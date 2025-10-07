//Empty array
let inventory = [{name: "Sample Item", qty: 10, price: 5.99}];
let damagedItems = [];
let isTable = true;

//Log inventory to console
console.log("Inventory Init:", inventory);

//Item constructor
function itemObject(name, qty, price) {
    this.name = name;
    this.qty = qty;
    this.price = price;
}

function addItem() {
    const name = document.getElementById('item-name').value.trim();
    const qty = parseInt(document.getElementById('item-qty').value);
    const price = parseFloat(document.getElementById('item-price').value);

    if (!name || isNaN(qty) || isNaN(price) || qty < 0 || price < 0) {
      alert("Fill all fields properly.");
      return;
    }

    const isDuplicate = inventory.some(i => i.name.toLowerCase() === name.toLowerCase());
    if (isDuplicate) {
      alert("Item with this name already exists."); 
      return;
    }

    const newItem = new itemObject(name, qty, price);

    inventory.push(newItem);

    resetForm();
    renderList();
    renderSummary();
    console.log("Added Item:", newItem);
    console.log("Inventory (After Adding Item):", inventory);
}

function resetForm() {
    document.getElementById('item-name').value = '';
    document.getElementById('item-qty').value = '';
    document.getElementById('item-price').value = '';
}

function renderList(items = inventory) {
  const list = document.getElementById('inventory-list');
  list.innerHTML = '';
  if (inventory.length === 0) {
    list.innerHTML = '<p>No items in inventory.</p>';
    return;
  }
  if (isTable) {
    const tableContainer = document.createElement('table');
    const header = `
    <tr>
      <th>Name</th>
      <th>Qty</th>
      <th>Price</th>
      <th>Actions</th>
    </tr>`;
    let rows = '';
    for (const item of items) {
      const i = inventory.indexOf(item);
      rows += 
      `<tr ${item.qty == 0 ? 'class="red"' : ''}>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>₱${item.price.toFixed(2)}</td>
        <td style="text-align: center;">
          <button onclick="editQty(${i})">Edit Qty</button>
          <button onclick="editPrice(${i})">Edit Price</button>
          <button onclick="editName(${i})">Edit Name</button>
          <button onclick="deleteItem(${i})">Delete</button>
          <button onclick="markDamaged(${i})">Mark Damaged</button>
        </td>
      </tr>`;
    }
    tableContainer.innerHTML = header + rows;
    list.appendChild(tableContainer);
  }
  else {
    const cardContainer = document.createElement('div');
    let cards = '';
    for (const item of items) {
      const i = inventory.indexOf(item);
      cards +=
      `<div class="card ${item.qty == 0 ? 'red' : ''}">
        <h3>${item.name}</h3>
        <p>Qty: ${item.qty}</p>
        <p>Price: ₱${item.price.toFixed(2)}</p>
        <div class="actions">
          <button onclick="editQty(${i})">Edit Qty</button>
          <button onclick="editPrice(${i})">Edit Price</button>
          <button onclick="editName(${i})">Edit Name</button>
          <button onclick="deleteItem(${i})">Delete</button>
          <button onclick="markDamaged(${i})">Mark Damaged</button>
        </div>
      </div>`;
    }
    cardContainer.innerHTML = cards;
    list.appendChild(cardContainer);
  }
}

function editQty(index) {
  const newQty = prompt("Enter new quantity:", inventory[index].qty);
  if (newQty === null) return;

  const parsed = parseInt(newQty);

  if (isNaN(parsed) || parsed < 0) {
    alert("Invalid input. Edit cancelled.");
    return;
  }
  
  inventory[index].qty = parsed;
  renderList();
  renderSummary();
  console.log("Edited Qty:", inventory[index]);
  console.log("Inventory (After Edit):", inventory);
}

function editPrice(index) {
  const newPrice = prompt("Enter new price:", inventory[index].price);
  if (newPrice === null) return;

  const parsed = parseFloat(newPrice);

  if (isNaN(parsed) || parsed < 0) {
    alert("Invalid input. Edit cancelled.");
    return;
  }

  inventory[index].price = parsed;
  renderList();
  renderSummary();
  console.log("Edited Price:", inventory[index]);
  console.log("Inventory (After Edit):", inventory);
}

function editName(index) {
  const newName = prompt("Enter new name:", inventory[index].name);
  if (newName === null) return;

  const trimmed = newName.trim();

  if (!trimmed) {
    alert("Name cannot be empty. Edit cancelled.");
    return;
  }

  const isDuplicate = inventory.some((i, idx) => i.name.toLowerCase() === trimmed.toLowerCase() && idx !== index);
  if (isDuplicate) {
    alert("Item with this name already exists. Edit cancelled.");
    return;
  }

  inventory[index].name = trimmed;
  renderList();
  console.log("Edited Name:", inventory[index]);
  console.log("Inventory (After Edit):", inventory);
}

function deleteItem(index) {
  if (!confirm(`Are you sure you want to delete "${inventory[index].name}"?`)) return;
  inventory.splice(index, 1);
  renderList();
  renderSummary();
  console.log("Inventory (After Deletion):", inventory);
}

function markDamaged(index) {
  const damagedItem = prompt("Enter quantity of damaged items:", 1);
  if (damagedItem === null) return;

  const parsed = parseInt(damagedItem);

  if (isNaN(parsed) || parsed <= 0) {
    alert("Invalid input. Action cancelled.");
    return;
  }
  else if (parsed > inventory[index].qty) {
    alert("Cannot mark more items as damaged than available in stock.");
    return;
  }
  else{
    const damaged = new itemObject(inventory[index].name, parsed, inventory[index].price);
    damagedItems.push(damaged);
    inventory[index].qty -= parsed;

    damagedItems.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    
    renderList();
    renderDamaged();
    renderSummary();
    
    console.log("Marked Damaged:", damaged);
    console.log("Inventory (After Marking Damaged):", inventory);
    console.log("Damaged Items:", damagedItems);
  }
}

function renderDamaged(items = damagedItems) {
    const list = document.getElementById('damaged-list');
    list.innerHTML = '';

    if (damagedItems.length === 0) {
      list.innerHTML = '<p>No Damaged Item(s).</p>';
      return;
    }

    if (isTable) {
      const tableContainer = document.createElement('table');
      const header = `
      <tr>
        <th>Name</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Actions</th>
      </tr>`;

      let rows = '';
      for (const item of items) {
        const i = damagedItems.indexOf(item);

        rows += 
        `<tr>
          <td>${item.name}</td>
          <td>${item.qty}</td>
          <td>₱${item.price.toFixed(2)}</td>
          <td style="text-align: center;">
            <button onclick="editDamaged(${i})">Edit</button>
            <button onclick="deleteDamaged(${i})">Delete</button>
          </td>
        </tr>`;
      }
      tableContainer.innerHTML = header + rows;
      list.appendChild(tableContainer);
    }
    else {
      const cardContainer = document.createElement('div');

      let cards = '';
      for (const item of items) {
        const i = damagedItems.indexOf(item);
        cards +=
        `<div class="card">
          <h3>${item.name}</h3>
          <p>Qty: ${item.qty}</p>
          <p>Price: ₱${item.price.toFixed(2)}</p>
          <div class="actions">
            <button onclick="editDamaged(${i})">Edit</button>
            <button onclick="deleteDamaged(${i})">Delete</button>
          </div>
        </div>`;
      }
      cardContainer.innerHTML = cards;
      list.appendChild(cardContainer);
    }
}

function editDamaged(index) {
  const newQty = prompt("Enter new quantity:", damagedItems[index].qty);
  if (newQty === null) return;

  const parsed = parseInt(newQty);

  if (isNaN(parsed) || parsed < 0 || parsed > damagedItems[index].qty) {
    alert("Invalid input. Edit cancelled.");
    return;
  }
  else if (parsed === damagedItems[index].qty) {
    return;
  }
  else if (parsed ===0) {
      deleteDamaged(index);
  }
  else{
    damagedItems[index].qty = parsed;
    inventory[index].qty += parsed;
  }

  renderDamaged();
  renderList();
  renderSummary();

  console.log("Edited Damaged Qty:", damagedItems[index]);
  console.log("Damaged Items (After Edit):", damagedItems);
  console.log("Inventory (After Editing Damaged):", inventory);
}

function deleteDamaged(index) {
  if (!confirm(`Are you sure you want to delete "${damagedItems[index].name}" from damaged items?`)) return;

  const qtyToDelete = damagedItems[index].qty;

  inventory[index].qty += qtyToDelete;
    
  damagedItems.splice(index, 1);

  renderDamaged();
  renderList();
  renderSummary();

  console.log("Damaged Items (After Deletion):", damagedItems);
  console.log("Inventory (After Deleting Damaged):", inventory);
}


function toggleView() {
    isTable = !isTable;

    renderList();
    renderDamaged();
}

function filterItems() {
  const threshold = parseInt(document.getElementById('filter-qty').value);
  if (isNaN(threshold)) return;
  const filtered = inventory.filter(i => i.qty <= threshold);
  renderList(filtered);

  console.log("Filtered Items (Qty <= " + threshold + "):", filtered);
}

function searchItems() {
  const searchType = document.getElementById('search-type').value;
  const query = document.getElementById('search').value.toLowerCase();
  let result;

  if (searchType === 'name') {
    result = inventory.filter(item => item.name.toLowerCase().includes(query));
  }
  else if (searchType === 'qty') {
    result = inventory.filter(item => item.qty.toString().includes(query));
  }
  else if (searchType === 'price') {
    result = inventory.filter(item => item.price.toString().includes(query));
  }

  console.log("Search Results for '" + query + "' in " + searchType + ":", result);
  renderList(result);
}

function sortItems(key) {
  const sortMethod = document.getElementById('sort-method').value;
  const isDescending = sortMethod === '1';

  inventory.sort((a, b) => {
    let result = 0;

    if (key === 'name') {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) {
        result = -1;
      }
      if (nameA > nameB) {
        result = 1;
      }
    } else if (key === 'qty' || key === 'price') {
      result = a[key] - b[key];
    }

    return isDescending ? result * -1 : result;
  });
  renderList();
}

function sortByName() {
  sortItems('name');
}

function sortByQuantity() {
  sortItems('qty');
}

function sortByPrice() {
  sortItems('price');
}

function renderSummary() {
  const totalItems = inventory.length;
  const totalQty = inventory.reduce((sum, i) => sum + i.qty, 0);
  const totalValue = inventory.reduce((sum, i) => sum + i.qty * i.price, 0);
  const totalDamaged = damagedItems.length;
  const totalLoss = damagedItems.reduce((sum, d) => sum + d.qty * d.price, 0);
  const netValue = totalValue - totalLoss;

  document.getElementById('total-items').textContent = totalItems;
  document.getElementById('total-qty').textContent = totalQty;
  document.getElementById('total-value').textContent = totalValue.toFixed(2);
  document.getElementById('total-damaged').textContent = totalDamaged;
  document.getElementById('total-loss').textContent = totalLoss.toFixed(2);
  document.getElementById('net-value').textContent = netValue.toFixed(2);
}

function summaryReport() {
  const totalItems = inventory.length;
  const totalQty = inventory.reduce((sum, i) => sum + i.qty, 0);
  const totalValue = inventory.reduce((sum, i) => sum + i.qty * i.price, 0);
  const totalDamaged = damagedItems.length;
  const totalLoss = damagedItems.reduce((sum, d) => sum + d.qty * d.price, 0);
  const netValue = totalValue - totalLoss;

  const report =
    `Inventory Summary Report:\n` +
    `Total Unique Items: ${totalItems}\n` +
    `Total Quantity: ${totalQty}\n` +
    `Total Inventory Value: ₱${totalValue.toFixed(2)}\n` +
    `Total Damaged Items: ${totalDamaged}\n` +
    `Total Loss: ₱${totalLoss.toFixed(2)}\n` +
    `Net Value: ₱${netValue.toFixed(2)}`;

  console.log(report);
  return report;
}

renderList();
renderDamaged();
renderSummary();