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
  $('#stackOverflow-results-list').empty();
  const stackOverflowResults = responseJson.items; 
  // iterate through the items array
  let noStackOverflowResults = '';
  if (!stackOverflowResults.length) {  // if the array length is 0 (false)
    noStackOverflowResults = `<h3>Stack Overflow returned no results. Try using different keywords or visit: 
    <a href="https://stackoverflow.com" target="_blank">https://stackoverflow.com</a></h3>`;
    $('#stackOverflow-results-list').html(noStackOverflowResults);
  } else {
      const appendStackOverflowResults = stackOverflowResults.map(question => {
        return (
          `<li><h3>${question.title}</h3>
          <p class="body-markdown">${question.body_markdown.length > 200 ? question.body_markdown.substring(0, 200) + '...' : question.body_markdown}</p>
          <button class="see-more">See detail</button>
          <div class="body hide-body">
           ${question.body}
            <button class="see-less">See less</button>
          </div>
          <a href="${question.link}" target="_blank">${question.link}</a>
          </li>`
        );
    });
    $('#stackOverflow-results-list').html(appendStackOverflowResults);
  }
}

function stackOverflowClickMore() {
  $('#stackOverflow-results-list').on('click', '.see-more', function(event) {
    let parentLi = $(this).closest('li');   // goes up to find closest <li>
    // console.log('stackOverflow click more ran');
    parentLi.find('.body').removeClass('hide-body');    // finds body, displays it
    parentLi.find('.body-markdown').addClass('markdown-hide');    // hides truncated
    $(this).addClass('button-hide');  // hides button that was clicked
  });
}

function stackOverflowClickLess() {
  $('#stackOverflow-results-list').on('click', '.see-less', function(event) {
    let parentLi = $(this).closest('li');
    // console.log('stackOverflow click less ran');
    parentLi.find('.body').addClass('hide-body');
    parentLi.find('.body-markdown').removeClass('markdown-hide');
    parentLi.find('.see-more').removeClass('button-hide');
  });
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
  $('#youtube-results-list').empty();
  const youTubeResults = responseJson.items;
  // iterate through the items array
  const appendYouTubeResults = youTubeResults.map(video => {
      return (
        `<li><h3>${video.snippet.title}</h3>
        <p>${video.snippet.description}</p>
        <iframe class="iframe-embed" src="https://www.youtube.com/embed/${video.id.videoId}?enablejsapi=1&origin=https://thinkful-nights-weekends-codename-camel.github.io/programmingFocus/" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
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
 // videoCategoryId: '28'  // tech and science -- currently unused
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
        getStackOverflowQuestions(codeSearchTerm);
        getYouTubeVideos(codeSearchTerm);
        $('#js-code-search').val(''); // empty user's search input
        $('.js-hide').removeClass('js-hide');
    });
}

function domReady() {
  watchForm();
  stackOverflowClickMore();
  stackOverflowClickLess();
}

$(domReady);
