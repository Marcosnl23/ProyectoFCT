package com.proyecto.backend.service;

import com.proyecto.backend.model.ValoracionGeneral;
import com.proyecto.backend.repository.ValoracionGeneralRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ValoracionGeneralService {

    @Autowired
    private ValoracionGeneralRepository valoracionGeneralRepository;

    public ValoracionGeneral guardarValoracion(ValoracionGeneral valoracion) {
        return valoracionGeneralRepository.save(valoracion);
    }

    public List<ValoracionGeneral> listarValoraciones() {
        return valoracionGeneralRepository.findAll();
    }

    public Optional<ValoracionGeneral> buscarPorId(Long id) {
        return valoracionGeneralRepository.findById(id);
    }

    public void eliminarValoracion(Long id) {
        valoracionGeneralRepository.deleteById(id);
    }

    public boolean existePorUsuarioId(Long usuarioId) {
        return valoracionGeneralRepository.existsByUsuarioId(usuarioId);
    }
}
