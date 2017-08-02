var editPOITimeout;
function createEditPOITimeout(){
    if(editPOITimeout != null) clearTimeout(editPOITimeout);
    editPOITimeout = setTimeout(function(){
        updateValues();
        savePOI(poi);
        clearTimeout(editPOITimeout);
        editPOITimeout = null;
    }, 2000);
}

var editScreenTimeout;
function createEditScreenTimeout(){
    if(editScreenTimeout != null) clearTimeout(editScreenTimeout);
    editScreenTimeout = setTimeout(function(){
         if(currentScreen != -1){
            saveScreen(screens[currentScreen], poi);
        }
        clearTimeout(editScreenTimeout);
        editScreenTimeout = null;
    }, 2000);
}

function updateValues(){
    poi.title = $("#poiName").val();
    poi.triggerDistance = $("#poiTriggerDistance").val()
    poi.rewardPoints = $("#poiReward").val()
}

var currentScreen = -1;

function init(){
    // POI EDITION
    $("#poiName").val(poi.title);
    $("#poiName").attr("placeholder", "Stop " + poi.orderNumber);
    $("#poiTriggerDistance").val(poi.triggerDistance);
    $("#poiReward").val(poi.rewardPoints);
    
    //TODO: imagen item

    $("#poiName").blur(onBlurPOI);
    $("#poiName").on("input", onInputPOI);

    $("#poiTriggerDistance").on("input", onInputPOI);
    $("#poiTriggerDistance").blur(onBlurPOI);
    
    $("#poiReward").blur(onBlurPOI);
    $("#poiReward").on("input", onInputPOI);

    $("#poiImage").change(function(e) {
        //$("#message").empty(); // borramos mensaje de error
        var file = this.files[0];
        if(!file) return;
        var imagefile = file.type;
        var match= ["image/jpeg","image/png","image/jpg"];
        if(!((imagefile==match[0]) || (imagefile==match[1]) || (imagefile==match[2]))){
            //$("#message").html("<p id='error'>Please Select A valid Image File. Only jpeg, jpg and png Images type allowed</p>");
            return false;
        }
        else{
            var formData = new FormData();
            formData.append("poiId", poi.id);
            formData.append("file", e.target.files[0]);
            formData.append("type", "pois");

            for (var pair of formData.entries()) {
                console.log(pair[0]+ ', ' + pair[1]); 
            }

            $.ajax({
                url: "upload-screen-files.php",
                type: "POST",
                data: formData,
                contentType: false,
                cache: false,
                processData:false,
                success: function(data){
                    //$('#loading').hide();
                    if (data.startsWith("ok")) {
                        var url = data.split("-")[1];
                        console.log("succes upload " + url);
                        poi.item = url;
                        // show preview
                        savePOI(poi);
                    } else {
                        console.log("error upload " + data)
                        //$("#message").html("<p id='error'>" + data + "</p>");   
                    }
                }
            });
        }
    });

    if(poi.type == "beacon"){
        $("#triggerContainer").addClass("hidden");
    }else if(poi.type == "start" || poi.type == "finish"){
        $("#attributes").addClass("hidden");
    }

    $(".endEditing").attr("href", "./" + gameTypeToUrl(game.type) +".php?id=" + poi.plot);

    function onBlurPOI(){
        if(editPOITimeout != null) clearTimeout(editPOITimeout);
        updateValues();
        savePOI(poi);
    }

    function onInputPOI(){
        if(editPOITimeout != null) clearTimeout(editPOITimeout);
        createEditPOITimeout();
    }


    $('.stop-editor').on('hidden.bs.modal', function () {
        currentScreen = -1;
    });
}

