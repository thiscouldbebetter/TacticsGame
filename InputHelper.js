 
function InputHelper()
{
	// do nothing
}

{
	InputHelper.prototype.initialize = function()
	{
		this.isMouseClicked = false;
		this.mousePos = new Coords();
 
		document.onkeydown = this.handleEventKeyDown.bind(this);
		document.onkeyup = this.handleEventKeyUp.bind(this);
 
		var canvas = Globals.Instance.display.canvas;
		canvas.onmousedown = this.handleEventMouseDown.bind(this);
		canvas.onmouseup = this.handleEventMouseUp.bind(this);
	}
 
	// events
 
	InputHelper.prototype.handleEventKeyDown = function(event)
	{
		this.keyCodePressed = String.fromCharCode(event.keyCode);
		Globals.Instance.update();
	}
 
	InputHelper.prototype.handleEventKeyUp = function(event)
	{
		this.keyCodePressed = null;
	}
 
	InputHelper.prototype.handleEventMouseDown = function(event)
	{
		this.isMouseClicked = true;
		this.mousePos.overwriteWithXY
		(
			event.offsetX,
			event.offsetY
		);
		Globals.Instance.update();
	}
 
	InputHelper.prototype.handleEventMouseUp = function(event)
	{
		this.isMouseClicked = false;
	}
}
