var catchEvent = {
    i: 0,
    init: function () {
        console.log('Here we are!');
        for (var i in this.events) {
            console.log(this.events[i]);
            this.addListener(this.events[i]);
            console.log('yey');
        }
    },
    events: [
        'change'],

    storeEvent: function (event) {
        var background  = chrome.extension.getBackgroundPage();
        if (!background.page.started) {
            return;
        }
        var object = {
            'eventType': event.type,
            'eventTarget': event.target
        };
        chrome.storage.sync.get('events', function (items) {
            if (items.events) {
                var events = items.events;
                events.push(object);
                items.events = events;
                chrome.storage.sync.set(items);
            }
        });
    },
    addListener: function (event) {
        document.addEventListener(event, this.storeEvent);
    }
};
catchEvent.init();

// var x = function () {
//     catchEvent.init();
// };
// x();
