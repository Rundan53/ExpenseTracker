

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
    li.focus();
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
    const token = localStorage.getItem('token');
    console.log(token);
    axios.post('http://localhost:3000/expense/add-expense', expenseDetails, { headers: { "Authorization": token } })
        .then((res) => {
            showOnScreen(res.data)
        })
        .catch((err) => {
            alert(err.response.data.error)
        })
}


function getDataFromDB() {
    const token = localStorage.getItem('token');
    console.log(token)
    axios.get('http://localhost:3000/expense/get-expenses',
        { headers: { "Authorization": token } })
        .then((res) => {
            console.log(res.data);
            for (let i = 0; i < res.data.length; i++) {
                showOnScreen(res.data[i])
            }
        })
        .catch((err) => {
            alert(err.response.data.error);
        })
}



function deleteFromDatabase(id) {
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:3000/expense/delete-expense/${id}`,
        { headers: { "Authorization": token } })
        .catch((err) => {
            alert(err.response.data.error)
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
                }
            };

            const rzp = new Razorpay(options);
            rzp.open();

            rzp.on('payment.failed', (response)=> {
                const orderId = response.error.metadata.order_id;
                console.log(orderId);

                axios.post(`http://localhost:3000/purchase/updateTransactionStatus`,
                {status: 'FAILED', order_id: orderId},
                { headers: { 'Authorization': token } })
                .then((resp)=> {
                    alert(resp.data.message)
                })
                .catch((err)=>{
                    console.log(err);
                })
            })

        })
        .catch((err) => {
            alert(err.message);
        })
}
