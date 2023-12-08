let expForm = document.getElementById('expForm');

let amount = document.getElementById('amount');
let details = document.getElementById('details');
let category = document.getElementById('category');
let contain = document.querySelector('.container')

let ul = document.createElement('ul');


window.addEventListener('DOMContentLoaded', () => {
    getDataFromDB()
});


expForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let expenseDetails = {
        amount: amount.value,
        description: details.value,
        category: category.value,
    }
    postToDatabase(expenseDetails);
});


//function to show expenses on screen
function showOnScreen(expenseData) {

    let li = document.createElement('li');

    //Creating List + (delete + edit) buttons
    createTextNode(li, expenseData);

    // 1)delete btn
    createDeleteBtn(li, expenseData.id);

    // 2)edit btn
    createEditBtn(li, expenseData);
}


//creates textNode
function createTextNode(li, expenseData) {
    let boldElement = document.createElement('b');
    let textOfLi = document.createTextNode(`${expenseData.amount}-${expenseData.description}-${expenseData.category}`);
    boldElement.appendChild(textOfLi);
    li.appendChild(boldElement);
    ul.appendChild(li);
    contain.appendChild(ul);
}

//creates delete Button
function createDeleteBtn(li, expenseId) {
    let deleteBtn = document.createElement('button');
    let delName = document.createTextNode('Delete Expense');
    deleteBtn.className = 'btn btn-danger';
    deleteBtn.appendChild(delName);
    li.appendChild(deleteBtn);

    //event for deleteBtn
    deleteBtn.addEventListener('click', () => removeFromScreen(li, expenseId));
}

//creates edit Button
function createEditBtn(li, expenseData) {
    let editBtn = document.createElement('button');
    let editName = document.createTextNode('Edit Expense');
    let br = document.createElement('br')
    editBtn.className = 'btn btn-success';
    editBtn.appendChild(editName);
    li.appendChild(editBtn);
    ul.appendChild(br);

    //event for editBtn
    editBtn.addEventListener('click', () => getDataInFrom(li, expenseData))
}


//fills resp data in form after clicking edit
function getDataInFrom(li, expenseData) {
    amount.value = expenseData.amount;
    details.value = expenseData.description;
    category.value = expenseData.category;

    removeFromScreen(li, expenseData.id);
}


//remove expense from screen if deleted
function removeFromScreen(li, expenseId) {
    if (confirm('Are You Sure')) {
        ul.removeChild(li);
        deleteFromDatabase(expenseId);
    }
}



function postToDatabase(expenseDetails) {

    axios.post('http://localhost:3000/expenses', expenseDetails)
        .then((res) => {
            showOnScreen(res.data)
        })
        .catch((err) => alert('Error in posting data'))
}


function getDataFromDB() {
    axios.get('http://localhost:3000/getExpenses')
        .then((res) => {
            console.log(res.data);
            for (let i = 0; i < res.data.length; i++) {
                showOnScreen(res.data[i])
            }
        })
        .catch((err) => {
            console.log(err.message);
            alert('Error in getting expenses');
        })
}



function deleteFromDatabase(id) {
    axios.delete(`http://localhost:3000/deleteExpense/${id}`)
        .catch((err) => alert(err.message))
}