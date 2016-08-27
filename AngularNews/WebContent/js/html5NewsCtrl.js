app.controller("html5NewsCtrl", ['$scope','$http','$timeout','$routeParams',
                                 function($scope,$http,$timeout,$routeParams) {
	
	$scope.topNav = {
			sections : "SECTIONS",
			search: "SEARCH",
			user: "itsyou..."
	};

	var now = new Date();

	$scope.siteHeading = {
			title : "CAPTECH.IO NEWS",
			dateMilli: now.getTime(), 
	};	

	var site = "http://html5news.herokuapp.com";

	/* Nav Categories */

	var categoryPage = "/articles/categories";
	$http.get(site + categoryPage)
	.success(function(response) {$scope.categories = response;});

	$scope.states = {};
    $scope.states.activeItem = localStorage.getItem("activeItem");
    
    $scope.selectItem = function(id){
    	$scope.states.activeItem=id;
		localStorage.setItem("activeItem", id);	//preserve selected menu item css on page refresh
    };
    
    /*TODO: Determine how to preserve selected menu item and apply css when user hits back or forward a number of times. */ 

	/*END Nav Categories  */

	/* Banners */

	var bannerPage = "/banners";
	$http.get(site + bannerPage)
	.success(function(response) {$scope.banners = response;});

	$scope.bannerExpanded = false;
	$scope.bannerCallToAction = "Click To Expand";
	$scope.bannerCallToActionIcon = 'fa fa-chevron-down';

	$scope.toggleBanner = function() {
		
		if($scope.bannerExpanded)
		{
			$scope.bannerStyle = '';
			$scope.bannerCallToActionIcon = 'fa fa-chevron-down';
			$scope.bannerCallToAction = "Click To Expand";
		}
		else
		{
			$scope.bannerStyle = 'bannerExpanded';
			$scope.bannerCallToActionIcon = 'fa fa-chevron-up';
			$scope.bannerCallToAction = "Click To Close";
		}
		$timeout(toggleBannerExpanded,450);		//timeout to sync show/hide text and banner redraw
	};

	function toggleBannerExpanded()
	{
		$scope.bannerExpanded = !$scope.bannerExpanded;
	}

	/* END Banners */

	/* Featured */

	var featuredPage = "/articles/featured";
	$http.get(site + featuredPage)
	.success(function(response) {
		$scope.asideArticles = insertExtraHTML(response.aside,true);
		$scope.mainArticles = insertExtraHTML(response.main,true);
		$scope.opinionArticles = insertExtraHTML(response.opinion, false);
		$scope.travelArticles = insertExtraHTML(response.travel,true);
		$scope.arrows = numOfTravelArrows();
	});

	function numOfTravelArrows()
	{
		var i = 0, temp = [];
		count = 46;
		for (i; i<count; i++) {
			temp.push(i);
		}
		return temp;
	}

	/* END Featured */

	/* Category */
	var categoryPage = "/category/";
	var categoryId = $routeParams.categoryId;
	if(categoryId != undefined)
	{
		$http.get(site + categoryPage + categoryId)
		.success(function(response) {
			$scope.categoryAside = insertExtraHTML(response.aside, false);
			$scope.categoryMain = insertExtraHTML(response.main,false);
		});
	}
	/* END Category */

	function insertExtraHTML(articles,isSnippet)
	{
		if(Object.prototype.toString.call(articles) == '[object Object]')  //Is this an Object and not an Array?
		{
			insertImages(articles, isSnippet);
			insertVideo(articles);
			insertNSFW(articles, isSnippet);
		}
		else
		{
			for (var i = 0; i < articles.length; i++) 
			{
				var article = articles[i];
				insertImages(article, isSnippet);
				insertVideo(article);
				insertNSFW(article, isSnippet);
			}
		}
		
		return articles;
	}
	
	function insertImages(article, isSnippet)
	{
		var text = determineDisplayedText(article, isSnippet);	
		var numOfImages = article.numberOfImages;
		
		if(numOfImages > 0)
		{
			var replaced = text.replace('<br>','<img src=/HTML5News/img/Bassnectar.jpg>');
			if(text != replaced)	//did we replace anything?
			{
				numOfImages--;
				setDisplayedText(article, isSnippet, replaced);
			}
			
			var images = '';
			for(var j = 0; j < numOfImages; j++) 
			{
				//if there are more images or there was no <br>, place after title
				images = '<img src=/HTML5News/img/captechWide.jpg>' + images;
			}
			article.headLine = article.headLine + images;
		}
			
		return article;
	}
	
	function insertVideo(article)
	{		
		if (article.hasVideoPlaceholder) 
		{
			//place video tag before title
			article.headLine = '<video controls>'+
			'<source src="/HTML5News/video/minion.mp4" type="video/mp4">'+
			'</video>' + article.headLine;
		}
	}
	
	function insertNSFW(article, isSnippet)
	{		
		if (article.nsfw) 
		{
			var text = determineDisplayedText(article, isSnippet);
			text = text + ' <sup>[</sup>NSFW<sup>]</sup></span>';
			setDisplayedText(article, isSnippet, text);
		}
	}
	
	
	function determineDisplayedText(article, isSnippet)
	{
		var text;
		if(isSnippet)
		{
			text = article.snippet;
		}
		else
		{
			text = article.fullStory;
		}
		return text;
	}
	
	function setDisplayedText(article, isSnippet, text)
	{
		if(isSnippet)
		{
			 article.snippet = text;
		}
		else
		{
			article.fullStory = text;
		}
	}
}]);