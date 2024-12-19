import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import SpeedrunEventsOverview from '@components/speedrunEvents/SpeedrunEventsOverview';
import { SpeedrunEvent, User } from "@types";
import SpeedrunEventService from "../services/SpeedrunEventService";

window.React = React;

const user1: User = {
  id: 1,
  username: "user1",
  email: "user1@example.com",
  password: "user1",
  signUpDate: new Date(),
  role: "User"
}

const loggedInUser = {
  token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxIiwicm9sZSI6IlVzZXIiLCJpYXQiOjE3MzQ2MjE3MTcsImV4cCI6MTczNDY1MDUxNywiaXNzIjoiY291cnNlc19hcHAifQ.2WWbPO1PCrFS1SapNW0cJYlI4SvmWvBRa7B0duHS9GE",
  id:1,
  username:"user1",
  role:"User",
};

const speedrunEvent1: SpeedrunEvent = {
  id: 4,
  name: "Super Speedruns",
  startDate: new Date("2025-01-01T00:00:00.000Z"),
  endDate: new Date("2025-01-02T00:00:00.000Z"),
  participants: [],
}
const speedrunEvent2: SpeedrunEvent = {
  id: 5,
  name: "SpeedrunWorld",
  startDate: new Date("2026-01-01T00:00:00.000Z"),
  endDate: new Date("2026-01-02T00:00:00.000Z"),
  participants: [],
}

const speedrunEvent1WithParticipant: SpeedrunEvent = {
  id: 4,
  name: "Super Speedruns",
  startDate: new Date("2025-01-01T00:00:00.000Z"),
  endDate: new Date("2025-01-02T00:00:00.000Z"),
  participants: [user1],
}

const speedrunEvents: SpeedrunEvent[] = [
  speedrunEvent1,
  speedrunEvent2,
];

const speedrunEventsWithParticipant: SpeedrunEvent[] = [
  speedrunEvent1WithParticipant,
  speedrunEvent2,
];

let mockAddUserToSpeedrunEvent: jest.Mock;

beforeEach(() => {
  mockAddUserToSpeedrunEvent = jest.fn();
});

afterEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});


test(`given: valid speedrun events, when: rendering the speedrun over`, async () => {
  // given
  SpeedrunEventService.addUserToSpeedrunEvent = mockAddUserToSpeedrunEvent
  localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

  // when
  render(<SpeedrunEventsOverview speedrunEvents={speedrunEvents}/>);

  // then
  expect(screen.getByText(speedrunEvent1.name));
  expect(screen.getByText(speedrunEvent1.startDate.toLocaleDateString()));
  expect(screen.getByText(speedrunEvent1.endDate.toLocaleDateString()));
  expect(screen.getByText(speedrunEvent2.name));
  expect(screen.getByText(speedrunEvent2.startDate.toLocaleDateString()));
  expect(screen.getByText(speedrunEvent2.endDate.toLocaleDateString()));
});

test(`given: any amount of participants, when: rendering the speedrun overview, then: the participatant count is equal to that amount`, async () => {
  // given
  SpeedrunEventService.addUserToSpeedrunEvent = mockAddUserToSpeedrunEvent
  localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

  // when
  render(<SpeedrunEventsOverview speedrunEvents={speedrunEvents}/>);

  // then
  expect(screen.getByTestId("participants-" + speedrunEvent1.id).innerText === speedrunEvent1.participants.length.toString());
});

test(`given: loggedInUser is not a participant, when: clicking on participate button, then: the participate button is removed`, async () => {
  // given
  SpeedrunEventService.addUserToSpeedrunEvent = mockAddUserToSpeedrunEvent
  localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

  // when
  const { rerender } = render(<SpeedrunEventsOverview speedrunEvents={speedrunEvents}/>);
  fireEvent.click(screen.getByTestId("participate-button-" + speedrunEvent1.id));
  rerender(<SpeedrunEventsOverview speedrunEvents={speedrunEventsWithParticipant}/>);

  // then
  expect(mockAddUserToSpeedrunEvent).toHaveBeenCalledTimes(1);
  expect(mockAddUserToSpeedrunEvent).toHaveBeenCalledWith(loggedInUser.id, speedrunEvent1.id);
  expect(screen.queryByTestId("participate-button-" + speedrunEvent1WithParticipant.id)).toBeNull();
});

test(`given: loggedInUser is not a participant, when: clicking on participate button, then: the participatant is added to the count`, async () => {
  // given
  SpeedrunEventService.addUserToSpeedrunEvent = mockAddUserToSpeedrunEvent
  localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

  // when
  const { rerender } = render(<SpeedrunEventsOverview speedrunEvents={speedrunEvents}/>);
  fireEvent.click(screen.getByTestId("participate-button-" + speedrunEvent1.id));
  rerender(<SpeedrunEventsOverview speedrunEvents={speedrunEventsWithParticipant}/>);

  // then
  expect(screen.getByTestId("participants-" + speedrunEvent1.id).innerText).toEqual(speedrunEvent1WithParticipant.participants.length.toString());
});