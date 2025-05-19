// Clase Stack � Patr�n Memento
// Se utiliza para guardar estados anteriores (deshacer/rehacer)

class Stack {
    constructor() {
        // Inicializa una pila vac�a
        this.items = [];
    }

    push(item) {
        // Agrega un elemento a la cima de la pila
        this.items.push(item);
    }

    pop() {
        // Elimina y devuelve el �ltimo elemento de la pila
        return this.items.length === 0 ? null : this.items.pop();
    }

    peek() {
        // Devuelve el �ltimo elemento sin eliminarlo
        return this.items.length === 0 ? null : this.items[this.items.length - 1];
    }

    isEmpty() {
        // Devuelve true si la pila est� vac�a
        return this.items.length === 0;
    }

    clear() {
        // Vac�a completamente la pila
        this.items = [];
    }
}

module.exports = Stack;
