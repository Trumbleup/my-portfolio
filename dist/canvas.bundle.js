/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***********************!*\
  !*** ./src/canvas.js ***!
  \***********************/
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
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vLi9zcmMvY2FudmFzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7O0FBRUE7QUFDQSxrREFBa0QsK0NBQStDO0FBQ2pHOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBLGU7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsUUFBUTtBQUMxQyxXQUFXO0FBQ1g7QUFDQTtBQUNBOztBQUVBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUEsS0FBSzs7QUFFTDs7O0FBR0E7O0FBRUEsR0FBRyxLIiwiZmlsZSI6ImNhbnZhcy5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgUHRzLm5hbWVzcGFjZSggdGhpcyApO1xyXG4gICAgdmFyIHNwYWNlID0gbmV3IENhbnZhc1NwYWNlKFwiI2NhbnZhc1wiKS5zZXR1cCh7Ymdjb2xvcjogXCIjMmEyYzJiXCIsIHJlc2l6ZTogdHJ1ZSwgcmV0aW5hOiB0cnVlfSk7XHJcbiAgICB2YXIgZm9ybSA9IHNwYWNlLmdldEZvcm0oKTtcclxuICBcclxuICBcclxuICAgIC8vLy8gRGVtbyBjb2RlIC0tLVxyXG4gIFxyXG4gICAgdmFyIHB0cyA9IG5ldyBHcm91cCgpO1xyXG4gICAgdmFyIHRpbWVPdXRJZCA9IC0xO1xyXG4gICAgdmFyIGhlYWRlciA9IG51bGw7XHJcbiAgXHJcbiAgXHJcbiAgICBzcGFjZS5hZGQoeyBcclxuICBcclxuICAgICAgLy8gY3JlYXRlIDIwMCByYW5kb20gcG9pbnRzXHJcbiAgICAgIHN0YXJ0OiggYm91bmQgKSA9PiB7XHJcbiAgICAgICAgcHRzID0gQ3JlYXRlLmRpc3RyaWJ1dGVSYW5kb20oIHNwYWNlLmlubmVyQm91bmQsIDMwMCApO1xyXG4gICAgICAgIGhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaG9tZVwiKTtcclxuICAgICAgfSwgXHJcbiAgXHJcbiAgICAgIGFuaW1hdGU6ICh0aW1lLCBmdGltZSkgPT4ge1xyXG4gICAgICAgIHB0cy5yb3RhdGUyRCggMC4wMDA1LCBzcGFjZS5jZW50ZXIgKTtcclxuICAgICAgICBwdHMuZm9yRWFjaCggKHAsIGkpID0+IHtcclxuICAgICAgICAgIGZvcm0uZmlsbE9ubHkoIFtcIiM2N0NDOEVcIiwgXCIjNTlEOEU2XCIsIFwiI0U3NEMzQ1wiXVtpJTNdICkucG9pbnQoIHAsIDIuNSwgXCJjaXJjbGVcIiApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIGhlYWRlciBwb3NpdGlvblxyXG4gICAgICAgIGlmIChoZWFkZXIpIHtcclxuICAgICAgICAgIGxldCB0b3AgPSB3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcclxuICAgICAgICAgIGxldCBkcCA9IHRvcCAtIHNwYWNlLnNpemUueSArIDE1MDtcclxuICAgICAgICAgIGlmIChkcCA+IDApIHtcclxuICAgICAgICAgICAgaGVhZGVyLnN0eWxlLnRvcCA9IGAke2RwICogLTF9cHhgO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaGVhZGVyLnN0eWxlLnRvcCA9IFwiMHB4XCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICB9LFxyXG4gIFxyXG4gICAgICByZXNpemU6ICgpID0+IHtcclxuICAgICAgICBjbGVhclRpbWVvdXQoIHRpbWVPdXRJZCApO1xyXG4gICAgICAgIHNldFRpbWVvdXQoICgpID0+IHtcclxuICAgICAgICAgIHB0cyA9IENyZWF0ZS5kaXN0cmlidXRlUmFuZG9tKCBzcGFjZS5pbm5lckJvdW5kLCAyMDAgKTtcclxuICAgICAgICB9LCA1MDAgKTtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgfSk7XHJcbiAgICBcclxuICAgIC8vLy8gLS0tLVxyXG4gICAgXHJcbiAgXHJcbiAgICBzcGFjZS5iaW5kTW91c2UoKS5iaW5kVG91Y2goKS5wbGF5KCk7XHJcbiAgXHJcbiAgfSkoKTs7Il0sInNvdXJjZVJvb3QiOiIifQ==