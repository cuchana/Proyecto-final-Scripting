const Stack = require('./stack');
const Stroke = require('./stroke');

describe('Stack (Patrón Memento)', () => {
    test('push y pop funcionan correctamente', () => {
        const stack = new Stack();
        expect(stack.isEmpty()).toBe(true);

        stack.push(1);
        stack.push(2);

        expect(stack.peek()).toBe(2);
        expect(stack.pop()).toBe(2);
        expect(stack.pop()).toBe(1);
        expect(stack.pop()).toBeNull();

        expect(stack.isEmpty()).toBe(true);
    });
});

describe('Gestión de Trazos', () => {
    let strokes;
    let undoStack;
    let redoStack;

    beforeEach(() => {
        strokes = [];
        undoStack = new Stack();
        redoStack = new Stack();
    });

    test('agregar un trazo', () => {
        const stroke = new Stroke([{ x: 0, y: 0 }], '#000000', 2);
        strokes.push(stroke);
        undoStack.push(stroke);
        redoStack.clear();

        expect(strokes.length).toBe(1);
        expect(undoStack.peek()).toBe(stroke);
        expect(redoStack.isEmpty()).toBe(true);
    });

    test('borrar puntos con borrador elimina puntos y trazo vacío', () => {
        const stroke1 = new Stroke([{ x: 10, y: 10 }, { x: 100, y: 100 }], '#000000', 2);
        const stroke2 = new Stroke([{ x: 200, y: 200 }], '#111111', 3);
        strokes.push(stroke1, stroke2);

        const eraserRadius = 50;
        const mouseX = 10;
        const mouseY = 10;

        for (let i = strokes.length - 1; i >= 0; i--) {
            let stroke = strokes[i];
            stroke.points = stroke.points.filter(pt => {
                const dx = pt.x - mouseX;
                const dy = pt.y - mouseY;
                return Math.sqrt(dx * dx + dy * dy) > eraserRadius;
            });
            if (stroke.points.length === 0) {
                undoStack.push(strokes.splice(i, 1)[0]);
                redoStack.clear();
            }
        }

        expect(strokes.length).toBe(2);
        expect(strokes[0].points.length).toBe(1); // el punto (100,100)
        expect(strokes[1].points.length).toBe(1);
    });

    test('deshacer quita el último trazo', () => {
        const stroke = new Stroke([{ x: 0, y: 0 }], '#000000', 2);
        strokes.push(stroke);
        undoStack.push(stroke);

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
