(function() {

    Pts.namespace( this );
    var space = new CanvasSpace("#canvas").setup({bgcolor: "#2a2c2b", resize: true, retina: true});
    var form = space.getForm();
  
  
    //// Demo code ---
  
    var pts = new Group();
    var timeOutId = -1;
    var header = null;
  
  
    space.add({ 
  
      // create 200 random points
      start:( bound ) => {
        pts = Create.distributeRandom( space.innerBound, 300 );
        header = document.getElementById("home");
      }, 
  
      animate: (time, ftime) => {
        pts.rotate2D( 0.0005, space.center );
        pts.forEach( (p, i) => {
          form.fillOnly( ["#67CC8E", "#59D8E6", "#E74C3C"][i%3] ).point( p, 2.5, "circle" );
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
          pts = Create.distributeRandom( space.innerBound, 200 );
        }, 500 );
      }
  
    });
    
    //// ----
    
  
    space.bindMouse().bindTouch().play();
  
  })();;