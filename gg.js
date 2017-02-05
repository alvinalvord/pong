var canvas = document.getElementById("lol");
var ctx = canvas.getContext("2d");
var circle = {
	x: window.innerWidth / 2,
	y: window.innerHeight / 2,
	r: 25,
	s: 0,
	e: 2 * Math.PI
};
var box = {
	x: window.innerWidth / 10 - 40,
	y: (window.innerHeight - window.innerHeight / 2) / 2,
	width: 40,
	height: window.innerHeight / 2
};
var box2 = {
	x: window.innerWidth / 10 * 9,
	y: (window.innerHeight - window.innerHeight / 2) / 2,
	width: 40,
	height: window.innerHeight / 2
};
var c = {
	x: 0,
	y: 0
};
var d = {
	x: 0,
	y: 0
};
var d2 = {
	x: 0,
	y: 0
};
var freeTranslation = {
	v: true,
	h: true
}
var speed  = 1;
var mainloop;
var freeloop;
var color = "#000000";
var player1 = 0;
var player2 = 0;
var barspeed = 10;
var invincible = false;
var pauseColor = "#FFFFFF";
var paused = false;
var frozen = {
	speed: 0,
	cx: 0,
	cy: 0,
	dx: 0,
	dy: 0,
	d2x: 0,
	d2y: 0,
	barspeed: 0
};

window.onload = function () {
	document.onkeydown = keyDown;
	document.onkeyup = keyUp;
	opening ();
	loop ();
}

function opening () {
	var a = new Audio ('Ring01.wav');
	//var a = new Audio ('flourish.mp3');
	a.play ();
}

function boop () {
	var a = new Audio ('Windows Exclamation.wav');
    a.play ();
}

function boom () {
	var a = new Audio ('Windows Foreground.wav');
	a.play ();
}

function loop () {
	drawBG (color);
	if (!paused) {
		updateBox ();
		updateBox2 ();
		updateCircle ();
	}
	else {
		drawPaused ();
		drawBox ();
		drawBox2 ();
		drawCircle ();
	}
	mainloop = setTimeout (loop, 1);
}

function keyDown (e) {
	switch (e.keyCode) {
		case 87:
			d.y = -barspeed;
			break;
		case 38:
			d2.y = -barspeed;
			break;
		
		case 65:
			d.x = -barspeed;
			break;
		case 37:
			d2.x = -barspeed;
			break;
			
		case 83:
			d.y = barspeed;
			break;
		case 40:
			d2.y = barspeed;
			break;
		
		case 68:
			d.x = barspeed;
			break;
		case 39:
			d2.x = barspeed;
			break;
	}
}

function keyUp (e) {
	switch (e.keyCode) {
		case 87:
		case 83:
			d.y = 0;
			break;
			
		case 65:
		case 68:
			d.x = 0;
			break;
		
		case 38:
		case 40:
			d2.y = 0;
			break;
			
		case 37:
		case 39:
			d2.x = 0;
			break;
			
		case 80:
			paused = !paused;
			if (paused) {
				pauseColor = randomColor ();
				freeze ();
			}
			else
				unfreeze ();
			break;
	}
}

function freeze () {
	frozen.speed = speed;
	frozen.cx = c.x;
	frozen.cy = c.y;
	frozen.dx = d.x;
	frozen.dy = d.y;
	frozen.d2x = d2.x;
	frozen.d2y = d2.y;
	frozen.barspeed = barspeed;
	
	speed = 0;
	c.x = 0;
	c.y = 0;
	d.x = 0;
	d.y = 0;
	d2.x = 0;
	d2.y = 0;
	barspeed = 0;
}

function unfreeze () {
	speed = frozen.speed;
	c.x = frozen.cx;
	c.y = frozen.cy;
	d.x = frozen.dx;
	d.y = frozen.dy;
	d2.x = frozen.d2x;
	d2.y = frozen.d2y;
	barspeed = frozen.barspeed;
}

