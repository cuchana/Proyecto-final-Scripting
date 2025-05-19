// Patrones de diseño: State (cambia en estado de dibujando o borrando), Memento (guarda el estado de un trazo, y el caretaker se encarga de guardar y restaurar los mementos)
// CLase Stack, la usamos para implementar las pilas de deshacer/rehacer
class Stack {
    constructor() {
        this.items = [];
    }

    push(item) {
        this.items.push(item); // añadir elemento al tope
    }

    pop() {
        // Eliminar y devolver el ultimo elemento
        return this.items.length > 0 ? this.items.pop() : null;
    }

    peek() {
        // Ver el ultimo elemento sin eliminarlo
        return this.items.length > 0 ? this.items[this.items.length - 1] : null;
    }

    isEmpty() {
        return this.items.length === 0;
    }
}

// Clase Stroke: cada línea dibujada con su color y grosor
class Stroke {
    constructor(points, color, weight) {
        this.points = points; //lista de puntos (vectores) del trazo
        this.color = color; //color del trazo
        this.weight = weight; // grosor del trazo
    }

    draw() {
        //para mostrar el trazo dibujado en pantalla
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
//Variables globales
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
//Variables para la cosa de ui
let filterSelect;
let saveButton;
let eraserButton;
let selectedColor = '#ff0000';
let colorPicker;
let isEraser = false;
// Tamaños
let brushSlider;
let eraserSlider;
let brushSize = 3;
let eraserRadius = 10;

//Configuracion del proyecto
function setup() {
    createCanvas(windowWidth, windowHeight);
    background(240);

    // Selector de color
    colorPicker = createColorPicker(selectedColor);
    colorPicker.position(10, 10);
    colorPicker.input(() => {
        selectedColor = colorPicker.value();
        isEraser = false;
    });

    // cargar imagen de fondo
    imgInput = createFileInput(handleFile);
    imgInput.position(10, 50);

    // boton para borrar, aqui cambiamos el state
    eraserButton = createButton('Borrador');
    eraserButton.position(10, 90);
    eraserButton.mousePressed(() => {
        isEraser = true;
    });

    // Botón para guardar dibujo como imagen
    saveButton = createButton('Guardar');
    saveButton.position(10, 130);
    saveButton.mousePressed(() => {
        saveCanvas('mi_dibujo', 'png');
    });

    // Menu donde podemos seleccionar filtros de bibliotecas de p5js
    filterSelect = createSelect();
    filterSelect.position(10, 170);
    filterSelect.option('Sin filtro');
    filterSelect.option('GRIS');
    filterSelect.option('INVERTIR');
    filterSelect.option('THRESHOLD');
    filterSelect.option('POSTERIZE');
    filterSelect.option('DILATE');
    filterSelect.option('ERODE');

    // Instrucciones
    helpBox = createDiv(`
        <strong>Instrucciones:</strong><br>
        Click + arrastrar = dibujar<br>
        Tecla Z = deshacer<br>
        Tecla Y = rehacer<br>
    `);
    helpBox.position(10, 210);
    helpBox.style('background', '#ffffffcc');
    helpBox.style('padding', '10px');
    helpBox.style('border-radius', '8px');
    helpBox.style('font-family', 'sans-serif');
    helpBox.style('font-size', '14px');
    helpBox.style('width', '220px');
    helpBox.style('box-shadow', '2px 2px 5px rgba(0,0,0,0.2)');

    // Tamaño del pincel
    createDiv('Tamaño del pincel').position(10, 310);
    brushSlider = createSlider(1, 20, brushSize);
    brushSlider.position(10, 330);
    brushSlider.input(() => {
        brushSize = brushSlider.value();
    });

    //  Radio del borrador
    createDiv('Radio del borrador').position(10, 370);
    eraserSlider = createSlider(5, 50, eraserRadius);
    eraserSlider.position(10, 390);
    eraserSlider.input(() => {
        eraserRadius = eraserSlider.value();
    });
}

// Bucle principal de dibujo
function draw() {
    background(240);

    if (img) {
        image(img, imgX, imgY, imgWidth, imgHeight);
        //aplica filtro si esta activado
        switch (filterSelect.value()) {
            case 'GRIS': filter(GRAY); break;
            case 'INVERTIR': filter(INVERT); break;
            case 'THRESHOLD': filter(THRESHOLD); break;
            case 'POSTERIZE': filter(POSTERIZE, 3); break;
            case 'DILATE': filter(DILATE); break;
            case 'ERODE': filter(ERODE); break;
        }
    }

    // Dibujar trazos
    for (let stroke of strokes) {
        stroke.draw();
    }

    // Trazado en curso
    if (currentStroke) {
        currentStroke.draw();
    }
}
// nos dimos cuenta que al interactuar con cosas de la interfaz se leen trazos en la pantalla, entonces vamos a distinguir cuando esta usando la interfaz vs el tablero
function isMouseOverUI() {
    return (
        mouseX < 250 && mouseY < 450 // Área aproximada donde están los controles
    );
}

//evento del mouse
function mousePressed() {
    //si es diferente a isEraser empieza a dibujar
      if (isMouseOverUI()) return;
    if (!isEraser) {
        currentStroke = new Stroke([], selectedColor, brushSize);
    }
}
function mouseDragged() {
   //cuando isEraser borra puntos
   if (isMouseOverUI()) return;

    if (isEraser) {
        for (let i = strokes.length - 1; i >= 0; i--) {
            let stroke = strokes[i];
            stroke.points = stroke.points.filter(pt => dist(mouseX, mouseY, pt.x, pt.y) > eraserRadius);
            if (stroke.points.length === 0) {
                undoStack.push(strokes.splice(i, 1)[0]);
                redoStack = new Stack();
            }
        }
    } else {
        if (currentStroke) {
            currentStroke.points.push(createVector(mouseX, mouseY));
        }
    }
}

function mouseReleased() {
        // Al soltar mouse, guardar trazo en lista y pila
if (isMouseOverUI()) return;

    if (!isEraser && currentStroke && currentStroke.points.length > 0) {
        strokes.push(currentStroke);
        undoStack.push(currentStroke);
        redoStack = new Stack();
    }
    currentStroke = null;
}

function keyPressed() {
    if (key === 'z' || key === 'Z') {
        if (!undoStack.isEmpty()) {
            let last = undoStack.pop();
            redoStack.push(last);
            strokes = strokes.filter(s => s !== last);
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
// esta es la funcion para cargar los archivos
function handleFile(file) {
    if (file.type === 'image') {
        loadImage(file.data, loadedImg => {
            img = loadedImg;
            let scale = min(width / img.width, height / img.height);
            imgWidth = img.width * scale;
            imgHeight = img.height * scale;
            imgX = (width - imgWidth) / 2;
            imgY = (height - imgHeight) / 2;
        });
    }
}
