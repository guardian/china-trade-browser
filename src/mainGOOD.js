/// <reference path="../typings/jquery/jquery.d.ts"/>
//var getJSON = require('./js/utils/getjson');
var template = require('./html/base.html');
var $ = require('jQuery');
var tradedata = require('./data/unapioutputchina.json');
var partners = require('./data/partnerAreas.json');
var somecountry, countries, tradeflows, places;
// var country = [];
/*
function Country(name, iso, trades){
	this.name = name;
	this.iso = iso;
	this.trades = trades; 	
};
*/

function listen (countries){
$('#go').on('click', function() {
	$('#list').html('');
	somecountry	= $('#vox').val();
//	console.log(somecountry);
	listcountry(countries,somecountry);
	$('#vox').val = "";
})};

function showdata (data) {
	var countries = data.dataset;
	listen(countries);
};
	
function listcountry(countries,somecountry) {	
	var somecountry = countries.filter(function justsomecountry(d) {
		return d.ptTitle === somecountry && d.rgDesc === 'Import';
	});
//	console.log("!",somecountry);
	somecountry.sort(function(a,b){
		return b.TradeValue - a.TradeValue;
	});
	$.each(somecountry, function (i,c){
		var item = '<li>' + c.cmdDescE + " (" + c.cmdCode + ") " + c.TradeValue + '</li>';
		$('#list').append(item);
	});
};


function listmainitems (tradedata,partners) {
	tradeflows = tradedata.dataset;
	places = partners.results;
//	places = places.slice(0,10); // remember to remove this!
	//console.log(places);
		$.each(places, function (i,p) {		
		var maintrades  = getmaintrades(i,p);
//		console.log(maintrades);
		country[i] = p;
		console.log('hi');
			$.each(maintrades, function (i,t) {
			if (t !== undefined ) {
			var item = '<li>' + p.text + " | " + t.pt3ISO + "| " + t.cmdCode + "| " + t.cmdDescE + "| " + " $" + t.TradeValue + '</li>';
			console.log(item);
//			var jsonitem = {
//				"country" : p.text,
//				"commodity" : t.cmdDescE
//			}
			//console.log(jsonitem);
			$('#mainitems').append(item);
			}
			}); 
		});
	};
	
function getmaintrades(i,place) {
	tradeflows = tradedata.dataset;
	var currentplaceflows = tradeflows.filter(function justcurrentplace(f){
				return f.ptTitle === place.text && f.rgDesc === 'Import';		
	});
	currentplaceflows.sort(function(a,b){
		return b.TradeValue - a.TradeValue;
	});
	currentplaceflows = currentplaceflows.slice(0,5);
	console.log(currentplaceflows);
	return currentplaceflows;		
	};

function boot(el) {
	el.innerHTML = template;
	showdata(tradedata);
	listmainitems(tradedata,partners);
}

module.exports = { boot: boot };
