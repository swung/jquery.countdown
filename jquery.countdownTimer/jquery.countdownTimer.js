(function($){
	var gVars = {};
	
	$.fn.countdown = function(hour,minite,second) {
		var container = this.eq(0);
		if(!container)
		{
			try{
				console.log("Invalid selector!");
			} catch(e){}
			return false;
		}
		gVars['cd_second'] = second;
		gVars['cd_minite'] = minite;
		gVars['cd_hour'] = hour;
		gVars['cd_total'] = hour*60*60+minite*60+second;
		setUp.call(container);
		
		return this;
	}
	
	function setUp()
	{
		var timers=['hour','minite','second']
		var tmp;
		
		for(var i=0;i<3;i++){
			tmp = $('<div>').attr('class', 'orange clock').html(
				'<div class="display"></div>'+
				'<div class="front left"></div>'+
				'<div class="rotate left">'+
					'<div class="bg left"></div>'+
				'</div>'+
				'<div class="rotate right">'+
					'<div class="bg right"></div>'+
				'</div>'
			);

			$(this).append(tmp);
			
			tmp.rotateLeft = tmp.find('.rotate.left');
			tmp.rotateRight = tmp.find('.rotate.right');
			tmp.rotateFront = tmp.find('.clock.front');
			tmp.display = tmp.find('.display');
			
			gVars[timers[i]] = tmp;
		}
		
		initClock();
		
		setInterval(function(){
			countdown();
			animation(gVars.hour, gVars.cd_hour-1, 24);
			animation(gVars.minite, gVars.cd_minite-1, 60);
			animation(gVars.second, gVars.cd_second-1, 60);
		},1000);
	}
	
	function countdown()
	{
		--gVars.cd_total;
		if(gVars.cd_total==0)
			return;

		gVars.cd_hour=gVars.cd_total/3600|0;
		gVars.cd_minite=(gVars.cd_total%3600)/60|0;
		if(gVars.cd_second==0)
		{
			gVars.cd_second=59;
		}else{
			--gVars.cd_second;
		}
	}

	function initClock()
	{
		animation(gVars.hour, gVars.cd_hour-1, 24);
		animation(gVars.minite, gVars.cd_minite-1, 60);
		animation(gVars.second, gVars.cd_second-1, 60);
	}
	
	function animation(clock, current, total)
	{
		var angle = (360/total)*(current+1);
		var element;
		if(current==0)
		{
			// Hiding the right half of the background:
			clock.rotateFront.hide();
			
			// Resetting the rotation of the left part:
			clock.rotateRight.show();
			clock.rotateLeft.show();
			rotateElement(clock.rotateRight,0);
			rotateElement(clock.rotateLeft,0);
		}
		
		if(angle<=180)
		{
			clock.rotateFront.show();
			clock.rotateRight.hide();
			// The left part is rotated, and the right is currently hidden:
			element = clock.rotateLeft;
		}
		else
		{
			clock.rotateFront.hide();
			// The first part of the rotation has completed, so we start rotating the right part:
			clock.rotateRight.show();
			clock.rotateLeft.show();
			
			rotateElement(clock.rotateLeft,180);
			
			element = clock.rotateRight;
			angle = angle-180;
		}

		rotateElement(element,angle);
		
		// Setting the text inside of the display element, inserting a leading zero if needed:
		clock.display.html(current<9?'0'+(current+1):(current+1));	
	}
	
	function rotateElement(element,angle)
	{
		// Rotating the element, depending on the browser:
		var rotate = 'rotate('+angle+'deg)';
		
		if(element.css('MozTransform')!=undefined)
			element.css('MozTransform',rotate);
			
		else if(element.css('WebkitTransform')!=undefined)
			element.css('WebkitTransform',rotate);
	
		// A version for internet explorer using filters, works but is a bit buggy (no surprise here):
		else if(element.css("filter")!=undefined)
		{
			var cos = Math.cos(Math.PI * 2 / 360 * angle);
			var sin = Math.sin(Math.PI * 2 / 360 * angle);
			
			element.css("filter","progid:DXImageTransform.Microsoft.Matrix(M11="+cos+",M12=-"+sin+",M21="+sin+",M22="+cos+",SizingMethod='auto expand',FilterType='nearest neighbor')");
	
			element.css("left",-Math.floor((element.width()-200)/2));
			element.css("top",-Math.floor((element.height()-200)/2));
		}
	
	}
})(jQuery)
