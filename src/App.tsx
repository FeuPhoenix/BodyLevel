import { Provider } from 'react-redux';
import { store } from './features/store';
import { ThemeProvider } from './components/UI/ThemeProvider';
import { Layout } from './components/UI/Layout';
import { Home } from './components/Home';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Layout>
          <Home />
        </Layout>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
