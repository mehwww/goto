'use strict';

var config = [];
var keyword = '';
var redirect = '';

chrome.storage.sync.get('config', function (result) {
  if (!result.config) {
    var data = [
      {keyword: 'l', redirect: 'http://localhost:$1/'},
      {keyword: 'g', redirect: 'https://www.google.com/'}
    ]
    chrome.storage.sync.set({
      config: data
    })
    config = data;
  } else {
    config = result.config
  }
})

chrome.omnibox.onInputChanged.addListener(
  function (text, suggest) {
    text = text.trim().split(/[ ]+/);
    if (keyword != text[0]) {
      resetDefaultSuggestion();
    }
    keyword = text.shift();
    redirect = '';
    var params = text;
    var url = '';
    var tag = '';

    config.map(function (row) {
      if (row.keyword == keyword) {
        var url = getUrl(row.redirect, params);
        var tag = getUrlTag(row.redirect, params);
        if (url.indexOf('$') != -1) {
          redirect = '';
          tag = tag + ' <match>Invalid Url</match>'
        } else {
          redirect = url;
        }
        chrome.omnibox.setDefaultSuggestion({
          description: '<match>' + row.keyword + '</match>' + ' - ' + tag
        });
      }
    })
  });

chrome.omnibox.onInputEntered.addListener(function (text) {
  console.log(redirect);
  if (redirect) navigate(redirect);
});

function getUrl(redirect, params) {
  var url = redirect;
  params.map(function (param, index) {
    var placeholder = '$' + (index + 1);
    url = url.replace(placeholder, param);
  });
  return url;
}

function getUrlTag(redirect, params) {
  var tag = redirect;
  params.map(function (param, index) {
    var placeholder = '$' + (index + 1);
    tag = tag.replace(placeholder, '<match>' + param + '</match>');
  });
  tag = tag.replace(/\$[0-9]/, '<match>' + '$&' + '</match>')
  tag = '<url>' + tag + '</url>'
  return tag;
}


function resetDefaultSuggestion() {
  chrome.omnibox.setDefaultSuggestion({
    description: '<dim>Go to any website quick</dim>'
  });
}

function navigate(url) {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.update(tabs[0].id, {url: url});
  });
}
