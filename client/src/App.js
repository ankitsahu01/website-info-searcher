import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import WebsiteInfoSearcher from './components/WebsiteInfoSearcher';

function App() {
  return (
    <>
    <BrowserRouter>
        <Header/>
      <Switch>
        <Route to="/" exact>
          <WebsiteInfoSearcher/>
        </Route>
      </Switch>
    </BrowserRouter>
    </>
  );
}

export default App;
