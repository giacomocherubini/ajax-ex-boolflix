$(document).ready(function() {

  var template_html = $("#template_film").html();
  var template_function = Handlebars.compile(template_html);

  // intercetto il tasto invio
  $('#search').keyup(function(event) {
    if(event.which == 13) {
      // l'utente ha premuto il tasto invio
      // recupero il testo inserito dall'utente
     var val_search = $('#search').val();
     // faccio la chiamata ajax a tmdb
     chiamata_api(val_search);
    }
  })

  $('#btn_search').click(function() {
    // recupero il testo inserito dall'utente
   var val_search = $('#search').val();
   // faccio la chiamata ajax a tmdb
   chiamata_api(val_search);
  })

   function chiamata_api (testo) {
     // faccio la chiamata ajax a tmdb
    $.ajax({
      'url': 'https://api.themoviedb.org/3/search/movie',
      'data': {
        'api_key': '98b8b4576cbd2fa355ca9f0c79a15767',
        'query': testo ,
        'language': 'it'
      },
      'method': 'GET',
      'success': function(data_response) {
        // creo una variabile per l'array di tutti i film trovati
        var movies = data_response.results;
        stampa_film(movies);
      },
      'error': function() {
        alert('si è verificato un errore');
      }
    })
  }


    function stampa_film(movies) {
    // creo un ciclo for sull'array dei film
      for (var i = 0; i < movies.length; i++) {
        var movie = movies[i];
        var titolo = movie.title;
        var titolo_originale = movie.original_title;
        var linguaggio = movie.original_language;
        var voto = movie.vote_average;
        console.log(movie);
        // creo l'oggetto Handlebars
        var handlebars_film = {
          'title': titolo,
          'original_title': titolo_originale,
          'language': linguaggio,
          'vote': voto
        }

        var html_film = template_function(handlebars_film);
        $('#films').append(html_film);

      }
    }



});
