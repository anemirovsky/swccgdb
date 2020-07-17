import { useState } from "react";
import { Page, Toolbar, Content } from "../../../components/Toolbar";
import { useRouter } from "next/router";
import { CardSearchResults } from "../../../components/card-search-table/card-search-results";
import {
  Side,
  Card,
} from "../../../components/card-search-table/card.interface";
import {
  CardFiltersBar,
  applyFilters,
} from "../../../components/card-search-table/card-filters-bar";
import { getCards } from "../../../components/card-search-table/getCards";
import { CardPanel } from "../../../components/card-panel";

function getCardSuggestions({
  side,
  allCards,
  deck,
}: {
  side: Side;
  allCards: Card[];
  deck: Card[];
}): Card[] {
  if (deck.length === 0) {
    if (side == Side.dark) {
      return allCards.filter(({ front: { title } }) => {
        return title === "•Knowledge And Defense (V)";
      });
    } else {
      return allCards.filter(({ front: { title } }) => {
        return title === "•Anger, Fear, Aggression (V)";
      });
    }
  }

  const destroyTheJedi = allCards.find(({ front: { title } }) => {
    return (
      title ===
      "Hunt Down And Destroy The Jedi / Their Fire Has Gone Out Of The Universe"
    );
  });
  if (deck.some(({ id }) => id === destroyTheJedi.id)) {
    const cardsInDestroyTheJedi = [
      "•Executor: Holotheatre",
      "•Visage Of The Emperor",
      "•Executor: Meditation Chamber",
      "•Epic Duel",
    ];
    return allCards
      .filter(({ front: { title } }) => cardsInDestroyTheJedi.includes(title))
      .filter((cardSuggestion) => {
        return deck.map(({ id }) => id).indexOf(cardSuggestion.id) === -1;
      });
  }

  return [];
}

export default function EditDeck(params) {
  const router = useRouter();
  const [deckCards, setDeckCards] = useState([]);
  const [filters, updateFilters] = useState(undefined);
  const [allCards, setCards] = useState([]);
  const side = router.query.side as Side;
  if (allCards.length === 0) {
    getCards().then(setCards);
  }
  const addCard = (card: Card) => {
    setDeckCards([...deckCards, card]);
  };
  const removeCard = (cardToRemove: Card) => {
    const index = deckCards.map(({ id }) => id).lastIndexOf(cardToRemove.id);
    setDeckCards([...deckCards.slice(0, index), ...deckCards.slice(index + 1)]);
  };
  const { id: deckId } = router.query;
  if (!deckId) {
    return (
      <Page>
        <Toolbar />
        <Content>Deck not found: {deckId}</Content>
      </Page>
    );
  }

  return (
    <Page>
      <Toolbar />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <CardFiltersBar
          allCards={allCards}
          filters={filters}
          onUpdateFilters={(filters) => updateFilters(filters)}
        />
        {/* TODO showSide will need to come from /deck/new choice */}
        <div style={{ display: "flex" }}>
          <CardSearchResults
            cards={applyFilters(allCards, { ...filters, side })}
            showSide={side}
            onCardSelected={addCard}
            style={{
              width: "70vw",
              marginLeft: "3vw",
            }}
          />
          <CardPanel
            cards={deckCards}
            suggestedCards={
              allCards.length
                ? getCardSuggestions({ deck: deckCards, allCards, side })
                : []
            }
            addCard={addCard}
            removeCard={removeCard}
          ></CardPanel>
        </div>
      </div>
    </Page>
  );
}
