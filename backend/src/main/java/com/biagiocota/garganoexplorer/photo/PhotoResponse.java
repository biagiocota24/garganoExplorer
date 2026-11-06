package com.biagiocota.garganoexplorer.photo;

import java.util.List;

// E QUELLO CHE IL BE RISPONDE AL FE QUANDO DEVE MANDARGLI UNA O PIU FOTO
public record PhotoResponse(String url, String publicId) {

    public static PhotoResponse from(Photo photo) {
        return new PhotoResponse(photo.getUrl(), photo.getPublicId());
    }

    public static List<PhotoResponse> fromAll(List<Photo> photos) {
        return photos.stream().map(PhotoResponse::from).toList();
    }
}