function showEditorScreen(index){
    var stopId = "#stop-edit";
    var point = null;
    //MARKER
    var screen = screens[index];

    $("#stop-editor-preview").empty();
    appendPreviewScreen("#stop-editor-preview", screen, index, false, true);
    currentScreen = index;
    appendEditor("#stop-editor-form", screen);

    $("#screenTitle").on('input',function(e){
        var title = $(this).val();
        $("body").find("[data-index=" + index + "]").each(function(){
            $(this).find(".preview-title").text(title);
        });
        $(stopId + "  #preview-title").text(title);
        screen.title = title;
        onInputScreen();
    });

    //DESCRIPTION
    $("#screenText").on('input',function(e){
        var text = $(this).val();
        $("body").find("[data-index=" + index + "]").each(function(){
            $(this).find(".preview-text").text(text);
        });

        $(stopId + "  #preview-text").text(text);
        screen.text = text;
        onInputScreen();
    });

    $("#screenImage").on('change',function(e){
        console.log("image changed");
        $("body").find("[data-index=" + index + "]").each(function(){
            var imageHolder = $(this).find(".preview-img");
            imageHolder.empty();
            var src = URL.createObjectURL(e.target.files[0]);
            imageHolder.attr('src', src);

            screen.image = src;
        });
    });

     $("#screenClue").on('input',function(e){
        var clue = $(this).val();
        screen.clue = clue;
        onInputScreen();
    });

    // SCREEN EDITION

    $("#screenClue").blur(onBlurScreen);
    $("#screenTitle").blur(onBlurScreen);
    $("#screenText").blur(onBlurScreen);

    function onBlurScreen(){
        if(editScreenTimeout != null) clearTimeout(editScreenTimeout);
        if(currentScreen != -1){
            saveScreen(screens[currentScreen], poi);
        }
    }

    function onInputScreen(){
        if(editScreenTimeout != null) clearTimeout(editScreenTimeout);
        createEditScreenTimeout();
    }

    $(stopId).modal('show');
}

function showScreensOverview(){

    $("#screens").empty();

    screens.forEach(function(screen, index){
        appendPreviewScreen("#screens", screen, index, screen.type != "B");
    });

    $(".preview-screen.clickable").on('click',function(e){
        var index = $(this).attr("data-index");
        showEditorScreen(index);
    });

}

function appendEditor(parent, screen){
    $(parent).empty();
    var title = screen.title;
    var text = screen.text;
    var image = screen.image;
    var clue = screen.clue;
    var type = screen.type;
    var gameType = game.type;

    $(parent).append(`
	    <div class="form-group">
            <label for="screenTitle">Title:</label>
            <input type="title" class="form-control" id="screenTitle" value="${title}">
        </div>
        <div class="form-group">
            <label for="screenImage">Image:</label>
            <input class="form-control" id="screenImage" type="file" accept="image/*" >
        </div>
        <div class="form-group">
            <label for="screenText">Text:</label>
            <textarea rows="6" type="text" class="form-control" id="screenText">${text}</textarea>
        </div>
        
    `);

    if(gameType == "TreasureHunt" && (poi.type == "start" || (poi.type != "finish" && type == "C"))){
        $(parent).append(`
            <div class="form-group">
                <label for="screenClue">Clue for the next POI:</label>
                <textarea rows="6" type="text" placeholder="Write here the clue for the next POI" class="form-control" id="screenClue">${clue}</textarea>
            </div>
        `);
    }
}

