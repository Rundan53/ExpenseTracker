function signUp(e) {
    e.preventDefault();

    const { username, email, password } = e.target;

    const signupDetails = {
        username: username.value,
        email: email.value,
        password: password.value,
    }

    axios.post(`http://localhost:3000/user/sign-up`, signupDetails)
        .then((res) => {
            console.log(res.data);
            if (res.status == 201) {
                window.location.href = './login.html'
            }
            else {
                throw new Error('failed to login')
            }
        })
        .catch(err => {
           handleError(e.target,err.response.data.error);
        })

}


function handleError(target,error) {
    const existingErrorMessages = target.querySelectorAll('p');
    existingErrorMessages.forEach((errMessage) => {
        if(errMessage.id === 'errorMessage'){
            errMessage.remove();
        }
    });
    
    let errMessage = document.createElement('p');
    errMessage.id = 'errorMessage';
    errMessage.innerHTML = error;
    errMessage.style.color = 'red';
    errMessage.style.textDecoration = 'underline'
    target.append(errMessage);
}