
import CITIES from '../.data/cities.json';
import React from 'react';
const  ControlPanel = (props) =>{

    return (
      <div className="control-panel">
        <h3>Camera Transition</h3>
        <p>Smooth animate of the viewport.</p>
       
        
  
        {CITIES.map((city, index) => (
           
          <div key={`btn-${index}`} className="input">
            <input
              type="radio"
              name="city"
              id={`city-${index}`}
              defaultChecked={city.city === 'Wellington'}
              onClick={() => props.onSelectCity(city)}
            />
           
            <label htmlFor={`city-${index}`}>{city.city}</label>
          </div>
        ))}
      </div>
    );
  }
  export default React.memo(ControlPanel);