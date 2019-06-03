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
     // svuoto il campo di ricerca dopo l'invio
     $('#search').val('');
     // svuoto il contenitore film all'inizio in modo tale che
     // ad ogni ricerca non compaiono i film gia cercati
     $('#films').html('');
    }
  })

  $('#btn_search').click(function() {
    // recupero il testo inserito dall'utente
   var val_search = $('#search').val();
   // faccio la chiamata ajax a tmdb
   chiamata_api(val_search);
   // svuoto il campo di ricerca dopo il click
   $('#search').val('');
   // svuoto il contenitore film all'inizio in modo tale che
   // ad ogni ricerca non compaiono i film gia cercati
   $('#films').html('');
  })

// funzione per la chiamata api a tmdb
   function chiamata_api (testo) {

     // chiamata ajax per i film
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
        stampa_locandine(movies);
      },
      'error': function() {
        alert('si è verificato un errore');
      }
    });

     // chiamata ajax per le serie tv
    $.ajax({
      'url': api_url + 'search/tv',
      'data': {
        'api_key': '98b8b4576cbd2fa355ca9f0c79a15767',
        'query': testo ,
        'language': 'it'
      },
      'method': 'GET',
      'success': function(data_response) {
        // creo una variabile per l'array di tutti i film trovati
        var serie = data_response.results;
        // preparo gli oggetti "serie"
        // per essere stampati dalla stessa funzione che stampa i film
        serie = standardizza_chiavi_serie(serie);
        stampa_locandine(serie);
      },
      'error': function() {
        alert('si è verificato un errore');
      }
    });
  }
    // funzione che stampa le le locandine recuperate dall'api
    function stampa_locandine(movies,film) {
    // creo un ciclo for sull'array dei film
      for (var i = 0; i < movies.length; i++) {
        var movie = movies[i];
        var titolo = movie.title;
        var titolo_originale = movie.original_title;
        var linguaggio = get_bandiera_lingua(movie.original_language);
        var numero_stelline = get_numero_stelline(parseFloat(movie.vote_average));
        var html_stelline = get_html_stelline(numero_stelline);
        var tipo = 'film';
        if(typeof movie.type !== 'undefined') {
          tipo = movie.type;
        }


        // creo l'oggetto Handlebars
        var handlebars_film = {
          'title': titolo,
          'original_title': titolo_originale,
          'language': linguaggio,
          'vote': html_stelline,
          'type': tipo
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
    // altrimenti resituisce la stringa della lingua
    function get_bandiera_lingua(linguaggio) {
      var bandiera = linguaggio;
      if(icone_bandiere.includes(linguaggio)) {
        bandiera = '<img src="img/'+linguaggio+'.png">';
      }
      return bandiera;
    }

    // funzione che prepara l'array delle serie con
    // le stesse chiavi dei film
     function standardizza_chiavi_serie(serie) {
       var serie_sistemate = [];
       for (var i =0; i < serie.length; i++) {
         var nuova_serie = {
           'title': serie[i].name,
           'original_title': serie[i].original_name,
           'original_language':serie[i].original_language,
           'vote_average': serie[i].vote_average,
           'type': 'serie tv'
         }
         serie_sistemate.push(nuova_serie);
       }
       return serie_sistemate;
     }
});
