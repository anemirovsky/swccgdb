import { useState } from "react";
import { Page, Toolbar, Content } from "../../../components/Toolbar";
import { useRouter } from "next/router";
import { CardSearchResults } from "../../../components/card-search-table/card-search-results";
import { Side } from "../../../components/card-search-table/card.interface";
import {
  CardFiltersBar,
  applyFilters,
} from "../../../components/card-search-table/card-filters-bar";
import { getCards } from "../../../components/card-search-table/getCards";
import { CardPanel } from "../../../components/card-panel";
import Footer from "../../../components/Footer";
import { useMutation, gql } from "@apollo/client";
import AddCardToDeckMutation from "../../../graphql/add-card-to-deck.gql";
import {
  MutationAddCardToDeckArgs,
  Mutation,
  Card,
} from "../../../graphql/types";

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
      return allCards.filter(({ title }) => {
        return title === "•Knowledge And Defense (V)";
      });
    } else {
      return allCards.filter(({ title }) => {
        return title === "•Anger, Fear, Aggression (V)";
      });
    }
  }

  const destroyTheJedi = allCards.find(({ title }) => {
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
      .filter(({ title }) => cardsInDestroyTheJedi.includes(title))
      .filter((cardSuggestion) => {
        return deck.map(({ id }) => id).indexOf(cardSuggestion.id) === -1;
      });
  }

  return [];
}

function isCardInSideDeck(card: Card) {
  return card.type === "Objective" || card.type === "Defensive Shield";
}

interface DeckCard extends Card {
  isSideDeck: boolean;
  deckCardId: string;
}

export default function EditDeck() {
  const router = useRouter();
  const [addCardToDeck] = useMutation<Mutation, MutationAddCardToDeckArgs>(
    gql(AddCardToDeckMutation)
  );
  const [deckCards, setDeckCards] = useState<DeckCard[]>([]);
  const [filters, updateFilters] = useState(undefined);
  const [allCards, setCards] = useState<Card[]>([]);
  const side = router.query.side as Side;
  const { id: deckId } = router.query;
  if (!deckId) {
    return <div>DeckID not found.</div>;
  }
  if (allCards.length === 0) {
    getCards().then(setCards);
  }
  const addCard = (card: Card) => {
    addCardToDeck({
      variables: {
        cardId: card.id,
        deckId: deckId as string,
      },
    }).then(({ data, errors }) => {
      if (!data) {
        console.error("Error adding card to deck", errors);
        return;
      }
      const deckCardId = data.addCardToDeck.newDeckCardId;
      setDeckCards([
        ...deckCards,
        { ...card, isSideDeck: isCardInSideDeck(card), deckCardId },
      ]);
    });
  };
  const removeCard = (cardToRemove: Card) => {
    const index = deckCards.map(({ id }) => id).lastIndexOf(cardToRemove.id);
    console.log(deckCards[index].deckCardId);
    setDeckCards([...deckCards.slice(0, index), ...deckCards.slice(index + 1)]);
  };
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
          showSideFilter={false}
          filters={filters}
          onUpdateFilters={(filters) => updateFilters(filters)}
        />
        {/* TODO showSide will need to come from /deck/new choice */}
        <div style={{ display: "flex" }}>
          <CardSearchResults
            cards={applyFilters(allCards, { ...filters, side })}
            showSide={side}
            onCardSelected={addCard}
            newTab={"_blank"}
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
      <Footer></Footer>
    </Page>
  );
}
