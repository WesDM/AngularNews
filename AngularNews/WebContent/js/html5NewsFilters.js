angular.module('html5NewsFilters',[]).filter('parseHTML', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});
