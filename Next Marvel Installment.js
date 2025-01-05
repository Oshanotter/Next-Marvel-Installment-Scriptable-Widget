// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: film;
// ----------------------------------------
// Next Marvel Installment - Scriptable Widget
// ----------------------------------------
// created by Max Forst
// feel free to take my code and modify it in any way you want.

// declare variables
var apiKey = "92cb657c99dd5b66f092cce535a32913";
var currentDate = new Date();
var dateFormatter = new DateFormatter();
dateFormatter.dateFormat = 'yyyy-MM-dd';
var currentDateString = dateFormatter.string(currentDate);
var noCoverImageUrl = "https://raw.githubusercontent.com/Oshanotter/Next-Marvel-Installment-Scriptable-Widget/refs/heads/main/images/no_cover.png";
var marvelStudiosLogo = "https://raw.githubusercontent.com/Oshanotter/Next-Marvel-Installment-Scriptable-Widget/refs/heads/main/images/marvel_studios_logo.png";

async function getNextTvShow() {
  /* gets the next upcoming or current tv show */

  var url = "https://api.themoviedb.org/3/discover/tv?with_keywords=180547&sort_by=first_air_date.desc&with_status=0|2&api_key=" + apiKey;
  var tvApi = await new Request(url).loadJSON();
  var tvShows = tvApi.results;
  console.log(tvShows);
  var nextShow = null;

  // loop through the tv shows and get when the next air date is
  for (var i = 0; i < tvShows.length; i++) {
    var show = tvShows[i];
    var id = show.id;
    var showUrl = "https://api.themoviedb.org/3/tv/" + id + "?api_key=" + apiKey;
    var showApi = await new Request(showUrl).loadJSON();
    var nextEpisode = showApi.next_episode_to_air;

    if (nextEpisode) {
      var airDate = nextEpisode.air_date;

    } else {
      var airDate = null;

    }

    // if the air date is sooner, set it as the next episode
    if (nextShow == null && airDate != null) {
      nextShow = {
        "show": show,
        "showApi": showApi
      };

    } else if (airDate != null && nextShow.showApi.next_episode_to_air.air_date > airDate) {
      nextShow = {
        "show": show,
        "showApi": showApi
      };

    }
  }

  // return the next or current show
  return nextShow;
}

async function getNextMovie() {
  /* gets the next upcoming movie */

  var url = "https://api.themoviedb.org/3/discover/movie?with_keywords=180547&sort_by=primary_release_date.asc&primary_release_date.gte=" + currentDateString + "&api_key=" + apiKey;
  var movieApi = await new Request(url).loadJSON();
  var movies = movieApi.results;
  var newestMovie = movies[0];
  return newestMovie;

}

function getWidgetpreferences() {
  /* returns the preferences for the widget based on its size */

  var widgetSize = config.widgetFamily;

  // determine image size based on widget size.
  if (widgetSize === "large") {
    var preferences = {
      "HeaderSize": new Size(320, 85),
      "BodySize": new Size(320, 235),
      "LeftSize": new Size(150, 235),
      "RightSize": new Size(160, 235),
      "FontSize": 20,
      "FirstSpacer": 30,
      "SecondSpacer": 45,
      "FiveOrTen": 10,
      "SevenOrFourteen": 14
    };

  } else if (widgetSize === "small") {
    var preferences = {
      "HeaderSize": new Size(150, 40),
      "BodySize": new Size(150, 110),
      "LeftSize": new Size(70, 110),
      "RightSize": new Size(75, 110),
      "FontSize": 10,
      "FirstSpacer": 10,
      "SecondSpacer": 15,
      "FiveOrTen": 5,
      "SevenOrFourteen": 7
    };

  } else {
    var preferences = {
      "HeaderSize": new Size(200, 50),
      "BodySize": new Size(320, 145),
      "LeftSize": new Size(100, 140),
      "RightSize": new Size(220, 140),
      "FontSize": 20,
      "FirstSpacer": 0,
      "SecondSpacer": 15,
      "FiveOrTen": 5,
      "SevenOrFourteen": 30
    };

  }

  return preferences;

}

