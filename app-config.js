"use strict";
(function(){
var app;
try{
 app  = angular.module("adm",["angular-growl","angularSpinner","ngRoute","ds.clock","FBAngular","ng-mfb","ngCookies","angular.filter","ngStorage","ngAudio","ngDraggable","ui.bootstrap","ui.transition","angular-confirm","ngMessages","chart.js","youtube-embed","ui.utils.masks","angular-json-tree","ngAnimate","ngSanitize", "textAngular","angular-chrono","ui.checkbox","ng.deviceDetector","ngOnboarding"]);
}catch(e){
	window.alert(e);
}


app.factory('config',function($location, $rootScope, $http, $templateCache){

	
	var _appInfo = {
		
			
			$$path:"SindCar",
			$$versao: "CeasaPlus 3.7",
			$$paginaInicial: "/imovel"
			
			
	}
	
	function getAppVersion(){
		
		return _appInfo.$$versao;
	}
	
	function getUrlBase(){
		
		var pathApp = _appInfo.$$path+"/";
		
		//Servidor de teste local (Utilizado para deploy do .war gerado pelo jenkins)
		if($location.$$absUrl.indexOf("7070/"+pathApp)!=-1)
			 return "http://"+$location.$$host+":7070/"+pathApp;
			
		else if($location.$$absUrl.indexOf("8080/"+pathApp)!=-1)
		  return "http://"+$location.$$host+":8080/"+pathApp;
		
		else if($location.$$absUrl.indexOf("8080")!=-1)
			  return "http://"+$location.$$host+":8080/";
		
        //SSL
		else if($location.$$absUrl.indexOf("https")!=-1)
			return "https://"+$location.$$host+"/";
                else
                  return "http://"+$location.$$host+"/";
		
	}
	
	
	function getPath(){
		
		return $location.path();
	}
	
	
	function cacheTemplates (){
		//Função substituida com a inclusão com service-worker
		
	}
	
	

	return {
		info: _appInfo,
		cacheTemplates: cacheTemplates,
		baseUrl: getUrlBase(),
		path: getPath(),
		appVersion: getAppVersion()
	};


});

app.run(['$rootScope', '$route','$modalStack','$localStorage','$location','st','$filter','deviceDetector', function($rootScope, $route,$modalStack, $localStorage,$location,st,$filter,deviceDetector) {
	
	
	try{
		
		//
		
  
	if('serviceWorker' in navigator) {
		  navigator.serviceWorker
		           .register('service-worker.js')
		           .then(function() { console.log("Service r Registered"); });
		}
	
	
	
	
	
	//Desabiliar zoom (Necessário para safari)
	document.documentElement.addEventListener('gesturestart', function (event) {
	    event.preventDefault();      
	}, false);
	

	//Configuração da lib de Chart
	Chart.moneyFormat= function(value) {
		return $filter('number')(value,2);
	}

    //Evento para contabilizar o tempo de carregamento do sistema
    var tempoCarregamento = (new Date().getTime()-window.inicioCarregamento)/1000;
	st.evt({evento:"tempo_carregamento_sistema",descricao:tempoCarregamento});
	
    $rootScope.$on('$routeChangeStart', function(event, next, current) { 
    	
    	if(!next.$$route){
    		$location.path("/login");
    	}
    	
    	//Caso o usuário não esteja logado, é direcionado para página de login
    	else if(!$rootScope.usuarioSistema && (!next.$$route || next.$$route.originalPath.indexOf("/login/:login")==-1) && next.$$route.originalPath.indexOf("/cadastro/:login")==-1 && next.$$route.originalPath.indexOf("/teste")==-1 && next.$$route.originalPath.indexOf("/prot/:template")==-1 && next.$$route.originalPath.indexOf("/lavoura")==-1){
    		console.log("PATH: "+next.$$route.originalPath);
    		console.log("Não existe usuário logado no sistema");
    		$location.path("/login");
    	}
    	
    	
    	//Google analytics
    	if(next.templateUrl) {
            // interagindo com o Analytics através do objeto global ga
            ga('send', 'pageview', { page: next.templateUrl });
        }
    	
    	//Define se irá chamar event.preventDefault()
    	var preventDefault = false;
    	
    	
    	//Caso o menu mobile esteja visivel, é fechado
    	if($("#nav-header")[0] && $("#nav-header")[0].className.indexOf("open")!=-1){
    		$("#nav-header").removeClass("open");
    	}
        
    	//Caso tenha backdrop aberto, este é removido
    	$(".modal-backdrop").remove();
    	
    	var isModalOpen = function(){
    		
    		var modals = $(".modal");
    		   		
    		for(var i in modals){
    			
    			if(modals[i].className=='modal in'){
    				
    				//Caso no-change-path seja definida no modal como 'true', no fechamento não ocorre a mudança de path
    				if(modals[i].getAttribute('no-change-path')=='true');
    				  preventDefault =true;
    				  
    				return true;
    			}
    		}
    		return false;
    	}
    	
    	if(isModalOpen()){
    		  $(".modal").modal('hide');
    	 }

    	var top = $modalStack.getTop();
    	
         if (top) {
             $modalStack.dismiss(top.key);
         }
         
         
         if(preventDefault==true)
            event.preventDefault();
           
     });
    
    
    
    
	}catch(e){
		window.alert("O CeasaPlus não é compatível com seu navegador!\n"+e);
		console.log(e);
	}
}]);
 
})();