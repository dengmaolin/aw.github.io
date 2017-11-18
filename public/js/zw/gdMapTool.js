/*
 * 	@ 文件描述    高德地图
 * 	@ 作者 	赵伟
 * 	@ 更新时间   2017-07-24
 */


var MapTool=function(options){
	var self=this;
	var _carMap=null;//地图实例
	var _toolBar=null;//地图控件实例
	var _placeSearch=null;//关键词搜索实例
	var markers=[];
	var _settings = $.extend({
		mapId: 'container',
		lng: '119.30',
		lat:'26.08',
		zoom:'14',
		minZ:'12',
		maxZ:'18',
		zooms:[10,19],
		city:'0591',
		mapClick:function(e){}
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
		
		_carMap=new AMap.Map(_settings.mapId,{
			resizeEnable: true,
            zoom: _settings.zoom,
            center: [_settings.lng, _settings.lat],
            zooms:_settings.zooms
		});
		/*self.setMarker(_settings.lng, _settings.lat,'','map-myPosition');
		self.setTipWindow(_settings.lng, _settings.lat,'您当前的位置');*/
		
		AMap.service(["AMap.PlaceSearch"], function() {
	        _placeSearch = new AMap.PlaceSearch({ //构造地点查询类
	            city: _settings.city, //城市
	            map: _carMap
	        });
	        //关键字查询
	        
	    });
	    
	    _carMap.on("click",_settings.mapClick);
	}
	
	//设置地图的中心点
	self.setMapCenter=function(lng,lat){
		_carMap.setZoomAndCenter(14, [lng,lat]);
	}
	
	//设置标记点
	self.setMarker=function(lng,lat,text,classImg){
		marker = new AMap.Marker({
			position: [lng, lat],
		
           
        });
        marker.setMap(_carMap);
        markers.push(marker);
		return marker;
		
		
	} 
	
	//清除所有标记
	self.clearMarker=function(){
		$.each(markers,function(k,v){
			_carMap.remove(v);  
		});
	} 
	
	
	//放大或缩小地体
	self.setZoom=function(flag){
		var currZoom=_carMap.getZoom();
		
		
		if(flag=='add' && currZoom!=18){
			currZoom=currZoom+1;
		}else if(flag=='del' && currZoom!=10){
			currZoom=currZoom-1;
		}
		_carMap.setZoom(currZoom);
	} 
	
	//设置窗体
	self.setTipWindow=function(lng,lat,tipText){
		   //构建信息窗体中显示的内容
        var info = [];
        info.push("<div class='map-tipWindow'>"+tipText+"</div>");
      
        infoWindow = new AMap.InfoWindow({
            content: info.join("<br/>")  //使用默认信息窗体框样式，显示信息内容
        });
        infoWindow.open(_carMap, [lng,lat]);
	} 
	
	//两点间的路线规划
	self.getLine=function(lngStart,latStart,lngEnd,latEnd){
		//构造路线导航类
	    var driving = new AMap.Driving({
	        map: _carMap,
	        panel: "panel"
	    }); 
	    // 根据起终点经纬度规划驾车导航路线
	    driving.search(new AMap.LngLat(lngStart, latStart), new AMap.LngLat(lngEnd,latEnd));
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
	
	
	//定位
	self.getMyLoc=function(onComplete){
		_carMap.plugin('AMap.Geolocation', function() {
	        geolocation = new AMap.Geolocation({
	            enableHighAccuracy: true,//是否使用高精度定位，默认:true
	            showButton: false,
	            timeout: 20000,          //超过10秒后停止定位，默认：无穷大
	            //buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
	            zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
	            buttonPosition:'RB'
	        });
	        _carMap.addControl(geolocation);
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
	            alert(str);
	        });      //返回定位出错信息
	    });
	}
	
	
	
	self.initMap();

}




