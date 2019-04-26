'use strict';




function watchForm() {
    console.log('watchForm ran');
    $('form').submit(event =>  {
        event.preventDefault();
        const codeSearchTerm = $('#js-code-search').val();
    });
}

$(watchForm);