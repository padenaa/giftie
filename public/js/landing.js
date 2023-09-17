//get the user login info
let googleUserId;

window.onload = (event) => { 
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log('Logged in as: ' + user.displayName);
        googleUser = user;
        googleUserId = user.uid;
        getProfiles(user.uid);
      } else {
        // If not logged in, navigate back to login page.
        window.location = 'index.html'; 
      };
    });
  };

  
document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    function openModal($el) {
        console.log("here")
      $el.classList.add('is-active');
    }
  
    function closeModal($el) {
      $el.classList.remove('is-active');
    }
  
    function closeAllModals() {
      (document.querySelectorAll('.modal') || []).forEach(($modal) => {
        closeModal($modal);
      });
    }
  
    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
      const modal = $trigger.dataset.target;
      const $target = document.getElementById(modal);
  
      $trigger.addEventListener('click', () => {
        openModal($target);
      });
    });
  
    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-close, .button') || []).forEach(($close) => {
      const $target = $close.closest('.modal');
  
      $close.addEventListener('click', () => {
        closeModal($target);
      });
    });
  
    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Escape') {
        closeAllModals();
      }
    });
  });

function adder(){
    window.location = "add.html"
}


//displayer
function getProfiles(userId){
    const dbRef = firebase.database().ref(userId);
    dbRef.on('value', (snapshot) => {
        const data = snapshot.val();
        renderDataAsHtml(data);
    })
};


const renderDataAsHtml = (data) => {
    let cards = ``;
    for(const friend in data) {
        const note = data[friend];
        // For each note create an HTML card
        //ideas = createIdeas(note, friend)
        console.log(friend)
        cards += createCard(note, friend)
    };
    document.getElementById("cards").innerHTML = cards;
};

const createIdeas = (note, noteId) => {
    let innerHTML = '<div class="field is-grouped">';
    for (const idea in note) {
        innerHTML += 
        `
            <div class="field" style="padding-right: 20px">
                <div class="box">
                    ${note[idea]} 
                </div>
            </div>
        
        `
    }
    innerHTML += '</div>'
    return innerHTML
}

const createCard = (note, noteId, ideas) => {
    //temporarily don't use ideas
    let innerHTML = 
    `
    <div class="column is-two-thirds is-offset-one-fifth">

            <div class="box">
            <article class="media">
                <div class="media-left">
                    <figure class="image is-128x128">
                        <img src=${note.pic}>
                    </figure>
                </div>
                <div class="media-content">
                    <p class="title is-4">${note.name}</p>
                    
                    <div>${note.ideas}</div>
                    
                </div>
                <footer class="media-content">
                    <a id="${noteId}" href="#" class="card-footer-item js-modal-trigger" data-target="modal-js-example" style="color: rgb(171, 212, 248);" onclick="edit('${noteId}')"><i class='fas fa-edit'></i></a>
                    <a href="#" class="card-footer-item js-modal-trigger" data-target="modal-js-example" style="color: rgb(171, 212, 248);" onclick="getRecommend('${noteId}')"><i class='fas fa-magic'></i></a>
                </footer>
            </article>
            </div>
    </div>
    `

    return innerHTML;
};

function edit(noteId){
    //get info from database
    const dbRef = firebase.database().ref(`${googleUserId}/${noteId}`);
    let data;
    dbRef.on('value', (snapshot) => {
        data = snapshot.val();
    })
    document.getElementById('modalTitle').innerHTML = data.name
    document.getElementById('modalIdeas').value = data.ideas
    document.getElementById('modal').classList.add('is-active')
    document.getElementById('saveChange').addEventListener('click', () => {
        firebase.database().ref(`${googleUserId}/${noteId}`).update({
            ideas: document.getElementById('modalIdeas').value
        }).then(()=>{
            window.location = "landing.html";
        })
        
    })

}

function getRecommend(noteId) {
  const dbRef = firebase.database().ref(`${googleUserId}/${noteId}`);
    let friend;
    dbRef.on('value', (snapshot) => {
        friend = snapshot.val();
  })
  let data = {
      relationship: friend.relationship,
      ideas: friend.ideas
  }
  callAPI(data, friend.name)

}

const callAPI = async (input, name) => {
  let data = {
      info: input
  }
  const response = await fetch('http://localhost:8000/api/recommend', {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
  })

  let resJSON = await response.json();
  result = resJSON['recommendation'];
  alert(result)
}
  
