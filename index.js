import { ApolloServer, gql } from "apollo-server";
import { v1 as uuid } from "uuid";
const persons = [
  {
    name: "Midu",
    phone: "034-1234567",
    street: "calle frontend",
    city: "Barcelona",
    id: "1234567abc",
  },
  {
    name: "Franco",
    phone: "011-1234567",
    street: "calle frontend",
    city: "Bolivia",
    id: "1234567abcd",
  },
  {
    name: "Midu",
    phone: "024-1234567",
    street: "calle frontend",
    city: "Argentina",
    id: "1234567abcde",
  },
];

const typeDefs = gql`
  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [Person]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person

    editNumber(name: String!, phone: String!): Person
  }
`;

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) =>
      persons.find((person) => person.name === args.name),
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      };
    },
  },

  Mutation: {
    addPerson: (root, args) => {
      const person = { ...args, id: uuid() };
      persons.push(person);
      return person;
    },
    editNumber: (root, args) => {
      const personIndex = persons.findIndex((p) => p.name === args.name);
      if (personIndex === -1) return null;

      const person = persons[personIndex];

      const updatedPerson = { ...person, phone: args.phone };

      persons[personIndex] = updatedPerson;
      console.log(persons);
      return updatedPerson;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log("el servidor esta en " + url);
});
