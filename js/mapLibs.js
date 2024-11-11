var searchTypeEnum = {
  SearchForm: 0,
  SearchMap: 1
};

var loadingHtml = {
  message: '<img width="40" src="'+mapDirImage+'/map-loading.gif" />',
  css: {
    border: '1px solid #ccc',
    padding: 'none',
    width: '40px',
    height: '40px'
  }
};

var browser = {
  isMobile: window.navigator.userAgent.indexOf('iPad') > 0
};

var minZoomAllowSearch = 6;
var minZoom = 5;

(function ($) {
  function CoordMapType(a) {
    this.tileSize = a
  };

  CoordMapType.prototype.getTile = function (a, b, c) {
    var d = c.createElement('div');
    d.innerHTML = a;
    d.style.width = this.tileSize.width + 'px';
    d.style.height = this.tileSize.height + 'px';
    d.style.fontSize = '10';
    d.style.borderStyle = 'solid';
    d.style.borderWidth = '1px';
    d.style.borderColor = '#AAAAAA';
    return d
  };


  vnTMaps = function (s) {


    var v = $(this).attr('id');
    $thismap = this;
    this.data = [];
    this.map = null;
    this.mapType = s.mapType;
    this.mapPoly = null;
    this.polyline = null;
    this.listLatlgn = null;
    this.markerCluster = null;
    this.geocoder = new google.maps.Geocoder();
    this.directionsService = new google.maps.DirectionsService();
    this.dirRenderer = new google.maps.DirectionsRenderer();
    this.isShowDirections = false;
    this.myLatLng = {} ;
    this.circle = null;
    this.curID = null;
    this.curjID = null;
    this.tooltip = null;

    this.isDrawing = s.lstPoint != undefined && s.lstPoint != '';
    this.isMapIdle = false;
    this.isShowRefreshButton = false;
    this.isShowUtil = false;

    this.infoWindow = null;
    this.initialize = function () {

      $thismap.curID = s.curID;

      var e = 10;
      if (s.zoom != '') e = parseInt(s.zoom);
      var f = 10.8230989;
      var g = 106.6296638;
      if (s.center != '') {
        f = parseFloat(s.center.split(':')[0]);
        g = parseFloat(s.center.split(':')[1])
      }
      if (s.lstPoint != '') {
        this.isDrawing = true;
        this.isMapIdle = false;
        var h = s.lstPoint.split(',');
        if (h.length >= 5) {
          this.listLatlgn = new Array();
          for (var i = 0; i < h.length; i++) {
            var j = h[i].split(':');
            this.listLatlgn.push(new google.maps.LatLng(parseFloat(j[0]), parseFloat(j[1])))
          }
        }
      }
      var k = {
        center: new google.maps.LatLng(f, g),
        zoom: e,
        overviewMapControl: true,
        overviewMapControlOptions: {
          opened: false
        },
        panControl: false,
        rotateControl: false,
        scaleControl: true,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          position: google.maps.ControlPosition.TOP_RIGHT
        },
        zoomControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT
        },
        draggable: true
      };
      this.map = new google.maps.Map(document.getElementById(v), k);
      this.tooltip = new TooltipMK({
        map: this.map
      });


      this.map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(document.getElementById('findMe'));

      var m = new google.maps.ImageMapType({
        getTileUrl: function (a, b) {
          return null
        },
        tileSize: new google.maps.Size(256, 256)
      });
      this.map.overlayMapTypes.push(m);
      google.maps.event.addListener(this.map, 'click', function (a) {});
      google.maps.event.addListener(this.map, 'zoom_changed', function () {
        if (this.getZoom() < minZoom) {
          this.setZoom(minZoom);
          return
        }
        $thismap.callBackMapChange()
      });
      if (this.listLatlgn != null) {
        this.polyline = new google.maps.Polygon({
          path: this.listLatlgn,
          strokeColor: '#585858',
          strokeWeight: 3,
          editable: true,
          fillColor: "#ccc",
          fillOpacity: 0.5
        });
        this.polyline.setMap(this.map)
      }


      google.maps.event.addListener(this.map, 'idle', function () {
        var a = this;
        if (a.getZoom() >= minZoomAllowSearch && !$thismap.isDrawing && !$thismap.isShowUtil && !$thismap.IsShowDetail && $thismap.isShowRefreshButton) {

        } else {
          $thismap.isShowRefreshButton = true;
          $thismap.isMapIdle = false
        }
        $thismap.callBackMapChange()
      });

      if (browser.isMobile) {
        this.infoWindow = new google.maps.InfoWindow()
      } else {
        this.infoWindow = new google.maps.InfoWindow()
        this.infoWindow.closeInfoCallBack = function () {
          if (this._infoBoxType == InfoBoxType.Utility) return;
          $thismap.IsShowDetail = false;

          var a = $thismap.findMarker($thismap.curID);
          if (a != null) {
            /*a.setIcon({
              url: mapDirImage+"/map_icon.png",
              size: new google.maps.Size(20, 20)
            });*/
            a.setZIndex()
          }
          $thismap.curID = null;

        }
      }
    };
    this.setContext = function (a, b, c) {
      if (a != undefined && a != '') {
        this.showInfoWindow(a)
      }
      if (b != undefined && c != undefined) {
        var d = parseFloat(c.split(':')[0]);
        var e = parseFloat(c.split(':')[1]);
        this.map.setCenter(new google.maps.LatLng(d, e));
        this.map.setZoom(parseInt(b))
      }
    };
    this.getMapBounds = function () {
      var a = $thismap.map.getBounds();
      if (a == undefined) return "";
      var b = a.getNorthEast();
      var c = a.getSouthWest();
      return b.lat() + ":" + c.lng() + "," + c.lat() + ":" + c.lng() + "," + c.lat() + ":" + b.lng() + "," + b.lat() + ":" + b.lng()
    };
    this.getCornerBounds = function () {
      var a = $thismap.map.getBounds();
      if (a == undefined) return null;
      var b = a.getNorthEast();
      var c = a.getSouthWest();
      var d = {
        minLat: c.lat(),
        minLong: c.lng(),
        maxLat: b.lat(),
        maxLong: b.lng()
      };
      return d
    };
    this.getBoundOfPolygon = function (a) {
      var b = a.split(',');
      if (b < 2) return {};
      var c = 0,
        minLat = 100000,
        maxLng = 0,
        minLng = 100000;
      for (var i = 0; i < b.length; i++) {
        var d = b[i].split(':');
        var e = parseFloat(d[0]);
        var f = parseFloat(d[1]);
        if (c < e) c = e;
        if (minLat > e) minLat = e;
        if (minLng > f) minLng = f;
        if (maxLng < f) maxLng = f
      }
      var g = {
        minLat: minLat,
        minLong: minLng,
        maxLat: c,
        maxLong: maxLng
      };
      return g
    };
    this.callBackMapChange = function () {};
    this.getZoom = function () {
      return this.map.getZoom()
    };
    this.getCenter = function () {
      return this.map.getCenter().lat() + ':' + this.map.getCenter().lng()
    };
    this.callBackSearchPlace = function () {};
    this.beginDrawButton = $('.begindraw');
    this.deleteShapeButton = $('.delshape');
    this.fullScreenButton = $('.fullscreen');
    this.exitFullScreenButton = $('.exitfullscreen');
    this.fullScreenButton.bind('click', this, function (a) {

      $('body').css('overflow', 'hidden');

      a.data.exitFullScreenButton.css('display', 'block');
      a.data.fullScreenButton.hide();
      google.maps.event.trigger(a.data.map, "resize")
    });

    this.exitFullScreenButton.bind('click', this, function (a) {

      $('body').css('overflow', 'auto');

      a.data.exitFullScreenButton.hide();
      a.data.fullScreenButton.show();

      google.maps.event.trigger(a.data.map, "resize");


    });

    this.beginDrawButton.bind('click', this, function (b) {
      if (b.data.map.getZoom() < minZoomAllowSearch) {
        alert('Bạn cần phóng to bản đồ hơn nữa vào khu vực bạn cần vẽ');
        return
      }
      $thismap.isDrawing = true;
      b.data.beginDrawButton.hide();
      b.data.deleteShapeButton.show();
      //b.data.ClearUtilitiesAroundPoint();
      b.data.clearPoint();
      b.data.callBackClearPointEvent();
      if (b.data.polyline != undefined) b.data.polyline.setMap(undefined);
      b.data.mapPoly = new google.maps.Polyline({
        strokeColor: '#585858',
        strokeOpacity: 1,
        map: b.data.map
      });
      b.data.map.setOptions({
        draggableCursor: "crosshair",
        draggable: false
      });
      var f = 10;
      var c = 0;
      function _beginDrawEvent(a) {
        return function () {
          a.listLatlgn = new Array();
          function _mouseMoveEvent(j) {
            a.mapPoly.getPath().push(j.latLng);
            var i = new Date().valueOf();
            if (i - c >= f) {
              c = i;
              a.listLatlgn.push(j.latLng)
            }
          }
          google.maps.event.addListener(b.data.map, "mousemove", function (j) {
            _mouseMoveEvent(j)
          })
        }
      };
      if (browser.isMobile) {
        $('body').bind('touchmove', function (e) {
          e.preventDefault();
          e.stopPropagation()
        })
      }
      google.maps.event.addListener(b.data.map, "mousedown", _beginDrawEvent(b.data));
      function _endDrawEvent(a) {
        return function () {
          if (browser.isMobile == false) {
            $('body').unbind('mouseup')
          } else {
            $('body').unbind('touchend')
          }
          if (a.mapPoly != undefined) {
            if (browser.isMobile) {
              $('body').unbind('touchmove')
            }
            a.map.setOptions({
              draggableCursor: "openhand",
              draggable: true
            });
            google.maps.event.clearListeners(a.map, 'mousedown');
            google.maps.event.clearListeners(a.map, 'mousemove');
            a.mapPoly.setMap(undefined);
            a.endDraw();
            a.callBackMapChange()
          }
        }
      };
      if (browser.isMobile == false) {
        $('body').bind('mouseup', this, _endDrawEvent(b.data))
      } else {
        $('body').bind('touchend', this, _endDrawEvent(b.data))
      }
    });
    this.deleteShapeButton.bind('click', this, function (a) {
      a.data.DeleteShape()
    });
    this.DeleteShape = function (a) {
      this.beginDrawButton.show();
      this.deleteShapeButton.hide();
      if (this.polyline != undefined) {
        this.polyline.setMap(undefined);
        this.polyline = null
      }
      this.clearPoint();
      $thismap.isDrawing = false;
      $thismap.isMapIdle = false;
      this.callBackClearPointEvent(true);

    };
    this.endDraw = function (a) {

      if ($thismap.listLatlgn != null) {

        this.beginDrawButton.hide();
        this.deleteShapeButton.show();
        var b = new Array();
        if (a == undefined) {
          var c = 5;
          var x;
          x = Math.round($thismap.listLatlgn.length / 50);
          if ($thismap.listLatlgn.length < 30) {
            c = 1;
            x = 2
          }
          for (var i = 0; i < $thismap.listLatlgn.length; i++) {
            if (i % (c * x) == 0) {
              b.push($thismap.listLatlgn[i])
            }
          }
        } else {
          b = $thismap.listLatlgn
        }
        $thismap.polyline = new google.maps.Polygon({
          path: b,
          strokeColor: '#585858',
          strokeWeight: 3,
          editable: true,
          fillColor: "#ccc",
          fillOpacity: 0.5
        });
        $thismap.polyline.setMap($thismap.map);
        $thismap.findPoint($thismap.polyline, a);

        google.maps.event.addListener($thismap.polyline.getPath(), 'set_at', function () {
          $thismap.findPoint($thismap.polyline)
        });
        google.maps.event.addListener($thismap.polyline.getPath(), 'insert_at', function () {
          $thismap.findPoint($thismap.polyline)
        })
      }
      $thismap.listLatlgn = null
    };
    this.markers = new Array();

    this.callBackDrawEvent = function () {};
    this.findPoint = function (a, b) {
      this.clearPoint();
      var c = a.getPath().getArray();
      var d = 0,
        minLat = 100000,
        maxLng = 0,
        minLng = 100000;
      var e = '';
      for (var i = 0; i < c.length; i++) {
        var f = c[i].lat();
        var g = c[i].lng();
        if (e.length > 0) e += ',';
        e += f + ':' + g;
        if (d < f) d = f;
        if (minLat > f) minLat = f;
        if (minLng > g) minLng = g;
        if (maxLng < g) maxLng = g
      }

      if (this.callBackDrawEvent) {
        this.callBackDrawEvent(d, minLat, maxLng, minLng, e, b)
      }
    };
    this.isInPolyline = function (a, b) {
      if (this.polyline != undefined && this.polyline != null) {
        return google.maps.geometry.poly.containsLocation(new google.maps.LatLng(a, b), this.polyline)
      }
      return true
    };
    this.clearPoint = function () {
      this.infoWindow.close();
      //this.ClearUtilitiesAroundPoint();
      if ($thismap.markers != undefined) {
        for (var t = 0; t < $thismap.markers.length; t++) {
          $thismap.markers[t].setMap(null)
        }
        $thismap.markers = []
      }

      if (this.markerCluster != null) {
        this.markerCluster.clearMarkers()
      }
    };
    this.callBackClearPointEvent = function () {};
    this.showPoint = function (a, b) {
      this.clearPoint();
      for (var j = 0; j < a.length; j++) {
        var c = a[j];
        var d = null;
        if (!device.ipad() && !device.tablet() && !device.ipod() && !device.iphone() && !device.androidTablet() && !device.blackberryTablet() && !device.android()) {
          if (c.vip == 0) d = google.maps.Animation.DROP;
          var f = '<div class="infowindow-preview">';
          f += '<div class="infowindow-preview-detail">';

          f += '<div class="infowindow-preview-title">' + c.title + '</div>';

          if (c.picture.length > 0 && c.picture.indexOf('no-photo.jpg') < 0) {
            f += '<div class="infowindow-preview-picture">';
            f += '<img src="' + c.picture + '" alt="" />';
            f += '</div>'
          }

          f += '<div class="infowindow-info">' + c.address + '</div>';

          f += '</div>';
          f += '</div>'
        }
        $thismap.markers.push(new google.maps.Marker({
          position: new google.maps.LatLng(c.lat, c.lon),
          map: this.map,
          tooltip: f,
          icon: {
            url: map_icon,
            size: new google.maps.Size(27, 40)
          },
          animation: d
        }));
        $thismap.markers[$thismap.markers.length - 1].id = c.id
      }
      for (var i = 0; i < $thismap.markers.length; i++) {
        $thismap.markers[i].addListener('click', function () {
          $thismap.showInfoWindow(this.id)
        });
        $thismap.markers[i].addListener('mouseover', function () {
          if (this.id != $thismap.curID) {
            this.setIcon({
              url: map_icon_hover,
              size: new google.maps.Size(27, 40)
            });
            $thismap.tooltip.addTip(this);
            $thismap.tooltip.getPos2(this.getPosition())
          }
        });

        $thismap.markers[i].addListener('mouseout', function () {
          if (this.id != $thismap.curID) {
            this.setIcon({
              url: map_icon,
              size: new google.maps.Size(27, 40)
            })
          }
          $thismap.tooltip.removeTip()
        })
      }
      if (b !== undefined && b) {
        if (this.polyline != undefined && this.polyline != null) {
          var g = new google.maps.LatLngBounds();
          this.polyline.getPath().forEach(function (e) {
            g.extend(e)
          });
          this.map.fitBounds(g)
        }
      }
    };


    this.ChangeMapByGeolocate = function (c, d) {


      this.map.setCenter(new google.maps.LatLng(c.lat, c.lng));
      this.map.setZoom(d) ;

      this.myLatLng = {lat: c.lat, lng: c.lng};
      var marker = new google.maps.Marker({
        position: this.myLatLng ,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 5,
          strokeColor: '#d69a28',
          strokeOpacity: 0.8,
          strokeWeight: 10,
          fillColor: '#FF0000',
          fillOpacity: 1
        },
        title: "My Locaton" ,
        map: this.map
      });

    };
    this.ChangeMapByAddress = function (c, d) {
      if (typeof(c) == 'string') {
        this.geocoder.geocode({
            'address': c
          },
          function (a, b) {
            if (b == google.maps.GeocoderStatus.OK) {
              $thismap.map.setCenter(a[0].geometry.location);
              $thismap.map.setZoom(d)
            } else {}
          })
      } else {
        this.map.setCenter(new google.maps.LatLng(c.lat, c.lng));
        this.map.setZoom(d)
      }
    };

    this.callBackAfterInfowindowClose = function () {};
    this.callbackShowInfoWindow = function () {};

    // tim duong
    this.DirectionsView = function (id) {

      var text_placeholder = $("#directionsForm").data("placeholder");
      if(this.myLatLng.lat != undefined) {
        $("#origin").val(text_placeholder);
      }

      $("#origin").focus(function() {
        if( $(this).val()== text_placeholder){
          $(this).val('');
        }
      });

      var destination =''; var destLatLng= '';
      if (this.data != undefined && this.data.length > 0) {
        for (var i = 0; i < this.data.length; i++) {
          if (this.data[i].id == id) {
            destination = this.data[i].address ;
            destLatLng = this.data[i].lat + "," + this.data[i].lon ;
          }
        }
      }

      $("#destination").val(destination) ;
      $("#destLatLng").val(destLatLng) ;

    };

    this.getDirections = function (i, f, g) {
      var e = this ;

      var text_placeholder = $("#directionsForm").data("placeholder");
      if(this.myLatLng.lat != undefined) {
        if (i === text_placeholder) {
          i = new google.maps.LatLng(this.myLatLng.lat, this.myLatLng.lng);
        }
      }

      var destLatLng =  $("#destLatLng").val();
      if(destLatLng !=="") {
        arr = destLatLng.split(",");
        f = new google.maps.LatLng(arr[0], arr[1]);
      }


      if (!i || !f || !g) {
        return
      }

      var dirRequest = {
        origin: i,
        destination: f,
        travelMode: google.maps.TravelMode[g],
        unitSystem: google.maps.UnitSystem.METRIC,
        provideRouteAlternatives: true
      };

      this.directionsService.route(dirRequest, function (l, k) {

        $("#directions_waiting").addClass("hide");

        if (l && k === google.maps.DirectionsStatus.OK) {
          e.clearPoint();
          $("#routes").empty();

          $thismap.dirRenderer.setMap($thismap.map);
          $thismap.dirRenderer.setPanel(document.getElementById('routes'));
          $thismap.dirRenderer.setDirections(l) ;
          $thismap.isShowDirections = true;
        } else {
          if (k === google.maps.DirectionsStatus.ZERO_RESULTS) {
            alert('Không tìm thấy kết quả . Vui lòng nhập lại');
          } else {
            if (k === google.maps.DirectionsStatus.NOT_FOUND || k === google.maps.DirectionsStatus.INVALID_REQUEST) {
              j = new google.maps.Geocoder();
              j.geocode({
                  address: i.toString()
                },
                function (m, n) {
                  if (n === google.maps.GeocoderStatus.OK) {
                    alert('Địa chỉ đến không tồn tại. Vui lòng nhập lại');
                  } else {
                    alert('Địa chỉ đi không tồn tại. Vui lòng nhập lại');
                  }
                })
            } else {
              alert('errDirectionService');
            }
          }
        }
      });

    };

    this.callBackClearDirections = function () {
      this.dirRenderer.set('directions', null);
    };
    // end tim duong

    this.IsShowDetail = false;
    this.showInfoWindow = function (d) {
      this.IsShowDetail = true;

      if (d == undefined || d == null) d = this.curID;
      else if (d != this.curID && this.curID != null) {
        var e = this.findMarker(this.curID);
        var f = this.findDataInfo(this.curID);
        if (e != undefined && e != null) {
          /*e.setIcon({
            url: mapDirImage+"/map_icon.png",
            size: new google.maps.Size(20, 20)
          });*/
          if (f != undefined && f != null) {
            e.setZIndex(6 - f.vip)
          }
        }
      } else if (d == this.curID) {}
      if (this.markers != undefined) {
        for (var i = 0; i < this.markers.length; i++) {
          if (this.markers[i].id == d) {
            var g = this.findDataInfo(d);
            if (g != null) {
              this.curID = null;
              //this.CloseProject();
              //this.ClearUtilitiesAroundPoint();

              var h = this.markers[i];
              h.setIcon( map_icon );
              h.setZIndex(300);
              var k = '<div class="infowindow">';
              k += '<div class="infowindow-detail">';


              k += '<div class="infowindow-picture">';
              if (g.picture.length > 0) {
                k += '<img class="hasimage" src="' + g.picture + '" alt="" />';
              }

              k += '<div class="infowindow-button">';
              k += '<a href="' + LINK_MOD + '/' + g.detailLink + '"  >'+xem_chi_tiet+'</a>';
              k += '<a href="javascript:void(0)" onclick="myControlerObj.ShowDirections(' + g.id + ')"  >'+tim_duong+'</a>';
              k += '</div>';

              k += '</div>' ;



              k += '<div class="infowindow-info">' ;
              k += '<div class="name"><a href="' + LINK_MOD + '/' + g.detailLink + '" target="_blank">' + g.title + '</a></div>';
              k += '<div class="address">' + g.address + '</div>';
              if (g.phone) {
                k += '<div class="phone"><span>' + g.phone + '</span></div>';
              }
              if(g.distance) {
                k += '<div class="meter">' + g.distance + '</div>';
              }
              if(g.timeopen) {
                k += '<div class="timeopen">' + g.timeopen + '</div>';
              }
              if(g.utilities) {
                k += '<div class="listPa">' + g.utilities + '</div>';
              }
              k += '</div>';

              k += '<div class="clear"></div>';

              k += '</div>';
              k += '</div>';



              this.infoWindow.setContent(k);
              if (h.map == null) h.setMap(this.map);
              this.infoWindow.open(this.map, h );
              google.maps.event.clearListeners(this.infoWindow, 'closeclick');
              this.curID = g.id;

              this.callbackShowInfoWindow(this.curID)
            } else {}
            break
          }
        }
      } else {}
    };
    this.showTipWindow = function (a) {
      var b = this.findMarker(a);
      if (b != null && b.id != $thismap.curjID) {
        $thismap.tooltip.addTip(b);
        $thismap.tooltip.getPos2(b.getPosition());
        b.setIcon({
          url:  map_icon_hover,
          size: new google.maps.Size(27, 40)
        });
        b.setZIndex(300)
      }
    };
    this.hideTipWindow = function (a, b) {
      $thismap.tooltip.removeTip();
      var c = this.findMarker(a);
      if (c != null){
        c.setIcon({
          url: map_icon,
          size: new google.maps.Size(27, 40)
        });
        c.setZIndex(b)
      }

    };
    this.showMap = function (a, b) {
      this.data = [];
      for (var i = 0; i < a.length; i++) {
        if (this.isInPolyline(a[i].lat, a[i].lon)) {
          if (a[i].picture == null || a[i].picture == '') a[i].picture = mapDirImage+'/nophoto.gif';
          this.data.push(a[i])
        }
      }
      this.showPoint(this.data, b);
      return this.data
    };
    this.findDataInfo = function (a) {
      if (this.data != undefined && this.data.length > 0) {
        for (var i = 0; i < this.data.length; i++) {
          if (this.data[i].id == a) {
            return this.data[i]
          }
        }
      }
    };
    this.findMarker = function (a) {
      if (this.markers != undefined) {
        for (var i = 0; i < this.markers.length; i++) {
          if (this.markers[i].id == a) {
            return this.markers[i]
          }
        }
      }
      return null
    };

    return $thismap
  };
  $.fn.vnTMaps = vnTMaps
} (jQuery));



