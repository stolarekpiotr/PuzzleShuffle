'use strict';

$(document).ready(function () {
    //==========================================================
    //Bootstrap tooltip start
    //==========================================================
    $("body").tooltip({ selector: '[data-toggle=tooltip]' });
    //==========================================================

    //==========================================================
    //Click on canvas handle
    //==========================================================
    let canvas = $("canvas");
    canvas.click(function (event) {
        let x = Math.floor(event.offsetX / imgClipWidth);
        let y = Math.floor(event.offsetY / imgClipHeight);
        let id = posToId(x, y);
        if (debug) {
            console.log("Click: ", x, y, id);
        }
        if (isBlankNeighbor(id)) {
            changePuzzles(id);
        }
        draw();
    });

    function changePuzzles(id) {
        let blank = board[blankId];
        let imgId = board[id].imgClipId;
        board[id].set(blank.imgClipId, true);
        blank.set(imgId, false);
        blankId = id;
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
    //==========================================================

    //==========================================================
    //Settings input
    //==========================================================
    let numberOfRows = 4;
    let numberOfColumns = 4;

    let numberOfRowsInput = $("#numberOfRows");
    numberOfRowsInput.val(numberOfRows);
    numberOfRowsInput.change(function () {
        numberOfRows = parseInt(numberOfRowsInput.val());
        refreshBoard();
    })

    let numberOfColumnsInput = $("#numberOfColumns");
    numberOfColumnsInput.val(numberOfColumns);
    numberOfColumnsInput.change(function () {
        numberOfColumns = parseInt(numberOfColumnsInput.val());
        refreshBoard();
    })
    //==========================================================

    let ctx = canvas[0].getContext('2d');
    let reader = new FileReader();
    reader.onloadend = function () {
        img.src = reader.result;
    }
    let img = new Image();
    img.onload = function () {
        setCanvas();
        refreshBoard();
    }
    let startImg = 'https://www.free-mandalas.net/wp-content/uploads/sites/14/nggallery/normal/dynamic/mandala-to-download-owl.jpg-nggid03485-ngg0dyn-220x220x100-00f0w010c011r110f110r010t010.jpg';
    img.src = startImg;
    let imgClipWidth = 0;
    let imgClipHeight = 0;

    let board = [];
    let blankId = 0;

    let debug = false;

    let resetButton = $('#resetButton');
    resetButton.click(function () {
        shuffleBoard();
        draw();
    });

    let showImageButton = $('#showImage');
    showImageButton.mouseover(function () {
        ctx.drawImage(img, 0, 0);
    });
    showImageButton.mouseout(function () {
        draw();
    });

    let input = $('#imgLoader');
    input.change(function (e) {
        urlInput.val('');
        let file = e.target.files[0];
        reader.readAsDataURL(file);
    });

    let filenameLabel = $('#filename');

    let urlInput = $('#imgUrl');
    urlInput.change(function () {
        img.src = urlInput.val();
        input[0].form.reset();
        filenameLabel.html('');
    });

    function setCanvas() {
        ctx.canvas.width = img.width;
        ctx.canvas.height = img.height;
    }

    function setImgClip() {
        imgClipWidth = img.width / numberOfColumns;
        imgClipHeight = img.height / numberOfRows;
    }

    function refreshBoard() {
        setImgClip();
        blankId = 0;
        setBoard();
        draw();
    }

    function setBoard() {
        board = [];
        for (let id = 0; id < numberOfRows * numberOfColumns; id++) {
            board[id] = new Puzzle(id);
        }
        board[0].isBlank = true;
        shuffleBoard();
    }

    function draw() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        board.forEach(function (puzzle) {
            puzzle.draw(ctx);
        })
    }

    function shuffleBoard() {
        let moves = 0;
        while (moves < 1000) {
            let direction = getDirection();
            let id = -1;
            if (direction === 0 && canMoveUp()) {
                id = getMoveUp();
            } else if (direction === 1 && canMoveDown()) {
                id = getMoveDown();
            } else if (direction === 2 && canMoveLeft()) {
                id = getMoveLeft();
            } else if (direction === 3 && canMoveRight()) {
                id = getMoveRight();
            }
            if (id !== -1) {
                changePuzzles(id);
                moves++;
            }
        }
    }

    function getMoveUp() {
        return blankId - numberOfColumns;
    }
    function canMoveUp() {
        return blankId - numberOfColumns >= 0;
    }

    function getMoveDown() {
        return blankId + numberOfColumns;
    }
    function canMoveDown() {
        return blankId < numberOfColumns * (numberOfRows - 1);
    }

    function getMoveLeft() {
        return blankId - 1;
    }
    function canMoveLeft(id) {
        return blankId % numberOfColumns > 0;
    }

    function getMoveRight() {
        return blankId + 1;
    }
    function canMoveRight(id) {
        return blankId % numberOfColumns < numberOfColumns - 1;
    }

    function getDirection() {
        return Math.floor((Math.random() * 10)) % 4;
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
            if (!debug) {
                ctx.strokeStyle = 'rgb(0,0,0)';
            } else if (this.onPosition()) {
                ctx.strokeStyle = 'rgb(0,255,0)';  // some color/style
            } else {
                ctx.strokeStyle = 'rgb(255, 0, 0)';  // some color/style
            }
            if (this.isBlank) {
                ctx.strokeStyle = 'rgb(255, 0, 0)';
            }
            ctx.lineWidth = 2;         // thickness
            ctx.strokeRect(this.positionX + 1, this.positionY + 1, imgClipWidth - 2, imgClipHeight - 2);
            //ctx.font = "30px Arial";
            //ctx.fillText(this.puzzleId + "/" + this.imgClipId, this.positionX, this.positionY + 30);
        }

        this.set = function (id, blank) {
            this.imgClipId = id;
            this.isBlank = blank;
        }
    };
});