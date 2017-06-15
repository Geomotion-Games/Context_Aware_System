// START
$("#start").on('click', 'li', function(e) {
    var stopId = "#stop-edit0";
    var stopNumber = 0;

    //$(stopId + " h4").text("Editing Start");
    stopOnClick(stopId, stopNumber);
});

// FINISH
$("#finish").on('click', 'li', function(e) {
    var stopId = "#stop-edit999";
    var stopNumber = 999;

    $(stopId + " h4").text("Editing Finish");
    stopOnClick(stopId, stopNumber);
});

// STOPS
$("#stops").on('click', 'li', function(e) {
    var stopNumber = parseInt($(this).attr("stop-number"));
    var stopId = "#stop-edit" + stopNumber;
    var remove = $(e.target).is('img');

    $(stopId + " h4").text("Editing Stop " + stopNumber);
    stopOnClick(stopId, stopNumber, remove);
});

function showEditorScreen(screen, stopNumber){
    var stopId = "#stop-edit";

    //MARKER
    for (var point in points){
        if(points[point].idNumber == stopNumber){
            $("#stop-editor-preview").empty();
            appendPreviewScreen("#stop-editor-preview", points[point].screens, screen, false);
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
        $(stopId + "  #preview-description").text($(this).val());
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

    $("#screens-overview #screens").empty();

    for(var screen in screens){
        appendPreviewScreen("#screens-overview #screens", screens, screen, true);
    }

    $("#preview-screen.clickable").on('click',function(e){
        var screen_index = $(this).attr("data-screen-index");
        showEditorScreen(screen_index, stopNumber);
    });

    $("#screens-overview").modal('show');
}

function appendPreviewScreen(parent, screens, index, clickable){
    //TODO: Obtener todos los parámetros de screen y añadirlos a la pantalla. Tener en cuenta el type tambien
    var title = screens[index].title ? screens[index].title : "Title";
    var description = screens[index].description ? screens[index].description : "Description";

    $(parent).append(`
            <div id="preview-screen" class=${clickable?"clickable":""} data-screen-index="${index}">
                <p id="preview-title">${title}</p>
                <p id="preview-description">${description}</p>
                <p id="preview-img">Image</p>
                <button id="preview-continue">Continuar</button>
            </div>
    `);
}

function stopOnClick(stopId, stopNumber, remove){

    if(remove){
        $(parent).remove();
        map.removeLayer("point" + stopNumber);
        map.removeLayer("pointText" + stopNumber);
        removeStop(stopNumber);
        e.preventDefault();
        return;
    }

    showScreensOverview(stopNumber);
}