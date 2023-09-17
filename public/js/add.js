//read the fields for the new post
//add under user
let googleUser;
let googleUserId;

rship_arr = ["family", "friend", "significant other", "colleague/professional", "other"]
const name_in = document.getElementById("name");
const rship_in = document.getElementById("relationship");
const profilefile = document.getElementById("picture");
const ideas_in = document.getElementById("ideas");
const filename = document.getElementById("filename");
var img = document.getElementById("profilepic");

//get the user login info
window.onload = (event) => { 
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log('Logged in as: ' + user.displayName);
        googleUser = user;
        googleUserId = user.uid;
      } else {
        // If not logged in, navigate back to login page.
        window.location = 'index.html'; 
      };
    });
};

//image uploader
profilefile.addEventListener('change', function() {
    console.log("uploading image");
    if (this.files && this.files[0]) {
        filename.innerHTML = this.files[0].name;
        var storageRef = firebase.storage().ref("friends").child(googleUserId+this.files[0].name);
        storageRef.put(this.files[0]).then(()=>{
            firebase.storage().ref("friends").child(googleUserId+this.files[0].name).getDownloadURL()
                .then((downloadURL) => {
                    img.src = downloadURL;
            })
        });
    }
});


function poster(){
    //update listings under general housing listings 
    firebase.database().ref(`${googleUser.uid}`).push({
        //update title, address, length, rent, beds, baths, gender, description, picture
        name: name_in.value,
        relationship: rship_arr[rship_in.selectedIndex],
        pic: img.src,
        ideas: ideas_in.value
    }).then(()=>{
        window.location = "landing.html";
    })
}