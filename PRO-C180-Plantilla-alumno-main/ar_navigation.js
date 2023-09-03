let coordinates = {}

$(document).ready(function () {
    get_coordinates();
    render_elements();
})

function get_coordinates() {
    let searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has('source') && searchParams.has('destination')) {
        let source = searchParams.get('source')
        let destination = searchParams.get('destination')
        coordinates.source_lat = source.split(";")[0]
        coordinates.source_lon = source.split(";")[1]
        coordinates.destination_lat = destination.split(";")[0]
        coordinates.destination_lon = destination.split(";")[1]
    } else {
        alert("¡Coordenadas no seleccionadas!")
        window.history.back();
    }
}


function render_elements() {
    $.ajax({
        url:`https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates.source_lon}%2C${coordinates.source_lat}%3B${coordinates.destination_lon}%2C${coordinates.destination_lat}?alternatives=true&geometries=polyline&steps=true&access_token=pk.eyJ1IjoiYXBvb3J2ZWxvdXMiLCJhIjoiY2ttZnlyMDgzMzlwNTJ4a240cmEzcG0xNyJ9.-nSyL0Gy2nifDibXJg4fTA`,
        type:"get",
        success:function(response){
            let images={
                "turnRight":"ar_right.png",
                "turnLeft":"ar_left.png",
                "slightLeft":"ar_slight_left.png",
                "slightRight":"ar_slight_right.png",
                "straight":"ar_straight.png"
            }
            let steps=response.routes[0].legs[0].steps
            
            for (let i = 0; i < step.length; i++) {
                let images
                let distance=steps[i].distance
                let instruccion=steps[i].maneuver.instruccion
                if(instruccion.includes("Turn right")){
                    images="turnRight"
                }
                else if(instruccion.includes("Turn left")){
                    images="turnLeft"
                }
                
                if(i>0){
                    $("scene_container").append(`
                    <a-entity gps-entity-place="latitude:${steps[i].maneuver.location[1]}; longitude:${steps[i].maneuver.location[0]}">
                        <a-image name="${instruccion}" src="./assets/${images[images]}" look-at="#step_${i-1}" scale="5 5 5" id="step_${i}" position="0 0 0">
                        </a-image>
                        <a-entity>
                            <a-text height="50" value="${instruccion}(${distance}m)"></a-text>
                        </a-entity>
                    </a-entity>
                    `)
                }
                else{
                $("scene_container").append(`
                <a-entity gps-entity-place="latitude:${steps[i].maneuver.location[1]}; longitude:${steps[i].maneuver.location[0]}">
                    <a-image name="${instruccion}" src="./assets/ar_start.png}" look-at="#step_${i+1}" scale="5 5 5" id="step_${i}" position="0 0 0">
                    </a-image>
                    <a-entity>
                        <a-text height="50" value="${instruccion}(${distance}m)"></a-text>
                    </a-entity>
                </a-entity>
                `)
                }
            }
        }
    })
}
