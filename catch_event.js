jQuery.fn.extend({
    getPath: function () {
        var paths = [];

        this.each(function (index, element) {
            var path;
            var $node = jQuery(element);

            while ($node.length) {
                // debugger;
                var realNode = $node.get(0);
                var name = realNode.localName;
                var id = realNode.id;
                var className = realNode.className;
                var selector = null;
                name = name.toLowerCase();

                if (id) {
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


                if (!name) {
                    break;
                }

                var parent = $node.parent();
                var sameTagSiblings = parent.children(name);

                if (sameTagSiblings.length > 1) {
                    allSiblings = parent.children();
                    var index = allSiblings.index(realNode) + 1;
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

            paths.push(path);
        });

        return paths.join(',');
    }
});

var catchEvent = {
    state: 'waiting',
    init: function () {
        var _this = this;
        chrome.storage.onChanged.addListener(function (changedStorage) {
            if (changedStorage.status) {
                _this.changeStatus();
            }
        });

        this.changeStatus();
    },
    events: [
        'change',
        'click',
        'focus',
        'submit',
        // 'mouseover'
    ],

    changeStatus: function () {
        var _this  = this;
        chrome.storage.sync.get('status', function (status) {
            _this.state = status.status;

            switch (_this.state) {
                case 'waiting':
                    console.log('wait');
                    chrome.storage.sync.get('availableEvents', function (items) {
                        _this.removeListeners(items);
                        _this.removeListeners(['mouseover'])
                    });
                    break;
                case 'playing':
                    console.log('play');
                    chrome.storage.sync.get('availableEvents', function (items) {
                        _this.addListeners(_this.events);
                    });
                    break;
                case 'asserting':
                    console.log('asserting');
                    chrome.storage.sync.get('availableEvents', function (items) {
                        _this.removeListeners(_this.events);
                    });
                    $(document).on('mouseenter', _this.mouseEnter);
                    $(document).on('mouseleave', _this.mouseLeave);
                    $(document).on('click', _this.catchAsserts);

                    break;
            }
        });
        // _this.addListeners(_this.events);

    },

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
    addListeners: function (events) {
        // console.log(events.length)
        // if (!events) {
        //     events = this.events;
        // }
        // document.addEventListener(event, this.storeEvent);
        $(document).on(events.join(' '), this.storeEvent);
    },
    removeListeners: function (events) {
        $(document).off(events.join(' '));
    },

    catchAsserts: function (event) {
        console.log($(event.target()));
    },
    mouseEnter: function (event) {
        if (event.type === 'mouseenter') {
            console.log($(event.target))
            $(event.target).css('border', '2px solid red');
        }
    },
    mouseLeave: function (event) {
        if (event.type === 'mouseleave') {
            console.log($(event.target))
            $(event.target).css('border', 'none');
        }
    }


};
catchEvent.init();