var loaderUtils = require('loader-utils');
var fs = require('fs');
var path = require('path');
var glob = require("glob")
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
        lastFileName = lastFileName.replace(/^.*[\\\/]/, '').replace(/\.[^.]*$/, '') +".i18n.json";
        // if (lastFileName.indexOf(relativePathStart) === 0) {
        //     lastFileName = lastFileName.substr(relativePathStart.length);
        // }

        // var translationFiles = glob.sync('lastFileName*.i18n.json');
        // path.join(self.context, lastFileName + cssExtension))


        var tranlationFileWildCard = path.join(self.context, lastFileName.replace(".i18n.json", "*.i18n.json"));
        var translationFiles = glob.sync(tranlationFileWildCard);
        console.log(translationFiles);
        if (translationFiles.length) {
            var last = translationFiles[translationFiles.length - 1];
            // var lastPath = last.split("/");
            //
            // lastFileName = lastPath[lastPath.length - 1];
            lastFileName = path.basename(last);
        }


        var metadata;
        if (query.remote) {
            metadata = "{ remote: './" + lastFileName + "' }";
        } else {
            metadata = "{ remote: './" + lastFileName + "', static: { 'en': require('./" + lastFileName + "') } }";
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
