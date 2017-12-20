/** All possible signs. */
let signList = [
  '<i class="fa fa-internet-explorer"></i>',
  '<i class="fa fa-firefox"></i>',
  '<i class="fa fa-chrome"></i>',
  '<i class="fa fa-opera"></i>',
  '<i class="fa fa-safari"></i>',
  '<i class="fa fa-edge"></i>',
  '<i class="fa fa-stack-overflow"></i>',
  '<i class="fa fa-github"></i>'
];

/** Global variables. */
let playDuration;
let clock;
let clockState;
let tier;
let moves = 0;
let scores = 0;
let name = '';
let rank = [];
let matchMode = false;
let gameLocked = true;

/** Pre-stored DOM nodes. */
let elemPlayDuration = $('#play-duration');
let elemMoves = $('#moves');
let elemAside = $('aside');
let elemBoard = $('.board');
let elemBoardSlide = $('.board__slide');
let elemBoardScores = $('#scores');
let elemBoardSumMoves = $('#summarize-moves');



/**
 * Create an array that maps all cards in the table.
 * @param {array} array - List of signs.
 * @returns {array} An array which doubles the list of signs.
 */
function createSignArray(array) {
  return [...array, ...array];
}



/**
 * FIsher-Yates Shuffle.
 * @param {array} array - Array to be shuffled.
 * @return {array} Array that been shuffled.
 */
function shuffle(array) {
    let i = array.length, r, c;
    while (i) {
        r = Math.floor(Math.random() * i--);
        c = array[i];
        array[i] = array[r];
        array[r] = c;
    }
    return array;
}



/** The followings are cookie related functions. */

/**
 * Set a certain cookie.
 * @param {string} cname - Key.
 * @param {string} cvalue - Value.
 * @param {number} exdays - Days expected for the cookie to expire.
 */
function setCookie(cname, cvalue, exdays) {

  // Generate expire date string
  let expires = new Date();
  expires.setTime(expires.getTime() + (exdays * 24 * 60 * 60 * 1000));

  // Set cookie
  // document.cookie = cname + '=' + cvalue + ';' + 'expires=' + expires.toUTCString() + ';path=/';
  document.cookie = `${cname}=${cvalue};expires=${expires.toUTCString()};path=/`;
}



/**
 * Get a certain cookie.
 * @param {string} cname - Indicate which key to be fetched.
 * @return {string} Either return a string containing fetched value of key, if there is one; or return an empty string, if there isn't one.
 */
function getCookie(cname) {
  let keyString = cname + "=";
  let pairs = document.cookie.split(';');

  // Iterate array of key-value pairs
  for(let i = 0; i < pairs.length; i++) {
    let pair = pairs[i];
    // If the pair begins with an empty space character, remove it
    while (pair.charAt(0) == ' ') {
      pair = pair.substring(1);
    }
    // If current subarray is the one we need, trim the value, return it, and abort function
    if (pair.indexOf(keyString) == 0) {
      return pair.substring(keyString.length, pair.length);
    }
  }

  // Return falsy as default
  return "";
}



/**
 * Delete a certain cookie.
 * @param {string} cname - Indicate which key to be deleted.
 */
function deleteCookie(cname) {
  document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}



/** The followings are ranking related functions. */

/**
 * Add name and scores within current session to the rank array.
 */
function addToRank() {
  rank.push([name, scores]);
}



/**
 * Sort rank array in descending order and keep rank array at length of 10.
 */
function ranking() {
  rank.sort(function(a, b) {
    return b[1] - a[1];
  });
  rank.splice(10, rank.length - 10);
}



/**
 * Compress rank list and save it to cookie.
 */
function saveRank() {
  let rowRankString = [];
  for (let pairs of rank) {
    rowRankString.push(pairs.join('@'));
  }
  rowRankString = rowRankString.join('&');
  setCookie('rank', rowRankString, 7)
}



/**
 * Load rank info from cookie, parse it and assign it to rank array.
 */
function loadRank() {
  let resolvedRankString = [];
  let rowRankString = getCookie('rank');
  if (rowRankString) {
    rowRankString = rowRankString.split('&')
    for (let pairs of rowRankString) {
      pairs = pairs.split('@');
      resolvedRankString.push(pairs);
    }
    rank = resolvedRankString;
  }
}



/**
 * Clear rank list in cookie and empty rank board.
 */
