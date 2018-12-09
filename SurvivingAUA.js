		   
		let loaded = false;
		
		function gameStart(){
			document.getElementById("load").innerHTML="";
			document.getElementById("startButton").innerHTML = "START";
			loaded = true;
		}
		
		(function(){
			
			let w = window.innerWidth || 360;
			let h = window.innerHeight || 560;
		
			if(h > w){		
				let nh = h;		
				h = w;		
				w = nh;		
				document.getElementById("mainF").style.transform = "translateX("+(h)+"px) rotate(90deg)";		
			}
			document.getElementById("mainF").style.width = w+"px";		
			document.getElementById("mainF").style.height = h+"px";		
			// RWTL
			document.getElementById("AUA").style.height = h*.3+"px";	
			document.getElementById("AUA").style.width = w+"px";		
			
			let c = document.getElementById("gameCanvas");		
			c.height = h;			
			c.width = w;			
			
			let ctx = c.getContext("2d");
		
		function loadGame(){
			
			let roadWidth = 5*w/36;		
			let roadTop = h-h*0.7;
			let roadLeft = (w-roadWidth)/2;
			let roadConstant = roadLeft/(h-roadTop);
			let score = 0;										
			let scoreC = document.getElementById("score");		
			function updateScore(ds){						
				score+=ds;
				scoreC.textContent = score;		
			}
			updateScore(0);		 
			
			let rso = [];
			let ratio = 0.8;
			let totalRso = 20;
			let maxHF = h*(1-ratio)/(2.25*(1-Math.pow(ratio,totalRso)));
			let maxH = maxHF;
			let totalHeight = 0.7*h;		
			let minWidth = 1;
			let maxWidth = 26;
			let dif = maxWidth - minWidth;
			let changedHeight = totalHeight-maxH*ratio;
			let cnst1 = Math.pow(ratio,totalRso)/(1-ratio);
			let stp = h-totalHeight;
			let tMaxH = h*20/36;
			let treeCnst = tMaxH/roadLeft;
			
			let gameDifficulty = 100;
			
			
			
			function BuildTrees(src,src2,start,left){		
				this.src = treeSrc[src];		
				this.src2 = treeSrc[src2];
				this.y = start;		
				this.x = 0;
				this.h = 0;
				this.w = 0;
				this.dy = 0.01;		
				this.r = 1.009;		
				this.left = left;
			}
			
			BuildTrees.prototype.draw = function(){ 		
				this.y += this.dy;			
				this.dy *= this.r;			
				this.x = (h-this.y)*roadConstant - this.w - this.w*this.left;			
				this.h = (roadLeft-this.x-this.w*this.left)*treeCnst;
				this.w = this.h*2/3;		
				
				ctx.drawImage(this.src,this.x,this.y-this.h,this.w,this.h);		
				ctx.drawImage(this.src2,w-this.x-this.w,this.y-this.h,this.w,this.h);
			
				if(this.y >= h){
					this.y = stp;		
					this.h = 0;
					this.w = 0;
					this.left = Math.random()*3;		
					this.dy = 0.5;
				}
			}
			
			function getById(x){		
				return document.getElementById(x);
			}
			let treeSrc = [getById("pinkTree"),getById("blueTree"),getById("redTree"),getById("purpleTree")]; 		
			
			let trees = [];		
			for(let n = 0; n < ((h*0.7)/50-2); n++){		
				trees.push(new BuildTrees(Math.floor(Math.random()*4),Math.floor(Math.random()*4),stp+n*50,2));
			}
			
			
			let failWCnst = roadLeft*2/totalHeight;		
			let failW = (w > 560) ? 150 : 120;
			let failH = failW*2/3;
			
			function buildTrees(src,start,lane){		
				this.src = failSrc[src];
				this.y = start;
				this.x = 0;
				this.h = 0;
				this.w = 0;
				this.dy = 0.5;
				this.lane = lane;
			}
			
			buildTrees.prototype.draw = function(){		
				this.dy *= 1.01;
				this.y += this.dy;
				this.x = (failWCnst/2)*(h-this.y)+(w-(failWCnst*(h-this.y)))*this.lane/8;
				this.w = failW-failW*failWCnst*(h-this.y)/w;
				this.h = 1.7*this.w/3;
				
				ctx.drawImage(this.src,this.x,this.y-this.h,this.w,this.h);			
				if(this.y >= h-20){
					if(Math.abs(this.x-cx) <= failH && Math.abs(this.y-h+failH) <= failH){
						clearInterval(intv);
						setTimeout(function(){
							document.getElementById("mainF").style.display = "none";		
							document.getElementById("startPage").style.display = "block"; 	
						},1000);
					}
				}
				if(this.y >= h+100){			
					this.y = stp;
					this.h = 0;
					this.w = 0;
					this.left = Math.random()*3;
					this.dy = 0.5;
					this.lane = 1+Math.random()*5;
				}
			}
			
			let failSrc = [getById("fail"),getById("fail"),getById("fail")];		
			
			let fails = [];		
			for(let n = 0; n < ((h*0.7+100)/gameDifficulty); n++){		
				fails.push(new buildTrees(Math.floor(Math.random()*3),stp+n*gameDifficulty,1));
			}
			
			
			let aplusW = (w > 560) ? 100 : 60;	
			function buildAPluses(start,lane){
				this.src = aPlusSrc;
				this.y = start;
				this.x = 0;
				this.h = 0;
				this.w = 0;
				this.dy = 0.5;
				this.lane = lane;
			}
			
			buildAPluses.prototype.draw = function(){		
				this.dy *= 1.01;
				this.y += this.dy;
				this.x = (failWCnst/2)*(h-this.y)+(w-(failWCnst*(h-this.y)))*this.lane/8;
				this.w = aplusW-aplusW*failWCnst*(h-this.y)/w;
				this.h = this.w;
				
				ctx.drawImage(this.src,this.x,this.y-this.h,this.w,this.h);
				if(this.y >= h-20){
					if(Math.abs(this.x-cx) <= aplusW && Math.abs(this.y-h+aplusW) <= aplusW){
						this.y = stp;
						this.h = 0;
						this.w = 0;
						this.left = Math.random()*3;
						this.dy = 0.5;
						this.lane = Math.floor(1+Math.random()*5);
						updateScore(1);			
					}
				}
				if(this.y >= h+100){
					this.y = stp;
					this.h = 0;
					this.w = 0;
					this.left = Math.random()*3;
					this.dy = 0.5;
					this.lane = Math.floor(1+Math.random()*5);
				}
			}
			
			let aPlusSrc = getById("aPlusimage");		
			
			let aPluses = [];		
			for(let n = 0; n < ((h*0.7+100)/(gameDifficulty-50)); n++){		
				aPluses.push(new buildAPluses(stp+n*(gameDifficulty-50),6));
			}
			
			
			
			function rectPoints(n,ho){
				n = totalRso-n-1;
				let y1 = stp+maxH*cnst1*(Math.pow(1/ratio,n)-1);
				let x1 = roadLeft-roadConstant*(y1-stp);
				let y2 = y1;
				let x2 = x1 + minWidth+(y1-stp)*dif/totalHeight;
				let y3 = y1 + maxH*cnst1*(Math.pow(1/ratio,n+1)-1);
				let x3 = roadLeft-roadConstant*(y3-stp);
				let y4 = y3;
				let x4 = x3 + minWidth+(y3-stp)*dif/totalHeight;
				
				return [x1,y1,x2,y2,x4,y4,x3,y3];
			}
			
			
			for(let n = 0; n < totalRso; n++){
				rso.push(rectPoints(n,h));
				rso[n][8] = "black";
			}
			
			function draw(){		
				ctx.beginPath();
				ctx.moveTo((w-roadWidth)/2,stp);
				ctx.lineTo((w-roadWidth)/2+roadWidth,stp);
				ctx.lineTo(w,h);
				ctx.lineTo(0,h);
				ctx.fillStyle="#696969";
				ctx.fill();
				ctx.closePath();

				}
			
			let cx = (w-failW)/2;
			let cl = false, cr = false;
			let emoji = getById("char");
			let ms = 3*w/560;
			function drawEmoji(){ 			
				if(cl) if(cx+failW+50 < w) cx+=ms;
				if(cr) if(cx-50 > 0) cx-=ms;
				ctx.drawImage(emoji,cx,h-failH,failW,failH);
			}
			
			
			let m = 0;
			let intv = setInterval(function(){
				try{
				ctx.clearRect(0,0,w,h);
				maxH+=0.5;
				changedHeight = maxH*cnst1*(Math.pow(1/ratio,totalRso-1)-1);
				if(changedHeight >= totalHeight){
					maxH = maxHF;
					m++;
				}
				for(let n = 0; n < totalRso; n++){
					rso[n]=rectPoints(n,h-totalHeight+changedHeight);
					if(m%2==0) rso[n][8] = "black";
					else rso[n][8] = "black";
				}
				draw();				
				for(let n = 0; n < trees.length; n++){
					trees[n].draw();
				}
				
				for(let n = 0; n < aPluses.length; n++){
					aPluses[n].draw();
				}
				
				for(let n = 0; n < fails.length; n++){
					fails[n].draw();
				}
				
				
				drawEmoji();		
				}catch(err){
					
				}
				
			},10)
			
			
			function getKey(e){			
				e.preventDefault();
				let ty = e.keyCode;
				if(ty===39){
					cr = false;
					cl = true;
				}
				else if(ty===37){
					cl = false;
					cr = true;
				}
			}
			function getKeyEnd(e){
				let ty = e.keyCode;
				if(ty === 39) cl = false;
				else if(ty === 37) cr = false;
			}
			
			document.body.removeEventListener("keydown",getKey);
			document.body.removeEventListener("keyup",getKeyEnd);
			document.body.addEventListener("keydown",getKey);
			document.body.addEventListener("keyup",getKeyEnd);
		}
		ld = function(){
			if(loaded){
				document.getElementById("startPage").style.display = "none";
				document.getElementById("mainF").style.display = "block";
				loadGame();
			}
		}
		})();
		
		