function freeMove () {
	if (freeTranslation.v)
		c.y = speed;
	else
		c.y = -speed;

	if (freeTranslation.h)
		c.x = speed;
	else
		c.x = -speed;
}

function randomColor () {
	var hex = '0123456789ABCDEF';
	var temp = '#';
	for (var i = 0; i < 6; i++) 
		temp += hex[Math.floor(Math.random () * 16)];
	return temp;
}

function gameReset () {
	boom ();
	box.x = window.innerWidth / 10 - 40;
	box.y = (window.innerHeight - window.innerHeight / 2) / 2;
	box.height = window.innerHeight / 2;
	
	box2.x = window.innerWidth / 10 * 9;
	box2.y = (window.innerHeight - window.innerHeight / 2) / 2;
	box2.height = window.innerHeight / 2;
	
	speed = 1;
}

function increaseDifficulty () {
	boop ();
	color = randomColor ();
	if (speed < 15)
		speed += 0.125;
	if (box.height > 8 * circle.r) {
		box.y += 4;
		box.height -= 8;
		box2.y += 4;
		box2.height -= 8;
	}
}

function checkCollisionBox () {
	if (circle.x + circle.r >= box.x &&
		circle.x - circle.r <= box.x + box.width &&
		circle.y + circle.r >= box.y &&
		circle.y - circle.r <= box.y + box.height) {
			if (circle.x >= box.x + box.width ||
				circle.x <= box.x) {
					if (circle.x >= box.x + box.width) {
						freeTranslation.h = true;
						circle.x = box.x + box.width + circle.r + barspeed;
					}
					else {
						freeTranslation.h = false;
						circle.x = box.x - circle.r - barspeed;
					}
				}
			else if (circle.y >= box.y + box.height ||
				circle.y <= box.y) {					
					if (circle.y >= box.y + box.height) {
						freeTranslation.v = true;
						circle.y = box.y + box.height + circle.r + barspeed;
					}
					else {
						freeTranslation.v = false;
						circle.y = box.y - circle.r - barspeed;
					}
				}
			
			increaseDifficulty ();
		}

	if (circle.x + circle.r >= box2.x &&
		circle.x - circle.r <= box2.x + box2.width &&
		circle.y + circle.r >= box2.y &&
		circle.y - circle.r <= box2.y + box2.height) {
			if (circle.x >= box2.x + box2.width ||
				circle.x <= box2.x) {
					if (circle.x >= box2.x + box2.width) {
						freeTranslation.h = true;
						circle.x = box2.x + box2.width + circle.r + barspeed;
					}
					else {
						freeTranslation.h = false;
						circle.x = box2.x - circle.r - barspeed;
					}
				}
			else if (circle.y >= box2.y + box2.height ||
				circle.y <= box2.y) {
					if (circle.y >= box2.y + box2.height) {
						freeTranslation.v = true;
						circle.y = box2.y + box2.height + circle.r + barspeed;
					}
					else {
						freeTranslation.v = false;
						circle.y = box2.y - circle.r - barspeed;
					}
				}
			
			increaseDifficulty ();
		}
}

function invincibility () {
	invincible = false;
}

function updateCircle () {
	freeMove ();
	
	if (circle.x + c.x < circle.r) {
		freeTranslation.h = true;
		circle.x = circle.r;
		player2 ++;
		gameReset ();
		invincible = true;
		setTimeout (invincibility, 3000);
	}
	else if (circle.x + c.x > canvas.width - circle.r) {
		freeTranslation.h = false;
		circle.x = canvas.width - circle.r;
		player1 ++;
		gameReset ();
		invincible = true;
		setTimeout (invincibility, 3000);
	}
	else
		circle.x += c.x;
	
	if (circle.y + c.y < circle.r) {
		freeTranslation.v = true;
		circle.y = circle.r;
	}
	else if (circle.y + c.y > canvas.height - circle.r) {
		freeTranslation.v = false;
		circle.y = canvas.height - circle.r;
	}
	else 
		circle.y += c.y;
	
	if (!invincible)
		checkCollisionBox ();
	
	drawCircle ();
}

