(function() {

  var zsocket = new ZhovSock("ws://0.0.0.0:8081", {
    onOpen: function() {
      console.log('connected');
    },
    onClose: function() {
      console.log('disconnected');
    }
  });

  zsocket.addListener('new province', function(data) {
    console.log('new province', data);
  });

  zsocket.addListener('error', function(data) {
    console.log('error', data.message);
  });

  $('.submit').on('click', function(event) {
    event.preventDefault();

    zsocket.send('new province', {
      name: $('.province-name').val()
    });
  });

  $('.do-test').on('click', function(event) {
    zsocket.send('bad handler that doesn\'t exist');
  });

}());
