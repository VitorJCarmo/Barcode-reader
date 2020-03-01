$(document).ready(function(){
    Quagga.init({
    inputStream : {
      name : "Live",
      type : "LiveStream",
      target: document.getElementById('reader')
    },
    decoder : {
      readers : [
          'code_128_reader',
          {
            format: "ean_reader",
            config: {
                supplements: [
                    'ean_5_reader', 'ean_2_reader','ean_13_reader'
                ]
            }
            },
          'ean_8_reader'
        ]
    }
  }, function(err) {
      if (err) {
          console.log(err);
          return
      }
      console.log("Initialization finished. Ready to start");
      Quagga.start();
  });    
})

Quagga.onProcessed(function(result) {
    var drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {
        if (result.boxes) {
            drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
            result.boxes.filter(function (box) {
                return box !== result.box;
            }).forEach(function (box) {
                Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
            });
        }

        if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
        }

        if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
        }
    }
});

Quagga.onDetected(function(result) {    		

        console.log('result', result);

        document.getElementById("result").innerHTML = result.codeResult.code;
        
        Quagga.stop();				
    
});