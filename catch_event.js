jQuery.fn.extend({
    getPath: function() {
        var pathes = [];

        this.each(function(index, element) {
            var path, $node = jQuery(element);

            while ($node.length) {
                // debugger;
                var realNode = $node.get(0);
                var name = realNode.localName;
                var id = realNode.id;
                var className = realNode.className;
                var selector = null;
                name = name.toLowerCase();

                if(id) {
                    name += '#' + id.trim();
                    selector = name + (path ? ' > ' + path : '');
                    if ($(selector).length === 1) {
                        path = selector;
                        break;
                    }
                }

                if (className) {
                    className = className.replace(/\s/g, '.');
                    name += '.' + className;
                    selector = name + (path ? ' > ' + path : '');
                    if ($(selector).length === 1) {
                        path = selector;
                        break;
                    }
                }


                if (!name) { break; }

                var parent = $node.parent();
                var sameTagSiblings = parent.children(name);

                if (sameTagSiblings.length > 1)
                {
                    allSiblings = parent.children();
                    var index = allSiblings.index(realNode) +1;
                    if (index > 0) {
                        name += ':nth-child(' + index + ')';
                    }
                }

                path = name + (path ? ' > ' + path : '');
                if ($(path).length === 1) {
                    break;
                }
                $node = parent;
            }

            pathes.push(path);
        });

        return pathes.join(',');
    }
});

var catchEvent = {
    i: 0,
    init: function () {
        var _this = this;
        console.log('Here we are!');
        for (var i in _this.events) {
            _this.addListener(_this.events[i]);
        }
    },
    events: [
        'change',
        'click',
        'focus',
        'submit',
        // 'mouseover'
    ],

    storeEvent: function (event) {
        chrome.storage.sync.get('status', function (status) {
            if (status.status) {
                console.log($(event.target).getPath());

                var object = {
                    'eventType': event.type,
                    'eventTarget': $(event.target).getPath()
                };
                if (event.type === 'change') {
                    object.value = $(event.target).val();
                }

                if (event.type === 'mouseover') {
                    console.log($(event.target))
                    $(event.target).css('border', '2px solid red');
                }
                console.log(object);
                chrome.storage.sync.get('events', function (items) {
                    var events;

                    if (items.events) {
                        events = items.events;
                    } else {
                        events = [];
                        console.log(window.location.href)
                        var myLocation = {
                            'eventType': 'navigation',
                            'eventTarget': '',
                            'value': window.location.href
                        };
                        events.push(myLocation);
                    }
                    console.log(events);
                    events.push(object);
                    items.events = events;
                    chrome.storage.sync.set(items);
                });
            } else {
                console.log('Not started.');
            }
        });

    },
    addListener: function (event) {
        console.log(event)
        document.addEventListener(event, this.storeEvent);
    },


};
catchEvent.init();