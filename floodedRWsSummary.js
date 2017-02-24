console.log('Loading function');

var request=require('request');

exports.handler = function(event, context, callback) {
    console.log("\n\nLoading handler\n\n");

    var url = 'https://'+process.env.BASE_URL+'/floods?minimum_state=1';
    if (event.queryStringParameters) {
      if (event.queryStringParameters.city) {
        url += '&city='+event.queryStringParameters.city;
      }
    }

    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          var results = JSON.parse(body);
          var flooded_RWs = [0,0,0,0,0];

          for (var i = 0; i < results.result.objects.output.geometries.length; i++) {
            flooded_RWs[results.result.objects.output.geometries[i].properties.state]++;
          }
          var myResponse = {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
              "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
            },
              body: JSON.stringify({ "# hati-hati RWs": flooded_RWs[1], "# 10-70cm RWs": flooded_RWs[2], "# 71-150cm RWs": flooded_RWs[3], "# 151cm+ RWs": flooded_RWs[4] })
            };
            console.log(myResponse);
            callback(null, myResponse);
        } else {
          var myErrorResponse = {
            statusCode: response.statusCode,
            headers: {
              "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
              "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
            },
              body: body
            };
            callback(null, myResponse);
        }
    });
  }
