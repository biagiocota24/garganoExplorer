package com.biagiocota.garganoexplorer.photo;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
// ENTITA DELLA SINGOLA FOTO NEL DATABASE
public class Photo {

    // QUESTO E L'URL PUBBLICO CHE UTILIZZERO PER ACCEDERVI E MOSTRARE LA FOTO
    @Column(name = "url", nullable = false, length = 500)
    private String url;

    // QUESTO E IL SUO ID CHE UTILIZZERO PER GESTIRLA, PER ESEMPIO ELIMINARLA ECC...
    @Column(name = "public_id", nullable = false)
    private String publicId;
}