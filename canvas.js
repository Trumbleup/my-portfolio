Pts.namespace( window );


var space = new CanvasSpace("#canvas");
space.setup({ bgcolor: "#fff" });

var form = space.getForm();

space.add( () => form.point( space.pointer, 10 ) );

space.bindMouse().bindTouch().play();