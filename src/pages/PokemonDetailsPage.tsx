import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import Layout from "../components/Layout";
import PokemonDetailsBiography from "../components/PokemonDetailsBiography";
import PokemonDetailsEvolutions from "../components/PokemonDetailsEvolutions";
import PokemonDetailsHeader from "../components/PokemonDetailsHeader";
import PokemonDetailsStats from "../components/PokemonDetailsStats";
import Tab from "../components/Tab";
import { getPokemonById, pokemonsSelector } from "../features/pokemonSlice";
import { getSpeciesById, speciesSelector } from "../features/speciesSlice";
import { PokemonTypeColors, SliceStatus } from "../globals";
import { ScaleLoader } from "react-spinners";
import { useTransition, animated } from "react-spring";

type PokemonTabs = "biography" | "stats" | "evolutions";

interface MatchParams {
  id: string;
}

const PokemonDetailsPage = ({ match }: RouteComponentProps<MatchParams>) => {
  const { id } = match.params;
  const dispatch = useDispatch();
  const history = useHistory();
  const [activeTab, setActiveTab] = useState<PokemonTabs>("biography");
  const transitions = useTransition(activeTab, (p) => p, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: {
      duration: 250,
    },
  });

  const pokemons = useSelector(pokemonsSelector);
  const species = useSelector(speciesSelector);

  const selectedPokemon = pokemons.data.find(
    (pokemon) => pokemon !== null && pokemon.id === Number(id)
  );
  const selectedSpecies = species.data.find((s) => s.id === Number(id));

  useEffect(() => {
    if (pokemons.data.length === 0) {
      dispatch(getPokemonById({ pokemonId: id }));
    }
    dispatch(getSpeciesById({ pokemonId: id }));
    //eslint-disable-next-line
  }, []);

  const backgroundColors = selectedPokemon?.types.map(({ type }) => {
    const [[, backgroundColor]] = Object.entries(PokemonTypeColors).filter(
      ([key, _]) => key === type.name
    );

    return backgroundColor;
  });

  const selectedBackgroundColor = backgroundColors && backgroundColors[0];

  return (
    <Layout title="Pokemon Details">
      {species.status.state === SliceStatus.IDLE ||
      species.status.state === SliceStatus.LOADING ? (
        <div className="text-center mx-auto mt-12">
          <ScaleLoader color="#E3350D" radius={16} />
        </div>
      ) : (
        <>
          <>
            {selectedPokemon && selectedSpecies && selectedBackgroundColor && (
              <>
                <button
                  className="text-primary font-semibold transform hover:-translate-y-1 transition-transform ease-in duration-150 focus:outline-none"
                  onClick={() => history.push("/")}
                >
                  <span className="text-primary font-semibold">Go Back</span>
                </button>
                <div
                  className="flex flex-col lg:flex-row justify-center items-start w-full mx-auto my-4 rounded-lg shadow-lg"
                  style={{
                    backgroundColor:
                      selectedBackgroundColor && selectedBackgroundColor.medium,
                  }}
                >
                  <PokemonDetailsHeader
                    pokemon={selectedPokemon}
                    species={selectedSpecies}
                    selectedBackgroundColor={selectedBackgroundColor}
                  />
                  <div className="bg-white lg:mt-0 rounded-t-3xl rounded-b-lg lg:rounded-t-none lg:rounded-b-none lg:rounded-r-lg overflow-hidden w-full pt-16 lg:pt-8 px-4 md:px-8 lg:px-12">
                    <div className="flex flex-row justify-between w-full">
                      <Tab
                        handleSelect={() => setActiveTab("biography")}
                        isSelected={activeTab === "biography"}
                      >
                        Biography
                      </Tab>
                      <Tab
                        handleSelect={() => setActiveTab("stats")}
                        isSelected={activeTab === "stats"}
                      >
                        Stats
                      </Tab>
                      <Tab
                        handleSelect={() => setActiveTab("evolutions")}
                        isSelected={activeTab === "evolutions"}
                      >
                        Evolutions
                      </Tab>
                    </div>
                    <div className="relative mt-8 lg:h-132 lg:overflow-y-scroll">
                      {transitions.map(({ item, key, props }) => {
                        let page: JSX.Element = (
                          <PokemonDetailsBiography
                            species={selectedSpecies}
                            pokemon={selectedPokemon}
                          />
                        );

                        switch (item) {
                          case "biography":
                            page = (
                              <PokemonDetailsBiography
                                species={selectedSpecies}
                                pokemon={selectedPokemon}
                              />
                            );
                            break;
                          case "stats":
                            page = <PokemonDetailsStats />;
                            break;
                          case "evolutions":
                            page = <PokemonDetailsEvolutions />;
                            break;
                          default:
                            break;
                        }
                        return (
                          <animated.div
                            key={key}
                            style={{
                              ...props,
                              position: "relative",
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            {page}
                          </animated.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        </>
      )}
    </Layout>
  );
};
export default PokemonDetailsPage;