MapSearchControler = function (h) {

  var i = this;
  this.searchVar = {
    page: 0
  };

  var j = {
    zoom: h.context.zoom,
    center: h.context.center,
    lstPoint: h.context.lstPoint,
    mapType: mapType,
    curID : h.context.curID
  };
  this.vnTMaps = $('#map').vnTMaps(j);
  this.vnTMaps.initialize();

  this.vnTMaps.callbackShowInfoWindow = function (a) {
    i.ChangeUrlForNewContext();
  };

  this.vnTMaps.callBackDrawEvent = function (a, b, c, d, e, f, g) {
    i.callBackDrawEvent(a, b, c, d, e, f, g);
  };
  this.vnTMaps.callBackClearPointEvent = function () {
    i.callBackClearPointEvent();
  };
  this.vnTMaps.callBackSearchPlace = function (a, b, c) {
    i.callBackSearchPlace(a, b, c);
  };
  this.vnTMaps.callBackMapChange = function (a) {
    i.ChangeUrlForNewContext();
  };
  this.Initialize(h);

};

MapSearchControler.prototype.Initialize = function (z) {
  $this = this;

  this.viewList = $('#viewList');
  this.viewMap = $('#viewMap');

  this.sortView = $('.sort-view');
  this.itemView = $('.item-view');
  this.pageView = $('.page-view');
  this.boxSearch = $('#boxMapSearch');

  this.itemData = [];
  this.tempItemData = [];
  this.lstPoint = '';
  this.currPageIndex = 0;

  $this.geolocateUser(z);
  $('#findMe').bind('click', this, function (a) {
    $this.geolocateUser(z);
  });

  /*var autocompleteKeyword = new google.maps.places.Autocomplete(document.getElementById("key_search"));
  autocompleteKeyword.bindTo("bounds", this.vnTMaps.map);
  autocompleteKeyword.setTypes(["geocode"]);*/


  // tim duong
  var autocompleteOrigin = new google.maps.places.Autocomplete(document.getElementById("origin"));
  autocompleteOrigin.bindTo("bounds", this.vnTMaps.map);
  autocompleteOrigin.setTypes(["geocode"]);

  $("#origin").on('keyup', function (e) {
    if (e.keyCode == 13) {
      $("#getDirections").trigger("click");
    }
  });


  $("#getDirections").bind('click', this, function (a) {
    var f = $("#origin").val(),
      g = $("#destination").val(),
      e = $("input[name=travelMode]:checked").val();

    $("#directions_waiting").removeClass("hide");
    setTimeout(function () {
      $this.vnTMaps.getDirections(f, g, e);
    },100)
    return false ;
  });

  $("#cancelDirections").bind('click', this, function (a) {
    $this.vnTMaps.isShowDirections = false;
    $this.vnTMaps.dirRenderer.set('directions', null);
    $("#directions").hide();
    $("#viewList").show();
    $this.vnTMaps.showPoint($thismap.data, 0);
    return false ;
  });
  //end tim duong


  $this.InitializeSearch(z);

  var I = {
    keyword: z.context.keyword,
    cate: z.context.catid,
    country: z.context.country,
    city: z.context.city,
    state: z.context.state,
    utilities: z.context.utilities,
    page: z.context.page != undefined ? z.context.page: 1,
    cid: z.context.curID,
    zoom: z.context.zoom,
    center: z.context.center,
    lstPoint: z.context.lstPoint,
    searchType: z.context.searchType,
    isSearchForm: z.context.searchType == searchTypeEnum.SearchForm,
    isPageLoad: true
  };

  $this._SearchAction(I)
};

