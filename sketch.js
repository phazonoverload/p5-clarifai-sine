var sineColors = [];
var timeToDraw = false;
var imageUrl;

// Clarifai 

  function getCredentials(cb) {
    var data = {
      'grant_type': 'client_credentials',
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET
    };
    
    var url = 'https://api.clarifai.com/v1/token';

    return axios.post(url, data, {
      'transformRequest': [
        function() {
          return transformDataToParams(data);
        }
      ]
    }).then(function(r) {
      localStorage.setItem('accessToken', r.data.access_token);
      localStorage.setItem('tokenTimestamp', Math.floor(Date.now() / 1000));
      cb();
    }, function(err) {
      console.log(err);
    });
  }

  function transformDataToParams(data) {
    var str = [];
    for (var p in data) {
      if (data.hasOwnProperty(p) && data[p]) {
        if (typeof data[p] === 'string'){
          str.push(encodeURIComponent(p) + '=' + encodeURIComponent(data[p]));
        }
        if (typeof data[p] === 'object'){
          for (var i in data[p]) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(data[p][i]));
          }
        }
      }
    }
    return str.join('&');
  }

  function postImage(imgurl) {
    imageUrl = imgurl;
    var accessToken = localStorage.getItem('accessToken');
    var data = {
      'url': imgurl
    };
    var url = 'https://api.clarifai.com/v1/color';
    return axios.post(url, data, {
      'headers': {
        'Authorization': 'Bearer ' + accessToken
      }
      /*'content-type': 'application/x-www-form-urlencoded'*/
    }).then(function(r) {
      parseResponse(r.data);
    }, function(err) {
      console.log('Sorry, something is wrong: ' + err);
    });
  }

  function parseResponse(resp) {
    if (resp.status_code === 'OK') {
      sineColors = [];
      var results = resp.results;
      addColors(results[0].colors);
      timeToDraw = true;
    } else {
      console.log('Sorry, something is wrong.');
    }
  }

  function run(imgurl) {
    if (Math.floor(Date.now() / 1000) - localStorage.getItem('tokenTimeStamp') > 86400
      || localStorage.getItem('accessToken') === null) {
      getCredentials(function() {
        postImage(imgurl);
      });
    } else {
      postImage(imgurl);
    }
  }

// Populate colors array

  function hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
      } : null;
  }

  function addColors(data) {
    for (var i = 0; i < data.length; i++) {
      var density = data[i].density;
      var r = hexToRgb(data[i].hex).r;
      var g = hexToRgb(data[i].hex).g;
      var b = hexToRgb(data[i].hex).b;

      sineColors[i] = {
        "color": color(r, g, b),
        "density": density,
        "hex": data[i].hex
      };
    }
    console.log(sineColors);
  }

function makeSinewave() {
  clear();
  background(200);
  for (var i = 0; i < sineColors.length; i++) {
    var amount = 500;
    var frequency = sineColors[i].density / 5;
    var maxOffset = 400;
    var incomingOffset = sineColors[i].density * 1000;
    if(incomingOffset < 400) {
      var offset = incomingOffset;
    } else {
      var offset = 400;
    }
    strokeWeight(sineColors[i].density + 5);
    stroke(sineColors[i].color);
    var startY = height / 2;

    beginShape();

    vertex(0, startY);
    for (var c = 1; c < amount; c++) {
      var sinoffset = sin(frequency * c);
      var sinX = c * (width / amount);
      var sinY = startY + (sinoffset * offset);
      bezierVertex(sinX, sinY, sinX, sinY - 1, sinX, sinY);
    }
  
    endShape();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(200);
  noFill();
}

function draw() {
  if(timeToDraw) {
    makeSinewave();
    timeToDraw = false;
  }
}