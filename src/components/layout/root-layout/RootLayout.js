import { Fragment } from 'react';
import MainNavigation from '../main-navigation/MainNavigation';

function RootLayout({ children }) {
  return (
    <Fragment>
      <MainNavigation />
      <main>{children}</main>
    </Fragment>
  );
}

export default RootLayout;