MapSearchControler.prototype.geolocateUser = function (z) {
  $this = this;
  if (typeof navigator.geolocation !== "undefined") {

    navigator.geolocation.getCurrentPosition(function (k)
    {
      var e = [];
      var d = 13 ;
      e.lat = k.coords.latitude;
      e.lng = k.coords.longitude;

      $this.vnTMaps.ChangeMapByGeolocate(e, d) ;
      $this.vnTMaps.DeleteShape();

      $this.vnTMaps.polyline = null;
      $this.vnTMaps.IsShowDetail = false;
      $this.vnTMaps.isShowUtil = false;


      var b = {
        keyword: z.context.keyword,
        cate: z.context.catid,
        country: z.context.country,
        city: z.context.city,
        state: z.context.state,
        utilities: z.context.utilities,
        page: z.context.page != undefined ? z.context.page: 1,
        lstPoint: z.context.lstPoint,
        searchType: z.context.searchType,
        isSearchForm: z.context.searchType == searchTypeEnum.SearchForm,
        isPageLoad: true
      };

      $this._SearchAction(b) ;

      return true ;

    }, function (e) {})

  }




};

MapSearchControler.prototype.ChangeMapPostition = function (a) {
  var d = 6;
  var e = "Việt Nam";
  if( $("#country").val() != '' ){
    e = $("#country :selected").text();
  }

  var c = false ;
  if ( $("#state").val() != '' ) {
    d = 14;

    var f =  $("#state :selected").text() + ', '+ $("#city :selected").text();
    e = f + ", " + e;
    c = true

  }else if (  $("#city").val() != '' ) {
    d = 12;
    var f = $("#city :selected").text();
    e = f + ", " + e;
    c = true
  }else{

  }

  if( $("#country").val() == '' &&  $("#city").val() == '' &&  $("#state").val() == '') {
    e = "Hồ Chí Minh, Việt Nam" ;
  }

  if (a.isPageLoad) a.zoom = d;
  this.vnTMaps.ChangeMapByAddress(e, d) ;
  this.vnTMaps.DeleteShape();

  return c ;
};

