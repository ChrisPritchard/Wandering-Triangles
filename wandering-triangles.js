let wanderingTriangles = {}

// call this to create a basic, default set of settings to modify
wanderingTriangles.baseSettings = function() {
    return {
        fadeAlpha: 0.1,
        framerate: 50,
        triangleSize: 15,
        triangleDensity: 0.5, // how many triangles per triangleSize columns of the canvas
        chanceOfJump: 0.005,
        chanceOfSecondaryColour: 0.25,
        chanceOfFill: 0.5,
        backgroundColour: "black",
        primaryColour: "white",
        secondaryColour: "gray",
        directionBias: 1
    };
}

wanderingTriangles.constants = {
    UP: 0, DOWN: 1, LEFT: 2, RIGHT: 3
};

// triangles are drawn from their 'point'. so a right triangle, pointing right, will actually
// extend further left than the current x,y. This is important to understand when looking into 
// directions and chances later.

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

wanderingTriangles.pick = function(odds) {
    var total = 0.0;
    for (var i = 0; i < odds.length; i++)
        total += odds[i];
    var result = Math.random() * total;
    total = 0.0;
    for (var i = 0; i < odds.length; i++) {
        total += odds[i];
        if (result < total)
            return i;
    }
    throw "error"; // should not be reached
}

wanderingTriangles.updateTriangle = function(instance, triangle) {

    settings = instance.settings;
    canvas = instance.context.canvas;

    if (triangle.type === this.constants.UP)
        triangle = this.nextTriangleFromUp(triangle, settings.triangleSize, settings.directionBias);
    else if (triangle.type === this.constants.DOWN)
        triangle = this.nextTriangleFromDown(triangle, settings.triangleSize, settings.directionBias);
    else if (triangle.type === this.constants.LEFT)
        triangle = this.nextTriangleFromLeft(triangle, settings.triangleSize, settings.directionBias);
    else
        triangle = this.nextTriangleFromRight(triangle, settings.triangleSize, settings.directionBias);

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

wanderingTriangles.nextTriangleFromUp = function(triangle, triangleSize, directionBias) {
    var odds = [0.33, 0.33, 0.33];
    if (directionBias == this.constants.LEFT) {
        odds = [0.6, 0.2, 0.2];
    } else if (directionBias == this.constants.RIGHT) {
        odds = [0.2, 0.6, 0.2];
    } else if (directionBias == this.constants.DOWN) {
        odds = [0.2, 0.2, 0.6];
    }

    var choice = this.pick(odds);
    if (choice == 0)
        triangle.type = this.constants.RIGHT; // triangle is further left overall
    else if (choice == 1)
        triangle.type = this.constants.LEFT; // triangle is further right over all
    else {
        triangle.y += triangleSize * 2;
        triangle.type = this.constants.DOWN; // triangle is lower
    }
    return triangle;
};

wanderingTriangles.nextTriangleFromDown = function(triangle, triangleSize, directionBias) {
    var odds = [0.33, 0.33, 0.33];
    if (directionBias == this.constants.LEFT) {
        odds = [0.6, 0.2, 0.2];
    } else if (directionBias == this.constants.RIGHT) {
        odds = [0.2, 0.6, 0.2];
    } else if (directionBias == this.constants.UP) {
        odds = [0.2, 0.2, 0.6];
    }

    var choice = this.pick(odds);
    if (choice == 0)
        triangle.type = this.constants.RIGHT; // triangle is further left overall
    else if (choice == 1)
        triangle.type = this.constants.LEFT; // triangle is further right over all
    else {
        triangle.y -= triangleSize * 2;
        triangle.type = this.constants.UP; // triangle is higher
    }
    return triangle;
};
           
wanderingTriangles.nextTriangleFromLeft = function(triangle, triangleSize, directionBias) {
    var odds = [0.33, 0.33, 0.33, 0.33, 0.33];
    if (directionBias == this.constants.RIGHT) {
        odds = [0.2, 0.2, 0.5, 0.2, 0.2];
    } else if (directionBias == this.constants.UP) {
        odds = [0.4, 0.2, 0.2, 0.4, 0.2];
    } else if (directionBias == this.constants.DOWN) {
        odds = [0.2, 0.4, 0.2, 0.2, 0.4];
    }

    var choice = this.pick(odds);
    if (choice == 0) {
        triangle.x += triangleSize;
        triangle.y -= triangleSize;
        triangle.type = this.constants.RIGHT; // right up (triangle is higher)
    } else if (choice == 1) {
        triangle.x += triangleSize;
        triangle.y += triangleSize;
        triangle.type = this.constants.RIGHT; // right down (triangle is lower)
    } else if (choice == 2) {
        triangle.x += triangleSize * 2;
        triangle.type = this.constants.RIGHT; // right level (triangle is back to back with current)
    } else if (choice == 3) {
        triangle.type = this.constants.DOWN; // point down (triangle is higher)
    } else {
        triangle.type = this.constants.UP; // point up (triangle is lower)
    }
    
    return triangle;
};

wanderingTriangles.nextTriangleFromRight = function(triangle, triangleSize, directionBias) {
    var odds = [0.33, 0.33, 0.33, 0.33, 0.33];
    if (directionBias == this.constants.LEFT) {
        odds = [0.2, 0.2, 0.5, 0.2, 0.2];
    } else if (directionBias == this.constants.UP) {
        odds = [0.4, 0.2, 0.2, 0.4, 0.2];
    } else if (directionBias == this.constants.DOWN) {
        odds = [0.2, 0.4, 0.2, 0.2, 0.4];
    }

    var choice = this.pick(odds);
    if (choice == 0) {
        triangle.x -= triangleSize;
        triangle.y -= triangleSize;
        triangle.type = this.constants.LEFT; // left up (triangle is higher)
    } else if (choice == 1) {
        triangle.x -= triangleSize;
        triangle.y += triangleSize;
        triangle.type = this.constants.LEFT; // left down (triangle is lower)
    } else if (choice == 2) {
        triangle.x -= triangleSize * 2;
        triangle.type = this.constants.LEFT; // left level (triangle is back to back with current)
    } else if (choice == 3) {
        triangle.type = this.constants.DOWN; // point down (triangle is higher)
    } else {
        triangle.type = this.constants.UP; // point up (triangle is lower)
    }
    
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
