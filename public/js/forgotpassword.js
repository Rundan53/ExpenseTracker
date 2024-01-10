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
        const response = await axios.post('password/forgot-password', userInfo);
        alert(response.data.message);
    }
    catch(err){
        alert(err.message);
    }
   

}