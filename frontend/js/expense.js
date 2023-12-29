

let expForm = document.getElementById('expForm');

let amount = document.getElementById('amount');
let details = document.getElementById('details');
let category = document.getElementById('category');
let contain = document.querySelector('.container')

const tbody = document.getElementById('tbody')

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
    for(let i=1; i<exKeys.length; i++){
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

    removeFromScreen(tr, expenseData.id);
}


//remove expense from screen if deleted
function removeFromScreen(tr, expenseId) {
    if (confirm('Are You Sure')) {
        tbody.removeChild(tr);
        deleteFromDatabase(expenseId);
    }
}



function postToDatabase(expenseDetails) {
    const token = localStorage.getItem('token');
   
    axios.post('http://localhost:3000/expense/add-expense', expenseDetails, { headers: { "Authorization": token } })
        .then((res) => {
            console.log(res);
            showOnScreen(res.data);
        })
        .catch((err) => {
            alert(err.response.data.error)
        })
}





function deleteFromDatabase(tr, id) {
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:3000/expense/delete-expense/${id}`,
        { headers: { "Authorization": token } })
        .then(()=>removeFromScreen(tr, id))
        .catch((err) => {
            console.log(err);
        })
}



document.getElementById('premium').onclick = async (event) => {
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:3000/purchase/premium`, { headers: { "Authorization": token } })
        .then((response) => {

            const options =
            {
                'key': response.data.key_id,
                'order_id': response.data.order.id,
                'handler': async (resp) => {
                    const respMessg = await axios.post(`http://localhost:3000/purchase/updateTransactionStatus`,
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
                console.log(orderId);

                axios.post(`http://localhost:3000/purchase/updateTransactionStatus`,
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
            alert(err.message);
        })
}




function initPage() {
    const token = localStorage.getItem('token');

    const getData = axios.get('http://localhost:3000/expense/get-expenses',
        { headers: { "Authorization": token } });

    const isPremium = axios.get(`http://localhost:3000/premium/premium-status`,
        { headers: { "Authorization": token } });

    Promise.all([getData, isPremium])
        .then(([res1, res2]) => {
           
            for (let i = 0; i < res1.data.length; i++) {
                showOnScreen(res1.data[i]);
            }

            if(res2.data.isPremium){
                showPremiumFeatures();
            }
        })
        .catch((err) => {
            alert(err.message);
        })
}



function showPremiumFeatures() {

    //premium header
    document.getElementById('premium').remove();
    const premiumHeader = document.createElement('h3');
    premiumHeader.innerHTML = `You're a Premium User`;
    premiumHeader.style.textDecoration = 'underline';
    document.querySelector('.d-flex').firstElementChild.append(premiumHeader);

    //leaderboard Button
    let leaderboardBtn = document.createElement('button');
    leaderboardBtn.innerHTML = 'Show Leaderboard';
    leaderboardBtn.className = 'premiumBtn';
    leaderboardBtn.setAttribute('data-bs-toggle', 'modal');
    leaderboardBtn.setAttribute('data-bs-target', '#leaderboard');
    document.querySelector('.d-flex').firstElementChild.append(leaderboardBtn);

    leaderboardBtn.addEventListener('click', showLeaderboard);
   
}


async function showLeaderboard() {
    const token = localStorage.getItem('token')
    try{
        const response = await axios.get(`http://localhost:3000/premium/get-leaderboard`,
        { headers: { "Authorization": token } });

        console.log(response.data)
        insertLeaderboardData(response.data);
    }
    catch(err){
        console.log(err.message);
    }
}


function insertLeaderboardData(dataArr) {
    const leaderboardTable = document.getElementById('leaderboardTable');

    // Clear existing content of the table
    leaderboardTable.innerHTML = '';

    // Create thead element
    const thead = document.createElement('thead');
    thead.className = 'table-danger';

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
