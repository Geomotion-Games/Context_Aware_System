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
    $("#poiReward").on("input", function(){
        onInputPOI();
         $("body").find("[data-index=2]").each(function(){
            $(this).find(".preview-reward > span").html($("#poiReward").val());
         });
    });

    $("#poiImage").change(function(e) {
        uploadImage({
            file: e.target.files[0], 
            preCallback: function(file){
                $("body").find("[data-index=2]").each(function(){
                    var imageHolder = $(this).find(".preview-img");
                    imageHolder.empty();
                    var src = URL.createObjectURL(file);
                    imageHolder.attr('src', src);
                    screen.image = src;
                });
            }, 
            postCallback: function(url){
                poi.item = url;
                savePOI(poi);
            }
        }); 
    });

    if(poi.type == "beacon"){
        $("#triggerContainer").addClass("hidden");
    }else if(poi.type == "start"){
        $("#attributes").addClass("hidden");
    }else if(poi.type == "finish"){
        $(".endEditing").text("Finish edition");
        $("#nameContainer").addClass("hidden");
        $("#rewardContainer").addClass("hidden");
        $("#imageContainer").addClass("hidden");
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

    //SCREEN TYPE B

    if(screens[1] && screens[1].type == "B"){
        if(screens[1].challengeType != ""){
            $("#challenge-type-selector").val(screens[1].challengeType);
        }
        if(screens[1].challengeURL != ""){
            $("#challenge-form input").val(screens[1].challengeURL);
        }
        updateChallengeSelector();
    }

    $("#challenge-form input").on("input", function(){
        console.log($(this).val());
        screens[1].challengeType = "minigame";
        screens[1].challengeURL = $(this).val();
        saveScreen(screens[1], poi);
    });

    function updateChallengeSelector(){
        var val = $("#challenge-type-selector").val();
        if (val == "checkin") { // check in
            screens[1].challengeType = "checkin";
            $( "#minigame-select-div" ).addClass('hidden');
            $("#challenge-form input").val("");
        } else if (val == "minigame") { // minigame
            screens[1].challengeType = "minigame";
            $( "#minigame-select-div" ).removeClass('hidden');
        }
    }

    $( "#challenge-type-selector" ).change(function() {
        updateChallengeSelector();
        var val = $(this).val();
       
        if(val == "checkin"){
            screens[1].challengeType = val;
            screens[1].challengeURL = "";
            saveScreen(screens[1], poi);
        }
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
         uploadImage({
            screenId: screen.id,
            type: "screens",
            file: e.target.files[0], 
            preCallback: function(file){
                $("body").find("[data-index=" + index + "]").each(function(){
                    var imageHolder = $(this).find(".preview-img");
                    imageHolder.empty();
                    var src = URL.createObjectURL(e.target.files[0]);
                    imageHolder.attr('src', src);
                });
            }, 
            postCallback: function(url){
                screen.image = url;
                saveScreen(screen, poi);
            }
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

    if(type == "A"){
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
    }else{
        $(parent).append(`
            <div class="form-group">
                <label for="screenTitle">Title:</label>
                <input type="title" class="form-control" id="screenTitle" value="${title}">
            </div>
            <div class="form-group">
                <label for="screenText">Text:</label>
                <textarea rows="6" type="text" class="form-control" id="screenText">${text}</textarea>
            </div>
        `);
    }

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

    var item = poi.item;
    var reward = poi.rewardPoints;


    var singleScreen = poi.type == "start" || poi.type == "finish";

    if(!editor) {
        if (type == "A") {
            $(parent).append(`
                <div class="${singleScreen?"col-md-12":"col-md-4"}">
                    <h4>Screen before challenge</h4>
                    <div href="" class="edit-screen">
                        <div class="preview-screen clickable" id="preview-screen-A" data-index="${index}">
                            <div class="hover">
                                <div class="content">
                                    <h4 class="preview-title" id="preview-title-A">${title}</h4>
                                    <img class="preview-img" id="preview-img-A" src="${image?image:""}">
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
                </div>
                
            `);
        } else if (type == "B") {
            $(parent).append(`
                <div class="${singleScreen?"col-md-12":"col-md-4"}">
                    <h4>Screen for challenge</h4>
                    <div class="preview-screen" id="preview-screen-B" data-screen-index="2">
                        <form id="challenge-form">
                            <div class="form-group">
                                <label for="challenge-type-selector">Challenge:</label>
                                <select class="form-control" id="challenge-type-selector">
                                    <option value="">Select the Challenge</option>
                                    <option value="checkin">Check In</option>
                                    <option value="upload_content">Upload Content</option>
                                    <option value="minigame">Minigame</option>
                                <select>
                            </div>
                            <div class="form-group hidden" id="minigame-select-div"">
                                <label for="minigame-selector">Minigame URL:</label>
                                <input type="text" name="minigame-selector"><br>
                            </div>
                        </form>
                    </div>
                </div>
            `);
        } else if (type == "C") {
            $(parent).append(`
                <div class="${singleScreen?"col-md-12":"col-md-4"}">
                    <h4>Screen after challenge</h4>
                    <div href="" class="edit-screen">
                        <div class="preview-screen clickable" id="preview-screen-C" data-index="${index}">
                            <div class="hover">
                                <div class="content">
                                    <h4 class="preview-title" id="preview-title-C">${title}</h4>
                                    <img class="preview-img" id="preview-img-C" src="${item?item:image}">
                                    <p class="preview-text" id="preview-text-C">${text}</p>
                                    <p class="preview-reward" id="preview-reward-C">You won <span>${reward}</span> points</p>
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
                </div>
            `);
        }
    }else{
        if (type == "A") {
            $(parent).append(`
                <div class="preview-screen" id="preview-screen-A" data-index="${index}">
                    <div class="content">
                        <h4 class="preview-title" id="preview-title-A">${title}</h4>
                        <img class="preview-img" id="preview-img-A" src="${image?image:""}">
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
                        <img class="preview-img" id="preview-img-C" src="${item?item:image}">
                        <p class="preview-text" id="preview-text-C">${text}</p>
                        <p class="preview-reward" id="preview-reward-C">You won <span>${reward}</span> points</p>
                        <p class="preview-button" id="preview-button-C">Go to map!</p>
                    </div>
                    <div class="background-front"></div>
                    <img class="background" src="css/map-background.png">
                </div>
            `);
        }
    }
}

function uploadImage(options){
        var file = options.file;
        if(!file) return;
        var imagefile = file.type;
        var match= ["image/jpeg","image/png","image/jpg"];
        if(!((imagefile==match[0]) || (imagefile==match[1]) || (imagefile==match[2]))){
            return false;
        }
        else{
            options.preCallback(file);

            var formData = new FormData();
            formData.append("poiId", poi.id);
            formData.append("file", file);
            formData.append("type", options.type || "pois");
            if(options.screenId) formData.append("screenId", options.screenId);

            $.ajax({
                url: "upload-screen-files.php",
                type: "POST",
                data: formData,
                contentType: false,
                cache: false,
                processData:false,
                success: function(data){
                    if (data.startsWith("ok")) {
                        var url = data.split("-")[1];
                        console.log("succes upload " + url);
                        options.postCallback(url);
                    } else {
                        console.log("error upload " + data)
                    }
                }
            });
        }
}