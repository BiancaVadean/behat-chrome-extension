var catchEvent = {
    init: function () {
        console.log('Here we are!');
        for( var i in this.events ) {
            console.log(this.events[i]);
            this.addListener(this.events[i]);
        }
    },
    events: ['click'],

    storeEvent: function (event) {
        var object = {
            'eventType': event.type,
            'eventTarget': event.target
        };
        chrome.storage.sync.get('events', function (items) {
            if (items.events) {
                var events = items.events;
                console.log(items);
                events.push(object);
                console.log(items);
                items.events = events;
                chrome.storage.sync.set(items);
            }
        });
    },
    addListener: function(event) {
        document.addEventListener(event, this.storeEvent(event));
    }
};
catchEvent.init();

// var x = function () {
//     catchEvent.init();
// };
// x();
