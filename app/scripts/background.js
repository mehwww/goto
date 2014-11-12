'use strict';

var config;
chrome.storage.sync.get('config', function (result) {
  config = result.config ? result.config : [];
})


chrome.omnibox.onInputChanged.addListener(
  function (text, suggest) {
    text = text.trim().split(/[ ]+/);
    var keyword = text.shift();
    var params = text;
    var suggestList = [];
    resetDefaultSuggestion();
    suggest(suggestList);
    config.map(function (row) {
      if (row.keyword.indexOf(keyword) != -1) {
        if (row.keyword == keyword) {
          chrome.omnibox.setDefaultSuggestion({
            description: row.keyword + ' - ' + row.redirect
          });
        } else {
          suggestList.push({
            content: row.redirect,
            description: row.keyword + ' - ' + row.redirect
          })
        }
      }
    })
    suggest(suggestList);

    /*
     chrome.omnibox.setDefaultSuggestion({
     description: keyword ? keyword : '<dim>input key</dim>'
     });
     suggest([
     {
     content: keyword + " one",
     description: "the first one"
     },
     {
     content:  " number two",
     description: "the second entry"
     }
     ]);
     */
  });

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
  function (text) {
    console.log('inputEntered: ' + text);
    //navigate('http://www.baidu.com')
  });

function resetDefaultSuggestion() {
  chrome.omnibox.setDefaultSuggestion({
//    description: '<url><match>src:</match></url> Search Chromium source'
//    description: '<url>url</url>' +
//    '<match>match</match>' +
//    '<url><match>url+match</match></url>' +
//    '<dim>dim</dim>'
    description: '<dim>Go to any website quick</dim>'
  });
}

function updateDefaultSuggestion(text) {

}

function navigate(url) {
  chrome.tabs.update({url: url});
}
