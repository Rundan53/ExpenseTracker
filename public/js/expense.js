

let expForm = document.getElementById('expForm');

let amount = document.getElementById('amount');
let details = document.getElementById('details');
let category = document.getElementById('category');
let contain = document.querySelector('.container');

const tbody = document.getElementById('tbody');
window.addEventListener('DOMContentLoaded', initPage);


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

    let tr = document.createElement('tr');

    //Creating List + (delete + edit) buttons
    addExpenseToTable(tr, expenseData);

    // 1)delete btn
    createDeleteBtn(tr, expenseData.id);

    // 2)edit btn
    createEditBtn(tr, expenseData);
}

//adding data to table
function addExpenseToTable(tr, expenseData) {

    let exKeys = Object.keys(expenseData);

    for (let i = 1; i < exKeys.length; i++) {
        const td = document.createElement('td');
        td.append(expenseData[exKeys[i]])
        tr.append(td);
    }
}


//creates delete Button
function createDeleteBtn(tr, expenseId) {
    let deleteBtn = document.createElement('button');
    let delName = document.createTextNode('Delete Expense');
    deleteBtn.className = 'btn btn-danger';
    deleteBtn.appendChild(delName);
    let td = document.createElement('td')
    td.append(deleteBtn);
    tr.append(td);

    //event for deleteBtn
    deleteBtn.addEventListener('click', () => deleteFromDatabase(tr, expenseId));
}


//creates edit Button
function createEditBtn(tr, expenseData) {
    let editBtn = document.createElement('button');
    let editName = document.createTextNode('Edit Expense');
    editBtn.className = 'btn btn-success';
    editBtn.appendChild(editName);
    let td = document.createElement('td');
    td.appendChild(editBtn);
    tr.append(td);
    tbody.append(tr);
    //event for editBtn
    editBtn.addEventListener('click', () => getDataInFrom(tr, expenseData))
}


//fills resp data in form after clicking edit
function getDataInFrom(tr, expenseData) {
    amount.value = expenseData.amount;
    details.value = expenseData.description;
    category.value = expenseData.category;

    deleteFromDatabase(tr, expenseData.id);
}


//remove expense from screen if deleted
function removeFromScreen(tr) {
    tbody.removeChild(tr);
}


function postToDatabase(expenseDetails) {
    const token = localStorage.getItem('token');

    axios.post('expense/add-expense', expenseDetails, { headers: { "Authorization": token } })
        .then((res) => {
           
            const limit = localStorage.getItem('rowsPerPage') || 5;
            const totalExpenses = document.querySelectorAll('#tbody tr').length;
       
            if (totalExpenses==0 || totalExpenses % limit !== 0) {
                showOnScreen(res.data);
            }
           
        })
        .catch((err) => {
            alert(err.data.message);
        })
}





function deleteFromDatabase(tr, id) {
    const token = localStorage.getItem('token');
    if (confirm('Are You Sure')) {
        axios.delete(`expense/delete-expense/${id}`,
            { headers: { "Authorization": token } })
            .then(() => {
                removeFromScreen(tr);
            })
            .catch((err) => {
                alert(err.message);
            })
    }

}