function appendPreviewScreen(parent, screen, index, clickable, editor){
    var title = screen.title || "";
    var text = screen.text || "";
    var image = screen.image || "";
    var type = screen.type;

    var singleScreen = poi.type == "start" || poi.type == "finish";

    if(!editor) {
        if (type == "A") {
            $(parent).append(`
                <div class="${singleScreen?"col-md-12":"col-md-4"}">
                    <div href="" class="edit-screen">
                        <div class="preview-screen clickable" id="preview-screen-A" data-index="${index}">
                            <div class="hover">
                                <div class="content">
                                    <h4 class="preview-title" id="preview-title-A">${title}</h4>
                                    <img class="preview-img" id="preview-img-A" src="${image?"images/"+image:""}">
                                    <p class="preview-text" id="preview-text-A">${text}</p>
                                    <p class="preview-button" id="preview-button-A">Go out and play!</p>
                                </div>
                                <div class="background-front"></div>
                                <img class="background" src="css/map-background.png">
                            </div>
                            <div class="edition-hover">
                                <i class="fa fa-pencil fa-4x" aria-hidden="true"></i>
                            </div>
                        </div>
                    </div>
                    <h4>Challenge description</h4>
                </div>
                
            `);
        } else if (type == "B") {
            $(parent).append(`
                <div class="${singleScreen?"col-md-12":"col-md-4"}">
                    <div class="preview-screen" id="preview-screen-B" data-screen-index="2">
                        <form id="challenge-form">
                            <div class="form-group">
                                <label for="challenge-type-selector">Challenge:</label>
                                <select class="form-control" id="challenge-type-selector">
                                    <option value="">Select the Challenge</option>
                                    <option value="1">Check In</option>
                                    <option value="2">Minigame</option>
                                    <option value="3">Upload Content</option>
                                <select>
                            </div>

                            <div class="form-group hidden" id="minigame-select-div"">
                                <label for="minigame-selector">Minigame:</label>
                                <select class="form-control" id="minigame-selector">
                                    <option value="">Select the Minigame</option>
                                    <option value="1">Minigame 1</option>
                                    <option value="2">Minigame 2</option>
                                    <option value="3">Minigame 3</option>
                                    <option value="4">Minigame 4</option>
                                <select>
                            </div>

                            <div class="form-group hidden" id="file-type-selector-div">
                                <label for="file-type-selector">Type of content:</label>
                                <select class="form-control" id="file-type-selector">
                                    <option value="">Select the type</option>
                                    <option value="1">Image file</option>
                                    <option value="2">Video file</option>
                                    <option value="3">Audio file</option>
                                <select>
                            </div>
                        </form>
                    </div>
                    <h4>Challenge</h4>

                    <script>
                        $( "#challenge-type-selector" ).change(function() {
                            if ($(this).val() == 1) { // check in
                                $( "#minigame-select-div" ).addClass('hidden');
                                $( "#file-type-selector-div" ).addClass('hidden');
                            } else if ($(this).val() == 2) { // minigame
                                $( "#minigame-select-div" ).removeClass('hidden');
                                $( "#file-type-selector-div" ).addClass('hidden');
                            } else if ($(this).val() == 3) { // upload content
                                $( "#minigame-select-div" ).addClass('hidden');
                                $( "#file-type-selector-div" ).removeClass('hidden');
                            }
                        });
                    </script>
                </div>
            `);
        } else if (type == "C") {
            $(parent).append(`
                <div class="${singleScreen?"col-md-12":"col-md-4"}">
                    <div href="" class="edit-screen">
                        <div class="preview-screen clickable" id="preview-screen-C" data-index="${index}">
                            <div class="hover">
                                <div class="content">
                                    <h4 class="preview-title" id="preview-title-C">${title}</h4>
                                    <img class="preview-img" id="preview-img-C" src="${image?"images/"+image:""}">
                                    <p class="preview-text" id="preview-text-C">${text}</p>
                                    <p class="preview-reward" id="preview-reward-C">You won <span>10</span> points</p>
                                    <p class="preview-button" id="preview-button-C">Go to map!</p>
                                </div>
                                <div class="background-front"></div>
                                <img class="background" src="css/map-background.png">
                            </div>
                            <div class="edition-hover">
                                <i class="fa fa-pencil fa-4x" aria-hidden="true"></i>
                            </div>
                        </div>
                    </div>
                    <h4>Challenge description</h4>
                </div>
            `);
        }
    }else{
        if (type == "A") {
            $(parent).append(`
                <div class="preview-screen" id="preview-screen-A" data-index="${index}">
                    <div class="content">
                        <h4 class="preview-title" id="preview-title-A">${title}</h4>
                        <img class="preview-img" id="preview-img-A" src="${image?"images/"+image:""}">
                        <p class="preview-text" id="preview-text-A">${text}</p>
                        <p class="preview-button" id="preview-button-A">Go out and play!</p>
                    </div>
                    <div class="background-front"></div>
                    <img class="background" src="css/map-background.png">
                </div>
            `);
        } else if (type == "C") {
            $(parent).append(`
                <div class="preview-screen" id="preview-screen-A" data-index="${index}">
                   <div class="content">
                        <h4 class="preview-title" id="preview-title-C">${title}</h4>
                        <img class="preview-img" id="preview-img-C" src="${image?"images/"+image:""}">
                        <p class="preview-text" id="preview-text-C">${text}</p>
                        <p class="preview-reward" id="preview-reward-C">You won <span>10</span> points</p>
                        <p class="preview-button" id="preview-button-C">Go to map!</p>
                    </div>
                    <div class="background-front"></div>
                    <img class="background" src="css/map-background.png">
                </div>
            `);
        }
    }
}

$("#add_screen").on("click", function(e){
    var random = getRandomInt(0, 3);
    var type = "";
    if(random == 0) type = "A";
    else if(random == 1) type = "B";
    else if(random == 2) type = "C";
    points[0].screens.push(new Screen({type:type, description: "description"}));
    var index = points[0].screens.length;
    appendPreviewScreen("#screens", points[0].screens, index - 1, true);
});