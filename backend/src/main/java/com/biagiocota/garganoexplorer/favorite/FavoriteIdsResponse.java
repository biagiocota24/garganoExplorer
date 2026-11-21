package com.biagiocota.garganoexplorer.favorite;

import java.util.List;
import java.util.UUID;

public record FavoriteIdsResponse(
        List<UUID> businessIds,
        List<UUID> attractionIds
) {
}