document.getElementById('premium').onclick = async (event) => {
    const token = localStorage.getItem('token');
    axios.get(`purchase/premium`, { headers: { "Authorization": token } })
        .then((response) => {

            const options =
            {
                'key': response.data.key_id,
                'order_id': response.data.order.id,
                'handler': async (resp) => {
                    const respMessg = await axios.post(`purchase/updateTransactionStatus`,
                        {
                            order_id: response.data.order.id,
                            payment_id: resp.razorpay_payment_id
                        },
                        { headers: { 'Authorization': token } });

                    alert(respMessg.data.message);
                    showPremiumFeatures();
                }
            };

            const rzp = new Razorpay(options);
            rzp.open();

            rzp.on('payment.failed', (response) => {
                const orderId = response.error.metadata.order_id;

                axios.post(`purchase/updateTransactionStatus`,
                    { status: 'FAILED', order_id: orderId },
                    { headers: { 'Authorization': token } })
                    .then((resp) => {
                        alert(resp.data.message)
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            })

        })
        .catch((err) => {
            alert(err.response.data.message);
        })
}




function initPage() {
    const token = localStorage.getItem('token');
    const limit = localStorage.getItem('rowsPerPage') || 5;
    const getData = axios.get(`expense/get-expenses?page=1&limit=${limit}`,
        { headers: { "Authorization": token } });

    const isPremium = axios.get(`premium/premium-status`,
        { headers: { "Authorization": token } });

    Promise.all([getData, isPremium])
        .then(([res1, res2]) => {

            for (let i = 0; i < res1.data.expenses.length; i++) {
                showOnScreen(res1.data.expenses[i]);
            }

            showPagination(res1.data);

            if (res2.data.isPremium) {
                showPremiumFeatures();
            }
        })
        .catch((err) => {
            alert(err.message);
        })
}



function showPremiumFeatures() {
    // Remove premium button
    document.getElementById('premium').remove();

    // Show premium status
    const premiumStatus = document.createElement('h3');
    premiumStatus.innerHTML = `You're a Premium User`;
    premiumStatus.style.textDecoration = 'underline';
    document.getElementById('premiumHeader').append(premiumStatus);

    // Show Leaderboard button
    const leaderboardBtn = document.createElement('button');
    leaderboardBtn.innerHTML = '<b>Leaderboard<b>';
    leaderboardBtn.className = 'premiumBtn float-end';
    leaderboardBtn.setAttribute('data-bs-toggle', 'modal');
    leaderboardBtn.setAttribute('data-bs-target', '#leaderboard');
    document.getElementById('premiumHeader').append(leaderboardBtn);

    // Show download file button
    const downloadBtn = document.createElement('button');
    downloadBtn.innerHTML = `<b>Download File</b>`;
    downloadBtn.className = 'premiumBtn';
    document.getElementById('premiumBtns').append(downloadBtn);

    // Show downloaded history button
    const historyBtn = document.createElement('button');
    historyBtn.innerHTML = `<b>Show History</b>`;
    historyBtn.className = 'premiumBtn';
    historyBtn.setAttribute('data-bs-toggle', 'modal');
    historyBtn.setAttribute('data-bs-target', '#history');
    document.getElementById('premiumBtns').append(historyBtn);

    // Add event listeners
    leaderboardBtn.addEventListener('click', showLeaderboard);
    downloadBtn.addEventListener('click', download);
    historyBtn.addEventListener('click', showHistory);
}


async function showLeaderboard() {
    const token = localStorage.getItem('token')
    try {
        const response = await axios.get(`premium/get-leaderboard`,
            { headers: { "Authorization": token } });

        insertLeaderboardData(response.data);
    }
    catch (err) {
        alert(err.message);
    }
}


function insertLeaderboardData(dataArr) {
    const leaderboardTable = document.getElementById('leaderboardTable');

    // Clear existing content of the table
    leaderboardTable.innerHTML = '';

    // Create thead element
    const thead = document.createElement('thead');

    // Create header row
    const headTr = document.createElement('tr');
    headTr.className = 'table-success';

    const heading = ['Sr.No', 'Name', 'Total Expense'];

    for (let i = 0; i < heading.length; i++) {
        const th = document.createElement('th');
        th.textContent = heading[i];
        th.setAttribute('scope', 'col');
        headTr.appendChild(th);
    }

    thead.appendChild(headTr);
    leaderboardTable.appendChild(thead);

    // Create tbody element
    const tbody = document.createElement('tbody');

    for (let i = 0; i < dataArr.length; i++) {
        const tr = document.createElement('tr');

        // Create and append td elements
        const srNoTd = document.createElement('td');
        srNoTd.textContent = i + 1;
        tr.appendChild(srNoTd);

        const usernameTd = document.createElement('td');
        usernameTd.textContent = dataArr[i].username;
        tr.appendChild(usernameTd);

        const totalAmountTd = document.createElement('td');
        totalAmountTd.textContent = dataArr[i].totalAmount;
        tr.appendChild(totalAmountTd);

        tbody.appendChild(tr);
    }

    // Append the new tbody
    leaderboardTable.appendChild(tbody);
}


async function download() {
    const token = localStorage.getItem('token')

    const response = await axios.get(`premium/download`, {
        headers: { "Authorization": token }
    });

    const a = document.createElement('a');
    a.href = response.data.fileUrl;
    a.download = 'myExpenses.csv';

    a.click();
}



async function showHistory() {
    const token = localStorage.getItem('token')

    const response = await axios.get('premium/get-history',
        { headers: { "Authorization": token } });
    
    addToHistoryTable(response.data.fileUrl);

}


function addToHistoryTable(files) {
    const table = document.getElementById('historyTable');
    table.innerHTML = '';

    // Create thead element
    const thead = document.createElement('thead');
    thead.className = 'table-danger';

    const headTr = document.createElement('tr');
    const th = document.createElement('th');
    th.textContent = 'Your Download History';
    th.setAttribute('scope', 'col');
    headTr.appendChild(th);
    thead.appendChild(headTr);
    table.appendChild(thead);

    // Create tbody element
    const tbody = document.createElement('tbody');

    for (let i = 0; i < files.length; i++) {
        const formattedDateTime  = formatDateTime(files[i].updatedAt);

        // Create a new anchor element
        const a = document.createElement('a');
        a.href = files[i].fileUrl;
        a.download = 'myExpense.csv';
        a.textContent = formattedDateTime;

        // Create a new table cell and append the anchor element
        const td = document.createElement('td');
        td.appendChild(a);

        // Create a new table row and append the table cell
        const tr = document.createElement('tr');
        tr.appendChild(td);

        // Append the table row to the tbody
        tbody.appendChild(tr);
    }

    // Append the tbody to the table
    table.appendChild(tbody);
}


function formatDateTime(dateTimeString){
    const updatedAtDate = new Date(dateTimeString);

    const formattedDate = new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC'
    }).format(updatedAtDate);

    return formattedDate;
}



