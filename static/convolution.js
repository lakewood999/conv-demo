/*
Copyright 2022 Steven Su

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

var filterSize = 3;
$("#filter-size-select").change(function() {
    // disable all sets of defaults
    $("#3-sample").hide();
    $("#no-sample").show();

    var filterSize = $("#filter-size-select").val();
    $("#kernel-container").empty();
    for (var i = 0; i < filterSize; i++) {
        var newRow = $("<div class='row'></div>");
        for (var j = 0; j < filterSize; j++) {
            var newColumn = $("<div class='col-sm'></div>");
            var newInput = $("<input type='number' class='form-control' id='kernel-input-" + i + "-" + j + "' value='0'></input>");
            newColumn.append(newInput)
            newRow.append(newColumn);
        }
        $("#kernel-container").append(newRow);
    }
    if (filterSize == 3) {
        console.log("hello")
        $("#3-sample").show();
        $("#no-sample").hide();
    }
});

$("#image-upload").change(function(el) {
    if ($("#image-upload").prop('files').length < 1) {
        $("#preview-box").hide();
    } else {
        $("#preview-box").show();
    }
    var reader = new FileReader();
    reader.onload = function (e) {
        $("#preview").attr("src",e.target.result);
    }
    reader.readAsDataURL($("#image-upload").prop('files')[0]);
    $("#image-upload").innerHTML = $("#image-upload").prop('files')[0].name;
});

$("#3-by-3-sharpen").click(function() {
    if (filterSize === 3) {
        $("#kernel-input-0-0").val(0);
        $("#kernel-input-0-1").val(-1);
        $("#kernel-input-0-2").val(0);
        $("#kernel-input-1-0").val(-1);
        $("#kernel-input-1-1").val(5);
        $("#kernel-input-1-2").val(-1);
        $("#kernel-input-2-0").val(0);
        $("#kernel-input-2-1").val(-1);
        $("#kernel-input-2-2").val(0);
    }
})

$("#3-by-3-ridge").click(function() {
    if (filterSize === 3) {
        $("#kernel-input-0-0").val(-1);
        $("#kernel-input-0-1").val(-1);
        $("#kernel-input-0-2").val(-1);
        $("#kernel-input-1-0").val(-1);
        $("#kernel-input-1-1").val(8);
        $("#kernel-input-1-2").val(-1);
        $("#kernel-input-2-0").val(-1);
        $("#kernel-input-2-1").val(-1);
        $("#kernel-input-2-2").val(-1);
    }
})

$("#3-by-3-box").click(function() {
    if (filterSize === 3) {
        var blurFactor = 1/9;
        $("#kernel-input-0-0").val(blurFactor);
        $("#kernel-input-0-1").val(blurFactor);
        $("#kernel-input-0-2").val(blurFactor);
        $("#kernel-input-1-0").val(blurFactor);
        $("#kernel-input-1-1").val(blurFactor);
        $("#kernel-input-1-2").val(blurFactor);
        $("#kernel-input-2-0").val(blurFactor);
        $("#kernel-input-2-1").val(blurFactor);
        $("#kernel-input-2-2").val(blurFactor);
    }
})

$("#3-by-3-sobelx").click(function() {
    if (filterSize === 3) {
        $("#kernel-input-0-0").val(1);
        $("#kernel-input-0-1").val(0);
        $("#kernel-input-0-2").val(-1);
        $("#kernel-input-1-0").val(2);
        $("#kernel-input-1-1").val(0);
        $("#kernel-input-1-2").val(-2);
        $("#kernel-input-2-0").val(1);
        $("#kernel-input-2-1").val(0);
        $("#kernel-input-2-2").val(-1);
    }
})

$("#3-by-3-sobely").click(function() {
    if (filterSize === 3) {
        $("#kernel-input-0-0").val(1);
        $("#kernel-input-0-1").val(2);
        $("#kernel-input-0-2").val(1);
        $("#kernel-input-1-0").val(0);
        $("#kernel-input-1-1").val(0);
        $("#kernel-input-1-2").val(0);
        $("#kernel-input-2-0").val(-1);
        $("#kernel-input-2-1").val(-2);
        $("#kernel-input-2-2").val(-1);
    }
})

$("#convolve-submit").click(function() {
    var formData = new FormData();
    var matrixArray = [];
    for (var i = 0; i < filterSize; i++) {
        var row = [];
        for (var j = 0; j < filterSize; j++) {
            row.push($("#kernel-input-" + i + "-" + j).val());
        }
        matrixArray.push(row);
    }
    formData.append("filterSize",filterSize);
    formData.append("image", $("#image-upload").prop('files')[0]);
    formData.append("matrix", JSON.stringify(matrixArray));
    $.ajax({
        url: '/convolve_image',
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function(data){
            $("#final-image").attr("src","data:image/jpeg;base64,"+data);
            console.log(data);
            $("#results-box").show();
        }
    });
});