'use strict';function _toConsumableArray(a){if(Array.isArray(a)){for(var b=0,c=Array(a.length);b<a.length;b++)c[b]=a[b];return c}return Array.from(a)}var signList=['<i class="fa fa-internet-explorer"></i>','<i class="fa fa-firefox"></i>','<i class="fa fa-chrome"></i>','<i class="fa fa-opera"></i>','<i class="fa fa-safari"></i>','<i class="fa fa-edge"></i>','<i class="fa fa-stack-overflow"></i>','<i class="fa fa-github"></i>'],matchMode=!1;function createSignArray(a){return[].concat(_toConsumableArray(a),_toConsumableArray(a))}function shuffle(a){for(var b,d,c=a.length;c;)b=Math.floor(Math.random()*c--),d=a[c],a[c]=a[b],a[b]=d;return a}function init(){var a=shuffle(createSignArray(signList));$('.card').each(function(b){$(this).removeClass('card--status-unfold card--status-match card--status-unmatch card--status-active'),$(this).html(a[b])})}function setActive(a){a.addClass('card--status-active'),a.css('animation','unfold 0.4s'),setTimeout(function(){a.addClass('card--status-unfold')},200)}function matching(){var a=$('.card--status-active');2==a.length&&(matchMode=!0,a.first().html()==a.last().html()?(a.addClass('card--status-match'),a.css('animation','match 0.6s'),setTimeout(function(){a.attr('style',''),a.removeClass('card--status-active'),matchMode=!1},600)):(a.addClass('card--status-unmatch'),a.css('animation','unmatch 0.4s'),setTimeout(function(){a.css('animation','unfold 0.4s reverse'),setTimeout(function(){setTimeout(function(){a.attr('style',''),matchMode=!1},200),a.removeClass('card--status-unfold card--status-unmatch card--status-active')},200)},400)))}$(document).ready(function(){init()}),$('#btn-start').click(function(){init()});var cardPool=[];$('.card').click(function(){var a=matchMode||$(this).hasClass('card--status-match')||$(this).hasClass('card--status-unmatch')||$(this).hasClass('card--status-unfold')||$(this).hasClass('card--status-active');a||(setActive($(this)),matching())});