package com.tempolux.catalog;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(WatchController.class)
@Import(WatchCatalogService.class)
class WatchControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void returnsTheFullCatalog() throws Exception {
    mockMvc.perform(get("/api/watches"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(10)))
        .andExpect(jsonPath("$[0].slug").value("aurora-regulator"))
        .andExpect(jsonPath("$[0].currency").value("EUR"));
  }

  @Test
  void returnsAWatchBySlug() throws Exception {
    mockMvc.perform(get("/api/watches/atlas-tourbillon"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name.es").value("Explorer Atlas"))
        .andExpect(jsonPath("$.materials.en[0]").value("Stainless steel case"));
  }

  @Test
  void returnsNotFoundForUnknownSlug() throws Exception {
    mockMvc.perform(get("/api/watches/unknown-watch")).andExpect(status().isNotFound());
  }
}
