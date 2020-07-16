window.onload = function () {
    canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var file = document.getElementById("uploaded-file");
    var audio = document.getElementById("audio");
    var test = document.getElementById('play-btn')
    var circle = document.getElementById('circle')
    var source, 
        style, 
        center_x, 
        center_y,
        radius,
        lineHeight,
        status, 
        context, 
        src, 
        analyser, 
        canvas, 
        bufferLength, 
        playerWidth, 
        playerHeight,
        frequencyArray;
     
    
    //--------Control volume using up and down keys---------    
    document.onkeydown = function (event) {
        switch (event.keyCode) {
            case 38:
        event.preventDefault();
        audio_vol = audio.volume;
        if (audio_vol != 1) {
            try {
                audio.volume = audio_vol + 0.02;
            }
            catch (err) {
                audio.volume = 1;
            }

        }

        break;
        case 40:
        event.preventDefault();
        audio_vol = audio.volume;
        if (audio_vol != 0) {
            try {
                audio.volume = audio_vol - 0.02;
            }
            catch (err) {
                audio.volume = 0;
            }

        }

        break;
    }
    };


    //------------onclick events------------------ 
    canvas.onclick = function() {
        if (status === 'playing'){
            audio.pause()
            status = 'paused'
        }else{
            audio.play();
            status = 'playing'
        }
            
    }
    
    circle.onclick = function() {
        style = 'circle'
        renderCircle()
    }

    // restart.onclick = () => {
    //     // audio.pause();
    //     audio.currentTime = 0;
    //     audio.play();
    // }

    bars.onclick = function () {
        style = 'bars';
        renderBars()
    }
    
    test.onclick = function(){
        // debugger
        audio.src = 'Beats-pop.mp3';
        source = 'Beats-pop.mp3'
        // console.log(test)
        player()  
    }
    
    
    //------------On uploading a file-----------------
    file.onchange = function () {
        var files = this.files;
        // debugger
        console.log(files[0]);
        audio.src = URL.createObjectURL(files[0]);
        player()
    }

    //----------------Sun shape visualizer--------------
    function renderCircle() {
        requestAnimationFrame(renderCircle);

        center_x = canvas.width / 2;
        center_y = canvas.height / 2;
        radius = 150;

        // style the background
        var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "rgba(35, 7, 77, 1)");
        gradient.addColorStop(1, "rgba(24, 83, 51, 1)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        analyser.getByteFrequencyData(frequencyArray);
        for (var i = 0; i < bufferLength; i++) {

            lineHeight = frequencyArray[i];

            // set coordinates
            x1 = center_x + Math.cos(i) * (radius);
            y1 = center_y + Math.sin(i) * (radius);
            x2 = center_x + Math.cos(i) * (radius + lineHeight);
            y2 = center_y + Math.sin(i) * (radius + lineHeight);

            //draw lines around the circle
            var lineColor = "rgb(" + frequencyArray[i]+i+100 + ", " + 25*i + ", " + 100 + ")";
            ctx.strokeStyle = lineColor;
            // ctx.lineWidth = bar_width;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

        }
    }


    //-------------Bars shape visualizer---------------
    function renderBars() { //animates the graphics to the audio frequency
        requestAnimationFrame(renderBars);
        analyser.getByteFrequencyData(frequencyArray);
        var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "rgba(35, 7, 77, 1)");
        gradient.addColorStop(1, "rgba(24, 83, 51, 1)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, playerWidth, playerHeight);

        var barWidth = (playerWidth / bufferLength) * 2.5;
        var barHeight;
        var x = 0;

        for (var i = 0; i < bufferLength; i++) {
            barHeight = frequencyArray[i] * 1.5;

            var r = barHeight + i + 100;
            var g = 25 * i;

            ctx.fillStyle = "rgb(" + r + "," + g + "," + 100 + ")";
            // ctx.fillStyle = "black";
            ctx.fillRect(x, playerHeight - barHeight, barWidth, barHeight);//takes (x-pos, y-pos, width, height) and draw the bars

            x += barWidth + 1; //changing the position of hte bar 
        }
    }

    //--------------Main function for the player-------------- 
    function player() {
        audio.load();
        audio.play();
        status = 'playing';
        context = new AudioContext();  //create an AudioContext object instance(from JS Audio API)
        src = context.createMediaElementSource(audio);
        analyser = context.createAnalyser(); //AnalyserNode method to create analyser using the AudioContext API object

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        src.connect(analyser);
        analyser.connect(context.destination);
        
        analyser.fftSize = 256;
        
        bufferLength = analyser.frequencyBinCount;
        // console.log(bufferLength);
        
        frequencyArray = new Uint8Array(bufferLength);
        
        playerWidth = canvas.width;
        playerHeight = canvas.height;
        // console.log(style)
        audio.play();

        if (style === 'circle'){
            renderCircle()
        }else {
            renderBars();
        }
    };
}

