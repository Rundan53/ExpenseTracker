let addBtn= document.getElementById('add');

let amount= document.getElementById('amount');
let details= document.getElementById('details');
let category= document.getElementById('category');
let contain= document.querySelector('.container')

addBtn.addEventListener('click',function addingExpense(e){
    e.preventDefault();

    //Storing in Local Storage
    let userExpense={
        exAmount: amount.value,
        exDetail: details.value,
        exCategory: category.value,
    };

    userExpenseSerialized= JSON.stringify(userExpense);
    localStorage.setItem(userExpense.exCategory,userExpenseSerialized);

    //Creating List + (delete + edit) buttons
    let ul=document.createElement('ul');
    let li=document.createElement('li');
    let textOfLi=document.createTextNode(`${userExpense.exAmount}-${userExpense.exDetail}-${userExpense.exCategory}`);
    li.appendChild(textOfLi);
    ul.appendChild(li);
    contain.appendChild(ul);

    // 1)delete btn
    let deleteBtn = document.createElement('button');
    let delName=document.createTextNode('Delete Expense');
    deleteBtn.className='btn btn-danger';
    deleteBtn.appendChild(delName);
    li.appendChild(deleteBtn);


    // 2)edit btn
    let editBtn= document.createElement('button');
    let editName= document.createTextNode('Edit Expense');
    editBtn.className= 'btn btn-success';
    editBtn.appendChild(editName);
    li.appendChild(editBtn);

    //using delete btn
    deleteBtn.addEventListener('click',remove);
    function remove(){
        if(confirm('Are You Sure')){
            ul.removeChild(li);
            localStorage.removeItem(userExpense.exCategory)
    }
    }

    //using edit btn
    editBtn.addEventListener('click',edit=()=>{
        remove();
        amount.value= userExpense.exAmount;
        details.value= userExpense.exDetail;
        category.value=userExpense.exCategory;
        })




});

