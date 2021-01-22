import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL , {Marker, Popup}from 'react-map-gl';
import listLogEntries from './API'
import LogEntryForm from './LogEntryForm'

const App = ()=> {
  const [logEntries, setLogEntries] = useState([])
  const [showPopup, setShowPopup] = useState({})
  const [addEntryLocation, setAddEntryLocation] = useState()
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 40.712743,
    longitude: -74.013379,
    zoom: 2
  });

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  };

  useEffect(()=>{
    (async () =>{
        const logEntries = await listLogEntries()
        setLogEntries(logEntries)
    })()
  },[])

 const showAddMarkerPopup = (event) =>{
      const [ longitude, latitude ] = event.lngLat
      setAddEntryLocation({
        latitude,
        longitude
      })
 }

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/abhinavp06/ckk802i8p0wbh17l1idm9ho6i"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={setViewport}
      onDblClick={showAddMarkerPopup}
    >{
      logEntries.map(entry =>(
        <React.Fragment key={entry._id}>
        <Marker 
          latitude={entry.latitude} 
          longitude={entry.longitude}
        >
          <div
            onClick={()=> setShowPopup({
              [entry._id]:true,
            })}
          >
            <svg 
              className="marker yellow"
              style={{
                width:`calc(0.6vmin * ${viewport.zoom})`,
                height:`calc(0.6vmin * ${viewport.zoom})`,
              }}
              viewBox="0 0 24 24"  
              stroke="red" 
              stroke-width="1" 
              fill="none" 
              stroke-linecap="round" 
              stroke-linejoin="round" 
            >
              <path 
                d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
              >
              </path>
              <circle 
                cx="12" 
                cy="10" 
                r="3"
              >
              </circle>
            </svg>
          </div>
        </Marker>
        {
          showPopup[entry._id]? (
            <Popup
              latitude={entry.latitude} 
              longitude={entry.longitude}
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={true}
              // onClose={() => setShowPopup({
              //   [entry.id]:false
              // })}
              onClose={() => setShowPopup({})}
              anchor="top" >
              <div classname="popup">
                <h3>{entry.title}</h3>
                <p>{entry.comments}</p>
                {entry.image && <img src={entry.image} alt={entry.title} />}
                &nbsp;&nbsp;&nbsp;
                <small>Visited on: {new Date(entry.visitDate).toLocaleDateString()}</small>
              </div>
            </Popup>
          ) : null
        }
        </React.Fragment>
      ))
    }
    {
      addEntryLocation ? (
          <>
            <Marker 
                  latitude={addEntryLocation.latitude} 
                  longitude={addEntryLocation.longitude}
            >
                  <div>
                    <svg 
                      className="marker"
                      style={{
                        width:`calc(0.6vmin * ${viewport.zoom})`,
                        height:`calc(0.6vmin * ${viewport.zoom})`,
                      }}
                      viewBox="0 0 24 24"  
                      stroke="red" 
                      stroke-width="1" 
                      fill="none" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                    >
                      <path 
                        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                      >
                      </path>
                      <circle 
                        cx="12" 
                        cy="10" 
                        r="3"
                      >
                      </circle>
                    </svg>
                  </div>
            </Marker>
            <Popup
              latitude={addEntryLocation.latitude} 
              longitude={addEntryLocation.longitude}
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={true}
              onClose={() => setAddEntryLocation(null)}
              anchor="top" >
              <div classname="popup">
                  <LogEntryForm onClose={() => 
                    {
                      setAddEntryLocation(null);
                      getEntries();
                    }} 
                    location={addEntryLocation} 
                  />
              </div>
            </Popup>
          </>
      ) : null
    }
    </ReactMapGL>
  );
}

export default App