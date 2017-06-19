var page = {
    init: function () {
        _this = this;
        _this.showBadge();
        chrome.storage.onChanged.addListener(function (changedStorage) {
            if (changedStorage.events) {
                _this.showBadge();
            }

            if (changedStorage.status) {
                _this.urlChanged();
                if (changedStorage.status.newValue === 'waiting') {
                    _this.removeBadge();
                    chrome.tabs.onActivated.removeListener();
                } else {
                    _this.showBadge();
                    if (changedStorage.status.newValue === 'asserting') {
                        chrome.tabs.onActivated.removeListener();
                    }
                }

                switch (changedStorage.status.newValue) {
                    case 'waiting':
                        _this.removeBadge();
                        chrome.tabs.onActivated.removeListener();
                        break;
                    case 'asserting':
                        _this.showBadge();
                        chrome.tabs.onActivated.removeListener();
                        break;
                    case 'playing':
                        _this.showBadge();
                        _this.urlChanged();
                        break;
                }
            }
        });

        _this.urlChanged();

    },
    showBadge: function () {
        chrome.storage.sync.get(null, function (items) {
            var index = 0;
            if (items.events) {
                index = items.events.length;
            }
            if (items.status && items.status !== 'waiting') {
                if (index > 1) {
                    index = index - 1;
                }
                chrome.browserAction.setBadgeText({text: index.toString()});
            }
        });
    },

    removeBadge: function () {
        chrome.browserAction.setBadgeText({text: ''});
    },

    urlChanged: function () {
        chrome.tabs.onActiveChanged.addListener(function (tabId, info) {
            chrome.tabs.get(tabId, function (tab) {
                if (tab.url) {
                    console.log(tab.url)
                    chrome.storage.sync.get(null, function (items) {
                        if (items.status === 'playing') {
                            var events = [];
                            if (items.events) {
                                events = items.events;
                            }
                            events.push({
                                'eventType': 'navigation',
                                'eventTarget': '',
                                'value': tab.url
                            });
                            chrome.storage.sync.set({'events': events});
                        }
                    });
                }
            });
        });
    }
};

page.init();