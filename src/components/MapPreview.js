import React,{useState,useEffect,useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import ReactMapGl, {Marker, Popup, Source, Layer, FlyToInterpolator,GeolocateControl} from 'react-map-gl';
import * as mapAction from '../store/actions/vehicles';
import * as homeZones from '../store/actions/homeZones';
import coordinates from '../Data';
import ControlPanel from '../components/ControlPanel';
import Pin from './pin';
import * as turf from '@turf/turf'
const MapPreview = () =>{
    
    const dispatch = useDispatch();
    const getVehiclesMarker = useSelector(state => state.vehicles)
    const [selected, setSelected] = useState(null);
    const accessToken = 'pk.eyJ1IjoiYW1lcjk0IiwiYSI6ImNra2h4NGtmNTBicDgyb3A3ZGVtNnVmYnMifQ.8r5xP3rJVCgykIeAvJwP-A';
    // the marker is used to simulate a person location 
    const [marker, setMarker] = useState({
        latitude: -41.276050282526164,
        longitude: 174.7726804186453,
      });
    const [events, logEvents] = useState({});
   
    // initialising the vehicle points to random place around wellington
    const [vehiclePoint,setVehiclePoint] = useState({
        latitude: -41.308734,
        longitude: 174.821595,
    });
    // this array is used to store all the vehicles'distances from the marker 
    // thereafter sorting the array to get the closest vehicle from the marker
    var distanceArray =[];
    var vehiclesDistances = [];    
    const [viewport, setViewport] = useState({
        width: "100vw",
        height: "100vh",
        latitude:-41.27134600994718,
        longitude: 174.77985076795642,
        zoom: 12,
        bearing: 0,
        pitch: 0
        });
          
        
    const  geojson = {
        type: 'FeatureCollection',
        features: [
            {type: 'geojson', geometry: {type: 'Polygon', coordinates:coordinates}}
        ]
        };
    const geolocateStyle = {
        top: 0,
        left: 0,
        margin: 10
        };
    const positionOptions = {enableHighAccuracy: true};
    
    
    useEffect(()=>{   // uploading all the vehicels that are available on the map
        dispatch(mapAction.fetchData()); // retreiving the vechiles location from the mevo API vehicles
        dispatch(homeZones.fetchData());// retreiving the homeZones from the mevo API homeZone
    },[dispatch])

    useEffect(()=>{
        // the block is used for the pop when the vehicle marker is clicked
        const listener =  (e)=>{
            if(e.key === "Escape"){
                setSelected(null);
            }
        }
        window.addEventListener("keydown", listener)
        return () =>{
            window.removeEventListener("keydown", listener);
        }
    },[])
    
        if(getVehiclesMarker.length > 0 && getVehiclesMarker.vehiclesData ){
            for(var i = 0; i < getVehiclesMarker.length; i++){
               var vDistance = turf.point( [parseFloat(getVehiclesMarker.vehiclesData[i].position.latitude),
                parseFloat(getVehiclesMarker.vehiclesData[i].position.longitude)])
                var markerDistcance = turf.point([marker.latitude, marker.longitude]);
                var d = turf.distance(markerDistcance,vDistance,{units:'kilometers'})
                distanceArray.push(d);
                vehiclesDistances.push({
                    id: parseFloat(getVehiclesMarker.vehiclesData[i].position.latitude),
                    distance:d
                })
            }
            
        }
        //sorting the array in acending order 
        distanceArray.sort((a,b)=> a - b)    
 
       const closestVehicleHandler = (lat, long)=>{
        var closestCar = distanceArray[0];
        var vehiclePoint = turf.point([lat, long]);
        var markerPoint = turf.point([marker.latitude, marker.longitude]);
        var singleMarkerDistance  = turf.distance(markerPoint,vehiclePoint,{units:'kilometers'});

        if( singleMarkerDistance === closestCar  ){
            return true
        }
        return false
       }

       // this function to change the camera viewport to the selected city from the side panel
        const onSelectCity = useCallback(({city, latitude, longitude}) => {
            setViewport({...viewport,
              longitude: longitude,
              lantitude: latitude,
              zoom: 11,
              transitionInterpolator: new FlyToInterpolator(),
              transitionDuration: 'auto'
            });
          }, [viewport]);

        const onMarkerDragStart = useCallback(event => {
        logEvents(_events => ({..._events, onDragStart: event.lngLat}));
        }, []);
        const onMarkerDrag = useCallback(event => {
        logEvents(_events => ({..._events, onDrag: event.lngLat}));
        setMarker({...marker,
            longitude: event.lngLat[0],
            latitude: event.lngLat[1]
            })
        }, []);
        
        const onMarkerDragEnd = useCallback(event => {
        logEvents(_events => ({..._events, onDragEnd: event.lngLat}));
            
        }, []);
        const showDistance = (id)=>{
            // this is the distance between the marker(i.e the current person location) and the the vehicles
            const dis =  vehiclesDistances.filter( d => d.id === id)
            return dis[0].distance.toFixed(2);
        }
    return (
        <div>  
            <ReactMapGl
            {...viewport}
            mapboxApiAccessToken={accessToken}
            dragRotate={false}
            onViewportChange={nextViewport => setViewport(nextViewport)}
            >

            { getVehiclesMarker.vehiclesData.map((data, index) =><Marker  key={index} latitude={parseFloat(data.position.latitude)} longitude={parseFloat(data.position.longitude)}> 
                  <button className="marker_btn" style ={{backgroundColor: closestVehicleHandler(parseFloat(data.position.latitude), parseFloat(data.position.longitude)) === true? 'green': 'transparent'}} onClick={(e) =>{
                      e.preventDefault();
                      setSelected(data)
                      setVehiclePoint({...vehiclePoint, lantitude:parseFloat(data.position.latitude),longitude:parseFloat(data.position.longitude)})
                  }}>
                  
                    <img src={data.iconUrl} alt="vehicle pin" height={40} />
                  </button>
                </Marker>
              )
            }
            
            <Marker
            longitude={marker.longitude}
            latitude={marker.latitude}
            offsetTop={-20}
            offsetLeft={-10}
            draggable
            onDragStart={onMarkerDragStart}
            onDrag={onMarkerDrag}
            onDragEnd={onMarkerDragEnd}
          >
            <Pin size={20} />
          </Marker>
            {selected && <Popup 
                    latitude={parseFloat(selected.position.latitude)} 
                    longitude={parseFloat(selected.position.longitude)}
                    onClose={() =>{
                        setSelected(null)
                       
                    }}
                    >
                        <div>Vehicle</div>
                        <p>Distance: {selected? showDistance(parseFloat(selected.position.latitude)):0}k</p>
                    </Popup>}
                    
                    <Source 
                       id='source'
                       type='geojson'
                       data={geojson}
                    >
                    <Layer  
                    id='line'
                    type='line'
                    paint={{
                         "line-color":'#f7590d',
                         "line-width":3
                     }}
                     line-join={"round"}
                    />
                    </Source>
                    
                   
                    <GeolocateControl
                    style={geolocateStyle}
                    positionOptions={positionOptions}
                    trackUserLocation
                    onViewportChange={(e) =>{setMarker({...marker,
                        longitude: e.longitude,
                        latitude: e.latitude
                      });}}
                    auto
                  />
            </ReactMapGl>

            <ControlPanel onSelectCity={onSelectCity}/>
        </div>
    )
}

export default MapPreview;
