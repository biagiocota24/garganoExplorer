package com.biagiocota.garganoexplorer.favorite;

import com.biagiocota.garganoexplorer.attraction.AttractionResponse;
import com.biagiocota.garganoexplorer.business.BusinessResponse;

import java.util.List;

public record FavoritesResponse(
        List<BusinessResponse> businesses,
        List<AttractionResponse> attractions
) {
}