MapSearchControler.prototype.InitializeSearch = function (z) {
  $this = this ;
  $('#boxMapSearch #btnSearch').bind('click', this, function (a) {
    $this.SearchSubmitForm(z);
  });
  $('#boxMapSearch #cat_id').bind('change', this, function (a) {
    $this.SearchSubmitForm(z);
  });

  $('#boxMapSearch #country').bind('change', this, function (a) {
    $this.SearchSubmitForm(z);
  });
  $('#boxMapSearch #city').bind('change', this, function (a) {
    $this.SearchSubmitForm(z);
  });
  $('#boxMapSearch #state').bind('change', this, function (a) {
    $this.SearchSubmitForm(z);
  });

  $('#boxMapSearch .ckUtilities').bind('click', this, function (a) {
    $this.SearchSubmitForm(z);
  });



};

MapSearchControler.prototype.SearchSubmitForm = function (z) {

  var b = {
    keyword: z.context.keyword,
    cate: z.context.catid,
    country: z.context.country,
    city: z.context.city,
    state: z.context.state,
    utilities: z.context.utilities,
    page: z.context.page != undefined ? z.context.page: 1,
    cid: z.context.curID,
    zoom: z.context.zoom,
    center: z.context.center,
    lstPoint: z.context.lstPoint,
    searchType: z.context.searchType,
    isSearchForm: z.context.searchType == searchTypeEnum.SearchForm,
    isPageLoad: true
  };

  b.page = 1;

  b.keyword = $("#key_search").val() ;

  b.cate =$("#cat_id").val() ;

  //dia diem
  b.country = $("#country").val() ;
  b.city = $("#city").val() ;
  b.state = $("#state").val() ;

  //tien ich
  b.utilities  = $("#utilities").val() ;

  var c = this.ChangeMapPostition(b);

  this.vnTMaps.polyline = null;
  this.vnTMaps.IsShowDetail = false;
  this.vnTMaps.isShowUtil = false;
  this._SearchAction(b) ;
};

