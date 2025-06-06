const { default: ollama } = require('ollama');
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { v4 as uuid } from 'uuid'

export async function autoGenerateBackside(model, front) {
  const AutoBackCard = z.object({
    back: z.string(),
  });

  const response = await ollama.chat({
    model: model,
    messages: [
      {
        role: 'user',
        content: `Generate a flashcard answer for the following prompt:\n\n${front}`,
      },
    ],
    format: zodToJsonSchema(AutoBackCard),
  });

  let result = AutoBackCard.parse(JSON.parse(response.message.content));
  result = result.flashcards.map((value) => {
    return {
      ...value,
      starred: false,
      id: uuid()
    }
  })
  result.id = uuid()

  return result;
}

export async function generateFlashcardsFromFile(model, fileContent) {
  const FlashcardOutput = z.object({
    front: z.string(),
    back: z.string(),
  });

  const DeckOutput = z.object({
    name: z.string(),
    description: z.string(),
    flashcards: z.array(FlashcardOutput),
  });

  const response = await ollama.chat({
    model: model,
    messages: [
      {
        role: 'user',
        content: `Create a flashcard deck from the following file content:\n\n${fileContent}`,
      },
    ],
    format: zodToJsonSchema(DeckOutput),
  });

  let deckOutput = DeckOutput.parse(JSON.parse(response.message.content));
  deckOutput.flashcards = deckOutput.flashcards.map((value) => {
    return {
      ...value,
      starred: false,
      id: uuid()
    }
  })
  deckOutput.id = uuid()
  return deckOutput;
}

export async function generateFlashcardsFromNotes(model, notes) {
  console.log("CONGRATS wtf");

  const FlashcardOutput = z.object({
    front: z.string(),
    back: z.string(),
  });

  const DeckOutput = z.object({
    name: z.string(),
    description: z.string(),
    flashcards: z.array(FlashcardOutput),
  });

  console.log(zodToJsonSchema(DeckOutput));

  const response = await ollama.chat({
    model: model,
    messages: [{
      role: "user",
      content: `Create a flashcard deck from the following study notes:\n\n${notes}`,
    }],
    format: zodToJsonSchema(DeckOutput),
  });

  console.log("TESTING");

  let result = DeckOutput.parse(JSON.parse(response.message.content));
  result.flashcards = result.flashcards.map((value) => {
    return {
      ...value,
      starred: false,
      id: uuid()
    }
  })
  result.id = uuid()
  return result;
}

export async function generateFlashcardsFromTerms(model, listOfTerms) {
  const FlashcardOutput = z.object({
    front: z.string(),
    back: z.string(),
  });

  const DeckOutput = z.object({
    name: z.string(),
    description: z.string(),
    flashcards: z.array(FlashcardOutput),
  });

  const response = await ollama.chat({
    model: model,
    messages: [
      {
        role: 'user',
        content: `Generate a flashcard deck from the following list of terms. For each term, provide a definition or explanation.\n\nTerms: ${listOfTerms}`,
      },
    ],
    format: zodToJsonSchema(DeckOutput),
  });

  let deckOutput = DeckOutput.parse(JSON.parse(response.message.content));
  deckOutput.flashcards = deckOutput.flashcards.map((value) => {
    return {
      ...value,
      starred: false,
      id: uuid()
    }
  })
  deckOutput.id = uuid()

  return deckOutput;
}
