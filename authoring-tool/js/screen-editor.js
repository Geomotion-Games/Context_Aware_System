// START
$("#start").on('click', 'li', function(e) {
    var stopNumber = 0;
    var action =  $(e.target).hasClass('fa-pencil') ? "edit" : "";

    stopOnClick(this, stopNumber, action);
});

// FINISH
$("#finish").on('click', 'li', function(e) {
    var stopNumber = 999;
    var action =  $(e.target).hasClass('fa-pencil') ? "edit" : "";

    stopOnClick(this, stopNumber, action);
});

// STOPS
$("#stops").on('click', 'li', function(e) {
    var stopNumber = parseInt($(this).attr("stop-number"));
    var action = $(e.target).hasClass('fa-trash') ? "remove" : "";
    action = $(e.target).hasClass('fa-pencil') ? "edit" : action;
    action = $(e.target).hasClass('fa-copy') ? "duplicate" : action;

    stopOnClick(this, stopNumber, action);
});

function showEditorScreen(screen, stopNumber){
    var stopId = "#stop-edit";
    var point = null;
    //MARKER
    for (var point in points){
        if(points[point].idNumber == stopNumber){
            $("#stop-editor-preview").empty();
            appendPreviewScreen("#stop-editor-preview", points[point].screens, screen, false, true);
            appendEditor("#stop-editor-form", points[point].screens, screen);
            point = points[point];
            break;
        }
    }

    $("#title").on('input',function(e){
        var title = $(this).val();
        $("body").find("[data-index=" + screen + "]").each(function(){
            $(this).find(".preview-title").text(title);
        });
        $(stopId + "  #preview-title").text(title);
        point.screens[screen].title = title;
        //$(this).closest('.modal-content').find('.modal-title').text( 'Editing Stop' + text + ":");
    });

    //DESCRIPTION
    $("#txt").on('input',function(e){
        var text = $(this).val();
        $("body").find("[data-index=" + screen + "]").each(function(){
            $(this).find(".preview-text").text(text);
        });

        $(stopId + "  #preview-text").text(text);
        point.screens[screen].text = text;
        //points[stopNumber].description = $(this).val();
    });

    $("#pwd").on('change',function(e){
        console.log("image changed");
        $("body").find("[data-index=" + screen + "]").each(function(){
            var imageHolder = $(this).find(".preview-img");
            imageHolder.empty();
            var src = URL.createObjectURL(e.target.files[0]);
            imageHolder.attr('src', src);

            point.screens[screen].image = src;
        });

    });

    $(stopId).modal('show');
}

function showScreensOverview(stopNumber){
    var screens = [];

    for (var point in points){
        if(points[point].idNumber == stopNumber){
            screens = points[point].screens;
        }
    }

    $("#screens").empty();

    for(var screen in screens){
        appendPreviewScreen("#screens", screens, screen, screens[screen].type != "B");
    }

    $("#preview-screen.clickable").on('click',function(e){
        var screen_index = $(this).attr("data-index");
        showEditorScreen(screen_index, stopNumber);
    });

}

function appendEditor(parent, screens, index){
    $(parent).empty();
    var title = screens[index].title;
    var text = screens[index].text;
    var image = screens[index].image;

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

function appendPreviewScreen(parent, screens, index, clickable, editor){
    var title = screens[index].title || "Title";
    var text = screens[index].text || "Text";
    var image = screens[index].image || "";

    if(!editor) {
        if (screens[index].type == "A") {
            $(parent).append(`
                <div class="col-md-4">
                    <div href="" class="edit-screen">
                        <div class="preview-screen clickable" id="preview-screen-A" data-index="${index}">
                            <div class="hover">
                                <div class="content">
                                    <h4 class="preview-title" id="preview-title-A">${title}</h4>
                                    <img class="preview-img" id="preview-img-A" src="${image}">
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
        } else if (screens[index].type == "B") {
            $(parent).append(`
                <div class="col-md-4">
                    <div class="preview-screen" id="preview-screen-B" data-index="${index}">
                        Challenge:
                        <select name="challenge">
                            <option value="a">Challenge A</option>
                            <option value="b">Challenge B</option>
                            <option value="c">Challenge C</option>
                            <option value="d">Challenge D</option>
                        </select>
                    </div>
                    <h4>Challenge</h4>
                </div>
            `);
        } else if (screens[index].type == "C") {
            $(parent).append(`
                <div class="col-md-4">
                    <div href="" class="edit-screen">
                        <div class="preview-screen clickable" id="preview-screen-C" data-index="${index}">
                            <div class="hover">
                                <div class="content">
                                    <h4 class="preview-title" id="preview-title-C">${title}</h4>
                                    <img class="preview-img" id="preview-img-C" src="${image}">
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
        if (screens[index].type == "A") {
            $(parent).append(`
                <div class="preview-screen" id="preview-screen-A" data-index="${index}">
                    <div class="content">
                        <h4 class="preview-title" id="preview-title-A">${title}</h4>
                        <img class="preview-img" id="preview-img-A" src="${image}">
                        <p class="preview-text" id="preview-text-A">${text}</p>
                        <p class="preview-button" id="preview-button-A">Go out and play!</p>
                    </div>
                    <div class="background-front"></div>
                    <img class="background" src="css/map-background.png">
                </div>
            `);
        } else if (screens[index].type == "C") {
            $(parent).append(`
                <div class="preview-screen" id="preview-screen-A" data-index="${index}">
                   <div class="content">
                        <h4 class="preview-title" id="preview-title-C">${title}</h4>
                        <img class="preview-img" id="preview-img-C" src="${image}">
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

function stopOnClick(parent, stopNumber, action){
    if(action == "remove"){
        $(parent).remove();
        map.removeLayer("point" + stopNumber);
        map.removeLayer("pointText" + stopNumber);
        removeStop(stopNumber);
        return;
    }else if(action == "edit"){
        window.location = "/screens-overview.html";
    }else if(action == "duplicate"){
        console.log("duplicate!");
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