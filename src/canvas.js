const { Line } = require("pts");

(function() {

  Pts.namespace( this );
  var space = new CanvasSpace("#canvas").setup({bgcolor: "#1b242f", resize: true, retina: true});
  var form = space.getForm();


  //// Demo code ---

  var pts = new Group();
  var timeOutId = -1;
  var header = null;

  const angle = -(window.innerWidth * .05);
  const line = new Line(0, angle);


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