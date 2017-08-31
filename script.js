'use strict';

$(document).ready(function () {

    $("canvas").click(function (event) {
        let x = Math.floor(event.offsetX / imgClipWidth);
        let y = Math.floor(event.offsetY / imgClipHeight);
        changePuzzles(x, y);
        draw();
    });

    function changePuzzles(x, y) {
        let id = posToId(x, y);
        if (isBlankNeighbor(id)) {
            let blank = board[blankId];
            let imgId = board[id].imgClipId;
            board[id].set(blank.imgClipId, true);
            blank.set(imgId, false);
            blankId = id;
        }
    }

    function posToId(x, y) {
        return y * numberOfColumns + x;
    }

    function isBlankNeighbor(id) {
        return id - blankId === numberOfColumns
            || blankId - id === numberOfColumns
            || id - blankId === 1
            || blankId - id === 1;
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
    let blankId = 0;

    let input = document.getElementById('imgLoader');
    input.addEventListener('change', handleFiles, false);

    function handleFiles(e) {
        file = e.target.files[0];
        reader.readAsDataURL(file);
    }

    reader.onloadend = function () {
        img.src = reader.result;
    }

    img.onload = function () {
        setCanvas();
        setImgClip();
        blankId = 0;
        setBoard();
        draw();
    }

    function setCanvas() {
        ctx.canvas.width = img.width;
        ctx.canvas.height = img.height;
    }

    function setImgClip() {
        imgClipWidth = img.width / numberOfColumns;
        imgClipHeight = img.height / numberOfRows;
    }

    function setBoard() {
        board = [];
        for (let id = 0; id < numberOfRows * numberOfColumns; id++) {
            board[id] = new Puzzle(id);
        }
        board[0].isBlank = true;
    }

    function draw() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        board.forEach(function (puzzle) {
            puzzle.draw(ctx);
        })
    }

    function Puzzle(id) {
        this.puzzleId = id;
        this.imgClipId = id;
        this.isBlank = false;
        this.getX = function () {
            return Math.floor(this.imgClipId % numberOfColumns);
        }
        this.getY = function () {
            return Math.floor(this.imgClipId / numberOfColumns);
        }
        this.positionX = this.getX() * imgClipWidth;
        this.positionY = this.getY() * imgClipHeight;

        this.onPosition = function () {
            return this.puzzleId === this.imgClipId;
        }

        this.draw = function (ctx) {
            let leftClip = this.getX() * imgClipWidth;
            let topClip = this.getY() * imgClipHeight;
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
            ctx.fillText(this.puzzleId + "/" + this.imgClipId, this.positionX, this.positionY + 30);
        }

        this.set = function (id, blank) {
            this.imgClipId = id;
            this.isBlank = blank;
        }
    };
});