function resetRank() {
  if (getCookie('rank')) {
    rank = [];
    $('#rankboard').empty();
    deleteCookie('rank');
    refreshRankBoard();
  }
}



/**
 * Read rank array and generate html string containing rank info.
 */
function refreshRankBoard() {
  if (getCookie('rank')) {
    $('#rankboard').empty();
    let i = 1;
    for (let entry of rank) {
      $('#rankboard').append(`<li class="rankboard__entry"><span class="rankboard__rank">${i++}</span><span class="rankboard__name">${entry[0]}</span><span class="rankboard__scores">${entry[1]}</span></li>`);
    }
  } else {
    $('#rankboard').empty();
    $('#rankboard').append(`<li class="rankboard__empty-info">Haven't Got Any Rank Yet</li><li class="rankboard__empty-info">Go Play Around</li><li class="rankboard__empty-info">And Enjoy Yourself</li>`);
  }
}



/**
 * Show rank board.
 */
function showRank() {
  elemAside.css('display', 'flex');
}



/**
 * hide rank board.
 */
function hideRank() {
  elemAside.css('display', 'none');
}



/** The followings are game logic related functions. */

/**
 * Initializing game.
 */
function initGame() {

  // Initialize game logic related variables
  playDuration = 0;
  moves = 0;
  scores = 0;
  elemPlayDuration.text('--');
  elemMoves.text('--');

  // Assgin signs to cards
  let signArray = shuffle(createSignArray(signList)); // Create sign array and shuffle it
  $('.card').each(function(index) {
    $(this).removeClass('card--flag-matched card--animation-reveal card--animation-match card--animation-unmatch card--flag-active'); // Iterate DOM by .card, remove all other classes
    $(this).html(signArray[index]); // Iterate DOM by .card, replace its content with sign accordingly
  });
}



/**
 * Refresh Time and Moves displayed on the page.
 */
function refreshStatus() {
  elemPlayDuration.text(playDuration++);
  elemMoves.text(moves);
}



/**
 * Start the game.
 */
function startGame() {
  clockState = 20;
  gameLocked = false;
}
// TODO Nifty effects when starting the game.



/**
 * Pause the game.
 */
function pauseGame() {
  clockState = 0;
  gameLocked = true;
}
// TODO Button to pause the game.



/**
 * Resume the game.
 */
function resumeGame() {
  clockState = 20;
  gameLocked = false;
}
// TODO Button to resume the game.



/**
 * Compress game data and store them to local storage.
 */
function saveGame() {
  pauseGame();
  let cardsData = '';
  $('.card').each(function() {
    cardsData += $(this).attr('class') + '@' + $(this).html() + '@@';
  });
  localStorage.setItem('cardsData', cardsData);
  localStorage.setItem('clockState', clockState);
  localStorage.setItem('playDuration', playDuration);
  localStorage.setItem('moves', moves);
  resumeGame();
}
// TODO Override existing save warning.



/**
 * Parse game data from local storage and assign them on the fly.
 */
function loadGame() {
  pauseGame();
  let cardsData = localStorage.getItem('cardsData');
  cardsData = cardsData.split('@@');
  cardsData.forEach(function(value, index) {
    cardsData[index] = value.split('@')
  });
  $('.card').each(function(index) {
    $(this).removeClass('card card--flag-matched card--animation-reveal card--animation-match card--animation-unmatch card--flag-active');
    $(this).addClass(cardsData[index][0]);
    $(this).html(cardsData[index][1]);
  });
  clockState = Number(localStorage.getItem('clockState'));
  playDuration = Number(localStorage.getItem('playDuration'));
  moves = Number(localStorage.getItem('moves'));
  resumeGame();
}
// TODO Override current game warning.



/** The followings are card related functions */

/**
 * Check if currently clicked card is suitable for activate.
 * @param {object} obj - jQuery object to be checked.
 * @return {boolean}
 */
function isEnabled(obj) {
  let disabled = gameLocked || matchMode || obj.hasClass('card--flag-matched');
  return !disabled;
}
// TODO Add feedback when a card is disabled



/**
 * Activate current clicked card by adding animation class, active flag class and revealed status class.
 * @param {object} obj - jQuery object to be activated.
 */
function activate(obj) {
  obj.addClass('card--animation-reveal card--flag-active');
}



/**
 * Matching process.
 * @param {object} activeCards - Collection of card that been flaged with active.
 */
