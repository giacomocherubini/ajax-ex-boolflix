$(document).ready(function() {

  var api_url = 'https://api.themoviedb.org/3/'
  var template_html = $("#template_film").html();
  var template_function = Handlebars.compile(template_html);
  var icone_bandiere = ['en','it','de','fr','es','zh'];

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
      'url': api_url + 'search/movie',
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
        var linguaggio = get_bandiera_lingua(movie.original_language);
        var numero_stelline = get_numero_stelline(parseFloat(movie.vote_average));
        var html_stelline = get_html_stelline(numero_stelline);


        // creo l'oggetto Handlebars
        var handlebars_film = {
          'title': titolo,
          'original_title': titolo_originale,
          'language': linguaggio,
          'vote': html_stelline
        }

        var html_film = template_function(handlebars_film);
        $('#films').append(html_film);

      }
    }

    // creo una funzione per dividere in 2 il numero e arrotondarlo per eccesso
    function get_numero_stelline(rating) {
      console.log(rating);
      var stelline = Math.ceil(rating/2);
      console.log(stelline);
      return stelline;
    }

    // creo una funzione per stabilire le stelline da visualizzare
    function get_html_stelline(numero_stelline) {
      // inizializzo la variabile icona_stelline
      var icone_stelline = '';
      // creo un ciclo for per il numero totale di stelline da visualizzare
      for (var i = 0; i < 5; i++) {
          // se i è minore del voto aggiugo una stellina piena
          // poi quando i diventa maggiore del voto aggiungo una stellina vuota
          if ( i < numero_stelline) {
            icone_stelline += '<i class="fas fa-star"></i>';
          } else {
            icone_stelline += '<i class="far fa-star"></i>';
          }
      }
      return icone_stelline;
    }

    // funzione per sostituirele bandiere alla lingua
    function get_bandiera_lingua(linguaggio) {
      var bandiera = linguaggio;
      if(icone_bandiere.includes(linguaggio)) {
        bandiera = '<img src="img/'+linguaggio+'.png">';
      }
      return bandiera;
    }
});
