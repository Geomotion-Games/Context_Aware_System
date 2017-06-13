// START
$("#start").on('click', 'li', function(e) {
    var stopId = "#stop-edit0";
    var stopNumber = 0;

    showScreensOverview(stopNumber);
    //$(stopId + " h4").text("Editing Start");
    //stopOnClick(this, stopId, stopNumber);
});

// FINISH
$("#finish").on('click', 'li', function(e) {
    var stopId = "#stop-edit999";
    var stopNumber = 999;

    $(stopId + " h4").text("Editing Finish");
    stopOnClick(this, stopId, stopNumber);
});

// STOPS
$("#stops").on('click', 'li', function(e) {
    var stopNumber = parseInt($(this).attr("stop-number"));
    var stopId = "#stop-edit" + stopNumber;
    var remove = $(e.target).is('img');

    $(stopId + " h4").text("Editing Stop " + stopNumber);
    stopOnClick(this, stopId, stopNumber, remove);
});

function showEditorScreen(stop, screen){

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
        $("#screens-overview #screens").append(`
            <div id="preview-screen" >
                <p id="preview-title">${screens[screen].title}</p>
                <p id="preview-description">${screens[screen].description}</p>
                <p id="preview-img">Image</p>
                <button id="preview-continue">Continuar</button>
            </div>
        `);
    }

    $("#screens-overview").modal('show');
}

function stopOnClick(parent, stopId, stopNumber, remove){
    var id = $(parent).attr('id');

    if(remove){
        $(parent).remove();
        map.removeLayer("point" + stopNumber);
        map.removeLayer("pointText" + stopNumber);
        console.log("removing");
        removeStop(stopNumber);
        e.preventDefault();
        return;
    }


    $(stopId).modal('show');

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
}
