angular.module('emissary.skyfire').factory('track', ['api', '$location', '$document', function(api, $location, $document) {
  var instance = {};
  instance.track = function(o) {
    if (o.domain ||
       o.kingdom ||
       o.phylum ||
       o.family ||
       o.phylum ||
       o.species) {
      o.value = o.value || 1;
      api.call('track', o, false);
    }
  };
  instance.visit = function() {
    var params = ['utm_source', 'utm_medium', 'utm_term', 'utm_content', 'utm_campaign'],
      ret = {},
      direct = true,
      search = $location.search();
    angular.forEach(params, function(item) {
      if (search[item]) {
        ret[item.replace('utm_', '')] = search[item];
        direct = false;
      }
    });
    if (direct) {
      if (document.referrer) {
        ret.medium = 'referral';
        ret.source = document.referrer;
      } else {
        ret.medium = 'direct';
      }
    }
    api.call('track.visit', ret, false);
  };
  window._kmq = window._kmq || [];
  var _kmk = _kmk || 'bbae1061ef6d3f51cbe1f460a8937597d8a4b602';
  function _kms(u){
    setTimeout(function(){
      var d = document, f = d.getElementsByTagName('script')[0],
      s = d.createElement('script');
      s.type = 'text/javascript'; s.async = true; s.src = u;
      f.parentNode.insertBefore(s, f);
    }, 1);
  }
  _kms('//i.kissmetrics.com/i.js');
  _kms('//doug1izaerwt3.cloudfront.net/' + _kmk + '.1.js');
  instance.kmq_push = function(i) {
    _kmq.push(i);
  };
  instance.pageView = function(path) {
    window.dataLayer.push({
      'event':'SendVirtualPageView',
      'vpv':path
    });
  };
  instance.conversion = function(formId) {
    window.dataLayer.push({
      'event':'SendVirtualPageView',
      'vpv':'/submitsuccess',
      'formId': formId
    });
  };

  return instance;
}]);