function updateBox () {
	if (box.x + d.x < window.innerWidth / 10 - box.width) 
		box.x = window.innerWidth / 10 - box.width;
	else if (box.x + d.x > window.innerWidth / 4 + window.innerWidth / 5 - box.width)
		box.x = window.innerWidth / 4 + window.innerWidth / 5 - box.width;
	else
		box.x += d.x;
	
	if (box.y + d.y < 0)
		box.y = 0;
	else if (box.y + d.y > canvas.height - box.height)
		box.y = canvas.height - box.height;
	else
		box.y += d.y;
	
	drawBox ();
}

function updateBox2 () {
	if (box2.x + d2.x < window.innerWidth / 4 * 3 - window.innerWidth / 5) 
		box2.x = window.innerWidth / 4 * 3 - window.innerWidth / 5;
	else if (box2.x + d2.x > window.innerWidth / 10 * 9)
		box2.x = window.innerWidth / 10 * 9;
	else
		box2.x += d2.x;
	
	if (box2.y + d2.y < 0)
		box2.y = 0;
	else if (box2.y + d2.y > canvas.height - box2.height)
		box2.y = canvas.height - box2.height;
	else
		box2.y += d2.y;
	
	drawBox2 ();
}

function drawPaused () {
	ctx.beginPath ();
	ctx.font = "100px Comic Sans MS";
	ctx.fillStyle = pauseColor;
	var temp = "GAME PAUSED";
	ctx.fillText (temp, window.innerWidth / 2 - ctx.measureText (temp).width / 2, window.innerHeight / 2);
}

function drawCircle () {
	ctx.beginPath ();
	ctx.lineWidth = "4";
	ctx.strokeStyle = "#ffffff";
	ctx.arc (circle.x, circle.y, circle.r, circle.s, circle.e);
	ctx.stroke ();
	if (invincible)
		ctx.fillStyle = randomColor ();
	else
		ctx.fillStyle = "#0000FF";
	ctx.fill ();
}

function drawBox () {
	ctx.beginPath ();
	ctx.lineWidth = "6";
	ctx.strokeStyle = "#000000";
	ctx.rect (box.x, box.y, box.width, box.height);
	ctx.stroke ();
	ctx.fillStyle = "#00ff00";
	ctx.fillRect (box.x, box.y, box.width, box.height);
}

function drawBox2 () {
	ctx.beginPath ();
	ctx.lineWidth = "6";
	ctx.strokeStyle = "#000000";
	ctx.rect (box2.x, box2.y, box2.width, box2.height);
	ctx.stroke ();
	ctx.fillStyle = "#ff0000";
	ctx.fillRect (box2.x, box2.y, box2.width, box2.height);
}

function drawBG (param) {
	ctx.canvas.width = window.innerWidth ;
	ctx.canvas.height = window.innerHeight;
	ctx.fillStyle = param;
	ctx.fillRect (0,0,canvas.width, canvas.height);
	
	ctx.beginPath ();
	ctx.moveTo (window.innerWidth / 2, 0);
	ctx.lineWidth = "10";
	ctx.strokeStyle = "#FFFFFF";
	ctx.lineTo (window.innerWidth / 2, window.innerHeight);
	ctx.stroke ();
	
	ctx.beginPath ();
	ctx.font = "100px Comic Sans MS";
	ctx.strokeStyle = "#000000";
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText (player1, window.innerWidth / 10 * 4, 125);
	ctx.stroke ();
	
	ctx.beginPath ();
	ctx.font = "100px Comic Sans MS";
	ctx.strokeStyle = "#000000";
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText (player2, window.innerWidth / 10 * 6 - ctx.measureText(player2).width, 125);
	ctx.stroke ();
}