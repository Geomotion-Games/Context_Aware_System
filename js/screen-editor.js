var noClue = false;

var editPOITimeout;
function createEditPOITimeout(){
    if(editPOITimeout != null) clearTimeout(editPOITimeout);
    editPOITimeout = setTimeout(function(){
        updateValues();
        savePOI(poi, game);
        clearTimeout(editPOITimeout);
        editPOITimeout = null;
    }, 2000);
}

var editScreenTimeout;
function createEditScreenTimeout(){
    if(editScreenTimeout != null) clearTimeout(editScreenTimeout);
    editScreenTimeout = setTimeout(function(){
         if(currentScreen != -1){
            saveScreen(screens[currentScreen], poi, game);
        }
        clearTimeout(editScreenTimeout);
        editScreenTimeout = null;
    }, 2000);
}

function updateValues(){
    poi.title = $("#poiName").val();
    poi.triggerDistance = $("#poiTriggerDistance").val();
    poi.itemName = $("#itemName").val();
    if(points <= 1000000) poi.rewardPoints = $("#poiReward").val();
}

var currentScreen = -1;

function init(){

    // POI EDITION
    $("#poiName").val(poi.title);
    $("#poiName").attr("placeholder", "Stop " + poi.orderNumber);
    $("#poiTriggerDistance").val(poi.triggerDistance);
    $("#poiReward").val(poi.rewardPoints);
    $("#itemName").val(poi.itemName);
    
    //TODO: imagen item

    $("#poiName").blur(onBlurPOI);
    $("#poiName").on("input", onInputPOI);

    $("#poiTriggerDistance").on("input", onInputPOI);
    $("#poiTriggerDistance").blur(onBlurPOI);

    $("#itemName").on("input", onInputPOI);
    $("#itemName").blur(onBlurPOI);
    
    $("#poiReward").blur(onBlurPOI);
    $("#poiReward").on("input", function(){
        var points = $("#poiReward").val();
        if(points > 1000000){
            $("#poiReward").val(1000000);
            points = 1000000;
        }

        onInputPOI();
         $("body").find("[data-index=2]").each(function(){
            if(points > 0) $(this).find(".preview-reward").html("You won <span>" + points + "</span> points");
            else $(this).find(".preview-reward").html("");
         });
    });

    $("#poiImage").change(function(e) {
        uploadImage({
            file: e.target.files[0], 
            preCallback: function(file){
               
            }, 
            postCallback: function(url){
                poi.item = url;
                savePOI(poi, game);
                $("body").find("[data-index=2]").each(function(){
                    var imageHolder = $(this).find(".preview-img");
                    imageHolder.empty();
                    var src = URL.createObjectURL(e.target.files[0]);
                    imageHolder.attr('src', src);
                    screen.image = src;
                    $("#removeImageC").show();
                });
            }
        }); 
    });

    if(poi.item == "-" || poi.item == "") $("#removeImageC").hide();

    $("#removeImageC").click(function(){
        if(poi.item == "-" || poi.item == "") return;
        poi.item = "";
        $("body").find("[data-index=" + 2 + "]").each(function(){
            var imageHolder = $(this).find("#preview-img-C").attr("src", "images/no-image.jpg");
        });
        savePOI(poi, game);
        $("#removeImageC").hide();
    });

    if(poi.type == "beacon"){
        $("#triggerContainer").addClass("hidden");
    }else if(poi.type == "start"){
        $("footer .endEditing").text("Finish edition");
        $("#attributes").addClass("hidden");
    }else if(poi.type == "finish"){
        $("footer .endEditing").text("Finish edition");
        $("#attributes").addClass("hidden");
    }

    $(".endEditing").attr("href", "./" + gameTypeToUrl(game.type) +".php?id=" + poi.plot);

    function onBlurPOI(){
        if(editPOITimeout != null) clearTimeout(editPOITimeout);
        updateValues();
        savePOI(poi, game);
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
            if(screens[1].challengeType == "upload_content"){
                $("#upload-type-selector").val(screens[1].challengeUploadType);
            }
        }

        if(screens[1].challengeURL != ""){
            $("#challenge-form input").val(screens[1].challengeURL);

        //if(screens[1].challengeID != ""){
          //  $('.selectpicker').selectpicker('val', screens[1].challengeID);
        }
        updateChallengeSelector();
    }

    $("#challenge-form input").on("input", function(){
        console.log($(this).val());
        screens[1].challengeType = "minigame";
        screens[1].challengeURL = $(this).val();
        saveScreen(screens[1], poi, game);
    });

    /*$(".minigame").change(function(){
        if ($(this).val().length === 0) return;
        screens[1].challengeType = "minigame";
        screens[1].challengeID = $(this).val();
        saveScreen(screens[1], poi, game);
    });*/

    $("#upload-type-selector").change(function(){
        console.log($(this).val());
        screens[1].challengeType = "upload_content";
        screens[1].challengeUploadType = $(this).val();
        saveScreen(screens[1], poi, game);
    });

    function updateChallengeSelector(){
        var val = $("#challenge-type-selector").val();
        if (val == "checkin") { // check in
            screens[1].challengeType = "checkin";
            $("#minigame-select-div").addClass('hidden');
            $("#upload-select-div").addClass('hidden');
            $("#challenge-form input").val("");
        }if (val == "upload_content") { // check in
            screens[1].challengeType = "upload_content";
            $("#minigame-select-div").addClass('hidden');
            $("#upload-select-div").removeClass('hidden');
            $("#challenge-form input").val("");
        } else if (val == "minigame") { // minigame
            screens[1].challengeType = "minigame";
            $("#upload-select-div").addClass('hidden');
            $("#minigame-select-div").removeClass('hidden');
        }
    }

    $( "#challenge-type-selector" ).change(function() {
        updateChallengeSelector();
        var val = $(this).val();
       
        if(val == "checkin"){
            screens[1].challengeType = val;
            screens[1].challengeURL = "";
            saveScreen(screens[1], poi, game);
        }else if(val == "upload_content"){
            screens[1].challengeType = val;
            screens[1].challengeUploadType = $("#upload-type-selector").val();
            saveScreen(screens[1], poi, game);
        }
    });

    noClue = window.location.search.includes("noClue");
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

    if(screens[0].image == null || screens[0].image == "") $("#removeImageA").hide();
    if(screens[0].uploadedVideo == null || screens[0].uploadedVideo == "") $("#removeVideoA").hide();

    $("#removeImageA").click(function(){
        if(screens[0].image == null || screens[0].image == "") return;
        screens[0].image = "";
        $("body").find("[data-index=" + 0 + "]").each(function(){
            var imageHolder = $(this).find(".preview-img").attr("src", "images/no-image.jpg");
        });
        saveScreen(screens[0], poi, game);
        $("#removeImageA").hide();
    });

    $("#screenTitle").on('input',function(e){
        var title = $(this).val();
        $("body").find("[data-index=" + index + "]").each(function(){
            $(this).find(".preview-title").text(title);
        });
        $(stopId + "  #preview-title").text(title);
        screen.title = title;
        onInputScreen();
    });

    var lockedVideoInput = false;

    $("#screenYoutubeOrVimeoVideo").on('input',function(e){
        var video = $(this).val();
        onYoutubeVideoChanged(video);
    });

    $("#screenYoutubeOrVimeoVideo").on('paste',function(e){
        var cd = e.originalEvent.clipboardData.getData("text/plain")
        onYoutubeVideoChanged(cd);
    });

    function onYoutubeVideoChanged(video){
        var videoID = video.length > 0 ? parseYoutubeOrVimeoURL(video) : "";

        if(videoID != null){

            $('.preview-youtubeOrVimeoVideo').each(function(index){
                $(this).show();
                $(this).attr('src', videoID);
            });
            $("body").find("[data-index=0]").each(function(){
                $(this).find(".preview-img").hide();
            });

            screens[0].youtubeOrVimeoURL = video;
            onInputScreen();
        }else{
            $("body").find("[data-index=0]").each(function(){
                var imageHolder = $(this).find(".preview-img");
                imageHolder.show();
                imageHolder.attr("src", "images/no-video.jpg");
            });
            $(".preview-youtubeOrVimeoVideo").hide();
        }
    }

    //DESCRIPTION
    $("#screenText").on('input',function(e){
        var text = $(this).val();
        var linkedText = Autolinker.link(text);
        $("body").find("[data-index=" + index + "]").each(function(){
            $(this).find(".preview-text").html(linkedText);
        });

        $(stopId + "  #preview-text").html(linkedText);
        screen.text = text;
        onInputScreen();
    });

    $("#screenImage").on('change',function(e){
        console.log("image changed");
         uploadImage({
            screenId: screen.id,
            type: "screens",
            file: e.target.files[0], 
            postCallback: function(url){
                screen.image = url;
                saveScreen(screen, poi, game);
                $("body").find("[data-index=" + index + "]").each(function(){
                    var imageHolder = $(this).find(".preview-img");
                    imageHolder.empty();
                    var src = URL.createObjectURL(e.target.files[0]);
                    imageHolder.attr('src', src);
                    $("#removeImageA").show();
                });
            }
        }); 
    });

    $("#screenVideo").on('change',function(e){
        console.log("video changed");
        $("#uploadingVideo").modal('show');

        uploadVideo({
            screenId: screen.id,
            file: e.target.files[0], 
            postCallback: function(url){
                screen.uploadedVideo = url;
                saveScreen(screen, poi, game);
                $("#uploadingVideo").modal('hide');
                $("body").find("[data-index=" + index + "]").each(function(){
                    var videoHolder = $(this).find(".preview-video");
                    videoHolder.html(`<source src="${url}" type="video/mp4"></source>`);
                    videoHolder.show();
                    $(this).find(".preview-img").hide();
                });
                $("#removeVideoA").show();
            }
        }); 
    });

    $("#removeVideoA").click(function(){
        if(screens[0].uploadedVideo == null || screens[0].uploadedVideo == "") return;
        screens[0].uploadedVideo = "";
        $("body").find("[data-index=" + 0 + "]").each(function(){
            $(".preview-video").hide();
            var imageHolder = $(this).find(".preview-img");
            imageHolder.attr("src", "images/no-video.jpg");
            imageHolder.show();
        });
        saveScreen(screens[0], poi, game);
        $("#removeVideoA").hide();
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
            saveScreen(screens[currentScreen], poi, game);
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
    

    //console.log(screens[0].mediaType)

    updateImageVideoForm(screens[0].mediaType);

    $(".preview-screen.clickable").on('click',function(e){
        console.log("edition-hover")
        var index = $(this).attr("data-index");
        showEditorScreen(index);
        e.preventDefault();
        return false;
    });

    // $(".edition-hover").on('click',function(e){
    //     console.log("hover")
    //     e.preventDefault();
    //     e.stopPropagation();
    //     return false;
    // });
}

function appendEditor(parent, screen){
    $(parent).empty();
    var title = screen.title;
    var text = screen.text;
    var image = screen.image;
    var video = screen.youtubeOrVimeoURL;
    var mediaType = screen.mediaType || "";
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
                <form id="image-videoForm">
                  <input id="imageRadio" type="radio" name="image-video" value="image" checked> Image
                  <input id="youtubeOrVimeoRadio" type="radio" name="image-video" value="youtubeOrVimeo"> Video URL (Youtube or Vimeo)<br>
                  <input id="videoRadio" type="radio" name="image-video" value="video"> Upload Video
                </form>
                <div id="imageForm">
                    <label for="screenImage">Image (Formats: JPG JPEG PNG GIF; Max 300kb): </label>
                    <div class="row">
                        <div class="col-md-12">
                            <input class="form-control" id="screenImage" type="file" accept="image/*" >
                            <i class="fa fa-times fa-2x" id="removeImageA" aria-hidden="true" title="Remove Image"></i>
                        </div>
                    </div>
                </div>
                <div id="youtubeOrVimeoForm">
                    <label for="screenYoutubeOrVimeoVideo">Youtube Or Vimeo Video (Full URL): </label>
                    <div class="row">
                        <div class="col-md-12">
                             <textarea rows="1" type="text" class="form-control" id="screenYoutubeOrVimeoVideo">${video}</textarea>
                        </div>
                    </div>
                </div>
                <div id="videoForm">
                    <label for="screenVideo">Upload Video (max 20 MB): </label>
                    <div class="row">
                        <div class="col-md-12">
                            <input class="form-control" id="screenVideo" type="file" accept="video/mp4" >
                            <i class="fa fa-times fa-2x" id="removeVideoA" aria-hidden="true" title="Remove Video"></i>
                        </div>
                    </div>
                </div>
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

    if(gameType == "TreasureHunt" && !noClue && (poi.type == "start" || (poi.type != "finish" && type == "C"))){
        $(parent).append(`
            <div class="form-group">
                <label for="screenClue">Clue for the next POI:</label>
                <textarea rows="6" type="text" placeholder="Write here the clue for the next POI" class="form-control" id="screenClue">${clue}</textarea>
            </div>
        `);
    }

    updateImageVideoForm(mediaType);

    $('#image-videoForm').change(function() {
        var value = $('input[name=image-video]:checked', '#image-videoForm').val();
        screen.mediaType = value;
        saveScreen(screen, poi, game);
        updateImageVideoForm(value);
    });
}

function updateImageVideoForm(value){
    if (value == 'image') {
        $("#imageRadio").prop("checked", true);

        $("#imageForm").show();
        $("#videoForm").hide();
        $("#youtubeOrVimeoForm").hide();

        $(".preview-video").hide();
        $(".preview-youtubeOrVimeoVideo").hide();

        $("body").find("[data-index=0]").each(function(){
            var imageHolder = $(this).find(".preview-img");
            var image = screens[0].image != null &&  screens[0].image != "" ?  getBaseURL() + screens[0].image : "images/no-image.jpg";
            imageHolder.show();
            imageHolder.attr("src", image);
        });
    }else if (value == 'youtubeOrVimeo') {
        $("#youtubeOrVimeoRadio").prop("checked", true);

        $("#youtubeOrVimeoForm").show();
        $("#imageForm").hide();
        $("#videoForm").hide();

        $(".preview-video").hide();

        if(screens[0].youtubeOrVimeoURL.length > 0){
            $(".preview-youtubeOrVimeoVideo").show();
            $("body").find("[data-index=0]").each(function(){
                $(this).find(".preview-img").hide();
            });
        }else{
            $(".preview-youtubeOrVimeoVideo").hide();
            $("body").find("[data-index=0]").each(function(){
                var imageHolder = $(this).find(".preview-img");
                imageHolder.show();
                imageHolder.attr("src", "images/no-video.jpg");
            });
        }
    }else if (value == 'video') {
        $("#videoRadio").prop("checked", true);

        $("#videoForm").show();
        $("#imageForm").hide();
        $("#youtubeOrVimeoForm").hide();

        $(".preview-youtubeOrVimeoVideo").hide();

        if(screens[0].uploadedVideo != ""){
            $(".preview-video").show();
            $("body").find("[data-index=0]").each(function(){
                $(this).find(".preview-img").hide();
            });
        }else{
            $(".preview-video").hide();
            $("body").find("[data-index=0]").each(function(){
                var imageHolder = $(this).find(".preview-img");
                imageHolder.show();
                imageHolder.attr("src", "images/no-video.jpg");
            });
        }
    }
}

function appendPreviewScreen(parent, screen, index, clickable, editor){
    var title = screen.title || "";
    var text = screen.text || "";
    var linkedText = Autolinker.link(text);
    var image = screen.image != null &&  screen.image != "" ?  getBaseURL() + screen.image : "images/no-image.jpg";
    var youtubeOrVimeo = screen.youtubeOrVimeoURL.length > 0 ? parseYoutubeOrVimeoURL(screen.youtubeOrVimeoURL) : "";
    var uploadedVideo = screen.uploadedVideo.length > 0 ? getBaseURL() + screen.uploadedVideo : "";
    var type = screen.type;
    //var challengeID = screen.challengeID;

    var item = poi.item;
    var reward = poi.rewardPoints;


    var singleScreen = poi.type == "start" || poi.type == "finish";

    if(!editor) {
        if (type == "A") {
            var content = `
                <div class="${singleScreen?"col-md-12":"col-md-4"}">
                    <h4>Screen before challenge</h4>
                    <div href="" class="edit-screen">
                        <div class="preview-screen clickable" id="preview-screen-A" data-index="${index}">
                            <div class="edition-hover">
                                <i class="fa fa-pencil fa-4x" aria-hidden="true"></i>
                            </div>
                            <div class="hover">
                                <div class="content">
                                    <h4 class="preview-title" id="preview-title-A">${title}</h4>
                                    <img class="preview-img" id="preview-img-A" src="${image?image:""}">
                                    <iframe class="preview-youtubeOrVimeoVideo" width="189" height="160"
                                        src="${youtubeOrVimeo}">
                                    </iframe>
                                    <video class="preview-video" width="189" height="160" controls>
                                        <source src="${uploadedVideo}" type="video/mp4"></source>
                                    </video>
                                    <p class="preview-text" id="preview-text-A" style="max-height:100px !important;">${linkedText}</p>
                                    `;
            
            if(poi.type == "finish"){      
                var totalTime = "0:00"; 
                if(totalRewardPoints != 0){
                     content += `
                                    <p class="preview-reward" id="preview-total-reward-C">You earned <span>${totalRewardPoints}</span> points</p>
                    `;
                }           
                content += `
                                    <p class="preview-reward" id="preview-total-time-C">Total time played: <span>${totalTime}</span></p>
                                    <p class="preview-button" id="preview-button-A">Finish Game</p>
                    `;
            }else{
                content += ` <p class="preview-button" id="preview-button-A">Start Game</p>`;
            }

            content += `
                               
                                </div>
                                <div class="background-front"></div>
                                <img class="background" src="css/map-background.png">
                            </div>
                           
                        </div>
                    </div>
                </div>
                
            `;
            $(parent).append(content);
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
                             <div class="form-group hidden" id="upload-select-div"">
                                <label for="upload-type-selector">Content type:</label>
                                 <select class="form-control" id="upload-type-selector">
                                    <option value="any">Any</option>
                                    <option value="image">Image</option>
                                    <option value="video">Video</option>
                                    <option value="audio">Audio</option>
                                <select>
                            </div>
                        </form>
                    </div>
                </div>
            `);
            //$('.selectpicker').selectpicker('render');
            //$('.selectpicker').selectpicker('val', challengeID);

        } else if (type == "C") {
             $(parent).append(`
                <div class="${singleScreen?"col-md-12":"col-md-4"}">
                    <h4>Screen after challenge</h4>
                    <div href="" class="edit-screen">
                        <div class="preview-screen clickable" id="preview-screen-C" data-index="${index}">
                            
                            <div class="hover">
                                <div class="content">
                                    <h4 class="preview-title" id="preview-title-C">${title}</h4>
                                    <img class="preview-img" id="preview-img-C" src="${item != "" ? item : image}">
                                    <p class="preview-text" id="preview-text-C">${linkedText}</p>
                                    <p class="preview-reward" id="preview-reward-C">${reward > 0 ? "You won <span>" + reward + "</span> points": ""}</p>
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
            var content = `
                <div class="preview-screen" id="preview-screen-A" data-index="${index}">
                    <div class="content">
                        <h4 class="preview-title" id="preview-title-A">${title}</h4>
                        <img class="preview-img" id="preview-img-A" src="${image?image:""}">
                        <iframe class="preview-youtubeOrVimeoVideo" width="189" height="160"
                            src="${youtubeOrVimeo}">
                        </iframe>
                        <video class="preview-video" width="189" height="160" controls>
                            <source src="${uploadedVideo}" type="video/mp4"></source>
                        </video>
                        <p class="preview-text" id="preview-text-A" style="max-height:100px !important;">${linkedText}</p>
                        `;
            
            if(poi.type == "finish"){      
                 var totalTime = "0:00"; 
                if(totalRewardPoints != 0){
                     content += `
                                    <p class="preview-reward" id="preview-total-reward-C">You earned <span>${totalRewardPoints}</span> points</p>
                    `;
                }           
                content += `
                                    <p class="preview-reward" id="preview-total-time-C">Total time played: <span>${totalTime}</span></p>
                                    <p class="preview-button" id="preview-button-A">Finish Game</p>
                    `;
            }else{
                content += ` <p class="preview-button" id="preview-button-A">Start Game</p>`;
            }

            content += `
                               
                                </div>
                    <div class="background-front"></div>
                    <img class="background" src="css/map-background.png">
                </div>
            `;
            $(parent).append(content);
        } else if (type == "C") {
            $(parent).append(`
                <div class="preview-screen" id="preview-screen-A" data-index="${index}">
                   <div class="content">
                        <h4 class="preview-title" id="preview-title-C">${title}</h4>
                        <img class="preview-img" id="preview-img-C" src="${item != "" ? item : image}">
                        <p class="preview-text" id="preview-text-C">${linkedText}</p>
                        <p class="preview-reward" id="preview-reward-C">${reward > 0 ? "You won <span>" + reward + "</span> points" : ""}</p>
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
        var match = ["image/jpeg","image/png","image/jpg", "image/gif"];
        
        if(match.indexOf(imagefile) == -1){
            return false;
        }else{
            var formData = new FormData();
            formData.append("poiId", poi.id);
            formData.append("file", file);
            formData.append("type", options.type || "pois");
            if(options.screenId) formData.append("screenId", options.screenId);

            $.ajax({
                url: "php/uploadImage.php",
                type: "POST",
                data: formData,
                contentType: false,
                cache: false,
                processData:false,
                success: function(data){
                    if (data.startsWith("ok")) {
                        var url = data.split("-")[1];
                        console.log("Succes upload: " + url);
                        options.postCallback(url);
                    } else {
                        showWarning("The image exceeds the 300kb limit");
                        console.log("Error upload: " + data);
                    }
                }
            });
        }
}

function uploadVideo(options){
        var file = options.file;
        if(!file) return;

        var filetype = file.type;

        var match = ["video/mp4"];

        if(match.indexOf(filetype) == -1){
            return false;
        }else{
            var formData = new FormData();
            formData.append("file", file);
            formData.append("screenId", options.screenId);

            $.ajax({
                url: "php/uploadVideo.php",
                type: "POST",
                data: formData,
                contentType: false,
                cache: false,
                processData:false,
                success: function(data){
                    if (data.startsWith("ok")) {
                        var url = data.split("-")[1];
                        console.log("Succes upload: " + url);
                        options.postCallback(url);
                    } else {
                        $("#uploadingVideo").modal('hide');
                        showWarning("The video exceeds the 20MB limit");
                        console.log("Error upload: " + data);
                    }
                }
            });
        }
}

/*function getMinigames(callback){
    var url = "./minigames.json";
    $.getJSON(url, function( data ) {
        var minigames = [];
        $.each(data, function( key, val ) {
            var m = new Minigame(val);
            minigames.push(m);
        });
        callback(minigames);
    });
}*/

function showWarning(message){
    $(".fileSizeWarningMessage").text(message);
    $(".fileSizeWarning").modal('show');
    $(".fileSizeWarning-close").click(function(){
        $(".fileSizeWarning").modal('hide');
    })
}