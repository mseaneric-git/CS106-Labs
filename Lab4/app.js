//Empty arrays
let inventory = [];
let damagedItems = [];

//Initialize table view (will be used for switching table and card view)
let isTable = true;

//Current view of inventory (for filtering/searching/sorting). This is to prevent direct modification on inventory array
let currView = [...inventory];

//Log initial inventory to console
console.log("Inventory Init:", inventory);

//Item constructor
function itemObject(name, qty, price) {
    this.name = name;
    this.qty = qty;
    this.price = price;
}

//Add item function
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
    currView = [...inventory];
    renderList();
    renderSummary();
    console.log("Added Item:", newItem);
    console.log("Inventory (After Adding Item):", inventory);
}

//Reset function
function resetForm() {
    document.getElementById('item-name').value = '';
    document.getElementById('item-qty').value = '';
    document.getElementById('item-price').value = '';
}

//Render inventory list function
function renderList(items = currView) {
  const list = document.getElementById('inventory-list');
  list.innerHTML = '';
  
  if (items.length === 0) {
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

//Edit item quantity in inventory function
function editQty(index) {
  const newQty = prompt("Enter new quantity:", inventory[index].qty);
  if (newQty === null) return;

  const parsed = parseInt(newQty);

  if (isNaN(parsed) || parsed < 0) {
    alert("Invalid input. Edit cancelled.");
    return;
  }
  
  inventory[index].qty = parsed;
  currView = [...inventory];
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
  currView = [...inventory];
  renderList();
  renderSummary();
  console.log("Edited Price:", inventory[index]);
  console.log("Inventory (After Edit):", inventory);
}

//Edit item name in inventory function
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
  currView = [...inventory];
  renderList();
  console.log("Edited Name:", inventory[index]);
  console.log("Inventory (After Edit):", inventory);
}

//Delete item in inventory function
function deleteItem(index) {
  if (!confirm(`Are you sure you want to delete "${inventory[index].name}"?`)) return;
  inventory.splice(index, 1);
  currView = [...inventory];
  renderList();
  renderSummary();
  console.log("Inventory (After Deletion):", inventory);
}

//Mark item as damaged function
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
   
    currView = [...inventory];
    renderList();
    renderDamaged();
    renderSummary();
    
    console.log("Marked Damaged:", damaged);
    console.log("Inventory (After Marking Damaged):", inventory);
    console.log("Damaged Items:", damagedItems);
  }
}

