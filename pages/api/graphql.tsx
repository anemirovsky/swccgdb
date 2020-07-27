import { ApolloServer, gql } from "apollo-server-micro";
import schema from "../../graphql/schema.gql";
import { PrismaClient } from "@prisma/client";
import { recentDecks } from "../../server/resolvers/recent-decks";
import { getSharedUser } from "../../server/create-shared-user";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const typeDefs = gql(schema + "");

// TODO put this secret into .env and load via .env npm module
const jwtSecret = "shhhhh";

const resolvers = {
  Query: {
    hello: (_parent, _args, _context) => "Hello!",
    recentDecks: () => recentDecks(prisma),
    cards: () => {
      return prisma.card.findMany();
    },
    deck: async (_parent, _args) => {
      return prisma.deck.findOne({
        where: { id: parseInt(_args.id) },
      });
    },
  },
  Mutation: {
    login: async () => {
      const user = await getSharedUser(prisma);
      return {
        jwt: jwt.sign({ userId: user.id }, jwtSecret),
      };
    },
    createDeck: async (_parent, _args, _context) => {
      if (!_context.userId) {
        throw new Error("Please login");
      }
      return prisma.deck.create({
        data: {
          side: _args.side,
          User: {
            connect: {
              id: _context.userId,
            },
          },
        },
      });
    },
    addCardToDeck: async (_parent, _args, _context) => {
      if (!_context.userId) {
        throw new Error("Please login");
      }
      await prisma.deckCard.create({
        data: {
          Card: {
            connect: {
              id: parseInt(_args.cardId),
            },
          },
          Deck: {
            connect: {
              id: parseInt(_args.deckId),
            },
          },
        },
      });
      return {
        success: true,
      };
    },
    removeCardFromDeck: async (_parent, _args, _context) => {
      if (!_context.userId) {
        throw new Error("Please login");
      }
      await prisma.deckCard.delete({
        where: {
          id: _args.deckCardId,
        },
      });
      return {
        success: true,
      };
    },
  },
  Deck: {
    author: (_parent) => {
      return prisma.user.findOne({
        where: {
          id: _parent.authorId,
        },
      });
    },
    cards: async (_parent) => {
      const cards = await prisma.card.findMany({
        where: {
          DeckCard: {
            some: {
              Deck: {
                id: _parent.id,
              },
            },
          },
        },
      });
      return cards;
    },
  },
  Card: {
    id: (_parent) => _parent.id,
    type: (_parent) => _parent.front_type,
    card_id: (_parent) => _parent.card_id,
    side: (_parent) => _parent.side,
    rarity: (_parent) => _parent.rarity,
    set: (_parent) => _parent.set,
    title: (_parent) => _parent.front_title,
    imageUrl: (_parent) => _parent.front_imageurl,
    subType: (_parent) => _parent.front_subtype,
    destiny: (_parent) => _parent.front_destiny,
    power: (_parent) => _parent.front_power,
    deploy: (_parent) => _parent.front_deploy || undefined,
    forfeit: (_parent) => _parent.front_forfeit,
    gametext: (_parent) => _parent.front_gametext,
    lore: (_parent) => _parent.front_lore,
    gemp_card_id: (_parent) => _parent.gemp_card_id,
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, jwtSecret);
      return { userId: decoded.userId };
    } catch (e) {
      return {};
    }
  },
});

const handler = apolloServer.createHandler({ path: "/api/graphql" });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
