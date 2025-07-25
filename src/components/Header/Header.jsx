import React, {useEffect, useRef} from 'react'
import "./Header.css"



class Vector{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    add(v){
        return new Vector(this.x + v.x,this.y + v.y)
    }


    subtract(v){
        return new Vector(this.x - v.x,this.y - v.y)
    }

    multiply(n){
        return new Vector(this.x * n,this.y * n)
    }

    mag(){
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    unit(){
        if(this.mag() == 0){
            return new Vector(0,0)
        }else{
            return new Vector(this.x/this.mag(),this.y/this.mag());
        }
    }
    
    angle(){
        return Math.atan2(this.y,this.x);
    }
}



class Particle{
    constructor(x,y,r,vel,color,ctx){
        this.ctx = ctx;
        this.pos = new Vector(x,y);
        this.orig = new Vector(x,y);
        this.vel = vel;
        this.r = 0;
        this.size = r;
        this.color = color;
        this.toDelete = false;
        this.toShrink = false;
    }


    draw(){
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.pos.x,this.pos.y,this.r,0,Math.PI * 2,false);
        this.ctx.fill();
        this.update();
    }

    update(){
        if(this.r < this.size && !this.toShrink){
            this.r+=.1;
        }
        if(this.toShrink){
            if(this.r > .2){
            this.r-=.1;
            }else{
                this.toDelete = true;
            }
        }
       

        this.pos = this.pos.add(this.vel);
        this.boundary();
    }

    boundary(){
        if(this.pos.x < 0 || this.pos.x > innerWidth || this.pos.y > 650 || this.pos.y < 0){
            this.toDelete = true;
        }
        let travelDistance = this.pos.subtract(this.orig).mag();
        if(travelDistance > 225 && !this.toShrink){
            this.toShrink = true;
        }
    }

    repel(mouse) {
        const direction = mouse.subtract(this.pos);
        const mag = direction.mag();
    
        if (mag < 150) {
            const normal = direction.multiply(1 / mag); // faster than unit()
            this.vel = normal.multiply(2);
        }
    }
}

const Header = () => {
    const canvasRef = useRef();
    const h1Ref = useRef();
    const shadowRef = useRef();
    const animateInt = useRef();
    const particlesRef = useRef([]);
    const mouseRef = useRef(null);




    onscroll=(e)=>{
        let {scrollY} = window

        // math/values to calibrate delta/speed
        let opacityOffset = scrollY/1000
        let textVelocity = 2;
        let opacityVelocity = 2.5;

        h1Ref.current.style.transform = `translateY(${-scrollY/textVelocity}px)`  
        shadowRef.current.style.opacity = 1 - (opacityOffset * opacityVelocity);
}



useEffect(() => {
    if(canvasRef.current){
        console.log("inside the if statement!")
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const generateParticles = (count) => {
      const particles = [];
      for (let i = 0; i < count; i++) {
        let posX = Math.floor(Math.random() * window.innerWidth);
        let posY = Math.floor(Math.random() * 750);
        let particleSize = Math.random() * 1.5;
        let velX = Math.random() > .5 ? Math.random() * 1 : Math.random() * -1;
        let velY = Math.random() > .5 ? Math.random() * 1 : Math.random() * -1;
        particles.push(new Particle(posX, posY, particleSize,new Vector(velX,velY), "black", ctx));
      }
      particlesRef.current = [...particlesRef.current,...particles];
    //   console.log(particles)
    };

    const animateParticles = () => {
    //   ctx.fillStyle = "black";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p,idx) => {
          p.draw()
          if(mouseRef.current)p.repel(mouseRef.current);
          if(p.toDelete){
              particlesRef.current.splice(idx,1)
              generateParticles(1);
          }
        });
    //   console.log("running particles--")
      animateInt.current = requestAnimationFrame(animateParticles);
    };

      canvas.width = window.innerWidth;
      canvas.height = 300; // set to your desired height
      generateParticles(225);
      animateParticles();

}

    return () => {
      cancelAnimationFrame(animateInt.current);
      particlesRef.current = [];
    };
  }, []);



const trackMouseCoords=(e)=>{
    console.log("trackmousecoords!!")
 
    mouseRef.current = new Vector(e.clientX,e.clientY);
    console.log(mouseRef.current);
}





  return (
    <header className="header">
        <div className="header-content">
        <div className="header-h1-container">
            <h1 ref={h1Ref} className="header-h1">JG<span className="thin">Dev</span></h1>
            <div ref={shadowRef} className="shadow-box">
            <h1 className="header-h1-shadow">JG<span className="thin">Dev</span></h1>
            </div>
        </div>
        </div>
        <canvas onMouseMove={(e)=>trackMouseCoords(e)} className="header-canvas" ref={canvasRef}></canvas>
    </header>
  )
}

export default Header