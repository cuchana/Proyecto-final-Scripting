# Avances del proyecto 😄

Link para acceder al codigo y editarlo: https://editor.p5js.org/luciana.gp0531/sketches/Bz3b9MuPT

Link para ejecutar directamente el avance: https://editor.p5js.org/luciana.gp0531/full/Bz3b9MuPT
 1. Abrir el link
 2. Adjuntar la imagen que queremos
 3. Empezar a dibujar con el mouse, los colores por ahora son randoms
 4. Para deshacer presionar Z y rehacer Y

Explicacion: En este codigo implementamos la primera fase de la aplicación donde se permite al usuario dibujar sobre una imagen, cargar imágenes desde su dispositivo y gestionar los trazos con deshacer/rehacer utilizando pilas. Se define una clase Stroke para representar los trazos y una clase Stack para gestionar el historial de cambios. El usuario puede dibujar con el mouse, y cada trazo se almacena en una pila (undoStack), permitiendo deshacer (Z) y rehacer (Y) cambios. Además el canvas se ajusta al tamaño de la pantalla.

Usamos las bibliotecas de p5.js directamente, no hemos usado ninguna herramienta externa, en caso de que lo hagamos estas bibliotecas las incluiremos en el index.html 