MapSearchControler.prototype.SearchSubmitFormByShape = function (a, b, c, d, e, f) {

  if (this.lstPoint != null && this.lstPoint.length > 0) {
    //this.mapTitle.html('');
    var g = {};
    if (a != undefined) {
      g.page = a
    } else {
      g.page = 1
    }

    g.keyword = $("#keyword").val() ;
    g.cate =$("#cat_id").val() ;
    //dia diem
    g.country = $("#country").val() ;
    g.city = $("#city").val() ;
    g.state = $("#state").val() ;


    g.lstPoint = this.lstPoint;
    g.isSearchForm = false;
    g.isPageLoad = false;
    g.minlat = b;
    g.minlong = c;
    g.maxlat = d;
    g.maxlong = e;
    g.m = "shape";
    if (f != undefined) {
      g.cid = f.cid;
      g.zoom = f.zoom;
      g.center = f.center
    } else {
      g.zoom = $thismap.getZoom();
      g.center = $thismap.getCenter()
    }
    this._SearchAction(g)
  }
};

MapSearchControler.prototype.SearchSubmitFormByBounds = function (a, b, c, d, e, f) {

  if (this.lstPoint != null && this.lstPoint.length > 0) {
    //this.mapTitle.html('');
    var g = {};
    if (a != undefined) {
      g.page = a
    } else {
      g.page = 1
    }

    g.keyword = $("#keyword").val() ;
    g.cate =$("#cat_id").val() ;
    //dia diem
    g.country = $("#country").val() ;
    g.city = $("#city").val() ;
    g.state = $("#state").val() ;

    g.minlat = b;
    g.minlong = c;
    g.maxlat = d;
    g.maxlong = e;
    g.isSearchForm = false;
    g.isPageLoad = false;
    g.m = "bounds";
    if (f != undefined) {
      g.cid = f.cid;
      g.zoom = f.zoom;
      g.center = f.center
    } else {
      g.zoom = $thismap.getZoom();
      g.center = $thismap.getCenter()
    }
    this._SearchAction(g)
  }
};

