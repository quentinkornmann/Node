/*
 * [1]
 */

for (var i = 0; i < 10; ++i) {
	{
		var j = 1;
	}
}

console.log("[1.1]", i, j); 

function f(i) {
	var j = i;

	console.log("[1.2]", i, j);
}

f(2);

console.log("[1.3]", i, j);

i = j;

console.log("[1.3]", i === j);
console.log("[1.4]", (++i) === (j++));
console.log("[1.5]", (++i) === (j+=1));
console.log("[1.6]", (i++) === (j+=1));

console.log("[1.7]", 1 == 1);
console.log("[1.8]", 1 === 1);
console.log("[1.9]", "1" === 1);
console.log("[1.10]", "1" == 1);
console.log("[1.11]", "1" === String("1"));
console.log("[1.12]", "1" == String("1"));
console.log("[1.13]", 1 === String("1"));
console.log("[1.14]", 1 == String("1"));
console.log("[1.15]", String("1") === String("1"));
console.log("[1.16]", String("1") == String("1"));
console.log("[1.17]", new String("1") === new String("1"));
console.log("[1.18]", new String("1") == new String("1"));

/*
 * [2]
 */

var a = "1";

a.b = 2;

console.log("[2.1]", a, a.toString(), a.valueOf());
console.log("[2.2]", a.b);

a = new String("1");
a.b = 2;

console.log("[2.3]", a, a.toString(), a.valueOf());
console.log("[2.4]", a.b);

a = [];

console.log("[2.5]", a);

a.push("a");
a.push("b");

console.log("[2.6]", a);
console.log("[2.7]", a[0], a["0"]);

for (i in a) {
	console.log("[2.8]", i, a[i]);
}

a.forEach(function (x) {
	console.log("[2.9]", x);
});

a.forEach(function (x, i) {
	console.log("[2.10]", x, i);
});

a = {};

console.log("[2.11]", a);

a[0] = "a";
a["a"] = "b";

console.log("[2.12]", a[0], a["a"], a.a);

for (i in a) {
	console.log("[2.13]", i, a[i]);
}

/*
 * [3]
 */

function square(x) {
	return x * x;
}

function Vector(x, y) {
	this.x = x;
	this.y = y;
	this.norm = function () {
		return Math.sqrt(square(x) + square(y));
	};
	this.plus = function (v) {
		return new Vector(this.x + v.x, this.y + v.y);
	};
	this.toString = function () {
		return "(" + this.x + " " + this.y + ")";
	};
	this.equals = function (v) {
		return typeof this === typeof v
			&& this.x === v.x && this.y === v.y;
	};
}

var v1 = new Vector(1, 2);
var v2 = new Vector(2, 4);

console.log("[3.1]", Vector(1, 2));
console.log("[3.2]", v1);
console.log("[3.3]", v1.toString());
console.log("[3.4]", JSON.stringify(v1));
console.log("[3.5]", v1 === v1);
console.log("[3.6]", v1.equals(v1));
console.log("[3.7]", v1 === v2);
console.log("[3.8]", v1.equals(v2));
console.log("[3.9]", v1.plus(v1).toString());
console.log("[3.10]", v1.plus(v1) === v2);
console.log("[3.11]", v1.plus(v1) == v2);
console.log("[3.12]", v1.plus(v1).equals(v2));
console.log("[3.13]", JSON.parse(JSON.stringify(v1)) === v1);
