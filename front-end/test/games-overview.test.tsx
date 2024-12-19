import React from 'react';
import { render, screen } from '@testing-library/react';
import GamesOverview from '@components/games/GamesOverview';
import { Game } from "@types";

window.React = React;

const game1: Game = {
  id: 1,
  name: 'Super Mario',
  genre: 'Platformer',
  description: 'A classic platforming game where you save the princess.',
  releaseDate: new Date('1985-09-13'),
};
const game2: Game = {
  name: 'The Legend of Zelda',
  genre: 'Action-Adventure',
  description: 'An epic adventure to save Princess Zelda and defeat Ganon.',
  releaseDate: new Date('1986-02-21'),
};

const games: Game[] = [
  game1,
  game2,
];

beforeEach(() => {
});

afterEach(() => {
  jest.clearAllMocks();
});

test(`given: valid games, when: rendering the game overview component, then: the names and descriptions are rendered`, async () => {

  // when
  render(<GamesOverview games={games} />);

  // then
  expect(screen.getByText(game1.name));
  expect(screen.getByText(game1.description));
  expect(screen.getByTestId("link-" + game1.id).getAttribute("href")).toEqual("/games/" + game1.id);
  expect(screen.getByText(game2.name));
  expect(screen.getByText(game2.description));
  expect(screen.getByTestId("link-" + game2.id).getAttribute("href")).toEqual("/games/" + game2.id);
});

