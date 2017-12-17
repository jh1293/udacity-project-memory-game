/** Global variables. */
// let signList = [
//   '<i class="fa fa-internet-explorer"></i>',
//   '<i class="fa fa-firefox"></i>',
//   '<i class="fa fa-chrome"></i>',
//   '<i class="fa fa-opera"></i>',
//   '<i class="fa fa-safari"></i>',
//   '<i class="fa fa-edge"></i>',
//   '<i class="fa fa-stack-overflow"></i>',
//   '<i class="fa fa-github"></i>'
// ];
// let signList = [
//   '<i class="fa fa-firefox"></i>',
//   '<i class="fa fa-firefox"></i>',
//   '<i class="fa fa-firefox"></i>',
//   '<i class="fa fa-firefox"></i>',
//   '<i class="fa fa-chrome"></i>',
//   '<i class="fa fa-chrome"></i>',
//   '<i class="fa fa-chrome"></i>',
//   '<i class="fa fa-chrome"></i>'
// ];
let signList = [
  '<i class="fa fa-firefox"></i>',
  '<i class="fa fa-firefox"></i>',
  '<i class="fa fa-firefox"></i>',
  '<i class="fa fa-firefox"></i>',
  '<i class="fa fa-firefox"></i>',
  '<i class="fa fa-firefox"></i>',
  '<i class="fa fa-firefox"></i>',
  '<i class="fa fa-firefox"></i>'
];
let matchMode = false;

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



function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function deleteCookie(cname) {
  document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}



// Game State: 10 - Standby; 20 - running; 30 - Game Over
let playDuration = 29;
let gameState;
let matchedNumber = 0;
let unmatchedNumber = 0;
let moves = 0;
let scores = 0;
let gameClock;
let tier;

function finishing() {
  // Assessing stars
  tier = Math.floor(--playDuration / 30);
  if (tier == 0) {
    console.log('Best');
    $('#summarize-stars').html('<i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i>');
  } else if (tier == 1) {
    console.log('Good');
    $('#summarize-stars').html('<i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i>');
  } else {
    console.log('Keep Practice');
    $('#summarize-stars').html('<i class="fa fa-star" aria-hidden="true"></i>');
  }
  // Assessing moves
  $('#summarize-moves').text(moves);
  // Assessing scores
  scores = Math.floor(moves * 180 / playDuration);
  $('#scores').text(scores);
  $('.board').removeClass('board--hide');
  $('.board__slide').removeClass('board__slide--animation-slidetoleft board__slide--animation-slidetoorigin');
}

let rank = [];

// let rank = [['Jeff', 855], ['Jeff', 1552], ['Jeff', 496]];

function addToRank() {
  rank.push([name, scores]);
}

function ranking() {
  rank.sort(function(a, b) {
    return b[1] - a[1];
  });
  rank.splice(10, rank.length - 10);
}

function saveRank() {
  let rowRankString = [];
  for (let pairs of rank) {
    rowRankString.push(pairs.join('@'));
  }
  rowRankString = rowRankString.join('&');
  setCookie('rank', rowRankString, 7)
}

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

function resetRank() {
  rank = [];
  $('#rankboard').empty();
  deleteCookie('rank');
}

function refreshRankBoard() {
  let hasCookie = getCookie('rank');
  if (hasCookie) {
    $('#rankboard').empty();
    let i = 1;
    for (let entry of rank) {
      $('#rankboard').append(`<li class="rankboard__entry"><span class="rankboard__rank">${i++}</span><span class="rankboard__name">${entry[0]}</span><span class="rankboard__scores">${entry[1]}</span>Points</li>`);
    }
  }
}




let elemPlayDuration = $('#play-duration');
let elemMoves = $('#moves');

/** Initializing game. */
function init() {
  // Initialize game logic related variables
  gameState = 20; // State: Keep Running
  playDuration = 0;
  matchedNumber = 0;
  unmatchedNumber = 0;
  moves = 0;
  scores = 0;
  if (gameClock) {
    window.clearInterval(gameClock);
  }
  elemPlayDuration.text('');
  elemMoves.text('');

  // Assgin signs to cards
  let signArray = shuffle(createSignArray(signList)); // Create sign array and shuffle it
  $('.card').each(function(index) {
    $(this).removeClass('card--flag-matched card--animation-reveal card--animation-match card--animation-unmatch card--flag-active'); // Iterate DOM by .card, remove all other classes
    $(this).html(signArray[index]); // Iterate DOM by .card, replace its content with sign accordingly
  });

  // Start main loop
  gameClock = window.setInterval(function() {
   switch (gameState) {
     case 20:
       if (matchedNumber == 8) {
         gameState = 30;
       } else {
         elemPlayDuration.text(playDuration++);
         elemMoves.text(moves);
       }
       break;
     case 30:
       window.clearInterval(gameClock);
       finishing();
       break;
    }
  }, 1000);
}

/**
 * Check if currently clicked card is suitable for activate.
 * @param {object} obj - jQuery object to be checked.
 * @return {boolean}
 */
function isEnabled(obj) {
  let disabled = matchMode || obj.hasClass('card--flag-matched');
  return !disabled;
}
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
      matchedNumber++;
      console.log(matchedNumber);
      moves++;
      console.log('moves: ' + moves);
      activeCards.addClass('card--animation-match');
      window.setTimeout(function() {
        activeCards.addClass('card--flag-matched');
        activeCards.removeClass('card--animation-reveal card--flag-active');
        matchMode = false;
      }, 600);
    } else {
      // Unmatch
      unmatchedNumber++;
      console.log(unmatchedNumber);
      moves++;
      console.log('moves: ' + moves);
      activeCards.addClass('card--animation-unmatch');
      window.setTimeout(function() {
          activeCards.removeClass('card--animation-reveal card--animation-unmatch card--flag-active');
          matchMode = false;
      }, 1000);
    }
  }
}

/** Document ready click event. */
$(document).ready(function() {
  // init();
  loadRank();
  refreshRankBoard();
});

/** Start Game <button> click event. */
$('#btn-start').click(function() {
  init();
});

/** Card <li> click event. */
$('.card').click(function() {
  if (
    isEnabled($(this))
  ) {
  activate($(this));
  matching($('.card--flag-active'));
  }
});

/** Replay <button> click event. */
$('#btn-replay').click(function() {
  init();
  $('.board__slide').removeClass('board__slide--animation-slidetoleft board__slide--animation-slidetoorigin');
  $('.board').addClass('board--hide');
});

/** Log <button> click event. */
$('#btn-log').click(function() {
  $('.board__slide').removeClass('board__slide--animation-slidetoleft board__slide--animation-slidetoorigin');
  $('.board__slide').addClass('board__slide--animation-slidetoleft');
});

$('#btn-return').click(function() {
  $('.board__slide').removeClass('board__slide--animation-slidetoleft board__slide--animation-slidetoorigin');
  $('.board__slide').addClass('board__slide--animation-slidetoorigin');
});

let name = '';

$('#btn-confirm').click(function() {
  name = $('#ipt-name').val();
  if (name) {
    console.log(name);
    addToRank();
    ranking();
    saveRank();
    refreshRankBoard();
    $('.board').addClass('board--hide');
  } else {
    console.log('empty!');
  }
});

$('#btn-resetrank').click(function() {
  resetRank();
});
