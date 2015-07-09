Targets:
	1. Use React.
	2. make isomorphic.
	3 Use latest ES features both on the server and client.
	4. If it's posible - try Relay and GraphQL.

Unit tests notes:
	1 See root package.json file for apropriate command to launch frontend/server Unit testing.
	2 To add code coverage message to tests output add "-R travis-cov" to each command, like following (package.json):
		./node_modules/.bin/mocha --compilers js:babel/register --recursive --require blanket -R travis-cov ./frontend/test/**/test*.js
	3 You can configure minimal allowable coverage value to enforce developers to write enough of tests. Do it by tweaking "config.travis-cov.threshold" values in the end of package.json file. Value specified in percentage.