MapSearchControler.prototype._SearchAction = function (d) {



  if (d.zoom != '' && d.zoom < minZoomAllowSearch) {
    this.itemView.html('<div class="notify-info">Hãy phóng to bản đồ để tìm kiếm.</div>');
    return
  }
  this.viewMap.block(loadingHtml);

  $("#viewList").show();
  $("#directions").hide();
  if(this.vnTMaps.isShowDirections) {
    this.vnTMaps.callBackClearDirections();
  }

  d.sort = 0;
  d.v = new Date().getTime();
  d.my_lat = this.vnTMaps.myLatLng.lat;
  d.my_lon = this.vnTMaps.myLatLng.lng;
  d.lang = lang ;
  this.searchVar = d;
  var f = this;

  //getAjaxMethod = POST
  $.ajax({
    url: url_ajax + '/maps.php',
    data: this.searchVar,
    type: "POST",
    xhrFields: {
      withCredentials: true
    },
    success: function (a) {
      if (a == null) {
        f.viewMap.unblock();
        return
      }

      //alert($.dde(a));

      a = eval("(" + a + ")");

      f.tempItemData = f.itemData = f.vnTMaps.showMap(a.data, d.isSearchForm);


      $("#map_num").html(a.total);

      f.ChagePageIndex(0);
      if (a.total == 0) {
        f.pageView.html('');
      }

      f.viewMap.unblock();

    },
    error: function (a, b, c) {
      f.viewMap.unblock()
    },
    complete: function () {
      if(f.vnTMaps.curID) {
        f.vnTMaps.showInfoWindow(f.vnTMaps.curID);
      }
    }
  });

  if (d.isSearchForm || d.isPageLoad) {
    //load du lieu sau khi load xong
  }
};

