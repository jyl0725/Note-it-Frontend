const canvas = document.getElementById('my-canvas');
const body = document.getElementsByTagName('body');

body.innerHTML += canvas

can = canvas.getContext('2d');

let mouse ={
  x: undefined,
  y: undefined
}
//
canvas.addEventListener('mousemove', e =>{
  // grab x and y cord
  mouse.x = event.x
  mouse.y = event.y
})


let circleArray = [];

for(let i = 0; i < 100; i++){
  let radius = 30
  let x = Math.random() * (1265 - radius *2) + radius;
  let y = Math.random() * (500 - radius *2) + radius;
  // negative value moves left, postive moves right
  let dx = (Math.random() - 0.5);
  let dy = (Math.random() - 0.5);
  circleArray.push(new Circle(x,y, dx, dy, radius))
}

console.log(circleArray)


function Circle(x,y, dx, dy, raidus){
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = raidus

  this.draw = function(){
    can.beginPath()
    can.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    can.strokeStyle = 'black'
    can.fill()
    can.stroke()
  }
  this.update = function(){
    if(this.x + this.radius > 1265 || this.x - this.radius < 0){
      this.dx = -this.dx
    }

    if(this.y + this.radius > 500 || this.y - this.radius < 0){
      this.dy = -this.dy
    }

    this.x += this.dx;
    this.y += this.dy;

    // mouse interactivity
    if (mouse.x - this.x < 50){
      this.radius += 1
    }

    this.draw();

  }

}


function animate(){
  requestAnimationFrame(animate)
  can.clearRect(0,0, 1265, 500);
  for(let i = 0; i < circleArray.length; i++){
    circleArray[i].update()
  }
}
animate()
