function mapInit() {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
    map = document.getElementById('map');
  if (map) {
    var mapData = {};
    mapData.x = map.getAttribute('data-x');
    mapData.y = map.getAttribute('data-y');
    mapData.title = map.getAttribute('data-title');
    mapData.content = map.getAttribute('data-content');
    mapData.pinUrl = map.getAttribute('data-pin');
    mapData.pinWidth = parseInt(map.getAttribute('data-pin-width'));
    mapData.pinHeight = parseInt(map.getAttribute('data-pin-height'));
    mapData.zoom = parseInt(map.getAttribute('data-zoom'));
    mapData.balloonState = parseInt(map.getAttribute('data-balloon-state'));
    ymaps.ready(init);
    var myMap, myPlacemark;

    function init() {
      myMap = new ymaps.Map('map', {
        center: [mapData.x, mapData.y],
        zoom: mapData.zoom,
        controls: ['zoomControl'],
        behaviors: ['Drag']
      });
      myPlacemark = new ymaps.Placemark(
        [mapData.x, mapData.y],
        {
          balloonContentHeader: mapData.title,
          balloonContent: mapData.content
        },
        {
          iconLayout: 'default#image',
          iconImageHref: mapData.pinUrl,
          iconImageSize: [mapData.pinWidth, mapData.pinHeight],
          iconImageOffset: [-(mapData.pinWidth / 2), -mapData.pinHeight],
          hideIconOnBalloonOpen: false,
          balloonOffset: [0, 0]
        }
      );
      if (isMobile) {
        myMap.behaviors.enable('multiTouch');
      } else {
        myMap.behaviors.enable('drag');
      }
      myMap.geoObjects.add(myPlacemark);
      if (mapData.balloonState) myPlacemark.balloon.open();
    }
  }
}

export default mapInit;