MapSearchControler.prototype._FilterAction = function () {
  if (this.itemData.length <= 1) return;
  var d = [];
  d = this.itemData ;
  this.tempItemData = d;
  this.ChagePageIndex(0)
};

MapSearchControler.prototype.ChangeUrlForNewContext = function () {

  var a = "&cat=" + (this.searchVar.cate != undefined ? this.searchVar.cate: '');
  a += "&country=" + (this.searchVar.country != undefined ? this.searchVar.country: 0);
  a += "&city=" + (this.searchVar.city != undefined ? this.searchVar.city: 0);
  a += "&state=" + (this.searchVar.state != undefined ? this.searchVar.state: 0);
  a += "&utilities=" + (this.searchVar.utilities != undefined ? this.searchVar.utilities: '');
  a += "&keyword=" + (this.searchVar.keyword != undefined ? this.searchVar.keyword: '');
  a += "&points=" + (this.vnTMaps.isDrawing ? (this.searchVar.lstPoint != undefined ? this.searchVar.lstPoint: '') : '');
  a += "&zoom=" + this.vnTMaps.getZoom();
  a += "&center=" + this.vnTMaps.getCenter();
  a += "&page=" + this.searchVar.page;
  a += "&curID=" + (this.vnTMaps.curID != undefined && this.vnTMaps.curID != null ? this.vnTMaps.curID: '');
  a += "&searchtype=" + (this.searchVar.isSearchForm ? 0 : 1);
  //alert('Url =' +a);
  //window.location.href = window.location.pathname + '#' + a
};

MapSearchControler.prototype.ChagePageIndex = function (a) {
  if (this.tempItemData.length == 0) {
    this.itemView.html('');
    return
  }
  var b = 50; //pagesize
  var c = this.tempItemData.length / b;
  c = Math.ceil(c);
  /*if (a == 0) {
    this.itemView.html('')
  }
  */
  this.itemView.html('') ;
  if (c < 1) return;
  if (a + 1 > c) return;
  this.currPageIndex = a;

  var d = a * b;
  if (d <= 0) d = 0;
  var e = d + b;
  var f = this;
  for (var i = d; i < e && i < this.tempItemData.length; i++) {
    var g = this.BuildItemDetail(this.tempItemData[i], i, i == this.tempItemData.length - 1);
    this.itemView.append(g);
    var h = $('#item_' + this.tempItemData[i].id);
    h.click(function () {
      f.vnTMaps.hideTipWindow($(this).attr('rel'), parseInt($(this).attr('zindex')));
      f.vnTMaps.showInfoWindow($(this).attr('rel'));
      $(this).parent().find('.detail-item-current').removeClass('detail-item-current');
      $(this).addClass('detail-item-current')
    });
    h.hover(function () {
        f.vnTMaps.showTipWindow($(this).attr('rel'))
      },
      function () {
        f.vnTMaps.hideTipWindow($(this).attr('rel'), parseInt($(this).attr('zindex')))
      })
  }
  $('.item-view .detail-item').live('click', function () {
    f.vnTMaps.showInfoWindow($(this).attr('rel'));
    $(this).parent().find('.detail-item-current').removeClass('detail-item-current');
    $(this).addClass('detail-item-current')
  });

  this.pageView.html(this.BuildPaging(this.tempItemData.length, b, a));
};

