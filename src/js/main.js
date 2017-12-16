/** Global variables. */
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
// let signList = [
//   '<i class="fa fa-firefox"></i>',
//   '<i class="fa fa-firefox"></i>',
//   '<i class="fa fa-firefox"></i>',
//   '<i class="fa fa-firefox"></i>',
//   '<i class="fa fa-firefox"></i>',
//   '<i class="fa fa-firefox"></i>',
//   '<i class="fa fa-firefox"></i>',
//   '<i class="fa fa-firefox"></i>'
// ];
let matchMode = false;

/**
 * Create an array which should be shuffled.
 * @param {array} array - List of signs.
 * @returns {array} An array which doubles the list of signs.
 */
function createSignArray (array) {
  return [...array, ...array];
}

/**
 * FIsher-Yates Shuffle.
 * @param {array} array - Array to be shuffled.
 * @return {array} Array that been shuffled.
 */
function shuffle (array) {
    let i = array.length, r, c;
    while (i) {
        r = Math.floor(Math.random() * i--);
        c = array[i];
        array[i] = array[r];
        array[r] = c;
    }
    return array;
}

/**
 * Initialize all cards.
 * 1. Create sign array and shuffle it.
 * 2. Iterate DOM by .card, remove all other classes.
 * 3. Iterate DOM by .card, replace its content with sign accordingly.
 */
function init() {
  let signArray = shuffle(createSignArray(signList));
  $('.card').each(function(index) {
    $(this).removeClass('card--animation-reveal card--animation-match card--animation-unmatch card--flag-active');
    $(this).html(signArray[index]);
  });
}

/**
 * Unfold card and set current clicked card as active.
 */
function activate(obj) {
  obj.addClass('card--animation-reveal card--flag-active');
  setTimeout(function() {
    obj.addClass('card--status-revealed');
  }, 400);
}

/**
 * Matching process.
 * Use '.card--flag-active' as a temporary flag for identifying two recently clicked cards.
 * '.card--animation-match' will be added to matched cards perminately, these cards will no longer participate matching.
 * '.card--animation-unmatch' will be added to matched cards temporarily, these cards will participate matching again.
 */
function matching(activeCards) {
  if (activeCards.length == 2) {

    // As matching process, turn on match mode in order to disable card clicking
    matchMode = true;

    if (activeCards.first().html() == activeCards.last().html()) {
      // Match
      activeCards.addClass('card--animation-match');
      setTimeout(function() {
        matchMode = false;
        activeCards.addClass('card--status-matched');
        activeCards.removeClass('card--status-revealed card--animation-reveal card--animation-match card--flag-active');
      }, 600);
    } else {
      // Unmatch
      activeCards.addClass('card--animation-unmatch');
      setTimeout(function() {
          matchMode = false;
          activeCards.removeClass('card--status-revealed card--animation-reveal card--animation-unmatch card--flag-active');
      }, 1000);
    }
  }
}

/** Document ready click event. */
$(document).ready(function() {
  init();
});

/** Start Game <button> click event. */
$('#btn-start').click(function() {
  init();
});

/** Card <li> click event. */
$('.card').click(function() {
  let disabled = matchMode || $(this).hasClass('card--status-revealed') || $(this).hasClass('card--status-matched')
  if (!disabled) {
    activate($(this));
    matching($('.card--flag-active'));
  }
});

// TODO Refactor animation code
