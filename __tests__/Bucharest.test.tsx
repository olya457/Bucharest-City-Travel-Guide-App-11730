import React from 'react';
import Renderer, { act } from 'react-test-renderer';
import { BucharestScreen } from '../src/screens/BucharestScreen';
import { Button } from '../src/components/UI';

test('city chapters open their own places and link to walks', async () => {
  const navigation = { navigate: jest.fn() };
  let app: Renderer.ReactTestRenderer;
  await act(async () => {
    app = Renderer.create(
      <BucharestScreen
        navigation={navigation as never}
        route={{ name: 'Bucharest' } as never}
      />,
    );
  });
  const button = (label: string) =>
    app!.root.findAllByType(Button).find(b => b.props.label === label)!;
  for (const [chapter, firstPlace] of [
    ['Architecture', 'athenaeum'],
    ['Green spaces', 'cismigiu'],
    ['Culture', 'art'],
  ]) {
    await act(async () => button(chapter).props.onPress());
    const places = app!.root
      .findAllByType(Button)
      .filter(b => b.props.label === 'Discover this place →');
    expect(places).toHaveLength(3);
    await act(async () => places[0].props.onPress());
    expect(navigation.navigate).toHaveBeenLastCalledWith('Place', {
      id: firstPlace,
    });
  }
  await act(async () => button('Explore city walks →').props.onPress());
  expect(navigation.navigate).toHaveBeenLastCalledWith('Routes');
  await act(async () => app!.unmount());
});