async function buildWidget(finalTitle, finalRelease, finalCoverURL, varTopText, varTopText2, releaseText, preferences) {
  /* builds the widget on the home screen */

  // format the release date
  var modifiedStr = finalRelease.replace(/-/g, '/');
  var theReleaseDate = new Date(modifiedStr);
  var dateFormatter = new DateFormatter();
  dateFormatter.dateFormat = 'MMM d, yyyy';
  var formattedReleaseDate = dateFormatter.string(theReleaseDate);


  // start creating the widget
  var widget = new ListWidget();

  // create background gradient
  let startColor = new Color("#f53131");
  let endColor = new Color("#000000");
  let gradient = new LinearGradient();
  gradient.colors = [startColor, endColor];
  gradient.locations = [0, 1];
  widget.backgroundGradient = gradient;

  // set padding for the widget
  widget.setPadding(0, 0, 0, 0);

  var widgetSize = config.widgetFamily;
  // if the widget is not medium sized, add the header directly to the widget
  if (widgetSize != "medium") {
    var Header = widget.addStack();
    Header.size = preferences.HeaderSize;
    Header.centerAlignContent();
    Header.addSpacer();
    var titleText = Header.addText(finalTitle);
    titleText.centerAlignText();
    titleText.font = Font.blackSystemFont(100);
    titleText.textColor = Color.black();
    titleText.minimumScaleFactor = 0.1;
    Header.addSpacer();
  }

  // add a new body stack to the widget
  var Body = widget.addStack();
  Body.size = preferences.BodySize;

  // load the cover image for the widget
  var coverImage = await new Request(finalCoverURL).loadImage();

  // add a left stack to the body stack
  var Left = Body.addStack();
  var coverArt = Left.addImage(coverImage);
  coverArt.cornerRadius = 6;
  Left.size = preferences.LeftSize;
  Left.setPadding(preferences.FiveOrTen, preferences.FiveOrTen, 0, 0);

  // add a right stack to the body stack
  var Right = Body.addStack();
  Right.size = preferences.RightSize;
  Right.layoutVertically();
  Right.setPadding(0, preferences.SevenOrFourteen, 0, preferences.FiveOrTen);

  // if the widget size is medium, add the header to the top of the right stack
  if (widgetSize == "medium") {
    var Header = Right.addStack();
    Header.size = preferences.HeaderSize;
    Header.centerAlignContent();
    var titleText = Header.addText(finalTitle);
    titleText.centerAlignText();
    titleText.font = Font.blackSystemFont(100);
    titleText.textColor = Color.black();
    titleText.minimumScaleFactor = 0.1;
    Header.addSpacer();
    Header.setPadding(0, 0, 10, 0);
  }

  // add the season text
  var seasonText = Right.addText(varTopText);
  seasonText.font = Font.boldSystemFont(preferences.FontSize);
  seasonText.textColor = Color.white();
  seasonText.minimumScaleFactor = 0.01;

  // add the episode text
  var episodeText = Right.addText(varTopText2);
  episodeText.font = Font.regularSystemFont(preferences.FontSize);
  episodeText.textColor = Color.white();
  episodeText.minimumScaleFactor = 0.01;
  episodeText.lineLimit = 1;

  // add a spacer between the episode text and the release text
  Right.addSpacer(preferences.FirstSpacer);

  // add the release text
  var releaseDateText = Right.addText(releaseText);
  releaseDateText.font = Font.boldSystemFont(preferences.FontSize);
  releaseDateText.textColor = Color.white();
  releaseDateText.minimumScaleFactor = 0.01;

  // add the date for the release text
  var releaseDateValue = Right.addText(formattedReleaseDate);
  releaseDateValue.font = Font.regularSystemFont(preferences.FontSize);
  releaseDateValue.textColor = Color.white();
  releaseDateValue.minimumScaleFactor = 0.01;
  releaseDateValue.lineLimit = 1;

  // add a spacer between the release date and the Marvel Studios logo
  Right.addSpacer(preferences.SecondSpacer);

  // add a stack to the bottom right of the Right stack for the Marvel Studios logo
  var bottomRight = Right.addStack();
  if (widgetSize == "medium") {
    bottomRight.setPadding(0, 125, 0, 0);

  } else {
    bottomRight.setPadding(0, 5, 0, 0);

  }

  logoReq = new Request(marvelStudiosLogo);
  const LOGOimg = await logoReq.loadImage();
  var LOGO = bottomRight.addImage(LOGOimg);

  // create the url that will execute when tapping on the widget
  var scriptName = Script.name();
  widget.url = "scriptable:///run?scriptName=" + encodeURI(scriptName) + "&action=closeApp";

  // set the widget
  Script.setWidget(widget);
  Script.complete();

}

