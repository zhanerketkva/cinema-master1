function RegisterUser() {
    let username = document.getElementById('input_username').value;
    let password = document.getElementById('input_password').value;

    console.log('username: ' + username + ' password: ' + password);
    if (username === '' || password === '') {
        return;
    }

    let response = fetch('http://127.0.0.1:3000/api/v1/auth/registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password })
        }).then(response => {
            if (response.status === 201) {
                console.log(response);
                window.location.href = 'login.html';
            } else {
                alert('Registration error');
            }
        }).catch(err => {
            console.log(err);
    })
}