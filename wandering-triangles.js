let wanderingTriangles = {}

// call this to create a basic, default set of settings to modify
wanderingTriangles.baseSettings = function() {
    return {
        fadeAlpha: 0.1,
        framerate: 18,
        triangleSize: 15,
        triangleDensity: 0.5, // how many triangles per triangleSize columns of the canvas
        chanceOfJump: 0.005,
        chanceOfSecondaryColour: 0.25,
        chanceOfFill: 0.5,
        backgroundColour: "black",
        primaryColour: "white",
        secondaryColour: "gray",
    };
}

wanderingTriangles.init = function(canvas, settings) {

    var instance = {
        context: canvas.getContext("2d"),
        settings: settings,
        state: [],
        enabled: true,      // toggle this to false to stop drawning triangles (a 'pause', but with fading)
        intervalHandle: 0     // used to track the internal draw loop
    };

    var interval = 1000 / instance.settings.framerate;
    clearInterval(instance.intervalHandle);
    var self = this;
    instance.intervalHandle = setInterval(function () { 
        self.draw(instance);
    }, interval);

    return instance;
};

wanderingTriangles.draw = function(instance) {
    // an alpha overdraw 'fades out' the triangles
    context = instance.context;
    canvas = context.canvas;
    settings = instance.settings;

    context.fillStyle = settings.backgroundColour;
    context.globalAlpha = settings.fadeAlpha;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = 1;

    // only refresh/draw-new triangles if the animation is 'enabled'. this is how pausing works
    if (instance.enabled) {
        var entityCount = (canvas.width / settings.triangleSize) * settings.triangleDensity;
        for (var i = 0; i < entityCount; i++) {
            if (instance.state.length <= i) {
                instance.state.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    type: Math.floor(Math.random() * 4),
                    colour: settings.primaryColour
                });
            }
            instance.state[i] = this.updateTriangle(instance, instance.state[i])
            this.drawTriangle(instance, instance.state[i])
        }
    }
};

wanderingTriangles.updateTriangle = function(instance, triangle) {

    settings = instance.settings;
    canvas = instance.context.canvas;

    if (triangle.type === 0)
        triangle = this.nextTriangleFromUp(triangle, settings.triangleSize);
    else if (triangle.type === 1)
        triangle = this.nextTriangleFromDown(triangle, settings.triangleSize);
    else if (triangle.type === 2)
        triangle = this.nextTriangleFromLeft(triangle, settings.triangleSize);
    else
        triangle = this.nextTriangleFromRight(triangle, settings.triangleSize);

    let offscreen = 
        triangle.x < -settings.triangleSize ||
        triangle.y < -settings.triangleSize ||
        triangle.x > canvas.width + settings.triangleSize ||
        triangle.y > canvas.height + settings.triangleSize
    if (Math.random() > settings.chanceOfJump && !offscreen) 
        return triangle;
        
    triangle.x = Math.random() * canvas.width;
    triangle.y = Math.random() * canvas.height;
    triangle.type = Math.floor(Math.random() * 4);

    if (Math.random() < settings.chanceOfSecondaryColour)
        triangle.colour = settings.secondaryColour;
    else
        triangle.colour = settings.primaryColour;

    return triangle;
};

wanderingTriangles.drawTriangle = function(instance, triangle) {

    settings = instance.settings;
    context = instance.context;

    context.fillStyle = context.strokeStyle = triangle.colour;
    context.beginPath();
    
    if (triangle.type === 0)
        this.upTrianglePath(context, triangle.x, triangle.y, settings.triangleSize);
    else if (triangle.type === 1)
        this.downTrianglePath(context, triangle.x, triangle.y, settings.triangleSize);
    else if (triangle.type === 2)
        this.leftTrianglePath(context, triangle.x, triangle.y, settings.triangleSize);
    else
        this.rightTrianglePath(context, triangle.x, triangle.y, settings.triangleSize);

    context.closePath();
    if (Math.random() > settings.chanceOfFill)
        context.stroke();
    else
        context.fill();
};

wanderingTriangles.nextTriangleFromUp = function(triangle, triangleSize) {
    var random = Math.random();
    if (random < 0.2)
        triangle.type = 3; // right
    else if (random < 0.4)
        triangle.type = 2; // left
    else {
        triangle.y += triangleSize * 2;
        triangle.type = 1; // down
    }
    return triangle;
};

wanderingTriangles.nextTriangleFromDown = function(triangle, triangleSize) {
    var random = Math.random();
    if (random < 0.2) {
        triangle.y -= triangleSize * 2;
        triangle.type = 0; // up
    }
    else if (random < 0.6)
        triangle.type = 2; // left
    else
        triangle.type = 3; // right
    return triangle;
};
           
wanderingTriangles.nextTriangleFromLeft = function(triangle, triangleSize) {
    var random = Math.random();
    if (random < 0.1) {
        triangle.x += triangleSize;
        triangle.y -= triangleSize;
        triangle.type = 3; // right
    }
    else if (random < 0.4) {
        triangle.x += triangleSize;
        triangle.y += triangleSize;
        triangle.type = 3; // right
    }
    else if (random < 0.7) {
        triangle.x += triangleSize * 2;
        triangle.type = 3; // right
    }
    else
        triangle.type = 0; // up
    return triangle;
};

wanderingTriangles.nextTriangleFromRight = function(triangle, triangleSize) {
    var random = Math.random();
    if (random < 0.1) {
        triangle.x -= triangleSize;
        triangle.y -= triangleSize;
        triangle.type = 2; // left
    }
    else if (random < 0.4) {
        triangle.x -= triangleSize;
        triangle.y += triangleSize;
        triangle.type = 2; // left
    }
    else if (random < 0.7) {
        triangle.x -= triangleSize * 2;
        triangle.type = 2; // left
    }
    else
        triangle.type = 0; // up
    return triangle;
};

wanderingTriangles.upTrianglePath = function (context, x, y, triangleSize) {
    var s = triangleSize;
    context.moveTo(x, y);
    context.lineTo(x - s, y + s);
    context.lineTo(x + s, y + s);
    context.lineTo(x, y);
};

wanderingTriangles.downTrianglePath = function (context, x, y, triangleSize) {
    var s = triangleSize;
    context.moveTo(x, y);
    context.lineTo(x - s, y - s);
    context.lineTo(x + s, y - s);
    context.lineTo(x, y);
};

wanderingTriangles.leftTrianglePath = function (context, x, y, triangleSize) {
    var s = triangleSize;
    context.moveTo(x, y);
    context.lineTo(x + s, y - s);
    context.lineTo(x + s, y + s);
    context.lineTo(x, y);
};

wanderingTriangles.rightTrianglePath = function (context, x, y, triangleSize) {
    var s = triangleSize;
    context.moveTo(x, y);
    context.lineTo(x - s, y - s);
    context.lineTo(x - s, y + s);
    context.lineTo(x, y);
};
