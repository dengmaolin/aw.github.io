/*
 * 	@ 文件描述    画饼状图
 * 	@ 作者 	赵伟
 * 	@ 更新时间   2017-07-26
 */

/*
 * 列表模型
 * @param {Object} options
 *  canvasId: canvas的ID,
 *	colors:[]  颜色数组,
 *	angles:[]  角度数组,
 *	centerPoint:[15,15]  中心点,
 *	radius:15  半径
 * 
 *  返回img的src
 */

guyu.drawPie={
	createNew : function(options){
		var _settings = $.extend({
			canvasId: 'canvas',
			colors:['#5ad82e','#f9132e','#f9f613','#3313f9'],
			angles:[Math.PI*0.5,Math.PI*0.5,Math.PI*0.5,Math.PI*0.5],
			centerPoint:[18,18],
			radius:15
		}, options);
		var canvas=document.getElementById(_settings.canvasId);
		var width = canvas.width,height=canvas.height;
		var ctx=canvas.getContext('2d');
		if (window.devicePixelRatio) {
			canvas.style.width = width + "px";
			canvas.style.height = height + "px";
			canvas.height = height * window.devicePixelRatio;
			canvas.width = width * window.devicePixelRatio;
			ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
		}
		
		
		var beginAngles=0;
		var endAngles=0;
		
		for(var i=0;i<_settings.angles.length;i++){//循环画饼
			beginAngles=endAngles;
			endAngles=beginAngles+_settings.angles[i];
			ctx.beginPath();
			ctx.fillStyle=_settings.colors[i];//数组填充的颜色
			ctx.lineWidth=1;
        	ctx.strokeStyle="#000";
			ctx.moveTo(_settings.centerPoint[0],_settings.centerPoint[1]);//移动到中心点
			ctx.arc(_settings.centerPoint[0],_settings.centerPoint[1],_settings.radius,beginAngles,endAngles);//画弧
			ctx.lineTo(_settings.centerPoint[0],_settings.centerPoint[1]);//链接中心点
			ctx.stroke();//闭合
			ctx.fill();//填充颜色
		}
		
		return canvas.toDataURL("image/png");//将canvas转换为图片地址
	}
};
