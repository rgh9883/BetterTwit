function createAcc(){
    document.getElementById('invalidLoginID').style.display = "none";
    document.getElementById('validLoginID').style.display = "none";
    let userName = document.getElementById('uName').value;
    let passVar = document.getElementById('pass').value;
    let passVar2 = document.getElementById('pass2').value;
    let formData = new FormData();

    if(passVar != passVar2){
        document.getElementById('invalidLoginID').style.display = "block";
        return;
    }

    // Build formData object for fetch.
    //This will act same as for post from past 2 projects.

    formData.append('userName', userName);
    formData.append('pass', passVar);
    formData.append('pass2', passVar2);

    //set options for fetch
    let options = {
        method: 'POST',
        body: formData
    };
    // run fetch
    fetch('create.py', options)
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
            if (data.result == false) {
                document.getElementById('wrongText').innerHTML = "Username Taken";
                document.getElementById('invalidLoginID').style.display = "block";

            }
            else {
                document.getElementById('validLoginID').style.display = "block";
                document.getElementById('passBut').disabled = true;
                document.getElementById('goBack').disabled = true;
                document.getElementById('spinner').className = "spinner-border"
                goToHomepage(Number(data[0].id))
            }
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('Fetch error:', error);
        });
}

function goToHomepage(id){
    window.location.href = "homepage.html?userId=" + id;
}

function goToLogin(){
    document.getElementById('passBut').disabled = true;
    document.getElementById('goBack').disabled = true;
    window.location.href="../socialMediaApp";
}