'use strict';

$(document).ready(function () {
    let input = document.getElementById('imgLoader');
    input.addEventListener('change', handleFiles, false);

    $("canvas").click(function (event) {
        let x = Math.floor(event.offsetX / imgClipWidth);
        let y = Math.floor(event.offsetY / imgClipHeight);
        if(board[0]) {
            console.log(x,y);
            changePuzzles(x,y);
            draw();
        }
    });

    function changePuzzles(x,y) {
        if(x === blankX) {
            if(y-1 === blankY) {
                let blank = board[blankY][blankX];
                board[y][x].set(blank.actualX, blank.actualY);
                blank.set(x,y);
            }
        }
    }

    let ctx = document.getElementById('canvas').getContext('2d');
    let reader = new FileReader();
    let file;
    let img = new Image();
    let board = []; //[rows][columns]
    let numberOfRows = 4;
    let numberOfColumns = 4;
    let imgClipWidth = 0;
    let imgClipHeight = 0;
    let blankX = 0;
    let blankY = 0;

    function handleFiles(e) {
        file = e.target.files[0];
        // this is to read the file
        reader.readAsDataURL(file);
    }

    // this is to setup loading the image
    reader.onloadend = function () {
        img.src = reader.result;
    }

    // load to image to get it's width/height
    img.onload = function () {
        // scale canvas to image
        ctx.canvas.width = img.width;
        ctx.canvas.height = img.height;
        imgClipWidth = img.width / numberOfColumns;
        imgClipHeight = img.height / numberOfRows;
        blankX = 0;
        blankY = 0;
        board = [];
        for (let row = 0; row < numberOfRows; row++) {
            board[row] = [];
            for (let column = 0; column < numberOfColumns; column++) {
                board[row][column] = new Puzzle(row, column);
            }
        }
        board[0][0].isBlank = true;
        draw();
        
    }

    function draw() {
        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
        board.forEach(function (row) {
            row.forEach(function (puzzle) {
                puzzle.draw(ctx);
            })
        })
    }

    function Puzzle(targetRow, targetColumn) {
        this.targetY = targetRow;
        this.targetX = targetColumn;
        this.actualY = targetRow;
        this.actualX = targetColumn;
        this.positionX = this.targetX * imgClipWidth;
        this.positionY = this.targetY * imgClipHeight;
        this.isBlank = false;

        this.onPosition = function () {
            return this.targetX === this.actualX && this.targetY === this.actualY;
        }

        this.draw = function (ctx) {
            let leftClip = this.actualX * imgClipWidth;
            let topClip = this.actualY * imgClipHeight;
            if (!this.isBlank) {
                ctx.drawImage(img, leftClip, topClip, imgClipWidth, imgClipHeight, this.positionX, this.positionY, imgClipWidth, imgClipHeight);
            }
            if (this.onPosition()) {
                ctx.strokeStyle = 'rgb(0,255,0)';  // some color/style
            } else {
                ctx.strokeStyle = 'rgb(255, 0, 0)';  // some color/style
            }
            ctx.lineWidth = 2;         // thickness
            ctx.strokeRect(this.positionX, this.positionY, imgClipWidth, imgClipHeight);
            ctx.font = "30px Arial";
            ctx.fillText(this.actualX + "/" + this.actualY,this.positionX,this.positionY+30);
            ctx.fillText(this.targetX + "/" + this.targetY,this.positionX,this.positionY+60);
        }

        this.log = function () {
            console.log(targetRow, targetColumn);
        }

        this.set = function (x,y) {
            this.actualX = x;
            this.actualY = y;
            this.isBlank = !this.blank;
        }
    };
});