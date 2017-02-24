console.log('Loading function');

var request=require('request');

exports.handler = function(event, context, callback) {
    console.log("\n\nLoading handler\n\n");

    request('https://'+process.env.BASE_URL+'/floods?minimum_state=1', function (error, response, body) {
      if (!error && response.statusCode == 200) {
          var results = JSON.parse(body);
          var flooded_regions = new Set();
          for (var i = 0; i < results.result.objects.output.geometries.length; i++) {
            flooded_regions.add(results.result.objects.output.geometries[i].properties.parent_name);
          }
          var myResponse = {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
              "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
            },
              body: JSON.stringify({ "total number of regions with flooded RWs": flooded_regions.size, "regions with flooded RWs": Array.from(flooded_regions) })
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
