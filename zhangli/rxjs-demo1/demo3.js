var refreshButton = document.querySelector(".refresh");

var refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');

var startupRequestStream = Rx.Observable.just('https://api.github.com/users');

var requestOnRefreshStream = refreshClickStream.map(event => {
  var randomOffset = Math.floor(Math.random() * 500);
  return 'https://api.github.com/users?since=' + randomOffset;
})

var responseStream = requestOnRefreshStream.merge(startupRequestStream)
   .flatMap(requestUrl => {
     return Rx.Observable.fromPromise(jQuery.getJSON(requestUrl))
   });

function createSuggestionStream(responseStream) {
  return responseStream.map(listUser => 
    listUser[Math.floor(Math.random() * listUser.length)]
  )
  .startWith(null)
  .merge(refreshClickStream.map(event => null));
}

var suggestionStream = createSuggestionStream(responseStream);

function renderSuggestion(suggestedUser, selector) {
  var suggestionEl = document.querySelector(selector);
  if(suggestedUser === null) {
    suggestionEl.style.visibility = 'hidden';
  } else {
    suggestionEl.style.visibility = 'visible';
    var usernameEl = document.querySelector('.userName');
    usernameEl.href = suggestedUser.html_url;
    usernameEl.textContent = suggestedUser.login;
    var imgEl = document.querySelector('img');
    imgEl.src = suggestedUser.avatar_url;
  }
}

suggestionStream.subscribe(user => {
    renderSuggestion(user, '.suggestion')
})