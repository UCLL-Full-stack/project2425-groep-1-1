import React from 'react';
import { render, screen } from '@testing-library/react';
import SpeedrunOverview from '../components/speedrunEvents/SpeedrunOverview';

window.React = React;

let mockLocalStorageGetItemLoggedInUser: jest.Mock;

test('')