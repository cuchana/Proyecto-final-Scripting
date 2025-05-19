// Clase Stroke – Representa un trazo dibujado por el usuario

class Stroke {
    constructor(points, color, size) {
        this.points = points; // Array de puntos {x, y}
        this.color = color;   // Color del trazo, por ejemplo '#FF0000'
        this.size = size;     // Grosor del trazo
    }
}

module.exports = Stroke;
