window.addEventListener("load", function() {
    
    var started = false, canvas, context, tool, currentTool, color, lineWidth, clear;

    var properties = {
        color: "black",
        lineWidth: "4"
    };

    var figure = {
        startPointX: 0,
        startPointY: 0,
        lastPointX: 0,
        lastPointY: 0
    }

    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    tool = document.getElementsByName("tool");
    color = document.getElementsByName("color");
    lineWidth = document.getElementById("lineWidth");
    clear = document.getElementById("clear");
   
    canvas.addEventListener("mousemove", moveHandler, false);
    canvas.addEventListener("mousedown", downHandler, false);
    canvas.addEventListener("mouseup", upHandler, false);

    lineWidth.addEventListener("change", lineWidthSelected, false);
    clear.addEventListener("click", clearCanvas, false);

    for(var i = 0; i < tool.length; i++) {
        tool[i].addEventListener("click", toolSelected, false);
    }
    for(var i = 0; i < color.length; i++) {
        color[i].addEventListener("click", colorSelected, false);
    }
    

    function lineWidthSelected() {
        properties.lineWidth = this.options[this.selectedIndex].value;
    }

    function toolSelected() {
        for(var i = 0; i < tool.length; i++) {
            if(tool[i] != this) tool[i].checked = false;
        }

        if (this.checked == true) {
            canvas.style.cursor = window.getComputedStyle(this).backgroundImage + ", auto";
            currentTool = this;
        } else {
            canvas.style.cursor = "default";
            currentTool = null;
        }
    }

    function colorSelected() {
        for(var i = 0; i < color.length; i++) {
            if(color[i] != this) color[i].checked = false;
        }

        if (this.checked == true) {
            properties.color = window.getComputedStyle(this).backgroundColor;
        } else {
            properties.color = "black";
        }
    }

    function clearCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        this.checked = false;
        canvas.style.cursor = "default";
        currentTool = null;
    }
      
    function getCoords(e) {
        var x, y;

        if (e.offsetX || e.offsetX == 0) {
            x = e.offsetX;
            y = e.offsetY;
        }

        return { x: x, y: y };
    }

    function downHandler(e) {
        if (currentTool.dataset.id == "fill") {
            canvas.style.backgroundColor = properties.color;
        } else if(currentTool.dataset.id == "rectangle") {
            figure.startPointX = getCoords(e).x;
            figure.startPointY = getCoords(e).y;
            context.rect(figure.startPointX, figure.startPointY, 0, 0);
        } else {
            context.beginPath();
            context.moveTo(getCoords(e).x, getCoords(e).y);
            
        }
        started = true;
    }
            
    function upHandler(e) {
        started = false;
        if(currentTool.dataset.id == "line") {
            context.beginPath();
            context.lineWidth = properties.lineWidth;
            context.strokeStyle = properties.color;
            context.moveTo(figure.startPointX, figure.startPointY);
            context.lineTo(figure.lastPointX, figure.lastPointY);
            context.stroke();              
        }
        figure.startPointX = 0;
        figure.startPointY = 0;
    }

    function moveHandler(e) {
        if (started) {
            context.lineTo(getCoords(e).x, getCoords(e).y);
            
            if(currentTool.dataset.id == "pencil") {
                context.lineWidth = properties.lineWidth;
                context.strokeStyle = properties.color;
                context.stroke();
            } else if(currentTool.dataset.id == "rubber") {
                // змінюємо параметр, щоб витирати контент
                context.globalCompositeOperation = 'destination-out'; 
                context.lineWidth = properties.lineWidth;
                context.strokeStyle =  window.getComputedStyle(canvas).backgroundColor;
                // повертаємо значення за замовчуванням
                context.globalCompositeOperation = 'source-over'; 
                context.stroke();
            } else if(currentTool.dataset.id == "rectangle") {
                context.lineWidth = properties.lineWidth;
                context.fillStyle = properties.color;

                figure.lastPointX = getCoords(e).x;
                figure.lastPointY = getCoords(e).y;

                // Працює, але стирає весь вміст canvas
                // context.clearRect(0, 0, canvas.width, canvas.height);

                context.fillRect(figure.startPointX, 
                                 figure.startPointY, 
                                 figure.lastPointX - figure.startPointX, 
                                 figure.lastPointY - figure.startPointY);         
            } else if(currentTool.dataset.id == "line") {
                if (figure.startPointX == 0) {
                    figure.startPointX = getCoords(e).x;
                    figure.startPointY = getCoords(e).y;
                }
                figure.lastPointX = getCoords(e).x;
                figure.lastPointY = getCoords(e).y; 
            }
        } 
    }
});