function matching(activeCards) {
  if (activeCards.length == 2) {
    // As matching processes, disable other cards
    matchMode = true;

    if (activeCards.first().html() == activeCards.last().html()) {
      // Match
      moves++;
      activeCards.addClass('card--animation-match');
      window.setTimeout(function() {
        activeCards.addClass('card--flag-matched');
        activeCards.removeClass('card--animation-reveal card--flag-active');
        matchMode = false;
      }, 600);
    } else {
      // Unmatch
      moves++;
      activeCards.addClass('card--animation-unmatch');
      window.setTimeout(function() {
          activeCards.removeClass('card--animation-reveal card--animation-unmatch card--flag-active');
          matchMode = false;
      }, 1000);
    }
  }
}



/**
 * Check if all cards were being matched.
 * @return {boolean} If the number of matched cards equals to total number of cards, return true.
 */
function isGameCompleted() {
  return $('.card--flag-matched').length == 16;
}



/**
 * Finishing current session of game.
 * This function was being called every time when player matches all cards in the table.
 */
function finishGame() {

  // Assessing tiers
  tier = Math.floor(--playDuration / 30);
  let elemSummarizeStars = $('#board-stars');
  if (tier == 0) {
    elemSummarizeStars.html('<i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i>');
  } else if (tier == 1) {
    elemSummarizeStars.html('<i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i>');
  } else {
    elemSummarizeStars.html('<i class="fa fa-star" aria-hidden="true"></i>');
  }

  // Assessing scores
  scores = Math.floor(moves * 180 / playDuration);

  // Handling result and log board
  elemBoardSumMoves.text(moves);
  elemBoardScores.text(scores);
  showBoard();
}



/**
 * Show result and log board.
 */
function showBoard() {
  elemBoardSlide.removeClass('board__slide--animation-slidetoleft board__slide--animation-slidetoorigin');
  elemBoard.removeClass('board--hide');
}



/**
 * Hide result and log board.
 */
function hideBoard() {
  elemBoardSlide.removeClass('board__slide--animation-slidetoleft board__slide--animation-slidetoorigin');
  elemBoard.addClass('board--hide');
}



/**
 * Slide board to show log area.
 */
function boardShowLog() {
  elemBoardSlide.removeClass('board__slide--animation-slidetoleft board__slide--animation-slidetoorigin');
  elemBoardSlide.addClass('board__slide--animation-slidetoleft');
}



/**
 * Slide board to return to result area.
 */
function boardReturn() {
  elemBoardSlide.removeClass('board__slide--animation-slidetoleft board__slide--animation-slidetoorigin');
  elemBoardSlide.addClass('board__slide--animation-slidetoorigin');
}



/**
 * Events handling area.
 * Events fired -> Call function.
 */
$(document).ready(function() {

  // Set clock
  clock = window.setInterval(function() {
   switch (clockState) {
     case 0: break;
     case 20:
      refreshStatus();
      break;
    }
  }, 1000);

  // Initialize cards
  initGame();

  // Load and refresh rank board
  loadRank();
  refreshRankBoard();
});



$('#btn-start').click(function() {
  initGame();
  startGame();
});



$('#btn-save').click(function() {
  saveGame();
});



$('#btn-load').click(function() {
  loadGame();
});



$('.card').click(function() {
  if (
    isEnabled($(this))
  ) {
    activate($(this));
    matching($('.card--flag-active'));
    setTimeout(function() {
      if (isGameCompleted()) {
        pauseGame();
        finishGame();
      }
    }, 600);
  }
});



$('#btn-replay').click(function() {
  initGame();
  hideBoard();
});



$('#btn-log').click(function() {
  boardShowLog();
});



$('#btn-return').click(function() {
  boardReturn();
});



$('#btn-confirm').click(function() {
  name = $('#ipt-name').val();
  if (name) {
    addToRank();
    ranking();
    saveRank();
    refreshRankBoard();
    initGame();
    hideBoard();
  } else {
    // TODO Show feedbacks when illegal or empty input received
  }
});



$('#btn-resetrank').click(function() {
  resetRank();
});



$('#btn-rank').click(function() {
  showRank();
});



$('#btn-close').click(function() {
  hideRank();
});



/** Hotfix for rank board */
$(window).resize(function() {
  if ($(document).width() > 769) {
    if (elemAside.css('display') == 'none') {
      showRank();
    }
  } else {
    hideRank();
  }
});
