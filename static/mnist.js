/*
Copyright 2022 Steven Su

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

var canvas = new fabric.Canvas('canvas');
canvas.isDrawingMode = true;
canvas.freeDrawingBrush.width = 24;
canvas.freeDrawingBrush.color = "#000000";
canvas.backgroundColor = "#ffffff";
canvas.setHeight(336);
canvas.setWidth(336);
canvas.renderAll();

$("#clear-canvas").click(function() {
    $("#prediction-section").hide();
    $("#prediction-empty").show();
    $("#prediction-loading").hide();
    canvas.clear();
    canvas.backgroundColor = "#ffffff";
    canvas.renderAll();
})

$("#predict-canvas").click(function() {
    $("#predict-canvas").attr("disabled", true);
    $("#prediction-section").hide();
    $("#prediction-empty").hide();
    $("#prediction-loading").show();

    // scale down the drawing canvas
    ctx = canvas.getContext('2d');
    const ctxScaled = document.getElementById("internal-scaled-canvas").getContext('2d');
    ctxScaled.save();
    ctxScaled.clearRect(0, 0, ctxScaled.canvas.height, ctxScaled.canvas.width); // clear temp canvas
    ctxScaled.scale(28.0 / ctx.canvas.width, 28.0 / ctx.canvas.height);
    ctxScaled.drawImage(document.getElementById('canvas'), 0, 0);
    ctxScaled.restore();

    // convert the image to a base64 url
    const imageData = document.getElementById("internal-scaled-canvas").toDataURL('image/jpeg', 1.0);

    // make the prediction from the server
    var formData = new FormData();
    formData.append("image",imageData)
    $.post("/predict", {"image":imageData}, function(data) {
        $("#final-number").text(data.answer);
        for (var num = 0; num < 10; num++) {
            $("#probability-" + num + "-key").text(num);
            $("#probability-" + num + "-value").text(data.probabilities[num]);
            $("#probability-" + num).removeClass("table-success");
            if (data.answer == num) {
                $("#probability-" + num).addClass("table-success");
            }
        }
        $("#predict-canvas").attr("disabled", false);
        $("#prediction-section").show();
        $("#prediction-loading").hide();
    }, "json");
})