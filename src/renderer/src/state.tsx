// state/atoms.ts
import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils'
import { v4 as uuid } from 'uuid';

// Types
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  starred: boolean;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  flashcards: Flashcard[];
}

// Factory functions
const createFlashcard = (id: string, front: string, back: string, starred = false): Flashcard => ({
  id,
  front,
  back,
  starred,
});

const createDeck = (id: string, name: string, description: string, flashcards?: Flashcard[]): Deck => ({
  id,
  name,
  description,
  flashcards: flashcards || [],
});

// ---- Atoms ----

// All decks (array of Deck objects)
export const decksAtom = atom<Deck[]>([
  createDeck(uuid(), 'Sample Deck', 'This is a sample deck.', Array.from({ length: 5 }, () => createFlashcard(uuid(), "front1", "back1"))),
  createDeck(uuid(), 'Sample Deck', 'This is a sample deck.'),
  createDeck(uuid(), 'Sample Deck', 'This is a sample deck.', Array.from({ length: 5 }, () => createFlashcard(uuid(), "joke", "hahah"))),
  createDeck(uuid(), 'Sample Deck', 'This is a sample deck.'),
  createDeck(uuid(), 'Sample Deck', 'This is a sample deck.'),
]);

// Currently selected deck ID (string or null)
export const selectedDeckIdAtom = atom<string | undefined>('');

// Derived atom: the selected Deck or null if not found
export const selectedDeckAtom = atom<Deck | null>((get) => {
  const decks = get(decksAtom);
  const selectedId = get(selectedDeckIdAtom);
  return decks.find((deck) => deck.id === selectedId) || null;
});

// Writeable atom to add a new deck
export const addDeckAtom = atom(null, (get, set, {id,  name, description }) => {
  const newDeck = createDeck(id, name, description);
  set(decksAtom, [...get(decksAtom), newDeck]);
});

// Writeable atom to add a flashcard to a specific deck
export const addFlashcardAtom = atom(null, (get, set, { deckId, front, back }) => {
  const decks = get(decksAtom);
  const updatedDecks = decks.map((deck) =>
    deck.id === deckId
      ? {
          ...deck,
          flashcards: [createFlashcard(uuid(), front, back), ...deck.flashcards ],
        }
      : deck
  );
  set(decksAtom, updatedDecks);
});


export const getFlashcardAtomByID = atomFamily((flashcardId: string) =>
  atom(
    (get) => {
      const deck = get(selectedDeckAtom);
      return deck?.flashcards.find((f) => f.id === flashcardId) ?? null;
    },
    (get, set, update: Partial<Flashcard>) => {
      const decks = get(decksAtom);
      const selectedId = get(selectedDeckIdAtom);

      const updatedDecks = decks.map((deck) => {
        if (deck.id !== selectedId) return deck;

        return {
          ...deck,
          flashcards: deck.flashcards.map((card) =>
            card.id === flashcardId
              ? { ...card, ...update }  // Merge the update to preserve id/starred/etc.
              : card
          ),
        };
      });

      set(decksAtom, updatedDecks);
    }
  )
);

// Toggle "starred" status of a flashcard in a deck
export const toggleStarredAtom = atom(null, (get, set, { deckId, flashcardId }) => {
  const decks = get(decksAtom);
  const updatedDecks = decks.map((deck) => {
    if (deck.id !== deckId) return deck;
    return {
      ...deck,
      flashcards: deck.flashcards.map((card) =>
        card.id === flashcardId ? { ...card, starred: !card.starred } : card
      ),
    };
  });
  set(decksAtom, updatedDecks);
});

// Writeable atom to delete multiple flashcards by IDs from a specific deck
export const deleteFlashcardsAtom = atom(
  null,
  (get, set, { deckId, flashcardIds }: { deckId: string; flashcardIds: string[] }) => {
    const decks = get(decksAtom);
    const updatedDecks = decks.map((deck) => {
      if (deck.id !== deckId) return deck;

      return {
        ...deck,
        flashcards: deck.flashcards.filter(
          (card) => !flashcardIds.includes(card.id)
        ),
      };
    });

    set(decksAtom, updatedDecks);
  }
);



export const isEditingAtom = atom(false)
