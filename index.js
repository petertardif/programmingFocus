'use strict';

const youTubeAPIKey = 'AIzaSyDxEA4w7rd0YACNoOzUeSK3YaI_UON9zjw';
const youTubeSearchURL = 'https://www.googleapis.com/youtube/v3/search';


function formatYouTubeQuery(parameters) {
    const queryItems = Object.keys(parameters)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`)
    return queryItems.join('&');
  }

function displayYouTubeResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  const youTubeResults = responseJson.items;
//  $('#results-list').empty();
  // iterate through the items array
  const appendYouTubeResults = youTubeResults.map(video => {
      return (
        `<li><h3>${video.snippet.title}</h3>
        <p>${video.snippet.description}</p>
        <img src='${video.snippet.thumbnails.default.url}'>
        </li>`
      );
  });
  $('#results-list').html(appendYouTubeResults);
}

/*  // embed YouTube video (replace videoID)
<iframe width="560" height="315" src="https://www.youtube.com/embed/N4mEzFDjqtA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
*/

function getYouTubeVideos(query) {
  const parameters = {
    key: youTubeAPIKey,
    q: query,
    part: 'snippet',
    maxResults: 20,
    type: 'video',
    videoCategoryId: '27'  // educational
    // videoCategoryId: '28'  // tech and science
  };
  const youTubeQueryString = formatYouTubeQuery(parameters)
  const youTubeURL = youTubeSearchURL + '?' + youTubeQueryString;

  console.log(youTubeURL);

  fetch(youTubeURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayYouTubeResults(responseJson))
    .catch(error => {
      $('#js-error-message').text(`Something went wrong: ${error.message}`);
    });
}


function watchForm() {
    console.log('watchForm ran');
    $('form').submit(event =>  {
        event.preventDefault();
        const codeSearchTerm = $('#js-code-search').val();
        getYouTubeVideos(codeSearchTerm);
    });
}

$(watchForm);