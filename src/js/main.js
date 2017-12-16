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

/**
 * Initialize all cards.
 * 1. Create sign array and shuffle it.
 * 2. Iterate DOM by .card, remove all other classes.
 * 3. Iterate DOM by .card, replace its content with sign accordingly.
 */
function init() {
  let signArray = shuffle(createSignArray(signList));
  $('.card').each(function(index) {
    $(this).removeClass('card--status-matched card--status-revealed card--animation-reveal card--animation-match card--animation-unmatch card--flag-active');
    $(this).html(signArray[index]);
  });
}

/**
 * Check if currently clicked card is suitable for activate.
 * @param {object} obj - jQuery object to be checked.
 * @return {boolean}
 */
function isEnabled(obj) {
  let disabled = matchMode || obj.hasClass('card--status-revealed') || obj.hasClass('card--status-matched');
  return !disabled;
}
/**
 * Activate current clicked card by adding animation class, active flag class and revealed status class.
 * @param {object} obj - jQuery object to be activated.
 */
function activate(obj) {
  obj.addClass('card--animation-reveal card--flag-active');
  setTimeout(function() {
    obj.addClass('card--status-revealed');
  }, 401);
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
      activeCards.addClass('card--animation-match');
      setTimeout(function() {
        activeCards.addClass('card--status-matched');
        activeCards.removeClass('card--status-revealed card--animation-reveal card--animation-match card--flag-active');
        matchMode = false;
      }, 601);
    } else {
      // Unmatch
      activeCards.addClass('card--animation-unmatch');
      setTimeout(function() {
          activeCards.removeClass('card--status-revealed card--animation-reveal card--animation-unmatch card--flag-active');
          matchMode = false;
      }, 1001);
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
  if (
    isEnabled($(this))
  ) {
  activate($(this));
  matching($('.card--flag-active'));
  }
});
