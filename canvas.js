import {CanvasSpace, Pt, Group} from "pts"

const space = new CanvasSpace("#canvas");
space.setup({ bgcolor: "#2a2c2b" });

const form = space.getForm();

space.add(() => form.point( space.pointer, 10 ));
