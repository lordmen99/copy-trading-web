import { ConnectedRouter } from 'connected-react-router';
import { DocumentWidthContextProvider } from 'containers/contexts/DocumentWidthContext';
import { ErrorContextProvider } from 'containers/contexts/ErrorContext';
import { ToastContextProvider } from 'containers/contexts/ToastContext';
import { UrlImagesContextProvider } from 'containers/contexts/UrlImagesContext';
import React, { Suspense } from 'react';
import { Spinner } from 'react-bootstrap';
import { Provider } from 'react-redux';
import { Switch } from 'react-router';
import { PersistGate } from 'redux-persist/integration/react';
import RouterConfig from 'routes';
import configureStore from './boot/configureStore';

const store = configureStore.setup();
export default function App() {
  return (
    <Provider store={store.store}>
      <PersistGate
        loading={
          <Spinner animation="border" variant="dark" style={{ position: 'absolute', top: '50%', left: '50%' }} />
        }
        persistor={store.persistor}
      >
        <ConnectedRouter history={configureStore.history}>
          <ErrorContextProvider>
            <ToastContextProvider>
              <UrlImagesContextProvider>
                <DocumentWidthContextProvider>
                  <Suspense
                    fallback={
                      <Spinner
                        animation="border"
                        variant="dark"
                        style={{ position: 'absolute', top: '50%', left: '50%' }}
                      />
                    }
                  >
                    <Switch>
                      <RouterConfig />
                    </Switch>
                  </Suspense>
                </DocumentWidthContextProvider>
              </UrlImagesContextProvider>
            </ToastContextProvider>
          </ErrorContextProvider>
        </ConnectedRouter>
      </PersistGate>
    </Provider>
  );
}
