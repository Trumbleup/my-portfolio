// const { Line } = require("pts");

const { Line } = require("pts");

// (function() {

//     Pts.namespace( this );
//     var space = new CanvasSpace("#canvas").setup({bgcolor: "#2a2c2b", resize: true, retina: true});
//     var form = space.getForm();
  
  
//     // Elements
//     const pts = [];
//     const center = space.size.$divide(1.8);
//     const angle = -(window.innerWidth * 0.5);
//     let count = window.innerWidth * 0.05;
//     if (count > 150) count = 150;
//     const line = new Line(0, angle).to(space.size.x, 0); 
//     const mouse = center.clone();

//     const r = Math.min(space.size.x, space.size.y) * 1;
//     for (var i = 0; i < count; i++) {
//       const p = new Vector(Math.random() * r - Math.random() * r , Math.random() * r - Math.random() * r);
//       p.moveBy(center).rotate2D(i*Math.PI/count, center);
//       p.brightness = 0.1;
//       pts.push(p);
//     }
  
  
//     space.add({ 
//       animate: (time, fps, context) => {
        
//         for (var i=0; i<pts.length; i++) {
//           var pt = pts[i];

//           pt.rotate2D( Const.one_degree / 20, center);
//           form.stroke( false ).fill( colors[i%3]).point(pt,1);

//           //get line from pt to the mouse line
//           const ln = new Line( pt ).to(line.getPerpendicularFromPoint(pt));

//           //opacity of line derived from distance to the line
//           const opacity = Math.min(0.8, 1 - Math.abs(line.getDistanceFromPoint(pt)) / r);
//           const distFromMouse = Math.abs(ln.getDistanceFromPoint(mouse));

//           if (distFromMouse < 50) {
//             if (pts[i].brightness < 0.3) pts[i].brightness += 0.015
//           } else {
//             if (pts[i].brightness > 0.1) pts[i].brightness -= 0.01
//           }

//           const color = "rgba(255,255,255," + pts[i].brightness + ")";
//           form.stroke(color).fill(true).line(ln);
//         }
//       },
  
//       onMouseAction: (type, x, y, evt) => {
//         if (type=="move") {
//           mouse.set(x,y);
//         }
//       },

//       onTouchAction: (type, x, y) => {
//         this.onMouseAction(type, x, y);
//       }

  
//     });
    
//     //// ----
    
  
//     space.bindMouse().bindTouch().play();
  
//   })();;


window.demoDescription = "In a field of points that revolves around a center, draw a perpendicular line from each point to a path.";

(function() {

  Pts.namespace( this );
  var space = new CanvasSpace("#canvas").setup({bgcolor: "#1b242f", resize: true, retina: true});
  var form = space.getForm();


  //// Demo code ---

  var pts = new Group();
  var timeOutId = -1;
  var header = null;

  const angle = -(window.innerWidth * .05)
  const line = new Line(0, angle)


  space.add({ 

    // creatr 200 random points
    start:( bound ) => {
      pts = Create.distributeRandom( space.innerBound, 75 );
      header = document.getElementById("header");
    }, 

    animate: (time, ftime) => {
      // make a line and turn it into an "op" (see the guide on Op for more)
      
      pts.rotate2D( 0.0008, space.center );

      pts.forEach( (p, i) => {
        // for each point, find the perpendicular to the line
        
        
        
        form.fillOnly( ["#f03", "#09f", "#0c6"][i%3] ).point( p, 2, "circle" );
        form.stroke(`rgba(255,255,255, 0.3`, 2).line(Line.fromAngle(p, -45, 4000));
      });

      // header position
      if (header) {
        let top = window.pageYOffset || document.documentElement.scrollTop;
        let dp = top - space.size.y + 150;
        if (dp > 0) {
          header.style.top = `${dp * -1}px`;
        } else {
          header.style.top = "0px";
        }
      }

    },

    resize: () => {
      clearTimeout( timeOutId );
      setTimeout( () => {
        pts = Create.distributeRandom( space.innerBound, 75 );
      }, 500 );
    }

  });
  
  //// ----
  

  space.bindMouse().bindTouch().play();

})();;