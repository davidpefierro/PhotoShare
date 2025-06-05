package com.photoshare.app.controlador;

import com.photoshare.app.dto.*;
import com.photoshare.app.servicio.AuthServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthControlador {

  @Autowired
  private AuthServicio authServicio;

  @PostMapping("/login")
  public AuthRespuesta login(@RequestBody LoginPeticion peticion) {
    return authServicio.login(peticion);
  }

  @PostMapping("/registro")
  public AuthRespuesta registrar(@RequestBody RegistroPeticion peticion) {
    return authServicio.registrar(peticion);
  }
}