console.log('Loading function');

var request=require('request');

exports.handler = function(event, context, callback) {
    console.log("\n\nLoading handler\n\n");

    request('https://'+process.env.BASE_URL+'/reports?city=jbd', function (error, response, body) {
      if (!error && response.statusCode == 200) {
          var results = JSON.parse(body);
          console.log(results);
          var total_count = results.result.objects.output.geometries.length;
          console.log(String(total_count));
          var grasp_count=0, qlue_count=0, detik_count=0;
          for (var i = 0; i < results.result.objects.output.geometries.length; i++) {
            console.log("got here");
            console.log(results.result.objects.output.geometries[i].properties.source);
            switch(results.result.objects.output.geometries[i].properties.source) {
              case "qlue":
                qlue_count++;
                break;
              case "detik":
                detik_count++;
                break;
              case "grasp":
                grasp_count++
            }
          }
          var myResponse = {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
              "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
            },
              body: JSON.stringify({ "total number of reports": String(total_count), "total number of qlue reports": String(qlue_count), "total number of detik reports": String(detik_count), "total number of Twitter & Telegram reports": String(grasp_count) })
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
