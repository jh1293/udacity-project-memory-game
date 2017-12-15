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
    $(this).removeClass('card--status-unfold card--status-match card--status-unmatch card--status-active');
    $(this).html(signArray[index]);
  });
}

/**
 * Unfold card and set current clicked card as active.
 */
function setActive(obj) {
  obj.addClass('card--status-active');
  obj.css('animation', 'unfold 0.4s');
  setTimeout(function(){
    obj.addClass('card--status-unfold');
  }, 200);
}

/**
 * Matching process.
 * Use '.card--status-active' as a temporary flag for identifying two recently clicked cards.
 * '.card--status-match' will be added to matched cards perminately, these cards will no longer participate matching.
 * '.card--status-unmatch' will be added to matched cards temporarily, these cards will participate matching again.
 */
function matching() {
  let currentActiveCards = $('.card--status-active');
  // Only process matching when there are two active cards, preventing double matching or parallel matching
  if (currentActiveCards.length == 2) {
    // Turn on match mode, preventing user from clicking other cards before unmatch animation ends
    matchMode = true;
    if (currentActiveCards.first().html() == currentActiveCards.last().html()) {
      // Match
      currentActiveCards.addClass('card--status-match');
      currentActiveCards.css('animation', 'match 0.6s');
      setTimeout(function() {
        currentActiveCards.attr('style', '');
        currentActiveCards.removeClass('card--status-active');
        matchMode = false;
      }, 600);
    } else {
      // Unmatch
      currentActiveCards.addClass('card--status-unmatch');
      currentActiveCards.css('animation', 'unmatch 0.4s');
      // Wait for 0.8s, allowing unmatch animation to process
      setTimeout(function() {
        currentActiveCards.css('animation', 'unfold 0.4s reverse');
        // When 'unfold 0.4s reverse' in half, Initialize card
        setTimeout(function(){
          // When 'unfold 0.4s reverse finished', empty animation, turn off match mode
          setTimeout(function(){
            currentActiveCards.attr('style', '');
            matchMode = false;
          }, 200);
          currentActiveCards.removeClass('card--status-unfold card--status-unmatch card--status-active');
        }, 200);
      }, 400);
    }
  }
}

/**
 * Document ready click event.
 */
$(document).ready(function() {
  init();
});

/**
 * Start Game <button> click event.
 */
$('#btn-start').click(function() {
  init();
});

/**
 * Card <li> click event.
 */
let cardPool = [];
$('.card').click(function() {
  //currentActiveCards.attr('style', '');
  // Check if the card is disabled
  let disabled = matchMode || $(this).hasClass('card--status-match') || $(this).hasClass('card--status-unmatch') || $(this).hasClass('card--status-unfold') || $(this).hasClass('card--status-active');
  // Processing if not disabled
  if (!disabled) {
  setActive($(this));
  matching();
  }
});

// TODO Refactor animation code
