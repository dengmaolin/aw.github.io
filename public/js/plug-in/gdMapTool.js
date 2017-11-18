var MapTool=function(options){
	var self=this;
	var _mapObj=null;//地图实例
	var _toolBar=null;//地图控件实例
	var _placeSearch=null;//关键词搜索实例
	var _driving=null;
	var _trafficLayer=null;
	var _settings = $.extend({
		mapId: 'container',
		lng: '119.30',
		lat:'26.08',
		zoom:'10',
		minZ:'12',
		maxZ:'18',
		zooms:[10,19],
		city:'0591',
		mapClick:function(e){},//地图点击事件
		markerClickEvent:function(e){},//marker点击事件
		markers:[],//使用的标注点
		mapDragendEvent:function(){},//地图拖拽事件
		mapDragstartEvent:function(){},
		mapDragingEvent:function(){}
	}, options);
	/* 
	 * 功能：初始化地图
	 * 中心坐标(lng,lat)
	 * mapId 地图div的 对应Id
	 * lng  经度
	 * lat  纬度
	 * zoom 放大级别
	 * minZ  最小级别
	 * maxZ  最大级别
	 */
	
	self.initMap=function(){
		
		_mapObj=new AMap.Map(_settings.mapId,{
			resizeEnable: true,
            zoom: parseInt(_settings.zoom),
            center: [_settings.lng, _settings.lat],
            zooms:_settings.zooms
		});
		
		AMap.service(["AMap.PlaceSearch"], function() {
	        _placeSearch = new AMap.PlaceSearch({ //构造地点查询类
	     
	            map: _mapObj
	        });
	        //关键字查询
	        
	    });
	    
	    //监听地图点击事件
	    _mapObj.on("click",_settings.mapClick);
	    
	    /*AMap.event.addListener(_mapObj,"dragging",function(e){
	    	
	    	//self.setMarker(_mapObj.getCenter().lng,_mapObj.getCenter().lat,'16','map-haveCar');
	    });*/
	    //地图拖拽 事件监听
	    AMap.event.addListener(_mapObj,"dragend",_settings.mapDragendEvent);
	    AMap.event.addListener(_mapObj,"dragstart",_settings.mapDragstartEvent);
	    AMap.event.addListener(_mapObj,"dragging",_settings.mapDragingEvent);
		
		
	    
	    
	}
	
	self.getMapCenter=function(){
		return _mapObj.getCenter();
	}
	//设置地图的中心点
	self.setMapCenter=function(lng,lat){
		_mapObj.setZoomAndCenter(14, [lng,lat]);
	}
	
	
	//设置标记点  classImg:map-haveCar 有车位标识  map-myPosition我的位置标识  map-noCar没车位标识
	self.setMarker=function(lng,lat,text,classImg){
		marker = new AMap.Marker({
			position: [lng, lat],
			offset: new AMap.Pixel(-16, -42), //相对于基点的偏移位置
			content: '<div class="marker-route marker-marker-bus-from '+classImg+'">'+text+'</div>' 
           
        });
        marker.setMap(_mapObj);
        AMap.event.addListener(marker, 'click',_settings.markerClickEvent);
		return marker;
	} 
	
	//清除某个标记
	self.deleteMarker=function(marker){
		_mapObj.remove(marker); 
	} 
	
	//清除所有标记
	self.clearMarker=function(){
		$.each(_settings.markers,function(k,v){
			if(v.canDelete){
				_mapObj.remove(v); 
			}
			 
		});
	} 
	
	//放大或缩小地体
	self.setZoom=function(flag){
		var currZoom=_mapObj.getZoom();
		if(flag=='add' && currZoom!=18){
			currZoom=currZoom+1;
		}else if(flag=='del' && currZoom!=10){
			currZoom=currZoom-1;
		}
		_mapObj.setZoom(currZoom);
	} 
	
	//设置窗体
	self.setTipWindow=function(lng,lat,tipText){
		   //构建信息窗体中显示的内容
        var info = [];
        info.push("<div class='map-tipWindow'>"+tipText+"</div>");
      
        infoWindow = new AMap.InfoWindow({
            content: info.join("<br/>")  //使用默认信息窗体框样式，显示信息内容
        });
        infoWindow.open(_mapObj, [lng,lat]);
	} 
	
	
	
	//地图搜索
	self.placeSearch=function(keyWord,callback){
		try{
			_placeSearch.search(keyWord,callback);
		}catch(e){
			guyu.commonJS.showMsg('搜索失败');
		}
	    
	}
	
	self.setSearchCity=function(cityCode){
		_placeSearch.setCity(cityCode);
	}
	
	
	self.searchCarWash=function(lng,lat,cityCode){
		if(cityCode!=undefined){
			_placeSearch.setCity(cityCode);
		}
		var cpoint = [lng,lat]; 
		_placeSearch.setType('汽车服务');
		_placeSearch.searchNearBy('洗车', cpoint, 10000, function(status, result) {
			
    	});
		
	}
	
	//定位
	self.getMyLoc=function(onComplete){
		_mapObj.plugin('AMap.Geolocation', function() {
	        geolocation = new AMap.Geolocation({
	            enableHighAccuracy: true,//是否使用高精度定位，默认:true
	            showButton: false,
	            timeout: 20000,          //超过10秒后停止定位，默认：无穷大
	            //buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
	            zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
	            buttonPosition:'RB'
	        });
	        _mapObj.addControl(geolocation);
	        geolocation.getCurrentPosition();
	        AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
	        AMap.event.addListener(geolocation, 'error', function(){
	        	var str = '定位失败,';
	            str += '错误信息：'
	            switch(data.info) {
	                case 'PERMISSION_DENIED':
	                    str += '浏览器阻止了定位操作';
	                    break;
	                case 'POSITION_UNAVAILBLE':
	                    str += '无法获得当前位置';
	                    break;
	                case 'TIMEOUT':
	                    str += '定位超时';
	                    break;
	                default:
	                    str += '未知错误';
	                    break;
	            }
	            guyu.commonJS.alert(str);
	        });      //返回定位出错信息
	    });
	}
	
	// poi选点UI启动
	self.loadPoiUi=function(inputId,cityCode,callback,searchType){
		AMapUI.loadUI(['misc/PoiPicker'], function(PoiPicker) {

	        var poiPicker = new PoiPicker({
	            city:cityCode,
	            input: inputId
	        });
	
	        //初始化poiPicker
	        poiPickerReady(poiPicker);
	    });

	    function poiPickerReady(poiPicker) {
	        window.poiPicker = poiPicker;
	
	        var marker = new AMap.Marker();
	
	        var infoWindow = new AMap.InfoWindow({
	            offset: new AMap.Pixel(0, -20)
	        });
	
	        //选取了某个POI
	        poiPicker.on('poiPicked', function(poiResult) {
	
	            var source = poiResult.source,
	                poi = poiResult.item,
	                info = {
	                    source: source,
	                    id: poi.id,
	                    name: poi.name,
	                    location: poi.location.toString(),
	                    address: poi.address
	                };
	
	            marker.setMap(_mapObj);
	            infoWindow.setMap(_mapObj);
	
	            marker.setPosition(poi.location);
	            infoWindow.setPosition(poi.location);
	
	            infoWindow.setContent(poi.name);
	            infoWindow.open(_mapObj, marker.getPosition());
	
	            _mapObj.setCenter(marker.getPosition());
	            callback(poiResult);
	        });
	
	        poiPicker.onCityReady(function() {
	            //poiPicker.suggest(searchType);
	        });
	    }
	}
	
	//加载城市选择界面
	self.loadCitySelectPage=function(callback){
		//设置ui依赖jquery还是Zepto
	    AMapUI.setDomLibrary($$);
		AMapUI.loadUI(['misc/MobiCityPicker'], function(MobiCityPicker) {

		  var cityPicker = new MobiCityPicker({
		    //topGroups: ..., // 顶部城市列表
		  });
		
		  //监听城市选中事件
		  cityPicker.on('citySelected', function(cityInfo) {
		    //隐藏城市列表
		    cityPicker.hide();
		
		    //选中的城市信息
		    console.log(cityInfo);
		    callback(cityInfo);
		  });
		  
		  //显示城市列表，可以用某个click事件触发
		  cityPicker.show();
		});
	}
	
	self.loadPositionPicker=function(callback){
		AMapUI.loadUI(['misc/PositionPicker'], function(PositionPicker) {
		    var positionPicker = new PositionPicker({
		        mode:'dragMap',//设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
		        map:_mapObj//依赖地图对象
		    });
		    //TODO:事件绑定、结果处理等
		    positionPicker.on('success', function(positionResult) {
		    	callback(positionResult);
			    /*document.getElementById('lnglat').innerHTML = positionResult.position;
			    document.getElementById('address').innerHTML = positionResult.address;
			    document.getElementById('nearestJunction').innerHTML = positionResult.nearestJunction;
			    document.getElementById('nearestRoad').innerHTML = positionResult.nearestRoad;
			    document.getElementById('nearestPOI').innerHTML = positionResult.nearestPOI;*/
			});
			positionPicker.on('fail', function(positionResult) {
			    // 海上或海外无法获得地址信息
			});
			positionPicker.start();
		});
	}
	
	//线路规划
	self.planRoute=function(startLng,startLat,endLng,endLat){
	    // 根据起终点经纬度规划驾车导航路线
	    AMap.service('AMap.Driving',function(){//回调函数
		    //实例化Driving
		    _driving= new AMap.Driving({
			    map: _mapObj,
			    panel: "panel"
			}); 
			_driving.search([startLng,startLat], [endLng,endLat],function(status, result) {});
		});
	   
	}
	
	// flag  show 显示   hidden隐藏
	self.showTrafficMap=function(flag){
		if(_trafficLayer==null){
			_trafficLayer = new AMap.TileLayer.Traffic({
		        zIndex: 10
		    });
		    _trafficLayer.setMap(_mapObj);
		}else{
			if(flag=='show'){
				_trafficLayer.show();
			}else{
				_trafficLayer.hide();
			}
		}
		
		 
	}
	
	self.getCityNameByLngLat=function(lng,lat){
		
	}
	
	//获取两点间的距离
	self.getDistance=function(sLng,sLat,eLng,eLat){
		try{
			var lnglat = new AMap.LngLat(sLng, sLat);
			return lnglat.distance([eLng, eLat]);
		}catch(e){
			return 0;
			//TODO handle the exception
		}
		
	}
	
	self.initMap();
	return this;
}




