// Clase Stack – Patrón Memento
// Se utiliza para guardar estados anteriores (deshacer/rehacer)

class Stack {
    constructor() {
        // Inicializa una pila vacía
        this.items = [];
    }

    push(item) {
        // Agrega un elemento a la cima de la pila
        this.items.push(item);
    }

    pop() {
        // Elimina y devuelve el último elemento de la pila
        return this.items.length === 0 ? null : this.items.pop();
    }

    peek() {
        // Devuelve el último elemento sin eliminarlo
        return this.items.length === 0 ? null : this.items[this.items.length - 1];
    }

    isEmpty() {
        // Devuelve true si la pila está vacía
        return this.items.length === 0;
    }

    clear() {
        // Vacía completamente la pila
        this.items = [];
    }
}

module.exports = Stack;
