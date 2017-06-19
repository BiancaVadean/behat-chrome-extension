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
    selectedElement: {
        initialStyle: '',
        element: ''
    },
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
        var _this = this;
        chrome.storage.sync.get('status', function (status) {
            _this.state = status.status;

            switch (_this.state) {
                case 'waiting':
                    console.log('wait');
                    if (_this.selectedElement.element) {
                        _this.selectedElement.element.attr('style', _this.selectedElement.initialStyle);
                    }
                    _this.removeListeners(['mouseover']);
                    chrome.storage.sync.get('availableEvents', function (items) {
                        _this.removeListeners(_this.events);
                    });
                    break;
                case 'playing':
                    console.log('play');
                    if (_this.selectedElement.element) {
                        _this.selectedElement.element.attr('style', _this.selectedElement.initialStyle);
                    }
                    _this.removeListeners(['mouseover']);
                    chrome.storage.sync.get('availableEvents', function (items) {
                        _this.addListeners(_this.events);
                    });
                    break;
                case 'asserting':
                    console.log('asserting');
                    // debugger;
                    events = _this.events.filter(function (el) {
                        return el != 'click';
                    });
                    chrome.storage.sync.get('availableEvents', function (items) {
                        _this.removeListeners(events);
                    });

                    $(document).on('mouseover', function (event) {
                        _this.onMouseover(event, _this);
                    });

                    $(document).click(function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        _this.storeEvent(event);
                    });
                    break;
            }
        });
        // _this.addListeners(_this.events);

    },

    storeEvent: function (event) {
        var object;
        if (this.state === 'asserting') {
            if (event.type === 'click') {
                object = {
                    'eventType': 'assert',
                    'eventTarget': $(event.target).getPath()
                }
            }
        } else {
            object = {
                'eventType': event.type,
                'eventTarget': $(event.target).getPath()
            };
            if (event.type === 'change') {
                object.value = $(event.target).val();
            }
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
    },
    addListeners: function (events) {
        $(document).on(events.join(' '), this.storeEvent);
    },
    removeListeners: function (events) {
        $(document).off(events.join(' '));
    },
    onMouseover: function (event, _this) {
        if (event.type === 'mouseover') {
            if (this.selectedElement.element) {
                this.selectedElement.element.attr('style', this.selectedElement.initialStyle);
            }

            this.selectedElement.element = $(event.target);
            this.selectedElement.initialStyle = $(event.target).attr('style') ?
                $(event.target).attr('style') :
                '';

            this.selectedElement.element.attr('style', this.selectedElement.initialStyle
                + ' outline: 1px solid red !important');
        }
    },
};

catchEvent.init();