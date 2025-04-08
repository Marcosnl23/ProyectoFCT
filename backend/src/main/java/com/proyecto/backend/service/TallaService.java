package com.proyecto.backend.service;

import com.proyecto.backend.model.Talla;
import com.proyecto.backend.repository.TallaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TallaService {

    @Autowired
    private TallaRepository tallaRepository;

    public List<Talla> listarTallas() {
        return tallaRepository.findAll();
    }
}