async function getUpcomingTvShows() {
  /* gets a list of the next upcoming tv shows */

  var url = "https://api.themoviedb.org/3/discover/tv?with_keywords=180547&sort_by=first_air_date.desc&with_status=0|2&api_key=" + apiKey;
  var tvApi = await new Request(url).loadJSON();
  var tvShows = tvApi.results;
  var nextEpisodes = [];

  // loop through the tv shows and get when the next air date is
  for (var i = 0; i < tvShows.length; i++) {
    var show = tvShows[i];
    var id = show.id;
    var showUrl = "https://api.themoviedb.org/3/tv/" + id + "?api_key=" + apiKey;
    var showApi = await new Request(showUrl).loadJSON();
    nextEpisodes[i] = showApi;
  }

  return nextEpisodes;

}

async function getUpcomingMovies() {
  /* gets the next upcoming movies */

  var url = "https://api.themoviedb.org/3/discover/movie?with_keywords=180547&sort_by=primary_release_date.asc&primary_release_date.gte=" + currentDateString + "&api_key=" + apiKey;
  var movieApi = await new Request(url).loadJSON();
  var movies = movieApi.results;
  return movies;

}

function mergeAndSortByDate(tvShows, movies) {
  /* merges the tvShows and movies list and sorts it by their next release dates */

  const tvShowItems = tvShows
    .filter((show) => show.next_episode_to_air) // ensure the show has a next episode
    .map((show) => ({
      type: "tv",
      title: show.name,
      releaseDate: show.next_episode_to_air.air_date,
      details: show,
    }));

  // map movies to include their release date
  const movieItems = movies.map((movie) => ({
    type: "movie",
    title: movie.title,
    releaseDate: movie.release_date,
    details: movie,
  }));

  // merge and sort the items by release date
  const combinedList = [...tvShowItems, ...movieItems].sort(
    (a, b) => new Date(a.releaseDate) - new Date(b.releaseDate)
  );

  return combinedList;
}

async function displayList() {
  /* displays a list of upcoming movies and tv shows */

  // get the tvShows and the movies lists
  var tvShows = await getUpcomingTvShows();
  var movies = await getUpcomingMovies();
  // merge the tvShows and the movies into one list
  var nextProjects = mergeAndSortByDate(tvShows, movies);

  // create the ui table to display when tapping on the widget
  let table = new UITable();

  // create the header for the table
  let row = new UITableRow();
  row.height = 50;
  row.cellSpacing = 20;
  row.isHeader = true;
  let cell = row.addText("Upcoming MCU Projects");
  cell.titleFont = Font.boldSystemFont(25);
  cell.centerAligned();
  table.addRow(row);

  // loop through each of the tvShows and movies
  for (let i = 0; i < nextProjects.length; i++) {

    let theProject = nextProjects[i];
    var title = theProject["title"];
    var coverPath = theProject.details.poster_path;
    // if the coverPath is not defined, set the coverURL to the default image
    if (coverPath) {
      var coverURL = "https://image.tmdb.org/t/p/w185" + theProject["details"]["poster_path"];

    } else {
      var coverURL = noCoverImageUrl;

    }

    // if the project is a tv show, display the seasons and episodes
    if (theProject.type == "tv") {
      var releaseDate = theProject.details.next_episode_to_air.air_date;
      var subTitle = "Ep. " + theProject.details.next_episode_to_air.episode_number + " Airing: ";
      var numSeasons = theProject.details.next_episode_to_air.season_number;

      // loop through the seasons to find the number of episodes and the cover path for the current season
      for (var j = 0; j < theProject.details.seasons.length; j++) {
        var season = theProject.details.seasons[j];
        if (season.season_number == numSeasons) {
          var numEpisodes = season.episode_count;
          var seasonCoverPath = season.poster_path;
          // the correct season was found, so stop looping
          break;
        }
      }
      // if the seasonCoverPath is defined, set it as the coverURL
      if (seasonCoverPath) {
        var coverURL = "https://image.tmdb.org/t/p/w185/" + seasonCoverPath;
      }

      // set the rest of the details for the table
      var cell3Text = "Season " + numSeasons;
      var cell3SubText = numEpisodes + " Episodes";
      var cell3Width = 20;
      var cell2Width = 50;
      var cell1Width = 14;

    } else {
      // if the project is a movie, set the details for the row as a movie
      var releaseDate = theProject.releaseDate;
      var subTitle = "Releasing: ";
      var cell3Text = null;
      var cell3SubText = null;
      var cell3Width = 0;
      var cell2Width = 50;
      var cell1Width = 10;

    }

    // format the release date
    var modifiedStr = releaseDate.replace(/-/g, '/');
    let theReleaseDate = new Date(modifiedStr);
    let RD = new DateFormatter();
    RD.dateFormat = 'MMM d, yyyy';
    var formattedReleaseDate = RD.string(theReleaseDate);

    // create the row for the tvShow or movie in the table
    let row = new UITableRow();
    row.height = 100;
    row.cellSpacing = 10;
    // open the tmdb website for the specified tvShow or movie
    row.onSelect = () => {
      Safari.openInApp("https://www.themoviedb.org/" + theProject.type + "/" + theProject.details.id, false);
    }
    row.dismissOnSelect = false; // must use this or the table will disappear when a row is selected

    // create the cell for the tvShow or movie cover artwork
    let cell1 = row.addImageAtURL(coverURL);
    cell1.widthWeight = cell1Width;
    cell1.centerAligned();

    // create the cell for the tvShow or movie title and the rlease date
    let cell2 = row.addText(title, subTitle + formattedReleaseDate);
    cell2.widthWeight = cell2Width;

    // create the cell for the tvShow season and episode numbers
    let cell3 = row.addText(cell3Text, cell3SubText);
    cell3.widthWeight = cell3Width;

    // add the row to the table
    table.addRow(row)

  }

  // make sure to show the seperators on the table
  table.showSeparators = true;

  // present the table and continue the script when it is closed
  await table.present()

  // if the script was run from the widget, close the app
  if (args.queryParameters.action == "closeApp") {
    App.close();
  }

}

