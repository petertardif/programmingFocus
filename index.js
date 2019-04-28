'use strict';

// StackOverflow API:
const stackOverflowSearchURL = 'https://api.stackexchange.com/2.2/search';

function formatStackOverflowQuery(parameters){
  const queryItems = Object.keys(parameters)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`)
  return queryItems.join('&');
}

function displayStackOverflowResults(responseJson) {
  console.log(responseJson);
  const stackOverflowResults = responseJson.items; 
  let max = 10;  // limiting search results to 10 if there are more than 10
  // iterate through the items array
  let appendStackOverflowResults = ``;
  if (stackOverflowResults.length > max) {
    for (let i = 0; i < max; i++) {
      appendStackOverflowResults += 
        `<li><h3>${stackOverflowResults[i].title}</h3> 
        <p>${stackOverflowResults[i].body_markdown}</p>
        <a href="${stackOverflowResults[i].link}" target="_blank">${stackOverflowResults[i].link}</a>
        </li>`;
      // return appendStackOverflowResults;
    }
    $('#stackOverflow-results-list').html(appendStackOverflowResults);
  } 
    else {
      const appendStackOverflowResults = stackOverflowResults.map(question => {
        return (
          `<li><h3>${question.title}</h3> 
          <p>${question.body_markdown}</p>
          <a href="${question.link}" target="_blank">${question.link}</a>
          </li>`
        );
    });
    $('#stackOverflow-results-list').html(appendStackOverflowResults);
  }
}

function getStackOverflowQuestions(query) {
  const parameters = {
    filter: '!9Z(-wwK0y',  // filter for body content (description)
    intitle: query,
    site: 'stackoverflow',
    sort: 'relevance'
  };
  const stackOverflowQueryString = formatStackOverflowQuery(parameters)
  const stackOverflowURL = stackOverflowSearchURL + '?' + stackOverflowQueryString;
  console.log(stackOverflowURL);

  fetch(stackOverflowURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayStackOverflowResults(responseJson))
    .catch(error => {
      $('#js-error-message').text(`Something went wrong: ${error.message}`);
    });
}

// youTube API:
const youTubeAPIKey = 'AIzaSyDxEA4w7rd0YACNoOzUeSK3YaI_UON9zjw';  // note: we understand this should not be here, but in order for the app to function...
const youTubeSearchURL = 'https://www.googleapis.com/youtube/v3/search';

function formatYouTubeQuery(parameters) {
    const queryItems = Object.keys(parameters)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`)
    return queryItems.join('&');
  }

function displayYouTubeResults(responseJson) {
  console.log(responseJson);
  const youTubeResults = responseJson.items;
  // iterate through the items array
  const appendYouTubeResults = youTubeResults.map(video => {
      return (
        `<li><h3>${video.snippet.title}</h3>
        <p>${video.snippet.description}</p>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/${video.id.videoId}?enablejsapi=1&origin=https://thinkful-nights-weekends-codename-camel.github.io/codeSearchAPIHack/" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </li>`
      );
  });
  $('#youtube-results-list').html(appendYouTubeResults);
}

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
        getStackOverflowQuestions(codeSearchTerm);
        getYouTubeVideos(codeSearchTerm);
    });
}

$(watchForm);