# Proyecto-final-Scripting
En este repositorio publicaremos los avances del proyecto final de scripting

Integrantes:  

David Galvis

Luciana Gutierrez


## Propuesta de proyecto corregida: 
Alcance:
Nuestro proyecto consiste en una aplicación interactiva basada en web, desarrollada con P5.js y JavaScript, que permite a los usuarios modificar arte generativo en tiempo real. La aplicación se ejecutará en navegadores de PC y dispositivos móviles, ofreciendo una interfaz gráfica donde los usuarios podrán interactuar con la imagen generada.

El arte generativo se alterará mediante patrones de diseño gráficos y estructuras de datos, lo que significa que se emplearán algoritmos y estructuras como pilas y listas para gestionar y transformar las imágenes dinámicamente. Por ejemplo, utilizaremos una pila para que los usuarios puedan deshacer y rehacer cambios en su obra, mientras que las listas permitirán organizar diferentes configuraciones de patrones visuales.

El usuario podrá modificar la imagen a través de:

Entrada del mouse (posición y velocidad de movimiento).

Entrada del teclado (para aplicar efectos o cambiar parámetros).

Sensores de micro:bit (como acelerómetro, botones y brújula) para alterar dinámicamente los patrones generados.

A diferencia de los ejemplos estándar de P5.js, nuestra propuesta introduce una capa de interacción avanzada mediante estructuras de datos, permitiendo una experiencia más estructurada y flexible.

En cuanto a la conexión con micro:bit, utilizaremos Web Serial API para recibir los datos del dispositivo en tiempo real y usarlos como entrada para modificar la imagen en P5.js. Esto permitirá que los movimientos físicos o las interacciones con el micro:bit influyan directamente en la composición visual.

Herramientas:
Software: P5.js

Lenguaje: JavaScript

Estructuras de datos: Pilas (para gestión de cambios), listas (para organización de patrones gráficos).

Sensores utilizados: Acelerómetro y botones de micro:bit.

Extras: Integración con micro:bit mediante Web Serial API.

¿Por qué decidimos continuar con esta propuesta?
Al ser la mayoria de la linea de experiencias creemos que esta propuesta se adapta mejor a nuestros conocimientos y habilidades, por otro lado creemos que podemos incluir las tematicas del curso en este proyecto usando la mayor parte de conceptos adquiridos, despues de leer las correcciones planteadas por el profesor pudimos hacer los ajustes necesarios a la propuesta y ver que es algo con un buen potencial. 

# Avance #2 proyecto: Fase final

Correciones dadas en el avance 1 y como planeamos implementarlas:

1. Aplicacion de patrones de diseño
   Formas de corregirlo: Podemos usar memento o state (sugerencias del profe), con memento podemos encapsular tpdps lps trazos como un snapshot, y con state seria tener estados como drawing, idle, erasing y editing. Con chat gpt exploramos el patrón command, encapsulando cada acción como un objeto que se puede deshacer o rehacer.

2. ¿Que queremos que haga el usuario con la imagen?
   Queremos que el usuario pueda intervenir una imagen de distintas formas, para así lograr hacer editor/tablero de fotos digital, vamos a añadir una lista de los comandos y una paleta de colores accesible (para mejorar el UI).
   
