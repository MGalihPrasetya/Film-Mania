const RAPID_API_KEY = "52e8abf9ecmsh071be3a9c3dc76ep120da8jsnd7dcf7bc8a97";    

async function search() {

    const moviesContainer = document.getElementById('movies');
    moviesContainer.innerHTML = 'Loading...';

    const { Search } = await searchMovies(document.getElementById('searchTerm').value);

    moviesContainer.innerHTML = Search.map(movie => `
        <li class="movie grid cols">
            <span class="thumbnail"><img src="${movie.Poster}"></span>
            <div class="metadata grid medium">
                <h3>${movie.Title}</h3>
                <span><b>Year: </b>${movie.Year}</span>
                <br>                     
                <div class="detail">
                    <button class="subtle" onclick="showDetail(this.parentElement, '${movie.imdbID}')">See Detail</button>
                </div>        
            </div>
        </li>
    `).join('');            
}

async function searchMovies(term) {            

    var str = term.replace(" ", "%20");

    const response = await fetch("https://movie-database-imdb-alternative.p.rapidapi.com/?s=" +term +"&page=1&r=json", {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": RAPID_API_KEY,
            "x-rapidapi-host": "movie-database-imdb-alternative.p.rapidapi.com"
        }
    });

    const body = await response.json();
    console.log(body);
    return body;
}

function showDetail(detailsContainer, id) {            
    
    detailsContainer.innerHTML = 'Loading...';

    fetch("https://movie-database-imdb-alternative.p.rapidapi.com/?i=" +id +"&r=json", {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": RAPID_API_KEY,
            "x-rapidapi-host": "movie-database-imdb-alternative.p.rapidapi.com"
        }
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("NETWORK RESPONSE ERROR");
        }
    })
    .then(data => {
        console.log(data);

        detailsContainer.innerHTML = `                    
            <br>
            <ul class="grid">
                <li class="grid small table">
                    <span><b>Rating: </b>${data.imdbRating}</span>
                    <span><b>Released: </b>${data.Released}</span>
                    <span><b>Runtime: </b>${data.Runtime}</span>                    
                    <span><b>Director: </b>${data.Director}</span>
                    <span><b>Actors: </b>${data.Actors}</span>
                    <br>
                    <span><b>Plot: </b>${data.Plot}</span>
                    <br>
                    <div class="terjemah">
                        <button class="subtle" onclick="#" id="btntranslate">Translate</button>
                    </div>
                </li>
            </ul>
        `;        

        document.getElementById("btntranslate").onclick = function() {translateLanguage(detailsContainer, data)};        
    })
    .catch((error) => console.error("FETCH ERROR:", error));    
}

function translateLanguage(translateContainer, value) {

    translateContainer.innerHTML = 'Loading Translate...';

    var str = value.Plot.replace(" ", "%20");    

    fetch("https://google-translate20.p.rapidapi.com/translate?text=" +str +"&tl=id&sl=en", {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": RAPID_API_KEY,
            "x-rapidapi-host": "google-translate20.p.rapidapi.com"
        }
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("NETWORK RESPONSE ERROR");
        }
    })
    .then(data => {
        console.log(data);

        translateContainer.innerHTML = `                    
            <br>
            <ul class="grid">                
                <li class="grid small table">
                    <span><b>Penilaian: </b>${value.imdbRating}</span>
                    <span><b>Rilis: </b>${value.Released}</span>
                    <span><b>Durasi: </b>${value.Runtime}</span>                    
                    <span><b>Sutradara: </b>${value.Director}</span>
                    <span><b>Aktor: </b>${value.Actors}</span>
                    <br>
                    <span><b>Sinopsis: </b>${data.data.translation}</span>
                    <br>
                </li>
            </ul>
            <br>
        `;
    })
    .catch((error) => console.error("FETCH ERROR:", error));

}