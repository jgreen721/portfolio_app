import React, {useRef} from 'react'
import "./Header.css"

const Header = () => {
    const canvasRef = useRef();
    const h1Ref = useRef();


    // const handleMouseMove=(e)=>{
    //     let elHeight = parseInt(getComputedStyle(e.target).height);
    //     let mouseHeight = e.clientY;
    //     let percent = mouseHeight/elHeight;
    //     // console.log(percent);
    //     let offset = 20;
    //     if(percent > .5){
    //         h1Ref.current.style.transform = `translateY(${offset * -percent}px)`
    //     }else{
    //         h1Ref.current.style.transform = `translateY(${0}px)`

    //     }
    // }

    onscroll=(e)=>{
        console.log(window.scrollY);
        let scrollVal = window.scrollY;
            h1Ref.current.style.transform = `translateY(${-scrollVal}px)`
}
  return (
    <header className="header">
        <div className="header-content">
        <div className="header-h1-container">
            <h1 ref={h1Ref} className="header-h1">JG<span className="thin">Dev</span></h1>
            <div className="shadow-box">
            <h1 className="header-h1-shadow">JG<span className="thin">Dev</span></h1>
            </div>
        </div>
        </div>
        <canvas></canvas>
    </header>
  )
}

export default Header