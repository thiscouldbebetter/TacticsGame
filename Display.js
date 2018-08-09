 
function Display(viewSize)
{
	this.viewSize = viewSize;
 
	this.fontHeight = 10;
	this.colorBack = "White";
	this.colorFore = "LightGray";
	this.colorHighlight = "Gray";
 
	// temporary variables
 
	this._drawPos = new Coords();
	this._drawPos2 = new Coords();
	this._mapCellPos = new Coords();
	this._zeroes = new Coords(0, 0);
}

{
	Display.prototype.clear = function()
	{
		this.drawRectangle
		(
			this._zeroes,
			this.viewSize,
			this.colorFore, // border
			this.colorBack // fill
		);
	}
 
	Display.prototype.drawCircle = function
	(
		center, radius, colorBorder, colorFill
	)
	{
		this.graphics.beginPath();
		this.graphics.arc
		(
			center.x, center.y,
			radius,
			0, Math.PI * 2  
		);
 
		this.graphics.fillStyle = colorFill;
		this.graphics.fill();
 
		this.graphics.strokeStyle = colorBorder;
		this.graphics.stroke();
	}
 
	Display.prototype.drawLine = function
	(
		posFrom, posTo, color
	)
	{
		this.graphics.beginPath();
		this.graphics.moveTo(posFrom.x, posFrom.y);
		this.graphics.lineTo(posTo.x, posTo.y);
		this.graphics.strokeStyle = color;
		this.graphics.stroke();
	}
	
	Display.prototype.drawRectangle = function
	(
		pos, size, colorBorder, colorFill
	)
	{
		this.graphics.fillStyle = colorFill;
		this.graphics.fillRect
		(
			pos.x, pos.y, size.x, size.y
		);
 
		this.graphics.strokeStyle = colorBorder;
		this.graphics.strokeRect
		(
			pos.x, pos.y, size.x, size.y
		);
	}
 
	Display.prototype.drawTextAtPos = function(text, pos, color)
	{
		if (color == null)
		{
			color = this.colorFore;
		}
 
		this.graphics.fillStyle = color;
		this.graphics.fillText
		(
			text,
			pos.x, 
			pos.y + this.fontHeight
		);
	}
 
	Display.prototype.initialize = function()
	{
		this.canvas = document.createElement("canvas");
		this.canvas.width = this.viewSize.x;
		this.canvas.height = this.viewSize.y;
	 
		var divMain = document.getElementById("divMain");
		divMain.appendChild(this.canvas);
 
		this.graphics = this.canvas.getContext("2d");
		this.graphics.font = "" + this.fontHeight + "px sans-serif";
	}
}
