import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

// pages
import Login from 'pages/login/LoginPage';
import HomePage from 'pages/dashboard/HomePage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <p>Ooops, something went terribly wrong!</p>;
    }

    return this.props.children;
  }
}

export default function Routes() {
  return (
    <ErrorBoundary>
      <Router>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
          <PrivateRoute path="/dashboard" component={HomePage} />
          <PublicRoute path="/login" component={Login} />
        </Switch>
      </Router>
    </ErrorBoundary>
  );

  // #######################################################################

  function PrivateRoute({ component, ...rest }) {
    const token = localStorage.getItem('userToken');
    return (
      <Route
        {...rest}
        render={(props) =>
          token ? (
            React.createElement(component, props)
          ) : (
              <Redirect
                to={{
                  pathname: '/login',
                  state: {
                    from: props.location,
                  },
                }}
              />
            )
        }
      />
    );
  }

  function PublicRoute({ component, ...rest }) {
    const token = localStorage.getItem('userToken');

    return (
      <Route
        {...rest}
        render={(props) =>
          token ? (
            <Redirect
              to={{
                pathname: '/',
              }}
            />
          ) : (
              React.createElement(component, props)
            )
        }
      />
    );
  }
}
