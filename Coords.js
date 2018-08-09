 
function Coords(x, y)
{
	this.x = x;
	this.y = y;
}

{
	Coords.prototype.add = function(other)
	{
		this.x += other.x;
		this.y += other.y;
		return this;
	}
 
	Coords.prototype.clone = function()
	{
		return new Coords(this.x, this.y);
	}
 
	Coords.prototype.divide = function(other)
	{
		this.x /= other.x;
		this.y /= other.y;
		return this;
	}
 
	Coords.prototype.divideScalar = function(scalar)
	{
		this.x /= scalar;
		this.y /= scalar;
		return this;
	}
 
	Coords.prototype.equals = function(other)
	{
		var returnValue = 
		(
			this.x == other.x
			&& this.y == other.y
		);
 
		return returnValue;
	}
 
	Coords.prototype.isInRangeMax = function(rangeMax)
	{
		var returnValue = 
		(
			this.x >= 0
			&& this.x <= rangeMax.x
			&& this.y >= 0
			&& this.y <= rangeMax.y
		);
 
		return returnValue;
	}
	
	Coords.prototype.magnitude = function()
	{
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
 
	Coords.prototype.multiply = function(other)
	{
		this.x *= other.x;
		this.y *= other.y;
		return this;
	}
 
	Coords.prototype.multiplyScalar = function(scalar)
	{
		this.x *= scalar;
		this.y *= scalar;
		return this;
	}
 
	Coords.prototype.overwriteWith = function(other)
	{
		this.x = other.x;
		this.y = other.y;
		return this;
	}
 
	Coords.prototype.overwriteWithXY = function(x, y)
	{
		this.x = x;
		this.y = y;
		return this;
	}
 
	Coords.prototype.subtract = function(other)
	{
		this.x -= other.x;
		this.y -= other.y;
		return this;
	}
 
	Coords.prototype.trimToRangeMax = function(rangeMax)
	{
		if (this.x < 0)
		{
			this.x = 0;
		}
		else if (this.x > rangeMax.x)
		{
			this.x = rangeMax.x;
		}
 
		if (this.y < 0)
		{
			this.y = 0;
		}
		else if (this.y > rangeMax.y)
		{
			this.y = rangeMax.y;
		}
 
		return this;
	}
}
