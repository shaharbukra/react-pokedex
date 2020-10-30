import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import fromApi from "../api/fromApi";
import { SliceStatus } from "../globals";
import { RootState } from "./store";
import { NamedAPIResource } from "./types";
import { statusHandlerReducer, wrapReduxAsyncHandler } from "./utilities";

export enum PokemonGenerations {
  GENERATION_1 = 151,
  GENERATION_2 = 251,
  GENERATION_3 = 386,
  GENERATION_4 = 493,
  GENERATION_5 = 649,
  GENERATION_6 = 721,
  GENERATION_7 = 809,
}

type SliceState = {
  data: NamedAPIResource[];
  status: {
    state: SliceStatus;
  };
};

const initialState: SliceState = {
  data: [],
  status: {
    state: SliceStatus.IDLE,
  },
};

const cachedPokemonsSlice = createSlice({
  name: "cachedPokemons",
  initialState,
  reducers: {
    ...statusHandlerReducer,
    getCachedPokemonsReducer(
      state,
      action: PayloadAction<{ cachedPokemons: NamedAPIResource[] }>
    ) {
      const { cachedPokemons } = action.payload;
      state.data = cachedPokemons;
    },
  },
});

export const cachedPokemonsReducer = cachedPokemonsSlice.reducer;
export const {
  initialize,
  error,
  success,
  getCachedPokemonsReducer,
} = cachedPokemonsSlice.actions;

const statusHandler = { initialize, error, success };

export const cachedPokemonsSelector = (state: RootState) =>
  state.cachedPokemons;

export const getCachedPokemons = wrapReduxAsyncHandler(
  statusHandler,
  async (dispatch) => {
    const {
      results,
    }: { results: NamedAPIResource[] } = await fromApi.getPokemons(
      PokemonGenerations.GENERATION_7
    );
    dispatch(getCachedPokemonsReducer({ cachedPokemons: results }));
  }
);