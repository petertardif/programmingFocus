'use strict';

// mdn search (very basic keyword search)
const mdnSearchURL = 'https://cors-anywhere.herokuapp.com/https://developer.mozilla.org/en-US/search.json';
// proxy server to bypass CORB error, we understand this would not be done in a production environment

function formatMdnQuery(parameters) {
    const queryItems = Object.keys(parameters)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`)
    return queryItems.join('&');
  }

function displayMdnResults(responseJson) {
  console.log(responseJson);
  const mdnResults = responseJson.documents;
  // iterate through the items array
  const appendMdnResults = mdnResults.map(document => {
      return (
        `<li><h3>${document.title}</h3>
        <p>${document.excerpt}</p>
	<a href="${document.url}">${document.url}</a>
        </li>`
      );
  });
  $('#mdn-results-list').html(appendMdnResults);	// add the <ul> with this ID to the HTML
}

function getMdnDocuments(query) {
  const parameters = {
    locale: 'en-US',
    q: query
  };
  const mdnQueryString = formatMdnQuery(parameters);	
  const mdnURL = mdnSearchURL + '?' + mdnQueryString;
  console.log(mdnURL);

  fetch(mdnURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayMdnResults(responseJson))
    .catch(error => {
      $('#js-error-message').text(`Something went wrong: ${error.message}`);
    });
}

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
  // iterate through the items array
  const appendStackOverflowResults = stackOverflowResults.map(question => {
      return (
        `<li><h3>${question.title}</h3> 
        ${question.body}
        <a href="${question.link}" target="_blank">${question.link}</a>
        </li>`
      );
  });
  $('#stackOverflow-results-list').html(appendStackOverflowResults);
}

function getStackOverflowQuestions(query) {
  const parameters = {
    filter: '!-*jbN-lBOF)v',  // filter for body content (description) and page and page_size
    intitle: query,
    site: 'stackoverflow',
    pagesize: 10,
    sort: 'relevance'
  };
  const stackOverflowQueryString = formatStackOverflowQuery(parameters);
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
  const youTubeQueryString = formatYouTubeQuery(parameters);
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
        getMdnDocuments(codeSearchTerm);
        getStackOverflowQuestions(codeSearchTerm);
        getYouTubeVideos(codeSearchTerm);
    });
}

$(watchForm);