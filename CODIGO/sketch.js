class Stack {
    constructor() {
        this.items = [];
    }

    push(item) {
        this.items.push(item);
    }

    pop() {
        return this.items.length > 0 ? this.items.pop() : null;
    }

    peek() {
        return this.items.length > 0 ? this.items[this.items.length - 1] : null;
    }

    isEmpty() {
        return this.items.length === 0;
    }
}

class Stroke {
    constructor(points, color, weight) {
        this.points = points;
        this.color = color;
        this.weight = weight;
    }

    draw() {
        stroke(this.color);
        strokeWeight(this.weight);
        noFill();
        beginShape();
        for (let point of this.points) {
            vertex(point.x, point.y);
        }
        endShape();
    }
}

let strokes = [];
let undoStack = new Stack();
let redoStack = new Stack();
let currentStroke = null;
let img = null;
let imgInput;
let imgWidth = 0;
let imgHeight = 0;
let imgX = 0;
let imgY = 0;


let selectedColor = '#ff0000'; // Color inicial
let colorPicker;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(240);

    // Crear selector de color
    colorPicker = createColorPicker('#ff0000');
    colorPicker.position(10, 10);
    colorPicker.input(() => {
        selectedColor = colorPicker.value();
    });

    // Crear input para cargar imagen
    imgInput = createFileInput(handleFile);
    imgInput.position(10, 50); // Justo debajo del colorPicker
  
      helpBox = createDiv(`
        <strong>Instrucciones:</strong><br>
        Click + arrastrar = dibujar<br>
        Tecla Z = deshacer<br>
        Tecla Y = rehacer<br>
         
    `);
    helpBox.position(10, 90);
    helpBox.style('background', '#ffffffcc');
    helpBox.style('padding', '10px');
    helpBox.style('border-radius', '8px');
    helpBox.style('font-family', 'sans-serif');
    helpBox.style('font-size', '14px');
    helpBox.style('width', '220px');
    helpBox.style('box-shadow', '2px 2px 5px rgba(0,0,0,0.2)');
}

function draw() {
    background(240);

    if (img) {
        image(img, imgX, imgY, imgWidth, imgHeight);
    }

    for (let stroke of strokes) {
        stroke.draw();
    }

    if (currentStroke) {
        currentStroke.draw();
    }
}

function mousePressed() {
    currentStroke = new Stroke([], selectedColor, random(2, 5));
}

function mouseDragged() {
    if (currentStroke) {
        currentStroke.points.push(createVector(mouseX, mouseY));
    }
}

function mouseReleased() {
    if (currentStroke && currentStroke.points.length > 0) {
        strokes.push(currentStroke);
        undoStack.push(currentStroke);
        redoStack = new Stack();
    }
    currentStroke = null;
}

function keyPressed() {
    if (key === 'z' || key === 'Z') {
        if (!undoStack.isEmpty()) {
            redoStack.push(undoStack.pop());
            strokes.pop();
        }
    }
    if (key === 'y' || key === 'Y') {
        if (!redoStack.isEmpty()) {
            let redoStroke = redoStack.pop();
            strokes.push(redoStroke);
            undoStack.push(redoStroke);
        }
    }
}

function handleFile(file) {
   if (file.type === 'image') {
        loadImage(file.data, loadedImg => {
            img = loadedImg;

            // Calcular escala manteniendo proporción
            let scale = min(width / img.width, height / img.height);
            imgWidth = img.width * scale;
            imgHeight = img.height * scale;

            // Centrar imagen
            imgX = (width - imgWidth) / 2;
            imgY = (height - imgHeight) / 2;
        });
    }
}
