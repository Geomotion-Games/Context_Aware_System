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

    //MARKER
    for (var point in points){
        if(points[point].idNumber == stopNumber){
            $("#stop-editor-preview").empty();
            appendPreviewScreen("#stop-editor-preview", points[point].screens, screen, false);
            appendEditor("#stop-editor-form", points[point].screens, screen);
        }
    }

    $(stopId + " input[name^='name']").on('input',function(e){

        //TITLE IN LIST
        $('#start #point0 span.name').text( $(this).val());

        //MARKER
        for (var point in points){
            if(points[point].idNumber == stopNumber){
                points[point].title = $(this).val();
                if(points[point].idNumber != 0 && points[point].idNumber != 999)
                    points[point].marker._tooltip.setContent( $(this).val() );
            }
        }

        //TITLE OF MODAL
        $(stopId + "  #preview-title").text($(this).val());
        $(this).closest('.modal-content').find('.modal-title').text( 'Editing ' + $(this).val() );
    });

    //DESCRIPTION
    $(stopId + " textarea[name^='content']").on('input',function(e){
        $(stopId + "  #preview-text").text($(this).val());
        points[stopNumber].description = $(this).val();
    });

    //URL
    $(stopId + " input[name^='url']").on('input',function(e){
        $(stopId + "  #preview-url").text($(this).val());
        points[stopNumber].url = $(this).val();
    });

    //DISTANCE
    $(stopId + " input[name^='distance']").on('input',function(e){
        $(stopId + "  #preview-distance").text($(this).val());
        points[stopNumber].distance = parseInt($(this).val());
    });

    //REWARD
    $(stopId + " input[name^='reward']").on('input',function(e){
        $(stopId + "  #preview-reward").text($(this).val());
        points[stopNumber].reward = parseInt($(this).val());
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

    $(parent).append(`
        <div class="form-group">
            <label for="name-name" class="control-label">Title:</label>
            <input name="name-` + poisCreated + `" type="text" class="form-control" id="name-` + poisCreated + `">
        </div>
        <div class="form-group">
            <label for="content-name" class="control-label">Text:</label>
            <textarea id="content-` + poisCreated + `" name="content-` + poisCreated + `"></textarea>
        </div>
        <div class="form-group">
            <label for="clue-name" class="control-label">Image:</label>
            <input name="image-` + poisCreated + `" type="file" class="form-control" id="image-` + poisCreated + `" accept="image/*">
        </div>
    `);
}

function appendPreviewScreen(parent, screens, index, clickable){
    var title = screens[index].title ? screens[index].title : "Title";
    var text = screens[index].text ? screens[index].text : "Text";
    var image = screens[index].image ? screens[index].image : "Image/Media";
    var reward = screens[index].reward ? screens[index].reward : "Reward";

    if(screens[index].type == "A"){
        $(parent).append(`
            <div id="preview-screen" class=${clickable?"clickable":""} data-index="${index}">
                <p id="preview-title">${title}</p>
                <p id="preview-text">${text}</p>
                <p id="preview-img">${image}</p>
                <button id="preview-continue">Continuar</button>
            </div>
        `);
    }else if(screens[index].type == "B"){
        $(parent).append(`
            <div id="preview-screen" class=${clickable?"clickable":""} data-index="${index}">
                Challenge:
                <select name="challenge">
                  <option value="volvo">Challenge A</option>
                  <option value="saab">Challenge B</option>
                  <option value="fiat">Challenge C</option>
                  <option value="audi">Challenge D</option>
                </select>
                 <button id="preview-continue">Continuar</button>
            </div>
        `);
    }else if(screens[index].type == "C"){
        $(parent).append(`
            <div id="preview-screen" class=${clickable?"clickable":""} data-index="${index}">
                <p id="preview-title">${title}</p>
                <p id="preview-text">${text}</p>
                <p id="preview-img">${image}</p>
                <p id="preview-reward">${reward}</p>
                <button id="preview-continue">Continuar</button>
            </div>
        `);
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