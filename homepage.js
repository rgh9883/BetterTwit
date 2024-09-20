var userId = 0;
var maxPosts = 10000;
var currentMax;
var viewingAllPosts = true;

function setID(){
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    userId = urlParams.get('userId');
}

function getProfile(){
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
                document.getElementById('username').innerHTML = data[0].username;
                let element = document.getElementById('profileLink');
                element.setAttribute('href', 'viewProfile.html?userId=' + data[0].id + '&currentUser=' + userId);
            }
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('Fetch error:', error);
        });
}

function post() {
    document.getElementById('nextPage').disabled = false;
    document.getElementById('previousPage').disabled = true;
    document.getElementById('onlyFollowing').innerHTML = "View Only Following";

    let post = document.getElementById('postBox').value;

    // Build formData object for fetch.
    //This will act same as for post from past 2 projects.
    let formData = new FormData();
    formData.append('postText', post);
    formData.append('userId', userId);

    //set options for fetch
    let options = {
        method: 'POST',
        body: formData
    };
    // run fetch
    fetch('post.py', options)
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
                alert("PostFailed")
            }
            else {
                loadPosts(data);
                maxPosts = data[0].postId;
            }
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('Fetch error:', error);
        });

}

function loadPostsFetch(){
    // Build formData object for fetch.
    //This will act same as for post from past 2 projects.
    let formData = new FormData();
    formData.append('maxPosts', maxPosts);

    //set options for fetch
    let options = {
        method: 'POST',
        body: formData
    };
    // run fetch
    fetch('displayPosts.py', options)
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
                alert("Posts Didn't Load")
            }
            else {
                loadPosts(data);
                maxPosts = data[0].postId;
            }
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('Fetch error:', error);
        });
}

function loadPosts(data){
    let postOutput = "";
    currentMax = data[0].postId;
    for(i = 0; i < data.length; i++){
        postOutput += "<div class= 'mb-3'> <label for='" + i + "' class='form-label'><a href='viewProfile.html?userId=" + data[i].id + "&currentUser=" + userId +"'><h3>" + data[i].username + "</h3></a><span class='timeText'>" + data[i].time + "</span></label> <div id='" + i + "' class='postContent'>" + data[i].textPost + "  <br><br><br><button type='button' class='likeButton' onclick='likeAction(" + data[i].postId + ")'><img class = 'likeIMG' src='likeButton.png'/></button><b class='likeCount'><h4 id='post" + data[i].postId + "'>" + data[i].numLikes + "</h4></b> </div> </div><br><br>";
    }
    document.getElementById('posts').innerHTML = postOutput;
}


function likeAction(postId){
    let formData = new FormData();
    formData.append('user', userId);
    formData.append('post', postId);
    //set options for fetch
    let options = {
        method: 'POST',
        body: formData
    };
    // run fetch
    fetch('like.py', options)
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
                const toastLiveExample = document.getElementById('liveToast');
                const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
                toastBootstrap.show();
            }
            else {
                console.log('liked');
                let numLikes = Number(document.getElementById('post' + postId).innerHTML);
                console.log(numLikes);
                numLikes++;
                document.getElementById('post' + postId).innerHTML = numLikes;
            }
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('Fetch error:', error);
        });
}

function pageNext(){
    // Build formData object for fetch.
    //This will act same as for post from past 2 projects.
    let formData = new FormData();
    let newMax = currentMax - 10;
    formData.append('maxPosts', newMax);
    document.getElementById('previousPage').disabled = false;

    //set options for fetch
    let options = {
        method: 'POST',
        body: formData
    };
    // run fetch
    fetch('displayPosts.py', options)
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
                alert("Posts Didn't Load")
            }
            else {
                loadPosts(data);
                console.log(currentMax)
                if(currentMax - 10 < 1){
                    document.getElementById('nextPage').disabled = true;
                }
            }
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('Fetch error:', error);
        });
}

function pagePrevious(){
    // Build formData object for fetch.
    //This will act same as for post from past 2 projects.
    document.getElementById('nextPage').disabled = false;
    let formData = new FormData();
    let newMax = currentMax + 10;
    formData.append('maxPosts', newMax);

    //set options for fetch
    let options = {
        method: 'POST',
        body: formData
    };
    // run fetch
    fetch('displayPosts.py', options)
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
                alert("Posts Didn't Load")
            }
            else {
                loadPosts(data);
                console.log(currentMax == maxPosts);
                console.log(maxPosts);
                if(currentMax == maxPosts){
                    document.getElementById('previousPage').disabled = true;
                }
            }
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('Fetch error:', error);
        });
}

function followingOnly(){
    if (!viewingAllPosts){
        loadPostsFetch();
        document.getElementById('onlyFollowing').innerHTML = "View Only Following";
        viewingAllPosts = true;
        document.getElementById('nextPage').disabled = false;
        document.getElementById('previousPage').disabled = true;
    }
    else{
        // Build formData object for fetch.
        //This will act same as for post from past 2 projects.
        let formData = new FormData();
        formData.append('maxPosts', maxPosts);
        formData.append('userId', userId);

        //set options for fetch
        let options = {
            method: 'POST',
            body: formData
        };
        // run fetch
        fetch('displayPostsFollowing.py', options)
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
                    document.getElementById('alertText').innerHTML = "You Don't Follow Anybody!";
                    const toastLiveExample = document.getElementById('liveToast');
                    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
                    toastBootstrap.show();
                }
                else {
                    loadPosts(data);
                    document.getElementById('onlyFollowing').innerHTML = "View All";
                    viewingAllPosts = false;
                    document.getElementById('nextPage').disabled = true;
                    document.getElementById('previousPage').disabled = true;
                }
            })
            .catch(error => {
                // Handle any errors that occurred during the fetch
                console.error('Fetch error:', error);
            });
    }

}

function logout(){
    window.location.href = "../socialMediaApp";
}