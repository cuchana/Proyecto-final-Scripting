const Stack = require('./stack');
const Stroke = require('./stroke');

// --- PRUEBAS PARA EL PATRÓN DE DISEÑO MEMENTO (Clase Stack) ---
describe('Stack (Patrón Memento)', () => {
    test('push y pop funcionan correctamente', () => {
        const stack = new Stack();

        // Al principio debe estar vacía
        expect(stack.isEmpty()).toBe(true);

        // Agregamos dos elementos
        stack.push(1);
        stack.push(2);

        // El último debe ser 2
        expect(stack.peek()).toBe(2);

        // Al hacer pop deben salir en orden inverso (LIFO)
        expect(stack.pop()).toBe(2);
        expect(stack.pop()).toBe(1);

        // Si está vacía, debe devolver null
        expect(stack.pop()).toBeNull();
        expect(stack.isEmpty()).toBe(true);
    });
});

// --- PRUEBAS PARA LA GESTIÓN DE TRAZOS ---
describe('Gestión de Trazos', () => {
    let strokes;       // Lista actual de trazos en pantalla
    let undoStack;     // Pila para deshacer
    let redoStack;     // Pila para rehacer

    // Se ejecuta antes de cada test
    beforeEach(() => {
        strokes = [];
        undoStack = new Stack();
        redoStack = new Stack();
    });

    test('agregar un trazo', () => {
        const stroke = new Stroke([{ x: 0, y: 0 }], '#000000', 2);

        // Añadimos el trazo
        strokes.push(stroke);

        // Guardamos en pila de deshacer
        undoStack.push(stroke);

        // Limpiamos el redo porque agregamos un nuevo trazo
        redoStack.clear();

        // Comprobaciones
        expect(strokes.length).toBe(1);
        expect(undoStack.peek()).toBe(stroke);
        expect(redoStack.isEmpty()).toBe(true);
    });

    test('borrar puntos con borrador elimina puntos y trazo vacío', () => {
        // Creamos 2 trazos
        const stroke1 = new Stroke([{ x: 10, y: 10 }, { x: 100, y: 100 }], '#000000', 2);
        const stroke2 = new Stroke([{ x: 200, y: 200 }], '#111111', 3);
        strokes.push(stroke1, stroke2);

        const eraserRadius = 50;
        const mouseX = 10;
        const mouseY = 10;

        // Simulamos borrador
        for (let i = strokes.length - 1; i >= 0; i--) {
            let stroke = strokes[i];

            // Quitamos los puntos cercanos al mouse
            stroke.points = stroke.points.filter(pt => {
                const dx = pt.x - mouseX;
                const dy = pt.y - mouseY;
                return Math.sqrt(dx * dx + dy * dy) > eraserRadius;
            });

            // Si el trazo ya no tiene puntos, lo quitamos
            if (stroke.points.length === 0) {
                undoStack.push(strokes.splice(i, 1)[0]);
                redoStack.clear();
            }
        }

        // Verificamos
        expect(strokes.length).toBe(2); // Ambos siguen pero uno con menos puntos
        expect(strokes[0].points.length).toBe(1); // solo queda (100,100)
        expect(strokes[1].points.length).toBe(1); // (200,200) sigue intacto
    });

    test('deshacer quita el último trazo', () => {
        const stroke = new Stroke([{ x: 0, y: 0 }], '#000000', 2);
        strokes.push(stroke);
        undoStack.push(stroke);

        // Simulamos deshacer
        if (!undoStack.isEmpty()) {
            const last = undoStack.pop();
            redoStack.push(last);
            strokes = strokes.filter(s => s !== last);
        }

        expect(strokes.length).toBe(0);
        expect(redoStack.peek()).toBe(stroke);
    });

    test('rehacer agrega el trazo deshecho', () => {
        const stroke = new Stroke([{ x: 0, y: 0 }], '#000000', 2);
        redoStack.push(stroke);

        // Simulamos rehacer
        if (!redoStack.isEmpty()) {
            const redoStroke = redoStack.pop();
            strokes.push(redoStroke);
            undoStack.push(redoStroke);
        }

        expect(strokes.length).toBe(1);
        expect(undoStack.peek()).toBe(stroke);
        expect(redoStack.isEmpty()).toBe(true);
    });
});
