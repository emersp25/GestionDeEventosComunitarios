package com.eventos.infrastructure.adapter.out.persistence;
import com.eventos.domain.model.Event;
import org.springframework.stereotype.Component;

/*
 * Mapper entre entidad de dominio (Event) y entidad JPA (EventEntity)
 * Parte del adaptador de salida
*/
@Component
public class EventMapper {
    /*Convierte de dominio a entidad JPA*/
    public EventEntity toEntity(Event event) {
        if (event == null) {
            return null;
        }

        return new EventEntity(
                event.getId(),
                event.getNombre(),
                event.getDescripcion(),
                event.getFechaInicio(),
                event.getFechaFin(),
                event.getUbicacion(),
                event.getCapacidadMaxima(),
                event.getStatus(),
                event.getPresupuestoSolicitado(),
                event.getPresupuestoAprobado(),
                event.getOrganizador(),
                event.getInscripcionesIds(),
                event.getFechaCreacion(),
                event.getFechaActualizacion()
        );
    }

    /* Convierte de entidad JPA a dominio*/
    public Event toDomain(EventEntity entity) {
        if (entity == null) {
            return null;
        }

        return new Event(
                entity.getId(),
                entity.getNombre(),
                entity.getDescripcion(),
                entity.getFechaInicio(),
                entity.getFechaFin(),
                entity.getUbicacion(),
                entity.getCapacidadMaxima(),
                entity.getStatus(),
                entity.getPresupuestoSolicitado(),
                entity.getPresupuestoAprobado(),
                entity.getOrganizador(),
                entity.getInscripcionesIds(),
                entity.getFechaCreacion(),
                entity.getFechaActualizacion()
        );
    }
}
