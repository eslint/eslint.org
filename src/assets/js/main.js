(function() {
  var nav_trigger = document.getElementById("nav-toggle"),
    nav = document.getElementById("nav-list"),
    body = document.getElementsByTagName("body")[0],
    open = false;

    nav_trigger.removeAttribute("hidden");
    nav_trigger.setAttribute("aria-expanded", "false");
    nav.setAttribute("data-open", "false");

    nav.setAttribute("data-open", "false");
    nav_trigger.addEventListener("click", togglenav, false);

  function togglenav(e) {
    if (!open) {
      this.setAttribute("aria-expanded", "true");
      nav.setAttribute("data-open", "true");
      open = true;
    } else {
      this.setAttribute("aria-expanded", "false");
      nav.setAttribute("data-open", "false");
      open = false;
    }
  }
})();


/* ALERTS */

/* element.closest() polyfill */

// if (!Element.prototype.matches) {
//   Element.prototype.matches =
//     Element.prototype.msMatchesSelector ||
//     Element.prototype.webkitMatchesSelector;
// }

// if (!Element.prototype.closest) {
//   Element.prototype.closest = function(s) {
//     var el = this;

//     do {
//       if (Element.prototype.matches.call(el, s)) return el;
//       el = el.parentElement || el.parentNode;
//     } while (el !== null && el.nodeType === 1);
//     return null;
//   };
// }


// function removeParent(e) {
//     parent = e.target.closest('.alert');
//     parent.remove();
// }

// (function() {
//   var alert_btn = document.querySelectorAll('.alert__remove-btn');

//     alert_btn.forEach((button) => {
//         button.removeAttribute('hidden');
//         button.addEventListener('click', removeParent, false);
//     })

// })();
(function(){
    var logo_theme_btn = document.querySelectorAll('.brand__logo__colors__btn'),
        logo_container = document.querySelector('.brand__logo__img');

    logo_theme_btn.forEach((button) => {

        button.addEventListener('click', function() {
            btn_theme = button.getAttribute('data-theme');
            unsetOtherButtons();
            button.setAttribute('aria-pressed', 'true');
            logo_container.setAttribute('data-theme', btn_theme);
        })
    })

    function unsetOtherButtons() {
        currentButton = document.querySelector('.brand__logo__colors__btn[aria-pressed="true"]');
        currentButton.setAttribute('aria-pressed', "false");
    }
})();
