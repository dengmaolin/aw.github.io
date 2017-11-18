/*
 * 	@ 文件描述    国家地图
 * 	@ 作者 	赵伟
 * 	@ 更新时间   2017-07-24
 */

var MapTool=function(options){
	var self=this;
	var _map=null;//地图实例
	var _localsearch=null;//搜索实例
	var _settings = $.extend({
		mapId: 'container',
		lng: '117.35',
		lat:'24.52',
		zoom:'14',
		minZ:'12',
		maxZ:'18',
		mapClick:function(e){},
		markerClick:function(e){}
	}, options);
	var areaShow=function(obj){  //画行政边界区
		var colors=["#FFD39B","#FF8247","#00CED1","#7CCD7C","#5CACEE","#CAE1FF","#98FB98","#00E5EE","#EEEE00","#EEB422","#FFE4C4"];
		if(obj)  
		{  
			//坐标数组，设置最佳比例尺时会用到  
			var pointsArr = [];  
			var points = obj.points;
			var _fillColor=colors[parseInt((Math.random()*10+1))%11];
			
			for(var i=0;i<points.length;i++)  
			{  
				var regionLngLats = [];  
				var regionArr = points[i].region.split(",");  
				for(var m=0;m<regionArr.length;m++)  
				{  
					var lnglatArr = regionArr[m].split(" ");  
					var lnglat = new T.LngLat(lnglatArr[0],lnglatArr[1]);  
					regionLngLats.push(lnglat);  
					pointsArr.push(lnglat);  
				}  
				
				
				//创建线对象  
				var polygon = new T.Polygon(regionLngLats,{
					color:"blue" , weight: 3, opacity: 0.0, fillColor: "#AEEEEE", fillOpacity: 0.1
				});
				_map.addOverLay(polygon);
				var line = new T.Polyline(regionLngLats,{color:"blue", weight:3, opacity:1, lineStyle:"dashed"});  
				//向地图上添加线  
				_map.addOverLay(line);  
			}  
			//显示最佳比例尺  
			//_map.setViewport(pointsArr);  
			_map.centerAndZoom(new T.LngLat(117.79,24.44), 9);
		}  
	}
	var _localSearchResult=function(result){//搜索结果
		areaShow(result.getArea());
	}
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
		
		_map=new T.Map(_settings.mapId,{
			projection: 'EPSG:4326',
			minZoom:_settings.minZ,
			maxZoom:_settings.maxZ
		});
		
		_map.centerAndZoom(new T.LngLat(_settings.lng, _settings.lat), _settings.zoom);
	    
	    _map.addEventListener("click",_settings.mapClick);
	    
	    
	}
	
	self.setCenterAndZoom=function(lng,lat,zoom){
		_map.centerAndZoom(new T.LngLat(lng, lat), zoom);

	}
	
	self.showArea=function(){
		var config = { 
			pageCapacity:10,	//每页显示的数量 
			onSearchComplete:_localSearchResult	//接收数据的回调函数 
		}; 
		//创建搜索对象 
		_localsearch = new T.LocalSearch(_map,config); 
		
		_localsearch.search('漳州市华安县');
		_localsearch.search('漳州市长泰县');
		_localsearch.search('漳州市龙海市');
		_localsearch.search('漳州市平和县');
		_localsearch.search('漳州市南靖县');
		_localsearch.search('漳州市漳浦县');
		_localsearch.search('漳州市云霄县');
		_localsearch.search('漳州市诏安县');
		_localsearch.search('漳州市东山县');
		_localsearch.search('漳州市芗城区');
		_localsearch.search('漳州市龙文区');
	}
	
	self.addMarker=function(lng,lat,iconUrl,markerData){
		var icon = new T.Icon({
			iconUrl: iconUrl,
			iconSize: new T.Point(30, 30)
		});
		//创建标注对象
		var marker = new T.Marker(new T.LngLat(lng, lat), {icon: icon});
		if(markerData!=undefined){
			marker.markerData=markerData;
		}
		//向地图上添加标注
 		_map.addOverLay(marker);
		marker.addEventListener("click", _settings.markerClick);
	}
	self.removeMarker=function(marker){
		_map.removeOverLay(marker);
	}
	
	//删除所有覆盖物
	self.clearOverLays=function(){
		_map.clearOverLays();
	}
	self.initMap();
}
