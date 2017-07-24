var editTimeout;
function createEditTimeout(){
    if(editTimeout != null) clearTimeout(editTimeout);
    editTimeout = setTimeout(function(){
        updateValues();
        savePOI(poi);
        clearTimeout(editTimeout);
        editTimeout = null;
    }, 2000);
}

function updateValues(){
    poi.title = $("#poiName").val();
    poi.triggerDistance = $("#poiTriggerDistance").val()
    poi.rewardPoints = $("#poiReward").val()
}

function init(){
    $("#poiName").val(poi.title);
    $("#poiName").attr("placeholder", "Point " + poi.orderNumber);
    $("#poiTriggerDistance").val(poi.triggerDistance);
    $("#poiReward").val(poi.rewardPoints);
    
    //TODO: imagen item

    $("#poiName").blur(onBlur);
    $("#poiName").on("input", onInput);
    $("#poiTriggerDistance").on("input", onInput);
    $("#poiTriggerDistance").blur(onBlur);
    $("#poiReward").blur(onBlur);
    $("#poiReward").on("input", onInput);

    if(poi.type == "beacon"){
        $("#triggerContainer").addClass("hidden");
    }

    $(".endEditing").attr("href", "../follow-the-path.php?id=" + poi.plot);


    function onBlur(){
        if(editTimeout != null) clearTimeout(editTimeout);
        updateValues();
        savePOI(poi);
    }

    function onInput(){
        if(editTimeout != null) clearTimeout(editTimeout);
        createEditTimeout();
    }

}

function showEditorScreen(index){
    var stopId = "#stop-edit";
    var point = null;
    //MARKER
    var screen = screens[index];

    $("#stop-editor-preview").empty();
    appendPreviewScreen("#stop-editor-preview", screen, index, false, true);
    appendEditor("#stop-editor-form", screen);

    $("#title").on('input',function(e){
        var title = $(this).val();
        $("body").find("[data-index=" + index + "]").each(function(){
            $(this).find(".preview-title").text(title);
        });
        $(stopId + "  #preview-title").text(title);
        screen.title = title;
        //$(this).closest('.modal-content').find('.modal-title').text( 'Editing Stop' + text + ":");
    });

    //DESCRIPTION
    $("#txt").on('input',function(e){
        var text = $(this).val();
        $("body").find("[data-index=" + index + "]").each(function(){
            $(this).find(".preview-text").text(text);
        });

        $(stopId + "  #preview-text").text(text);
        screen.text = text;
        //points[stopNumber].description = $(this).val();
    });

    $("#pwd").on('change',function(e){
        console.log("image changed");
        $("body").find("[data-index=" + index + "]").each(function(){
            var imageHolder = $(this).find(".preview-img");
            imageHolder.empty();
            var src = URL.createObjectURL(e.target.files[0]);
            imageHolder.attr('src', src);

            screen.image = src;
        });

    });

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

    $(parent).append(`
	    <div class="form-group">
            <label for="title">Title:</label>
            <input type="title" class="form-control" id="title" value="${title}">
        </div>
        <div class="form-group">
            <label for="pwd">Image:</label>
            <input class="form-control" id="pwd" type="file" accept="image/*" >
        </div>
        <div class="form-group">
            <label for="txt">Text:</label>
            <textarea rows="6" type="text" class="form-control" id="txt">${text}</textarea>
        </div>
    `);
}

function appendPreviewScreen(parent, screen, index, clickable, editor){
    var title = screen.title || "";
    var text = screen.text || "";
    var image = screen.image || "";
    var type = screen.type;

    if(!editor) {
        if (type == "A") {
            $(parent).append(`
                <div class="col-md-4">
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
                <div class="col-md-4">
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
                <div class="col-md-4">
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