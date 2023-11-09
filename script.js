//get the id of the television show the user searched for from the page URL
//for example, http:///www.screenscene.com/tvshow.html?showID=showID=526
//(this is just an example, the above URL will not actually work)

const urlParams = new URLSearchParams(window.location.search);
const showID = urlParams.get("showID");

async function tvSearched() {
  let tv = document.getElementById("tvSearch").value;
  let response = await fetch("https://api.tvmaze.com/search/shows?q=" + tv);
  let shows = await response.json();
  /*console.log(shows);*/
  document.getElementById("preSearch").style.display = "none";

  for (let x = 0; x < shows.length; x++) {
    /*console.log(x);*/
    let htmlBuilder = "";
    let showImage = "NoPicture.png";
    let showRating = "Rating not available";

    if (shows[x].show.image !== null) {
      showImage = shows[x].show.image.medium;
      /*console.log(showImage);*/
    }

    if (shows[x].show.rating.average !== null) {
      showRating = parseFloat(shows[x].show.rating.average) + "/10";
      /*console.log(showRating);*/
    }
    htmlBuilder = `
    <div class="search-results">
      <img src="${showImage}" />
      <div class="show-details">
        <div class="show-title">
          ${shows[x].show.name}
        </div>
        <div class="show-rating">
          ${showRating}
        </div>
        <div class="show-summary">
        ${shows[x].show.summary}
        </div>

        <a class="view-details-button" href="tvshow.html?showID=${shows[x].show.id}">
          view details
          <img src="ArrowForward.png" style="margin-left: 12px;"/>
        </a>
      </div>
    </div>
    
    `;
    document.getElementById("searchResults").innerHTML += htmlBuilder;
  }
}

async function showDetails() {
  let urlParams = new URLSearchParams(window.location.search);
  let showID = urlParams.get("showID");
  let response = await fetch(" https://api.tvmaze.com/shows/" + showID);
  let tv = await response.json();
  /*console.log(tv);*/
  let showImage = "NoPicture.png";
  let showRating = "Rating not available";

  if (tv.image !== null) {
    showImage = tv.image.medium;
    /*console.log(showImage);*/
  }

  if (tv.rating.average !== null) {
    showRating = parseFloat(tv.rating.average) + "/10";
    /*console.log(showRating);*/
  }
  let htmlBuilder = "";
  htmlBuilder = `
  <img src="${showImage}" />
      <div class="show-details">
        <div class="show-title">
          ${tv.name}
        </div>
        <div class="show-rating">
          ${showRating}
        </div>
        <div class="show-summary">
        ${tv.summary}
        </div>
      </div>
  `;
  document.getElementById("tvSummary").innerHTML += htmlBuilder;

  let responseCast = await fetch(
    " https://api.tvmaze.com/shows/" + showID + "/cast"
  );
  let casts = await responseCast.json();
  /*console.log(casts);*/

  for (let y = 0; y < casts.length; y++) {
    let castImage = "NoPicture.png";

    if (casts[y].person.image !== null) {
      castImage = casts[y].person.image.medium;
      /*console.log(showImage);*/
    }
    let castHtmlBuilder = "";
    castHtmlBuilder += `
    <div class="cast-column">
      <img src="${castImage}" class="cast-image"/>
      <div class="cast-name">
        ${casts[y].person.name}
      </div>
      <div class="character-name">
        ${casts[y].character.name}
      </div>
    </div>
    `;
    document.getElementById("castRow").innerHTML += castHtmlBuilder;
  }

  let responseSeasons = await fetch(
    " https://api.tvmaze.com/shows/" + showID + "/seasons"
  );
  let seasons = await responseSeasons.json();
  /*console.log(seasons);*/

  for (let a = 0; a < seasons.length; a++) {
    let seasonNumber = a + 1;
    /*console.log(seasonNumber);*/
    let sesaonHtmlBuilder = "";
    sesaonHtmlBuilder += `
    <div class="season-header">
      Season ${seasonNumber}
    </div>
    `;
    let responseEpisodes = await fetch(
      "https://api.tvmaze.com/seasons/" + seasons[a].id + "/episodes"
    );
    let episodes = await responseEpisodes.json();
    /*console.log(episodes);*/
    for (let b = 0; b < episodes.length; b++) {
      let episodeImage = "NoPicture.png";

      if (episodes[b].image !== null) {
        episodeImage = episodes[b].image.medium;
        /*console.log(showImage);*/
      }
      sesaonHtmlBuilder += `
        <div class="episode-row">
         <img src="${episodeImage}" class="episode-image"/>
         <div class="episode-information">
          <div class="episode-name">
           ${episodes[b].name}
          </div>
          <div class="episode-summary">
          ${episodes[b].summary}
          </div>
         </div>
        </div>
      `;
    }

    document.getElementById("episodes").innerHTML += sesaonHtmlBuilder;
  }
}
