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
        <iframe width="560" height="315" src="https://www.youtube.com/embed/${video.id.videoId}" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </li>`
      );
  });
  $('#results-list').html(appendYouTubeResults);
}

/*
  // snippet for thumbnail
  <img src='${video.snippet.thumbnails.medium.url}'>
*/

/*  // embed YouTube video (replace videoID) -- see origin info > try publishing to GitHub pages to see if this resolves console errors*
<iframe width="560" height="315" src="https://www.youtube.com/embed/${video.id.videoId}&origin=https://example.com" frameborder="0" allow="accelerometer;  encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
*/

function getYouTubeVideos(query) {
  const parameters = {
    key: youTubeAPIKey,
    maxResults: 6,
    order: 'Relevance',
    part: 'snippet',
    q: query,
    relevanceLanguage: 'en',
    safeSearch: 'strict',
    type: 'video',
    videoCategoryId: '27', // educational
 // videoCategoryId: '28'  // tech and science -- maybe we can use this too and sort it
    videoEmbeddable: true  

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