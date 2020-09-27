import React from 'react'
import './Sections/Rainbow.css';

function RainbowBackgroundPage(props) {

    return (
    <div>
      <div className="heroPart" style={{padding:"0px"}}>
                
                <div className="front">
                    <div className="hero" style={{height:"auto"}}>
                        {props.children}
                    </div>
                </div>

                <div className="back">
                    <div className="left"></div>
                    <div className="right"></div>
                </div>
      </div>
    </div>
        
    )
}

export default RainbowBackgroundPage
