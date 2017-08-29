$(document).ready(function () {
    var input = document.getElementById('input');
    input.addEventListener('change', handleFiles, false);

    function Puzzle() {
        var id = 0;
    };

    function handleFiles(e) {
        var ctx = document.getElementById('canvas').getContext('2d');
        var reader = new FileReader();
        var file = e.target.files[0];
        // load to image to get it's width/height
        var img = new Image();
        img.onload = function () {
            // scale canvas to image
            ctx.canvas.width = img.width;
            ctx.canvas.height = img.height;
            // draw image
            ctx.drawImage(img, 0, 0
                , ctx.canvas.width / 2, ctx.canvas.height / 2, 0, 0, ctx.canvas.width / 2, ctx.canvas.height / 2
            );
            ctx.drawImage(img, ctx.canvas.width / 2, ctx.canvas.height / 2
                , ctx.canvas.width / 2, ctx.canvas.height / 2, ctx.canvas.width / 2, ctx.canvas.height / 2, ctx.canvas.width / 2, ctx.canvas.height / 2
            );
        }
        // this is to setup loading the image
        reader.onloadend = function () {
            img.src = reader.result;
        }
        // this is to read the file
        reader.readAsDataURL(file);
    }
});