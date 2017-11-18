var mapTool=(function($,window){
	var self=this;
	/* 
	 * 功能：初始化地图
	 * 中心坐标(lng,lat)
	 * mapDivId 地图div的 对应Id
	 * lng  经度
	 * lat  纬度
	 * zoom 放大级别
	 * minZ  最小级别
	 * maxZ  最大级别
	 */
	self.initMap=function(mapDivId,lng,lat,zoom,minZ,maxZ){
		var map = new BMap.Map(mapDivId,{minZoom:minZ,maxZoom:maxZ});          // 创建地图实例   放大级别
		var point = new BMap.Point(lng,lat);  // 创建点坐标  
		map.centerAndZoom(point, zoom);                 // 初始化地图，设置中心点坐标和地图级别  
		map.enableDragging();   //设置地图可以拖拽
		map.enableScrollWheelZoom(true);//设置地图可以放缩
		map.setDefaultCursor("Default"); //设置鼠标的样式
		return map;
	}
	/*
	 * 添加 点 覆盖物 
	 * map 地图实例
	 * lng 经度
	 * lat 纬度
	 * 覆盖物图标
	 */
	self.addOverlay=function(map,lng,lat,myIcon){
		var point=new BMap.Point(lng,lat);
		var marker;
		if(myIcon!=undefined){
			marker=new BMap.Marker(point,{icon:myIcon});//创建覆盖点
		}
		else{
			marker=new BMap.Marker(point);//创建覆盖点
		}
		map.addOverlay(marker);
		return marker;
	}
	/*
	 *   坐标转换
	 *   lng  经度
	 *   lat  纬度
	 *   flag 标志：  1.平面坐标  2. 像素坐标   3.图块坐标   
	 */
	self.coordinateTransform=function(map,lng,lat){  //6327 2356
		var point={};
		point.lng=lng;
		point.lat=lat;
		var projection =map.getMapType().getProjection();
		var worldCoordinate = projection.lngLatToPoint(point);
		var worldCoordStr ="<br />平面坐标："+ worldCoordinate.x +", "+ worldCoordinate.y;
		return worldCoordinate;
	}
	/*
	 *  点击地图  添加覆盖物
	 *  e：点击事件
	 *  viewmodel: 数据模型
	 */
	self.getMapClickPosition=function(map,e){
		
		
		 if(!e.overlay)
		 {
		 	self.deleteAllMarker(map);
			mapTool.addOverlay(map,e.point.lng,e.point.lat);
		 }
		
	}
	/*
	 *  设置自定义覆盖物的弹窗
	 */
	self.setCustomInfoWindow=function(map,marker,content,mpoint){
		//覆盖物点击事件
		var markerEventCallBack=function(e){
			var infowindow = new BMap.InfoWindow(content);
			map.openInfoWindow(infowindow,mpoint);//显示窗口
		}
		marker.addEventListener('touchend',markerEventCallBack);
		//给覆盖物注册事件
		marker.addEventListener('click',markerEventCallBack);
	}
	/*
	 *   删除所有图层
	 *   map: 地图实例
	 */
	self.deleteAllMarker=function(map){
		 map.clearOverlays();
	}
	
	/*
	 *   关键词搜索
	 *   map: 地图实例
	 *   content
	 */
	self.keySerch=function(map,content,model){
		var options = {
			onSearchComplete: function(results){
				// 判断状态是否正确
				if (local.getStatus() == BMAP_STATUS_SUCCESS){
					var s = [];
					for (var i = 0; i < results.getCurrentNumPois(); i++){
						s.push(results.getPoi(i).point);
					}
					if(s.length>0){
						mapTool.deleteAllMarker(map);
						map.centerAndZoom(new BMap.Point(s[0].lng,s[0].lat),17);
   						mapTool.addOverlay(map,s[0].lng,s[0].lat);
   						model.addressLongitude(s[0].lng);
		   				model.addressLatitude(s[0].lat);
		   				$("#addrSearchTip").text('请选择具体地址');
   						$("#addrSearchTip").addClass('font-gray-white');
		   				$("#addrSearchTip").removeClass('font-red');
   					}else{
   						
					}
					//return s;
				}else{
					$("#addrSearchTip").text('没搜索到具体地址');
	   				$("#addrSearchTip").addClass('font-red');
	   				$("#addrSearchTip").removeClass('font-gray-white');
				}
			}
		};
		var local = new BMap.LocalSearch(map, options);
		local.search(content);
	}
	
	/*
	 * 	自定义覆盖物
	 */
	self.setZoom=function(map,type){
		var currZoom=map.getZoom();
		
		if(type=='add'){
			if(currZoom==18){
				currZoom=currZoom-1;
			}
			map.setZoom(currZoom+1);
		}else{
			if(currZoom==12){
				currZoom=currZoom+1;
			}
			map.setZoom(currZoom-1);
		}
		
		
		
	}
	
	/*
	 * 	自定义覆盖物
	 */
	// 复杂的自定义覆盖物
    
	return this;
})(jQuery,window)