//Render damaged list
function renderDamaged(items = damagedItems) {
    const list = document.getElementById('damaged-list');
    list.innerHTML = '';

    if (damagedItems.length === 0) {
      list.innerHTML = '<p>No damaged item(s).</p>';
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

//Edit item quantity in damaged function
function editDamaged(index) {
  const newQty = prompt("Enter new quantity:", damagedItems[index].qty);
  if (newQty === null) return;

  const parsed = parseInt(newQty);
  const curDamagedQty = damagedItems[index].qty;

  if (isNaN(parsed) || parsed < 0 || parsed > curDamagedQty) {
    alert("Invalid input. Edit cancelled.");
    return;
  }

  const inventoryIndex = inventory.findIndex(i => i.name === damagedItems[index].name);

  if (parsed === curDamagedQty) {
    return;
  }

  if (parsed === 0) {
      deleteDamaged(index);
      return;
  }
  
  const qtyReturned = curDamagedQty - parsed;

  if (inventoryIndex !== -1) {
    inventory[inventoryIndex].qty += qtyReturned;
  }

  damagedItems[index].qty = parsed;

  renderDamaged();
  renderList();
  renderSummary();

  console.log("Edited Damaged Qty:", damagedItems[index]);
  console.log("Damaged Items (After Edit):", damagedItems);
  console.log("Inventory (After Editing Damaged):", inventory);
}

//Delete damaged item function
function deleteDamaged(index) {
  const itemToDelete = damagedItems[index];
  if (!confirm(`Are you sure you want to delete "${itemToDelete.name}" from damaged items?`)) return;

  const qtyToDelete = itemToDelete.qty;
  const inventoryIndex = inventory.findIndex(i => i.name === damagedItems[index].name);
  
  if (inventoryIndex !== -1) {
    inventory[inventoryIndex].qty += qtyToDelete;
  }

  damagedItems.splice(index, 1);

  renderDamaged();
  renderList();
  renderSummary();

  console.log("Damaged Items (After Deletion):", damagedItems);
  console.log("Inventory (After Deleting Damaged):", inventory);
}

//Toggle view function
function toggleView() {
    isTable = !isTable;

    renderList();
    renderDamaged();
}

//Filter function
function filterItems() {
  const threshold = document.getElementById('filter-qty').value;
  const thresholdValue = parseInt(threshold);

  if (threshold === '' || isNaN(thresholdValue)) return;
  const filtered = inventory.filter(i => i.qty <= thresholdValue);

  currView = filtered;
  renderList(currView);
  document.getElementById('filter-qty').value = '';

  console.log("Filtered Items (Qty <= " + thresholdValue + "):", filtered);
}

//Reset filter funciton
function resetFilter() {
  currView = [...inventory];
  document.getElementById('filter-qty').value = '';
  document.getElementById('search').value = '';
  renderList(currView);
  console.log("Filters reset. Showing all items.");
}

//Search function
function searchItems() {
  const searchType = document.getElementById('search-type').value;
  const query = document.getElementById('search').value.toLowerCase();
  let result;

  if (query.trim() === '') {
    renderList(currView);
    return;
  }

  if (searchType === 'name') {
    result = currView.filter(item => item.name.toLowerCase().includes(query));
  }
  else if (searchType === 'qty') {
    result = currView.filter(item => item.qty.toString().includes(query));
  }
  else if (searchType === 'price') {
    result = currView.filter(item => item.price.toString().includes(query));
  }

  renderList(result);

  console.log("Search Results for '" + query + "' in " + searchType + ":", result);
}

//Sort item function
function sortItems(key) {
  const sortMethod = document.getElementById('sort-method').value;
  const isDescending = sortMethod === '1';

  // Sort the currView array
  currView.sort((a, b) => {
    let result = 0;

    if (key === 'name') {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) {
        result = -1;
      }
      else if (nameA > nameB) {
        result = 1;
      }
    } else if (key === 'qty' || key === 'price') {
      result = a[key] - b[key];
    }

    return isDescending ? result * -1 : result;
  });
  
  renderList();
  console.log("Sorted by " + key + " (" + (isDescending ? "Descending" : "Ascending") + ")");
}

//Sort by name function
function sortByName() {
  sortItems('name');
}

//Sort by quantity function
function sortByQuantity() {
  sortItems('qty');
}

//Sort by price function
function sortByPrice() {
  sortItems('price');
}

// Helper function to calculate summary statistics
function calculateSummary() {
  const totalItems = inventory.length;
  const totalQty = inventory.reduce((sum, i) => sum + i.qty, 0);
  const totalValue = inventory.reduce((sum, i) => sum + i.qty * i.price, 0);
  const totalDamagedQty = damagedItems.reduce((sum, d) => sum + d.qty, 0);
  const totalLoss = damagedItems.reduce((sum, d) => sum + d.qty * d.price, 0);
  const netValue = totalValue - totalLoss;

  return {
    totalItems,
    totalQty,
    totalValue,
    totalDamagedQty,
    totalLoss,
    netValue
  };
}

//Render summary function
function renderSummary() {
  const summary = calculateSummary();

  document.getElementById('total-items').textContent = summary.totalItems;
  document.getElementById('total-qty').textContent = summary.totalQty;
  document.getElementById('total-value').textContent = summary.totalValue.toFixed(2);
  document.getElementById('total-damaged').textContent = summary.totalDamagedQty;
  document.getElementById('total-loss').textContent = summary.totalLoss.toFixed(2);
  document.getElementById('net-value').textContent = summary.netValue.toFixed(2);
}

//Summary report (console report) function
function summaryReport() {
  const summary = calculateSummary();

  const report =
    `Inventory Summary Report:\n` +
    `Total Unique Items: ${summary.totalItems}\n` +
    `Total Quantity: ${summary.totalQty}\n` +
    `Total Inventory Value: ₱${summary.totalValue.toFixed(2)}\n` +
    `Total Damaged Items: ${summary.totalDamagedQty}\n` +
    `Total Loss: ₱${summary.totalLoss.toFixed(2)}\n` +
    `Net Value: ₱${summary.netValue.toFixed(2)}`;

  alert(report);
  console.log(report);
  return report;
}

//Init
renderList();
renderDamaged();
renderSummary();