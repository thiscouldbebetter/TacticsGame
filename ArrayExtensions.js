 
 
// extensions
 
function ArrayExtensions()
{
	// extension class
}

{
	Array.prototype.addLookups = function(keyName)
	{
		for (var i = 0; i < this.length; i++)
		{
			var item = this[i];
			var key = item[keyName];
			this[key] = item;
		}
 
		return this;
	}
 
	Array.prototype.remove = function(itemToRemove)
	{
		var indexToRemoveAt = this.indexOf(itemToRemove);
		if (indexToRemoveAt != -1)
		{
			this.removeAt(indexToRemoveAt);
		}
	}
 
	Array.prototype.removeAt = function(indexToRemoveAt)
	{
		this.splice
		(
			indexToRemoveAt, 1
		);
	}
}
