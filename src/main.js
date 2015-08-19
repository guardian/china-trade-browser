/// <reference path="../typings/jquery/jquery.d.ts"/>
//var getJSON = require('./js/utils/getjson');
var template = require('./html/base.html');
var $ = require('jQuery');
var tradedata = require('./data/unapioutputchina.json');
var partners = require('./data/partnerAreas.json');
var somecountry, countries, tradeflows, places;
var countrylist = [];
var trade;

function  Country (wtoid, name, iso, trades){
	this.wtoid = wtoid;
	this.name = name;
	this.iso = iso;
	this.trades = trades; 	
};

function listmainitems (tradedata,partners) {
	tradeflows = tradedata.dataset;
	places = partners.results;
		$.each(places, function (i,p) {	
			p.trades = {};	
		var maintrades  = getmaintrades(i,p);
			$.each(maintrades, function (j,t) {
			if (t !== undefined ) {
				p.iso = t.pt3ISO;
			var item = '<li>' + p.text + " | " + t.pt3ISO + "| " + t.cmdCode + "| " + t.cmdDescE + "| " + " $" + t.TradeValue + '</li>';
			var tradeitem = {
				"commodity" : t.cmdDescE,
				"commoditycode" : t.cmdCode,
				"rank" : j + 1,
				"dollarvalue" : t.TradeValue
							}
			p.trades[j] = tradeitem;
			$('#mainitems').append(item);
			}
			}); 
		});
		var	jsonoutput = JSON.stringify(places); 
		console.log(jsonoutput);
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
	return currentplaceflows;		
	};

function boot(el) {
	el.innerHTML = template;
	listmainitems(tradedata,partners);
}

module.exports = { boot: boot };
