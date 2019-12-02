/**
 * Burlak Navigation 1.0
 * Ajax navigation, without dependencies
 * http://burlak.me
 * eugeneburlak@yandex.ru
 *
 * Copyright 2018 Eugene Burlak
 *
 * Released under the MIT License
 *
 * Released on: January 23, 2018
 */

// 	options = {
// 	container: string, selector of rendering wrapper,
// 	navItems: string, selectors of links,
// 	preloader: boolean, it render preloader,
//  exact: boolean, return false if link equal current link
//	beforeInit: function, run before init
// 	beforeRendered: function, run before ajax request send,
// 	afterRendered: function, run after render,
//	afterInit: function, run after init
// }

(function(w) {
  w.BurlakNavigation = function(options) {
    this.options = options;
    this.options.container = this.options.container
      ? this.options.container
      : '#app';
    this.options.navItems = this.options.navItems
      ? this.options.navItems
      : '.ajax';
    this.options.preloader = this.options.preloader ? true : false;
    this.beforeInit = this.options.beforeInit ? this.options.beforeInit : false;
    this.afterInit = this.options.afterInit ? this.options.afterInit : false;
    this.beforeRendered = this.options.beforeRendered
      ? this.options.beforeRendered
      : false;
    this.afterRendered = this.options.afterRendered
      ? this.options.afterRendered
      : false;
    this.app = document.querySelector(this.options.container);
    this.isLoadProcess = false;
    this.exact = this.options.exact ? true : false;

    this.get = function(url, method, data, callbackSuccess, callbackError) {
      var res,
        xhr = new XMLHttpRequest(),
        param,
        body = '',
        self = this;
      for (param in data) {
        body +=
          encodeURIComponent(param) +
          '=' +
          encodeURIComponent(data[param]) +
          '&';
      }
      if (method === 'GET' && body) {
        url = url + '?' + body;
      }
      xhr.open(method, url, true);
      xhr.setRequestHeader(
        'Content-Type',
        'application/x-www-form-urlencoded; charset=UTF-8'
      );
      method === 'GET'
        ? xhr.setRequestHeader('X-REQUESTED-WITH', 'XMLHttpRequest')
        : '';
      xhr.send(body);
      xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;
        if (xhr.status != 200) {
          callbackError(xhr);
        } else {
          res = xhr.responseText;
          callbackSuccess(res);
        }
      };
    };

    this.createPreloader = function() {
      var preloader = document.createElement('div'),
        preloaderSpinner = document.createElement('div');
      preloader.classList.add('preloader');
      preloaderSpinner.classList.add('preloader-spinner');
      preloaderSpinner.innerHTML =
        '<svg class="preloader-spinner-inner" viewBox="25 25 50 50"><circle class="preloader-spinner-inner-path" cx="50" cy="50" r="20" fill="none" stroke-width="2"/></svg>';
      preloader.appendChild(preloaderSpinner);
      return preloader;
    };

    this.appendPreloader = function() {
      var self = this;
      this.preloader = this.createPreloader();
      document.body.appendChild(this.preloader);
      setTimeout(function() {
        self.preloader.classList.add('preloader__visible');
      }, 0);
    };

    this.removePreloader = function() {
      var self = this;
      self.preloader.classList.remove('preloader__visible');
      setTimeout(function() {
        self.preloader.parentNode.removeChild(self.preloader);
      }, 400);
    };

    this.loadStart = function() {
      this.isLoadProcess = true;
      this.options.preloader ? this.appendPreloader() : '';
    };

    this.loadEnd = function() {
      this.isLoadProcess = false;
      this.options.preloader ? this.removePreloader() : '';
    };

    this.parseAndReplace = function(DOMString, href, addToHistory) {
      var self = this,
        parser = new DOMParser(),
        dom = parser.parseFromString(DOMString, 'text/html'),
        replaced = document.querySelector(self.options.container),
        replacement = dom.querySelector(self.options.container),
        newTitle = dom.head.querySelector('title').innerHTML,
        newBodyClass = dom.body.className;
      document.body.className = newBodyClass;
      document.querySelector('head title').innerHTML = newTitle;
      if (!replacement || !replaced) {
        window.location = href;
        return;
      }
      replaced.parentNode.replaceChild(replacement, replaced);
      if (addToHistory) history.pushState(null, null, href);
      self.addLinksEvent(self.options.navItems);
      if (self.afterRendered) self.afterRendered(replacement);
      self.loadEnd();
    };

    this.getContent = function(href, addToHistory) {
      var self = this;
      if (self.beforeRendered) self.beforeRendered();
      if ((self.exact && this.href === location.href) || self.isLoadProcess)
        return;

      self.loadStart();
      self.get(
        href,
        'POST',
        {},
        function(DOMString) {
          self.parseAndReplace(DOMString, href, addToHistory);
        },
        function(error) {
          if (error.status === 404) {
            self.parseAndReplace(error.responseText, href, addToHistory);
          } else {
            self.loadEnd();
          }
          if (error.status === 0) {
            window.open(href);
          }
        }
      );
    };

    this.addLinksEvent = function(selector) {
      var self = this,
        selector = selector ? selector : this.options.navItems,
        links = document.querySelectorAll(selector);
      for (var i = 0; i < links.length; i++) {
        if (
          links[i] instanceof Element &&
          links[i].tagName.toLowerCase() === 'a'
        ) {
          links[i].addEventListener('click', function(e) {
            e.preventDefault();
            var href = this.href;
            self.getContent(href, true);
          });
        }
      }
    };

    this.popStateListener = function() {
      var self = this;
      window.addEventListener('popstate', function(e) {
        self.getContent(location.pathname + location.search, false);
      });
    };

    this.goTo = function(url) {
      this.getContent(url, true);
    };

    this.init = function() {
      if (this.beforeInit) this.beforeInit();
      this.addLinksEvent(this.options.navItems);
      this.popStateListener();
      if (this.afterRendered)
        this.afterRendered(document.querySelector(this.options.container));
      if (this.afterInit) this.afterInit();
      return this;
    };
  };
})(window);

export default BurlakNavigation;
