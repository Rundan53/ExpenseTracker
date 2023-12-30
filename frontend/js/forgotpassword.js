const resetForm = document.getElementById('resetForm');
resetForm.addEventListener('submit', (event)=> {
    event.preventDefault();
    resetPassword();
});

async function resetPassword() {
    const emailInput = document.getElementById('email');
    const userInfo = {
        email: emailInput.value
    }
    try{
        const response = await axios.post('http://localhost:3000/password/forgot-password', userInfo);
        console.log(response.data);
    }
    catch(err){
        alert(err.message);
    }
   

}