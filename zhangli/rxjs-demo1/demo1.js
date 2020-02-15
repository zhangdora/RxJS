var refreshButton = document.querySelector(".refresh");

var requestStream = Rx.Observable.just('https://api.github.com/users');

var responseStream = requestStream
   .flatMap(requestUrl => 
     Rx.Observable.fromPromise(jQuery.getJSON(requestUrl))
    );

responseStream.subscribe(response => {
     console.log(response)
})

function createSuggestionStream(responseStream) {
  return responseStream.map(listUser => 
    listUser[Math.floor(Math.random() * listUser.length)]
  );
}

var suggestionStream = createSuggestionStream(responseStream);

function renderSuggestion(userData, selector) {
  var element = document.querySelector(selector);
  var usernameEl = document.querySelector('.userName');
  usernameEl.href = userData.html_url;
  usernameEl.textContent = userData.login;
  var imgEl = document.querySelector('img');
  imgEl.src = userData.avatar_url;
}

suggestionStream.subscribe(user => {
    renderSuggestion(user, '.suggestion')
})