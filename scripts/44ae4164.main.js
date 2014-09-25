"use strict";function errorMessage(a,b){return function(c){var d=(a?a:"")+(c&&a?" - ":"")+(c?"cause:"+c:"");if("console"===b)console.error(d);else if("info"===b)console.info(d);else if("alert"===b)alert(d);else if("exception"===b)throw d}}function rejectDeferred(a,b,c){if(c=c||"console",_.isString(a))throw"Bad rejectDeferred parameter (missing deferred) !";return function(d){errorMessage(b,c)(d),a.reject(b)}}function resolvedDefer(a){var b=angular.element($(document.body)).injector().get("$q"),c=b.defer();return c.resolve(a),c}var bdxioModule=angular.module("bdxioModule",["ngRoute","ngAnimate","bdxioControllers"]);bdxioModule.config(["$routeProvider","$locationProvider",function(a,b){a.when("/home",{templateUrl:"templates/pages/c9045eba.home.html",controller:"HomeController"}).when("/partners",{templateUrl:"templates/pages/c193c13e.partners.html",controller:"PartnersController"}).when("/people",{templateUrl:"templates/pages/cf1250d8.people.html",controller:"PeopleController"}).otherwise({redirectTo:"/home"}),b.hashPrefix("!")}]),bdxioModule.run(["$rootScope","$location","$anchorScroll","$timeout","$q","SharedData",function(a,b,c,d,e,f){a.goto=function(a,e){a!==b.path()&&ga("send","screenview",{screenName:a}),b.path(a),e?(b.hash(e),c(),d(function(){var a=$("body").css("padding-top");scrollBy(0,-parseInt(a,10))},100)):b.hash("")},a.genMailTo=function(a){return"mailto:"+a+"@bdx.io"},f.init({offline:b.search().offline===!0})}]),angular.module("bdxioModule").factory("SpreadsheetReader",["$q",function(a){var b={read:function(b,c){var d=a.defer(),e=(b.feed.title.$t,_.map(b.feed.entry,function(a){var b=/([A-Z]+)([0-9]+)/g.exec(a.title.$t);return{v:a.content.$t,r:Number(b[2]),c:b[1]}})),f=_(e).filter(function(a){return a.r>=c.firstRow}).groupBy("r").mapValues(function(a){var b={};return _.each(a,function(a){b[c.columnFields[a.c]]=a.v}),b}).values().filter(function(a){var b=_.filter(c.fieldsRequiredToConsiderFilledRow,function(b){return!a[b]});return 0===b.length}).value();return c.sortBy&&(f=_.sortBy(f,c.sortBy)),c.postProcess&&(f=c.postProcess(f)),d.resolve(f),d.promise}};return b}]),angular.module("bdxioModule").factory("SharedData",["$q","$http","SpreadsheetReader","VoxxrinReader",function(a,b,c,d){var e={SPREADSHEETS:[{tabId:1,dataField:"orgas",descriptor:{firstRow:2,columnFields:{A:"firstName",B:"lastName",C:"bio",D:"company",E:"avatarUrl",F:"twitter",G:"linkedin",H:"gplus"},fieldsRequiredToConsiderFilledRow:["firstName","lastName"],sortBy:["lastName","firstName"]}},{tabId:2,dataField:"jurys",descriptor:{firstRow:2,columnFields:{A:"firstName",B:"lastName",C:"bio",D:"company",E:"avatarUrl",F:"twitter",G:"linkedin",H:"gplus"},fieldsRequiredToConsiderFilledRow:["firstName","lastName"],sortBy:["lastName","firstName"]}},{tabId:3,dataField:"speakers",descriptor:{firstRow:2,columnFields:{A:"firstName",B:"lastName",C:"bio",D:"company",E:"avatarUrl",F:"twitter",G:"linkedin",H:"gplus",I:"blog",J:"talk1",K:"talk2"},fieldsRequiredToConsiderFilledRow:["firstName","lastName"],sortBy:["lastName","firstName"]}},{tabId:4,dataField:"partners",descriptor:{firstRow:2,columnFields:{A:"active",B:"type",C:"name",D:"imgId",E:"website",F:"description",G:"imgHeight"},fieldsRequiredToConsiderFilledRow:["active","name","type"],postProcess:function(a){return a=_.groupBy(a,"type"),_.each(_.keys(a),function(b){a[b]={companies:_(a[b]).filter(function(a){return"1"==a.active}).map(function(a){return _.extend(a,{imgStyle:a.imgHeight?"height: "+a.imgHeight+"px":""})}).value(),activeCount:_.filter(a[b],function(a){return"1"==a.active}).length,inactiveCount:_.filter(a[b],function(a){return"1"!=a.active}).length}}),a}}},{tabId:5,dataField:"newsletters",descriptor:{firstRow:2,columnFields:{A:"longLabel",B:"shortLabel",C:"url"},fieldsRequiredToConsiderFilledRow:["longLabel","shortLabel","url"]}}],_data:{},_dataLoadedDefer:a.defer(),init:function(f){var g=this,h=a.defer(),i=function(a){return f.offline?"/data/mockedSpreadsheet"+a+".json":"https://spreadsheets.google.com/feeds/cells/1TWnEIQScabIWWGbH5GYLPeWZaM6y3Qww9aVZj6o6Xm4/"+a+"/public/basic?alt=json&callback=JSON_CALLBACK&v=3.0"},j=_.map(e.SPREADSHEETS,function(a){return b.jsonp(i(a.tabId),{}).then(function(b){return c.read(b.data,a.descriptor)},errorMessage("Error while fetching spreadsheet info for tab "+a.tabId))}),k=a.defer();a.all(j).then(function(a){_.each(a,function(a,b){g._data[e.SPREADSHEETS[b].dataField]=a}),k.resolve()},rejectDeferred(k,"Error while fetching spreadsheet data"));var l=a.defer();return d.readDaySchedule("lrdbdxio14",0,"bdxio14").then(function(a){g._data.daySchedule=a,l.resolve()}),a.all([k.promise,l.promise]).then(function(){var a=g._data.daySchedule;_.each(g._data.speakers,function(b){b.talks=[],b.talk1&&b.talks.push(a.schedule[b.talk1.toLowerCase()]),b.talk2&&b.talks.push(a.schedule[b.talk2.toLowerCase()])}),g._dataLoadedDefer.resolve(),h.resolve()},rejectDeferred(h,"Error while fetching data")),h.promise},data:function(a){return this._data[a]?_.cloneDeep(this._data[a]):null},dataLoaded:function(){return this._dataLoadedDefer.promise}};return e}]),angular.module("bdxioModule").factory("VoxxrinReader",["$q","$http",function(a,b){var c={readDaySchedule:function(c,d,e){var f=a.defer();return b.get("http://app.voxxr.in/r/events/"+c+"/day/"+c+"-"+d).then(function(a){var b={schedule:{}};_.each(a.data.schedule,function(a){var c=new RegExp(e+"-(.+)","gi").exec(a.id)[1];b.schedule[c]=_.extend({__id:c},a)}),f.resolve(b)},rejectDeferred(f,"Error while retrieving Voxxrin day schedule for event="+c+" and day="+d)),f.promise}};return c}]);var bdxioControllers=angular.module("bdxioControllers",[]);bdxioControllers.controller("HomeController",["$scope","$q","SharedData",function(a,b,c){a.themes=[{className:"coding",hints:["Langages","Frameworks","Tooling"],detailedHints:["Java, PHP, C#, Javascript","Groovy, Scala, Dart ...","Et les autres librairies et outils de productivité au quotidien"]},{className:"medias",hints:["Web","Jeux","Mobile"],detailedHints:["Les différents médias","sur lesquels développer aujourd'hui"]},{className:"future",hints:["Startups","Objets connectés"],detailedHints:["Où découvrir les idées","disruptives du monde de demain"]},{className:"design",hints:["Design","Pratiques","Architectures","Cloud"],detailedHints:["Architecture REST","Bases NOSQL","Développement dans le cloud","Pratiques telles que SCRUM ou Kanban"]}],a.cfpOpened=Date.now()<=Date.parse("Aug 16, 2014 23:59:59 GMT+0200"),a.programAvailable=!0,a.newsletters=[],b.when(c.dataLoaded()).then(function(){a.newsletters=c.data("newsletters")})}]),bdxioControllers.controller("PartnersController",["$q","$scope","SharedData",function(a,b,c){a.when(c.dataLoaded()).then(function(){var a=c.data("partners");_([a.gold,a.silver,a.bronze]).pluck("companies").flatten().each(function(a){a.imgSrc=$("#"+a.imgId).attr("src")}),b.partnerLevels=[_.extend({title:"Gold",anchorId:"gold"},a.gold),_.extend({title:"Silver",anchorId:"silver"},a.silver),_.extend({title:"Bronze",anchorId:"bronze"},a.bronze)]},errorMessage("Cannot load SharedData")),b.noActivePartner=function(a){return 0==a.activeCount},b.someInactivePartnersComing=function(a){return 0!=a.activeCount&&0!=a.inactiveCount}}]),bdxioControllers.controller("PeopleController",["$scope","$q","SharedData",function(a,b,c){b.when(c.dataLoaded()).then(function(){a.participantSections=[{title:"Les speakers",anchor:"speakers",participants:c.data("speakers")},{title:"L'équipe d'organisation",anchor:"orgas",participants:c.data("orgas")},{title:"Le jury du CFP",anchor:"jury",participants:c.data("jurys")}]},errorMessage("Cannot load SharedData"))}]);