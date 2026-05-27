package com.tempolux.catalog;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// CORS limitado a localhost — en producción reemplazar por la URL real del dominio
@RestController
@RequestMapping("/api/watches")
@CrossOrigin(originPatterns = {
    "http://localhost:4200",
    "http://127.0.0.1:4200",
    "https://*.web.app",
    "https://*.firebaseapp.com"
})
public class WatchController {

  private final WatchCatalogService catalogService;

  public WatchController(WatchCatalogService catalogService) {
    this.catalogService = catalogService;
  }

  // GET /api/watches — devuelve los 10 modelos del catálogo
  @GetMapping
  public List<Watch> findAll() {
    return catalogService.findAll();
  }

  // GET /api/watches/{slug} — útil para páginas de detalle futuras; devuelve 404 si no existe
  @GetMapping("/{slug}")
  public ResponseEntity<Watch> findBySlug(@PathVariable String slug) {
    return catalogService.findBySlug(slug)
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }
}
