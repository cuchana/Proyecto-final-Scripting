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
        this.points = points; // Lista de puntos del trazo
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

let strokes = []; // Lista de trazos dibujados
let undoStack = new Stack(); // Pila para deshacer cambios
let redoStack = new Stack(); // Pila para rehacer cambios
let currentStroke = null;
let img = null;
let imgInput;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(240);
    
    // Crear botón para cargar imágenes
    imgInput = createFileInput(handleFile);
    imgInput.position(10, 10);
}

function draw() {
    background(240);

    // Mostrar imagen si está cargada
    if (img) {
        image(img, 0, 0, width, height);
    }

    // Dibujar todos los trazos
    for (let stroke of strokes) {
        stroke.draw();
    }

    if (currentStroke) {
        currentStroke.draw();
    }
}

function mousePressed() {
    currentStroke = new Stroke([], color(random(255), random(255), random(255)), random(2, 5));
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
        redoStack = new Stack(); // Se limpia la pila de rehacer
    }
    currentStroke = null;
}

function keyPressed() {
    if (key === 'z' || key === 'Z') { // Deshacer
        if (!undoStack.isEmpty()) {
            redoStack.push(undoStack.pop());
            strokes.pop();
        }
    }
    if (key === 'y' || key === 'Y') { // Rehacer
        if (!redoStack.isEmpty()) {
            let redoStroke = redoStack.pop();
            strokes.push(redoStroke);
            undoStack.push(redoStroke);
        }
    }
}

// Función para manejar la carga de imágenes
function handleFile(file) {
    if (file.type === 'image') {
        img = loadImage(file.data);
    }
}
