
// Fake classes, to prevent need for including everything from Framework.

class EntityBuilder
{}

class IDHelper
{
	static Instance(): IDHelper { return null; }
}

class RandomizerSystem
{}

class URLParser
{
	static fromWindow()
	{
		return { "queryStringParameters": {} };
	}
}
