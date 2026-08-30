import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-quienes-somos',
  styleUrl: './quienes-somos.css',
  templateUrl: './quienes-somos.html',
})
export class QuienesSomos {
  integrantes = [
    {
      id: 'member-nicolas',
      nombre: 'Nicolás Romano',
      rol: 'Product Owner',
      imagen: 'equipo/carlos.png',
      alt: 'Nicolás Romano',
      bio: `Responsable de definir la visión del producto y priorizar el backlog para maximizar el valor entregado al cliente.`
    },
    {
      id: 'member-tobias',
      nombre: 'Tobías Ruffino',
      rol: 'Scrum Master',
      imagen: 'equipo/mateo.png',
      alt: 'Tobías Ruffino',
      bio: `Facilitador ágil que guía al equipo en la adopción de Scrum, eliminando impedimentos y fomentando la mejora continua.`
    },
    {
      id: 'member-ana',
      nombre: 'Ana Paula Hartl',
      rol: 'Desarrolladora',
      imagen: 'equipo/valentina.png',
      alt: 'Ana Paula Hartl',
      bio: `Responsable del diseño visual y estilos de la plataforma mediante CSS, participando también en el desarrollo del HTML para crear una interfaz moderna, atractiva y adaptable a los usuarios.`
    },
    {
      id: 'member-lucas',
      nombre: 'Lucas Gómez Ponce',
      rol: 'Desarrollador',
      imagen: 'equipo/franco.png',
      alt: 'Lucas Gómez Ponce',
      bio: `Encargado de la elaboración de diagramas y modelado visual del sistema, participando también en el desarrollo del HTML para asegurar una estructura moderna y bien organizada de la aplicación.`
    },
    {
      id: 'member-franco',
      nombre: 'Franco Quispe',
      rol: 'Desarrollador',
      imagen: 'equipo/diego.png',
      alt: 'Franco Quispe',
      bio: `Responsable de la documentación y estructuración de los casos de uso del sistema, colaborando además en el desarrollo del HTML para garantizar una interfaz clara, organizada y funcional.`
    }
  ];
}
