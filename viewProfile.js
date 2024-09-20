var userId = 0;
var currentId = 0;

function setID(){
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    userId = urlParams.get('userId');
    currentId = urlParams.get('currentUser');
}

function getUserProfile(){
    // Build formData object for fetch.
    //This will act same as for post from past 2 projects.
    let formData = new FormData();
    formData.append('userId', userId);

    //set options for fetch
    let options = {
        method: 'POST',
        body: formData
    };
    // run fetch
    fetch('getProfile.py', options)
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
                alert("Profile Didn't Load")
            }
            else {
                document.getElementById('userName').innerHTML = data[0].username;
                document.getElementById('followerCount').innerHTML = data[0].Followers;
                document.getElementById('followingCount').innerHTML = data[0].Following;
            }
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('Fetch error:', error);
        });
}

function follow(){
    console.log(userId == currentId)
    if(userId == currentId){
        document.getElementById('alertText').innerHTML = "Can't Follow Yourself";
        const toastLiveExample = document.getElementById('liveToast');
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        toastBootstrap.show();
    }
    else{
        let formData = new FormData();
        formData.append('user', userId);
        formData.append('currentUser', currentId);
        //set options for fetch
        let options = {
            method: 'POST',
            body: formData
        };
        // run fetch
        fetch('follow.py', options)
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
                if (data.result == false) {
                    document.getElementById('alertText').innerHTML = "Already Following!!";
                    const toastLiveExample = document.getElementById('liveToast');
                    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
                    toastBootstrap.show();
                }
                else {
                    console.log('followed');
                    document.getElementById('followerCount').innerHTML = data[0].Followers;
                    document.getElementById('followingCount').innerHTML = data[0].Following;
                }
            })
            .catch(error => {
                // Handle any errors that occurred during the fetch
                console.error('Fetch error:', error);
            });
    }
}

function backToHome(){
    window.location.href = "homepage.html?userId=" + currentId;
}