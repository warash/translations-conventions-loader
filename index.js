var loaderUtils = require('loader-utils');
var fs = require('fs');
var path = require('path');

var translationRegex = /@Translations\({[\s]*?}\)$/gm;


var relativePathStart = '.' + path.sep;

function dashCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}


function TranslationsConventionsLoader(source, sourcemap) {
    var self = this;
    self.cacheable && self.cacheable();


    var query = loaderUtils.parseQuery(this.query);


    source = source.replace(translationRegex, function (match, offset, src) {

        var fileContext = self.request.split(self.context);
        var lastFileName = fileContext[fileContext.length - 1];
        lastFileName = lastFileName.replace(/^.*[\\\/]/, '').replace(/\.[^.]*$/, '');
        // if (lastFileName.indexOf(relativePathStart) === 0) {
        //     lastFileName = lastFileName.substr(relativePathStart.length);
        // }

        var metadata;
        if (query.prod){
            metadata = "{ remote: './" + lastFileName + ".i18n.json' }";
        }else{
            metadata = "{ remote: './" + lastFileName + ".i18n.json', static: { 'en': require('./" + lastFileName + ".i18n.json') } }";
        }


        return '@Translations' + '(' + metadata + ')';
    });



    if (self.callback) {
        self.callback(null, source, sourcemap)
    } else {
        return source;
    }
}
TranslationsConventionsLoader.default = TranslationsConventionsLoader;
module.exports = TranslationsConventionsLoader;
