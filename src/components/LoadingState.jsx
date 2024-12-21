import React from 'react'
import './CSS/LoadingState.css'
import planeImage from '../assets/loading-plane.png';
import { LuCloud } from "react-icons/lu";
import { LuCloudy } from "react-icons/lu";



export const LoadingState = () => {
    return (
        <div className='loading-background'>
            <div className='loading-icon'>
                <img src={planeImage} alt="" className='plane-icon' />
                <div className='line line-1'></div>
                <div className='line line-2'></div>
                <div className='cloud cloud-1'><LuCloudy /></div>
                <div className='cloud cloud-2'><LuCloud /></div>
                <div className='cloud cloud-3'><LuCloud /></div>
            </div>
        </div>
    )
}

export default LoadingState