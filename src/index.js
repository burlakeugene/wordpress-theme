import jQuery from './js/jquery/jquery';
import fancybox from './js/fancybox/jquery.fancybox.min.js';
import Swiper from './js/swiper/swiper.min.js';
import BurlakNavigation from './js/burlak-navigation.js';
import * as Burlak from 'burlak';
import mapInit from './js/map-yandex.js';
(function($) {
  if ($.fancybox) {
    $.fancybox.defaults.hash = false;
  }
  function runCount(item) {
    var bool = item.getAttribute('bool'),
      from = item.getAttribute('data-from'),
      to = item.getAttribute('data-to'),
      seconds = item.getAttribute('data-seconds'),
      milliseconds = parseInt(seconds) ? parseInt(seconds) * 1000 : 500;
    from = parseInt(from);
    to = parseInt(to);
    if (!bool) {
      item.setAttribute('bool', 1);
      $(item)
        .prop('Counter', from)
        .animate(
          {
            Counter: to
          },
          {
            duration: milliseconds,
            easing: 'swing',
            step: function(now) {
              $(this).text(Math.ceil(now));
            }
          }
        );
    }
  }

  function clearCount(item) {
    var from = item.getAttribute('data-from');
    item.removeAttribute('bool');
    from = parseInt(from);
    $(item).text(from);
  }

  var view = Burlak.InView;
  var isMobile = new Burlak.Detection().isMobile;
  $(document).ready(function() {
    document.addEventListener('wpcf7mailsent', function(event) {
      setTimeout(function() {
        $.fancybox.close();
      }, 3000);
    });

    window.callModal = function(name) {
      $.fancybox.open({
        src: '#request',
        type: 'inline',
        opts: {
          baseClass: 'modal-wrapper',
          afterShow: function() {
            $('input.place').val(name ? name : '');
          },
          afterClose: function() {
            $('input.place').val('');
          }
        }
      });
    };

    var modalBool = localStorage.getItem('modalBool') || false;
    document.addEventListener('mouseout', function() {
      let e = event,
        t = e.relatedTarget || e.toElement;
      if ((!t || t.nodeName == 'HTML') && !modalBool) {
        modalBool = true;
        localStorage.setItem('modalBool', true);
        window.callModal('Убрали мышь');
      }
    });

    function commonFunc() {
      if (!isMobile()) {
        $('[data-fancybox="gallery"]').fancybox({
          thumbs: {
            autoStart: true
          }
        });
      }
      let tabs = document.querySelectorAll('.tabs');
      tabs.length &&
        tabs.forEach((item, index) => {
          let buttons = item.querySelectorAll('.tabs-buttons-item');
          buttons.forEach((button, index) => {
            button.addEventListener('click', e => {
              let name = e.target.getAttribute('data-tab-id'),
                buttons = e.target
                  .closest('.tabs')
                  .querySelectorAll('.tabs-buttons-item'),
                targets = e.target
                  .closest('.tabs')
                  .querySelectorAll('.tabs-contents-item');
              if (!name) return;
              buttons.forEach((button, index) => {
                button.classList.remove('active');
              });
              e.target.classList.add('active');
              targets.forEach((target, index) => {
                if (target.getAttribute('data-tab-id') === name) {
                  target.classList.add('active');
                } else {
                  target.classList.remove('active');
                }
              });
            });
          });
        });

      document.body.addEventListener('click', () => {
        document
          .querySelector('.header')
          .classList.remove('navigation-visible');
      });

      var slideBar = document.querySelector('.header-slidebar');
      slideBar &&
        slideBar.addEventListener('click', e => {
          e.stopPropagation();
        });

      var toggleButton = document.querySelector('.nav-toggle');
      if (toggleButton) {
        toggleButton.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          let header = document.querySelector('.header');
          header && header.classList.remove('search-visible');
          header && header.classList.toggle('navigation-visible');
        });
      }

      new view('.lazy', {
        in: item => {
          setTimeout(() => {
            let img = item.querySelector('img') || false,
              url = img ? img.getAttribute('data-lazy') : false,
              allImages = document.querySelectorAll(
                '[data-lazy="' + url + '"]'
              );
            if (!img || !url) return;
            var newImage = new Image();
            newImage.addEventListener('load', () => {
              allImages.forEach((img, index) => {
                img.src = url;
                img.removeAttribute('data-lazy');
                img.closest('.lazy') &&
                  img.closest('.lazy').classList.add('lazy-loaded');
              });
            });
            newImage.src = url;
          }, 0);
        }
      });

      new Swiper(name, {
        speed: 600,
        slidesPerView: 7,
        spaceBetween: 10,
        loop: true,
        navigation: {
          prevEl: name + ' .swiper-button-prev',
          nextEl: name + ' .swiper-button-next'
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          renderBullet: function(index, className) {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
          }
        },
        autoplay: {
          delay: 5000
        },
        breakpoints: {
          900: {
            slidesPerView: 6
          },
          740: {
            slidesPerView: 5
          },
          600: {
            slidesPerView: 4
          },
          400: {
            slidesPerView: 3
          },
          340: {
            slidesPerView: 2
          }
        }
      });

      mapInit();

      jQuery('.gallery').each(function() {
        jQuery(this)
          .find('.gallery-icon a')
          .attr('data-fancybox', 'group-' + jQuery(this).attr('id'));
      });

      let forms = document.querySelectorAll('.wpcf7-form');
      window.wpcf7 &&
        forms.length &&
        forms.forEach((form, index) => {
          window.wpcf7.initForm(form);
        });

      let accordions = document.querySelectorAll('.accordion');
      for (let i = 0; i < accordions.length; i++) {
        var accordionToggle = accordions[i].querySelector('.accordion-toggle'),
          parent = accordionToggle.parentNode,
          target = parent.querySelector('.accordion-target');
        if (parent.classList.contains('opened')) {
          target.style.height = target.scrollHeight + 'px';
        }
        accordionToggle.addEventListener('click', function() {
          var parent = this.parentNode,
            target = parent.querySelector('.accordion-target');

          if (parent.classList.contains('opened')) {
            target.style.height = 0 + 'px';
          } else {
            target.style.height = target.scrollHeight + 'px';
          }

          accordions.forEach((item, index) => {
            if (item === parent) return;
            let target = item.querySelector('.accordion-target');
            item.classList.remove('opened');
            target.style.height = 0 + 'px';
          });

          parent.classList.toggle('opened');
        });
      }
    }

    var router = new BurlakNavigation({
      container: '#app',
      navItems: '.ajax, .ajax a, .pagination a',
      preloader: true,
      beforeInit: function() {},
      beforeRendered: function() {
        $.fancybox.close();
      },
      afterRendered: function(appContainer) {
        window.scrollTo(0, 0);
        commonFunc();
        var hash = window.location.hash,
          item = null;
        if (hash) item = appContainer.querySelector(hash);
        if (item) {
          window.scroll({
            top:
              item.offsetTop - document.querySelector('.header').clientHeight,
            behavior: 'smooth'
          });
        }
        //safari height hack
        let images = document.querySelectorAll('img[srcset]');
        images.forEach((img, index) => {
          img.outerHTML = img.outerHTML;
        });
      },
      afterInit: function() {}
    });
    router.init();
  });

  window.addEventListener('load', function() {
    var preloader = document.querySelector('.preloader');
    if (preloader) {
      preloader.classList.remove('preloader__visible');
      setTimeout(function() {
        preloader.parentNode.removeChild(preloader);
      }, 400);
    }
  });

  window.addEventListener('scroll', function(e) {
    let top = document.documentElement.scrollTop || document.body.scrollTop,
      header = document.querySelector('.header');
    if (!header) return;
    if (top > 5) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
})(jQuery);
