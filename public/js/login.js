function login(e) {
    e.preventDefault();
    const {email, password} = e.target;

    loginDetails = {
        email: email.value, 
        password: password.value
    }

    axios.post(`user/log-in`, loginDetails)
    .then((res) => {
       
        if (res.status == 200) {
            localStorage.setItem('token', res.data.token)
            alert(res.data.message);
            window.location.href = '/home';
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