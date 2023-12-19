function postUser(e) {
    e.preventDefault();

    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const signupDetails = {
        username: username,
        email: email,
        password: password,
    }

    axios.post(`http://localhost:3000/user/sign-up`, signupDetails)
    .then((res)=> {
        console.log(res.data);
        if(res.status == 201) {
            window.location.href = '../login/login.html'
        }
        else{
            console.log(res);
        }
    })
    .catch(err=> alert(err.response.data.error) )

}