MapSearchControler.prototype.BuildPaging = function (total, pagesize, currpage)  {
  var navigation = "";
  var pmore = 3;
  var cPage = currpage + 1 ;
  var totalPages = total / pagesize;
  totalPages = Math.ceil(totalPages);

  var objectLink = 'myControlerObj.ChagePageIndex(';


  // get total pages
  var next_page = pmore;
  var prev_page = pmore;
  if (cPage < pmore) next_page = pmore + pmore - cPage;
  if (totalPages - cPage < pmore) prev_page = pmore + pmore - (totalPages - cPage);

  if (totalPages > 1)
  {
    navigation = "<ul>";
    // Show first page
    if (cPage > (pmore + 1))
    {
      pLink = objectLink  +  "0)";
      navigation += '<li><a href="javascript:void(0)" onclick="'+ pLink +'"   ><i class="fa fa-angle-double-left"></i></a></li>';
    }
    // End
    // Show Prev page
    if (cPage > 1)
    {
      numpage = cPage - 1;
      pLink = objectLink  +  "" + (numpage -1) + ")";
      navigation += '<li><a href="javascript:void(0)" onclick="'+ pLink +'"  ><i class="fa fa-angle-left"></i></a></li>';
    }
    // End
    // Left
    for (i = prev_page; i >= 0; i --)
    {
      pagenum = cPage - i;
      if ((pagenum > 0) && (pagenum < cPage))
      {
        pLink = objectLink  +  "" + (pagenum-1) + ")";
        navigation += '<li><a href="javascript:void(0)" onclick="'+ pLink +'" >' + pagenum + '</a></li>';

      }
    }
    // End
    // Current
    navigation += '<li><span class="pagecur">' + cPage + '</span></li>';
    // End
    // Right
    for (i = 1; i <= next_page; i ++)
    {
      pagenum = cPage + i;
      if ((pagenum > cPage) && (pagenum <= totalPages))
      {
        pLink = objectLink  +  "" + (pagenum-1) + ")";
        navigation += '<li><a href="javascript:void(0)" onclick="'+ pLink +'" >' + pagenum + '</a></li>';
      }
    }
    // End
    // Show Next page
    if (cPage < totalPages)
    {
      numpage = cPage + 1;
      pLink = objectLink  +  "" + (numpage-1) + ")";
      navigation += '<li><a href="javascript:void(0)" onclick="'+ pLink +'"  ><i class="fa fa-angle-right"></i></a></li>';
    }
    // End
    // Show Last page
    if (cPage < (totalPages - pmore))
    {
      pLink = objectLink  + "" + (totalPages-1) + ")";
      navigation += '<li><a href="javascript:void(0)" onclick="'+ pLink +'"  ><i class="fa fa-angle-double-right"></i></a></li>';
    }

    navigation += '</ul>';
    // End
  }

  return navigation ;

};

MapSearchControler.prototype.BuildItemDetail = function (a, b, c) {

  var e = '';
  e += '<div  id="item_' + a.id + '" class="item" rel="' + a.id + '"  zindex="1" >';

  e += '<div class="info">';
  e += '<div class="name">' + a.title + '</div>';
  e += '<div class="address">' + a.address + '</div>';
  if(a.phone) {
    e += '<div class="phone"><span>' + a.phone + '</span></div>';
  }
  if(a.distance) {
    e += '<div class="meter">' + a.distance + '</div>';
  }
  if(a.timeopen) {
    e += '<div class="timeopen">' + a.timeopen + '</div>';
  }
  if(a.utilities) {
    e += '<div class="listPa">' + a.utilities + '</div>';
  }
  e += '</div>';

  e += '<div class="clear"></div>';
  e += '</div>';

  if (!c) {
  }
  return e ;
};

MapSearchControler.prototype.callBackDrawEvent = function (a, b, c, d, e, f) {

  this.lstPoint = e;
  if (this.vnTMaps.isDrawing) {
    this.SearchSubmitFormByShape(1, b, d, a, c, f)
  } else {
    this.SearchSubmitFormByBounds(1, b, d, a, c, f)
  }

};

MapSearchControler.prototype.callBackClearPointEvent = function (a) {

  this.itemView.html('');
  this.pageView.html('');
  this.lstPoint = '';
  this.vnTMaps.isMapIdle = true ;

};

MapSearchControler.prototype.callBackSearchPlace = function (b, c, d) {
  var e = d[0].short_name;
  var f = '';
  for (var a = 0; a < d.length; a++) {
    for (var i = 0; i < d[a].types.length; i++) {
      if (d[a].types[i] == 'route' && f.length == 0) {
        f = 'route';
        break
      } else if (d[a].types[i] == 'sublocality' && f.length == 0) {
        f = 'sublocality';
        break
      } else if (d[a].types[i] == 'administrative_area_level_2' && f.length == 0) {
        f = 'administrative_area_level_2';
        break
      } else if (d[a].types[i] == 'administrative_area_level_1' && f.length == 0) {
        f = 'administrative_area_level_1';
        break
      } else if (d[a].types[i] == 'neighborhood' && f.length == 0) {
        f = 'neighborhood';
        break
      }
    }
    if (f.length > 0) break
  }
  if (f.length == 0) f = 'unknow';
  $this._SearchAction({
    page: 1,
    lat: b,
    lon: c,
    level: f,
    address: e
  })
};


MapSearchControler.prototype.ShowDirections = function (id) {

  $("#viewList").hide();
  $("#directions").show();
  $("#routes").html('');

  this.vnTMaps.DirectionsView(id) ;

};


