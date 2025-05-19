Profe no pudimos conseguir el microbit prestado entonces te vamos a explicar como planeabamos implementarlo pero pues no funcionó
Queriamos que con el boton a cambiaramos a modo dibujar y el b a modo borrador, y el acelerometro que lee los datos en x y y dibujara, para lograr esto hay que añadir en las variables globales esto

```js
let serial;
let micX = 0;
let micY = 0;
```

En el setup()

```js
// Serial
    serial = new p5.SerialPort();
    serial.list();
    serial.open(); // abrir el primer puerto disponible
    serial.on('data', serialEvent);
```

Y agregamos una funcion que lee los datos seriales enviados por el microbit
```js
function serialEvent() {
    let data = serial.readLine().trim();
    if (data.startsWith("A")) {
        isEraser = true;
    } else if (data.startsWith("B")) {
        isEraser = false;
    } else {
        let [xStr, yStr] = data.split(",");
        let x = parseFloat(xStr);
        let y = parseFloat(yStr);
        if (!isNaN(x) && !isNaN(y)) {
            let drawX = map(x, -1024, 1024, 0, width);
            let drawY = map(y, -1024, 1024, 0, height);

            if (!isEraser) {
                if (!currentStroke) {
                    currentStroke = new Stroke([], selectedColor, brushSize);
                }
                currentStroke.points.push(createVector(drawX, drawY));
            } else {
                for (let i = strokes.length - 1; i >= 0; i--) {
                    let stroke = strokes[i];
                    stroke.points = stroke.points.filter(pt => dist(drawX, drawY, pt.x, pt.y) > eraserRadius);
                    if (stroke.points.length === 0) {
                        undoStack.push(strokes.splice(i, 1)[0]);
                        redoStack = new Stack();
                    }
                }
            }
        }
    }
}
```

Y obviamente debemos programar el microbit para que envie por el puerto serial los datos en el dormato indicado 

```py
from microbit import *
import utime

while True:
    if button_a.was_pressed():
        uart.write("A\n")
    if button_b.was_pressed():
        uart.write("B\n")

    x = accelerometer.get_x()
    y = accelerometer.get_y()
    uart.write("{},{}\n".format(x, y))
    sleep(100)
```
