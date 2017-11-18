(function($){
	var __validate = $.fn.validate;
	$.fn.guyuvalidate = function(opts) {
		var __rules = $.extend({
			userName:"required",
			password:"required",
			checkCode:"required",
			name:"required",
			confirmPwd:{
				equalTo:"#password"
			},
			email:"email",
			title:"required",
			cid:{
				min:1
			},
			newName:"required"
		},opts?(opts.rules||{}):{});
		var __messages = $.extend({
			userName:"账号不能为空",
			password:"用户密码不能为空",
			checkCode:"验证码不能为空",
			confirmPwd:"两次输入的密码不正确",
			email:"邮件格式不正确",
			name:"名称不能为空",
			cid:"文章必须选择所属栏目",
			title:"文章的标题必须输入",
			newName:"首页图片必须上传"
		},opts?(opts.messages||{}):{});
		var __defaultOpts = $.extend(opts||{},{
			rules:__rules,
			messages:__messages,
			errorElement: opts?(opts.errorElement||"span"):"span",
			errorClass:opts?(opts.errorClass||"errorContainer"):"errorContainer"
		});
		$.extend($.fn.validate.prototype,__defaultOpts);
		__validate.call(this,__defaultOpts);
		return this;
	}
})(jQuery);

//邮编验证
 jQuery.validator.addMethod("isZipCode", function(value, element) {   
	var tel = /^[0-9]{6}$/;
	return this.optional(element) || (tel.test(value));
}, "请正确填写您的邮政编码，如364101");
	  
//验证电话
 jQuery.validator.addMethod("isMobile", function(value, element) {  
  	var length = value.length;   
    var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/; 
    return this.optional(element) || (length == 11 && mobile.test(value));
}, "请正确填写您的手机号码");	
      
jQuery.validator.addMethod("isPhone", function(value,element) {   
    var length = value.length;   
    var mobile = /^1\d{10}$/;   
    var tel =/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;   
    return this.optional(element) || (tel.test(value) || mobile.test(value));   
 
}, "输入电话或手机号");    

//传真验证
jQuery.validator.addMethod("isFax",function(value,element){
    var fax = /^(\d{3,4})?[-]?\d{7,8}$/;
    return this.optional(element) || (fax.test(value));
},"请正确填写传真号");

 //三位数字验证
jQuery.validator.addMethod("isThreeNo",function(value,element){
    var fax = /^\d{3}$/;
    return this.optional(element) || (fax.test(value));
},"请正确填写3位数字");

   // 判断数值类型，包括整数和浮点数
    jQuery.validator.addMethod("isNumber", function(value, element) {       
         return this.optional(element) || /^[-\+]?\d+$/.test(value) || /^[-\+]?\d+(\.\d+)?$/.test(value);       
    }, "请输入数字"); 
    
  // 判断浮点型  
    jQuery.validator.addMethod("isFloat", function(value, element) {       
         return this.optional(element) || /^[-\+]?\d+(\.\d+)?$/.test(value);       
    }, "只能包含数字、小数点等字符");

  // 身份证号码验证
    jQuery.validator.addMethod("isIdCardNo", function(value, element) { 
      var idCardNo= /^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/;   
      return this.optional(element) || idCardNo.test(value);    
    }, "请输入正确的身份证号码格式，如350822 XXXXXXXX XXXX"); 

   // 只能包含中文字符
	jQuery.validator.addMethod("isChinese", function(value, element) {       
         return this.optional(element) || /^[\u0391-\uFFE5]+$/.test(value);       
    }, "请输入中文"); 

    // 匹配qq验证           
    jQuery.validator.addMethod("qq", function(value, element) {
    var tel = /^[1-9]\d{4,9}$/;
    return this.optional(element) || (tel.test(value));
}, "qq号码格式错误");

    // IP地址验证   
    jQuery.validator.addMethod("ip", function(value, element) {    
      return this.optional(element) || /^(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.)(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.){2}([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))$/.test(value);    
    }, "请填写正确的IP地址。");
    
    // 年龄验证   
    jQuery.validator.addMethod("isAge", function(value, element) {    
      var isAge= /^([1-9]\d?|200)$/;
      return this.optional(element) || isAge.test(value);
    }, "年龄应在1到200之间");
    
    // 正整数验证   
    jQuery.validator.addMethod("isPositiveInteger", function(value, element) {    
      var isPositiveInteger= /^([0-9]*[1-9][0-9]*)$/;
      return this.optional(element) || isPositiveInteger.test(value);
    }, "请输入正整数");
	// 正整数验证   
    jQuery.validator.addMethod("isPassword", function(value, element) {    
      var isPassword= /^([0-9 | A-Z | a-z | _ ]{6,16})$/;
      return this.optional(element) || isPassword.test(value);
    }, "请输入6到16位密码,密码只能由字母数字及下划线组成");
    // 正数验证  
    jQuery.validator.addMethod("isRightInteger", function(value, element) {    
      var isRightInteger= /^(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
      return this.optional(element) || isRightInteger.test(value);
    }, "请输入正数");
    //整数验证
    jQuery.validator.addMethod("isInteger", function(value, element) {    
      var isInteger= /^-?[0-9]\d*$/;
      return this.optional(element) || isInteger.test(value);
    }, "请输入整数");
    //合法的url
    jQuery.validator.addMethod("isURL", function(value, element) {    
      var isURL= /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
      return this.optional(element) || isURL.test(value);
    }, "请输入正确的url");
    //时间起止验证 
    jQuery.validator.methods.compareDate = function(value, element, param) {                        
            var startDate = jQuery(param).val();
            
            var date1 = new Date(Date.parse(startDate.replace("-", "/")));
            var date2 = new Date(Date.parse(value.replace("-", "/")));
            return date1 < date2;
        };
