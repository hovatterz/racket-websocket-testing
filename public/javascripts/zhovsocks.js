ZhovSock = function(url, options) {
  var scope = this;

  this.defaultOptions = {
    onOpen: function() {},
    onClose: function() {}
  };

  this.options = $.extend({}, this.defaults, options);

  this.listeners = {};
  this.addListener = function(type, handler) {
    scope.listeners[type] = handler;
  };

  this.socket = new WebSocket(url);
  this.socket.onopen = this.options.onOpen;
  this.socket.onclose = this.options.onClose;

  this.socket.onmessage = function(event) {
    var json = $.parseJSON(event.data);
    var listener = scope.listeners[json.type];
    if (listener != undefined) {
      listener(json.data);
    }
  };

  this.send = function(type, data) {
    scope.socket.send(JSON.stringify({
      type: type,
      data: data
    }));
  };

  return this;
};