async function main() {
  /* the main function that runs the script */

  // if the script run in a widget
  if (config.runsInWidget) {

    // get the widget preferences
    var preferences = getWidgetpreferences();

    // get the next tvShow episode and the next movie
    var tvDict = await getNextTvShow();
    var movieDict = await getNextMovie();

    // get the release dates for the tvShow and the movie
    var tvRelease = tvDict.showApi.next_episode_to_air.air_date;
    var movieRelease = movieDict.release_date;

    // if the tv episode releases first, display it on the widget
    if (tvRelease < movieRelease) {
      var finalTitle = tvDict.show.name;
      var finalRelease = tvRelease;
      var seasonNum = tvDict.showApi.next_episode_to_air.season_number;

      // loop through the seasons to get the coverURL for next or current season
      for (var i = 0; i < tvDict.showApi.seasons.length; i++) {
        var season = tvDict.showApi.seasons[i];
        if (season.season_number == seasonNum) {
          var seasonCoverPath = season.poster_path;
          break;

        }
      }
      // if the season cover path is not defined, get the regular show cover
      if (!seasonCoverPath) {
        var showCoverPath = tvDict.show.poster_path;

        // if the showCoverPath is not defined, get the default image for no cover artwork
        if (!showCoverPath) {
          var finalCoverURL = noCoverImageUrl;

        } else {
          var finalCoverURL = "https://image.tmdb.org/t/p/w185/" + showCoverPath;

        }

      } else {
        var finalCoverURL = "https://image.tmdb.org/t/p/w185/" + seasonCoverPath;

      }

      // declare what the text on the widget should be
      var varTopText = "Season " + seasonNum;
      var varTopText2 = "Episode " + tvDict.showApi.next_episode_to_air.episode_number;
      var releaseText = "";

    } else {
      // the movie will release first, so whow it on the widget
      var finalTitle = movieDict.title;
      var finalRelease = movieRelease;
      var finalCoverURL = "https://image.tmdb.org/t/p/w185/" + movieDict.poster_path;
      var varTopText = "";
      var varTopText2 = "";
      var releaseText = "Releasing:";

    }

    // build the widget
    buildWidget(finalTitle, finalRelease, finalCoverURL, varTopText, varTopText2, releaseText, preferences);

  } else {
    // the script is being run in the app
    displayList();

  }
}

// run the main function
main();