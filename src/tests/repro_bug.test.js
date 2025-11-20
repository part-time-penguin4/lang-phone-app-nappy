import { create } from 'zustand';

// Jest mocks are hoisted, so we can't use out-of-scope variables directly if they are not declared with `mock`.
// The easiest way is to provide the implementation inline.

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve(null)),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve(null)),
}));

import useSession from '../store/useSession';

describe('useSession Store Bug Reproduction', () => {
  beforeEach(() => {
    // Reset store state before each test
    useSession.setState({
      goalPerDay: 30,
      xp: 0,
      streak: 0,
      lastActiveDay: null,
      inSession: false,
      currentIndex: 0,
      currentSet: [],
    });
    jest.clearAllMocks();
  });

  test('submitAnswer should increment currentIndex', async () => {
    const session = useSession.getState();

    const dummyCards = [{ id: '1', front: 'F1', back: 'B1' }, { id: '2', front: 'F2', back: 'B2' }];

    // Start a session
    session.startSession(dummyCards);

    let current = useSession.getState();
    expect(current.inSession).toBe(true);
    expect(current.currentIndex).toBe(0);
    expect(current.currentSet).toHaveLength(2);

    // Submit answer for the first card
    await current.submitAnswer({ quality: 'good' });

    current = useSession.getState();

    // We expect this to fail if the bug is present (it stays 0)
    expect(current.currentIndex).toBe(1);
  });
});
