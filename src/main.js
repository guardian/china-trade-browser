/// <reference path="../typings/jquery/jquery.d.ts"/>
var getJSON = require('./js/utils/getjson');
var template = require('./html/base.html');
var $ = require('jQuery');
var tradedata = require('./data/unapioutputchina.json');
var partners = require('./data/partnerAreas.json');
var fullstats = require('./data/fullstats.json');
var somecountry, countries, tradeflows, places;
var countrylist = [];
var trade;
var stats;
var latlong = require('./data/countries.json');
var commcode = require('./data/commoditycodes.json');


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
				"dollarvalue" : t.TradeValue,
				"shortdesc" : t.shortdesc,
				"rollup" : t.rollup
							}
			p.trades[j] = tradeitem;
			$('#mainitems').append(item);
			}
			});
			
		stats = getstats(p);
		if (stats !== undefined && p !== undefined) {
		p.gdp = stats.gdp;
		p.chinaexports = stats.chinaexports;
		p.chinaexportsovergdp = stats.chinaexportsovergdp;
		p.averagevariation = stats.averagevariation;
		p.continent = stats.continent;
		
			
		var geo = getgeo(p);
		p.lng = geo.lng;
		
	
		
		}
		});
		console.log(places);
		var	jsonoutput = JSON.stringify(places); 
		console.log(jsonoutput);
	};
	
	
function getgeo(p){
		//console.log(latlong);
		var currentgeo = latlong.filter(function findthisgeo(g) {
			return g.iso3 == p.iso;	
		})
		currentgeo = currentgeo[0];
//		console.log(currentgeo);
		if (currentgeo !== undefined) {
 		return currentgeo;
		}
};
	
function getstats(p) {
	
	var statslist = fullstats.sheets.Exports;
	var	currentplace = statslist.filter(function findthisone(s) {
		return s.iso == p.iso; 		
	})
	currentplace = currentplace[0];
	if (currentplace !== undefined) {
	return currentplace;
	} 
};
	
function getmaintrades(i,place) {
	tradeflows = tradedata.dataset;
	tradeflows = addshortdesc(tradeflows);
	var currentplaceflows = tradeflows.filter(function justcurrentplace(f){
				return f.ptTitle === place.text && f.rgDesc === 'Import';		
	});
	currentplaceflows.sort(function(a,b){
		return b.TradeValue - a.TradeValue;
	});
	currentplaceflows = currentplaceflows.slice(0,5);
	return currentplaceflows;		
	};
	
function addshortdesc(tradeflows) {
	var commcodes = commcode.sheets.commoditycodes;	
	$.each(tradeflows, function plusdeets(i,t) {
		var currentcomm = commcodes.filter(function justthisone(c) {
			return c.code == t.cmdCode;
		});
		currentcomm = currentcomm[0];
		if (currentcomm !== undefined) {
			t.shortdesc = currentcomm.shortdesc;
			t.rollup = currentcomm.rollup;
	//	console.log(t);
		}
		});
	return tradeflows;
};

function boot(el) {
	el.innerHTML = template;
	listmainitems(tradedata,partners);
}

module.exports = { boot: boot };
