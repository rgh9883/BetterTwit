function testAjax() {
    document.getElementById('invalidLoginID').style.display = "none";
    document.getElementById('validLoginID').style.display = "none";
    let userName = document.getElementById('uName').value;
    let passVar = document.getElementById('pass').value;

    // Build formData object for fetch.
    //This will act same as for post from past 2 projects.
    let formData = new FormData();
    formData.append('userName', userName);
    formData.append('pass', passVar);

    //set options for fetch
    let options = {
        method: 'POST',
        body: formData
    };
    // run fetch
    fetch('login.py', options)
        .then(response => {
            // Check if the request was successful
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Parse the response as JSON
            return response.json();
        })
        .then(data => {
            // Handle the JSON data
            console.log(data);
            console.log(data.result)
            if (data.result == false) {
                //window.location.href = "changePassword.html";
                document.getElementById('invalidLoginID').style.display = "block"
            }
            else {
                document.getElementById('validLoginID').style.display = "block";
                document.getElementById('submit').disabled = true;
                document.getElementById('createAccount').disabled = true;
                document.getElementById('spinner').className = "spinner-border"
                goToHomepage(Number(data[0].id))
            }
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('Fetch error:', error);
        });

}

function createAccount(){
    document.getElementById('submit').disabled = true;
    document.getElementById('createAccount').disabled = true;
    window.location.href = "createAccount.html";
}

function goToHomepage(id){
    document.getElementById('submit').disabled = true;
    document.getElementById('createAccount').disabled = true;
    window.location.href = "homepage.html?userId=" + id;
}