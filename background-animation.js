var GrislyGrotto;
(function (GrislyGrotto) {
    var BackgroundAnimation = (function () {
        function BackgroundAnimation() {
            this.fadeAlpha = 0.1;
            this.framerate = 20;
            this.entityCount = 20;
            this.heightMultiplier = 1000;
            this.entitites = [];
        }
        BackgroundAnimation.prototype.initialise = function (canvas, backgroundColour, primaryColour, secondaryColour) {
            var _this = this;
            this.context = canvas.getContext("2d");
            this.backgroundColour = backgroundColour;
            var interval = 1000 / this.framerate;
            setInterval(function () { _this.draw(); }, interval);
            this.resizeCanvas();
            var self = this;
            window.onresize = function () { self.resizeCanvas(); };
            this.entityCount = this.entityCount * (this.context.canvas.height / this.heightMultiplier);
            for (var i = 0; i < this.entityCount; i++)
                this.entitites.push(new WanderingTriangle(this.context.canvas, primaryColour, secondaryColour));
        };
        BackgroundAnimation.prototype.resizeCanvas = function () {
            this.context.canvas.width = document.body.clientWidth;
            this.context.canvas.height = document.body.clientHeight;
        };
        BackgroundAnimation.prototype.draw = function () {
            this.context.fillStyle = this.backgroundColour;
            this.context.globalAlpha = this.fadeAlpha;
            this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
            this.context.globalAlpha = 1;
            for (var i = 0; i < this.entitites.length; i++)
                this.entitites[i].draw(this.context);
        };
        return BackgroundAnimation;
    }());
    GrislyGrotto.BackgroundAnimation = BackgroundAnimation;
    var TriangleType;
    (function (TriangleType) {
        TriangleType[TriangleType["left"] = 0] = "left";
        TriangleType[TriangleType["right"] = 1] = "right";
        TriangleType[TriangleType["up"] = 2] = "up";
        TriangleType[TriangleType["down"] = 3] = "down";
    })(TriangleType || (TriangleType = {}));
    var WanderingTriangle = (function () {
        function WanderingTriangle(canvas, primaryColour, secondaryColour) {
            this.size = 15;
            this.chanceOfJump = 0.005;
            this.changeOfSecondaryColour = 0.25;
            this.canvas = canvas;
            this.colour = this.primaryColour = primaryColour;
            this.secondaryColour = secondaryColour;
            this.jump();
        }
        WanderingTriangle.prototype.jump = function () {
            this.point = {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height
            };
            this.type = Math.floor(Math.random() * 4);
            if (Math.random() < this.changeOfSecondaryColour)
                this.colour = this.secondaryColour;
            else
                this.colour = this.primaryColour;
        };
        WanderingTriangle.prototype.draw = function (context) {
            if (Math.random() < this.chanceOfJump)
                this.jump();
            context.fillStyle = context.strokeStyle = this.colour;
            context.beginPath();
            this.type = this.nextTriangle();
            this.triangleForType(context);
            context.closePath();
            if (Math.random() > 0.5)
                context.stroke();
            else
                context.fill();
        };
        WanderingTriangle.prototype.triangleForType = function (context) {
            if (this.type === TriangleType.up)
                this.upTriangle(context);
            else if (this.type === TriangleType.down)
                this.downTriangle(context);
            else if (this.type === TriangleType.left)
                this.leftTriangle(context);
            else if (this.type === TriangleType.right)
                this.rightTriangle(context);
        };
        WanderingTriangle.prototype.nextTriangle = function () {
            var random = Math.random();
            if (this.type === TriangleType.up)
                if (random < 0.2)
                    return TriangleType.right;
                else if (random < 0.4)
                    return TriangleType.left;
                else {
                    this.point.y += this.size * 2;
                    return TriangleType.down;
                }
            if (this.type === TriangleType.down)
                if (random < 0.2) {
                    this.point.y -= this.size * 2;
                    return TriangleType.up;
                }
                else if (random < 0.6)
                    return TriangleType.left;
                else
                    return TriangleType.right;
            if (this.type === TriangleType.left) {
                if (random < 0.1) {
                    this.point = { x: this.point.x + this.size, y: this.point.y - this.size };
                    return TriangleType.right;
                }
                else if (random < 0.4) {
                    this.point = { x: this.point.x + this.size, y: this.point.y + this.size };
                    return TriangleType.right;
                }
                else if (random < 0.7) {
                    this.point = { x: this.point.x + this.size * 2, y: this.point.y };
                    return TriangleType.right;
                }
                else
                    return TriangleType.up;
            }
            if (random < 0.1) {
                this.point = { x: this.point.x - this.size, y: this.point.y - this.size };
                return TriangleType.left;
            }
            else if (random < 0.4) {
                this.point = { x: this.point.x - this.size, y: this.point.y + this.size };
                return TriangleType.left;
            }
            else if (random < 0.7) {
                this.point = { x: this.point.x - this.size * 2, y: this.point.y };
                return TriangleType.left;
            }
            else
                return TriangleType.up;
        };
        WanderingTriangle.prototype.upTriangle = function (context) {
            var p = this.point;
            var s = this.size;
            context.moveTo(p.x, p.y);
            context.lineTo(p.x - s, p.y + s);
            context.lineTo(p.x + s, p.y + s);
            context.lineTo(p.x, p.y);
            this.type = TriangleType.up;
        };
        WanderingTriangle.prototype.downTriangle = function (context) {
            var p = this.point;
            var s = this.size;
            context.moveTo(p.x, p.y);
            context.lineTo(p.x - s, p.y - s);
            context.lineTo(p.x + s, p.y - s);
            context.lineTo(p.x, p.y);
            this.type = TriangleType.down;
        };
        WanderingTriangle.prototype.leftTriangle = function (context) {
            var p = this.point;
            var s = this.size;
            context.moveTo(p.x, p.y);
            context.lineTo(p.x + s, p.y - s);
            context.lineTo(p.x + s, p.y + s);
            context.lineTo(p.x, p.y);
            this.type = TriangleType.left;
        };
        WanderingTriangle.prototype.rightTriangle = function (context) {
            var p = this.point;
            var s = this.size;
            context.moveTo(p.x, p.y);
            context.lineTo(p.x - s, p.y - s);
            context.lineTo(p.x - s, p.y + s);
            context.lineTo(p.x, p.y);
            this.type = TriangleType.right;
        };
        return WanderingTriangle;
    }());
})(GrislyGrotto || (GrislyGrotto = {}));
//# sourceMappingURL=background-animation.js.map