async function updateRows(e) {
    try {
        const token = localStorage.getItem('token');
        const limit = e.target.value;
        localStorage.setItem('rowsPerPage', limit);

        const response = await axios.get(`expense/get-expenses?page=1&limit=${limit}`,
            { headers: { "Authorization": token } });

     
        tbody.innerHTML = '';
        for (let i = 0; i < response.data.expenses.length; i++) {
            showOnScreen(response.data.expenses[i]);
        }
       
        showPagination(response.data)
    }
    catch (err) {
        alert(err.response.data.message)
    }

}



function showPagination(pageData) {
    const pageContainer = document.getElementById('pagination');

    pageContainer.innerHTML = '';

    if (pageData.hasPreviousPage) {
        const btn2 = document.createElement('button');
        btn2.innerHTML = 'Previous Page';
        pageContainer.appendChild(btn2);
        btn2.addEventListener('click', () => getExpenses(pageData.previousPage));

    }

    const btn1 = document.createElement('button');
    btn1.innerHTML = `${pageData.currentPage}`;
    pageContainer.appendChild(btn1);
    btn1.addEventListener('click', () => getExpenses(pageData.currentPage));

    if (pageData.hasNextPage) {
        const btn3 = document.createElement('button');
        btn3.innerHTML = 'Next Page';
        pageContainer.appendChild(btn3);
        btn3.addEventListener('click', () => getExpenses(pageData.nextPage));
    }
}



async function getExpenses(page) {
    try {
        const token = localStorage.getItem('token');
        const limit = localStorage.getItem('rowsPerPage') || 5;

        const response = await axios.get(`expense/get-expenses?page=${page}&limit=${limit}`,
            { headers: { "Authorization": token } });

        
        tbody.innerHTML = '';
        for (let i = 0; i < response.data.expenses.length; i++) {
            showOnScreen(response.data.expenses[i]);
        }
        showPagination(response.data)
    }
    catch (err) {
        alert(err.response.data.message)
    }
}
