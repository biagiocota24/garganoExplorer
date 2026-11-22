import { create } from "zustand";
import type { PlaceType } from "../api/review";
import {
  favoriteApis,
  getMyFavoriteIds,
  type FavoriteIdsResponse,
} from "../api/favorite";

type FavoriteState = {
  businessIds: Set<string>;
  attractionIds: Set<string>;

  load: () => Promise<void>;
  isFavorite: (type: PlaceType, id: string) => boolean;
  toggle: (type: PlaceType, id: string) => Promise<void>;
  clear: () => void;
};

const keyByType = {
  business: "businessIds",
  attraction: "attractionIds",
} as const;

export const useFavoriteStore = create<FavoriteState>()((set, get) => ({
  businessIds: new Set<string>(),
  attractionIds: new Set<string>(),

  load: async () => {
    try {
      const favoriteIds: FavoriteIdsResponse = await getMyFavoriteIds();
      set({
        businessIds: new Set(favoriteIds.businessIds),
        attractionIds: new Set(favoriteIds.attractionIds),
      });
    } catch {
      set({
        businessIds: new Set(),
        attractionIds: new Set(),
      });
    }
  },
  isFavorite: (type, id) => get()[keyByType[type]].has(id),
  toggle: async (type, id) => {
    const key = keyByType[type];
    const previous = get()[key];
    const wasFavorite = previous.has(id);

    const next = new Set(previous);
    if (wasFavorite) {
      next.delete(id);
    } else {
      next.add(id);
    }
    set({ [key]: next });

    try {
      await (wasFavorite
        ? favoriteApis[type].removeFavorite(id)
        : favoriteApis[type].addFavorite(id));
    } catch (err) {
      const current = new Set(get()[key]);
      if (wasFavorite) current.add(id);
      else current.delete(id);
      set({ [key]: current });
      throw err;
    }
  },
  clear: () => {
    set({ businessIds: new Set(), attractionIds: new Set() });
  },
}));
