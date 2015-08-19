/// <reference path="../typings/jquery/jquery.d.ts"/>
//var getJSON = require('./js/utils/getjson');
var template = require('./html/base.html');
var $ = require('jQuery');
var tradedata = require('./data/unapioutputchina.json');
var partners = require('./data/partnerAreas.json');
var somecountry, countries, tradeflows, places;


function listen (countries){
$('#go').on('click', function() {
	$('#list').html('');
	somecountry	= $('#vox').val();
	console.log(somecountry);
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
	console.log("!",somecountry);
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
	//console.log(places);
	$.each(places, function (i,p) {
		
		var maintrade  = getmaintrade(i,p);
		console.log(maintrade);
		if (maintrade !== undefined ) {
		var item = '<li>' + p.text + " | " + maintrade.pt3ISO + "| " + maintrade.cmdCode + "| " +maintrade.cmdDescE + "| " + " $" + maintrade.TradeValue + '</li>';
		//console.log(item);
		$('#mainitems').append(item);
		} 
	});
	}
	
function getmaintrade(i,place) {
	tradeflows = tradedata.dataset;
	var currentplaceflows = tradeflows.filter(function justcurrentplace(f){
				return f.ptTitle === place.text && f.rgDesc === 'Import';		
	});
	currentplaceflows.sort(function(a,b){
		return b.TradeValue - a.TradeValue;
	});
	return currentplaceflows[0];		
	};

function boot(el) {
	el.innerHTML = template;
	showdata(tradedata);
	listmainitems(tradedata,partners);
}

module.exports = { boot: boot };
