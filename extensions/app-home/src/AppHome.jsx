import {render} from 'preact';

import HomePage from './pages/HomePage.jsx';

export default async () => {
  render(<HomePage />, document.body);
};
