const React = require('react');
const ReactDOM = require('react-dom');

const ReactRouter = require('react-router');
const Link = ReactRouter.Link;
const Router = ReactRouter.Router;
const Route = ReactRouter.Route;
const IndexRoute = ReactRouter.IndexRoute;
const hashHistory = ReactRouter.hashHistory;

const NavigationBar = require(__dirname + '/src/components/NavigationBar.jsx');
const UserDashBoard = require(__dirname + '/src/components/UserDashBoard.jsx');
const UserLegislatorsInfo = require(__dirname + '/src/components/UserLegislatorsInfo.jsx');
const LegislationSearch = require(__dirname + '/src/components/LegislationSearch.jsx');
const UserLogin = require(__dirname + '/src/components/UserLogin.jsx');
const UserSignup = require(__dirname + '/src/components/UserSignup.jsx');
const UserLogout = require(__dirname + '/src/components/UserLogout.jsx');
const About = require(__dirname + '/src/components/about.jsx');

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isVerifyingUserSession: true,
      isUserLoggedIn: false,
      username: '',
      userLocation: {
        lat: undefined,
        long: undefined
      }
    };
  }

  // Need check with the server to see if user is autheticated
  componentDidMount() {
    $.get('login')
      .done(function(data) {
        this.setState({        
          isVerifyingUserSession: false,
          isUserLoggedIn: true,
          username: data.username,
          userLocation: data.location
        });
      })
      .fail(error => {
        // If user is not logged in:
        this.setState({
          isVerifyingUserSession: false,
          isUserLoggedIn: false

          // Testing Only:
          // isUserLoggedIn: true,
          // username: 'boba',
          // userLocation: {
          //   lat: 37.795,
          //   long: -122.40
          // }      
        });

        // Redirect them to login
        hashHistory.push('/about');
      });
  }

  render() {
    // If we are in the progress of checking if the user is logged in or not...
    if (this.state.isVerifyingUserSession === true) {
      return (
        <div>
          <h1>Authenticating...</h1>
        </div>
      );
    }

    // If the user is logged in...
    if (this.state.isUserLoggedIn === true) {
      return (
        <div>
          <NavigationBar username={this.state.username}/>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-4">
                <UserLegislatorsInfo userLat={this.state.userLocation.lat} userLong={this.state.userLocation.long} />
              </div>
              <div className="col-md-8">

                {this.props.main.type === 'UserDashBoard' ? 
                  <UserDashBoard username={this.state.username}/> :
                  <LegislationSearch username={this.state.username} />
                }

              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }
}

App.defaultProps = {
  main: 'UserDashBoard'
};

class AppRoutes extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router history = {hashHistory}>
        <Route path="/about" component={About} />
        <Route path="/login" component={UserLogin} />
        <Route path="/signup" component={UserSignup} />
        <Route path="/logout" component={UserLogout} /> 
        <Route path="/" component={App}>
          <Route path="/search" components = {{main: 'LegislationSearch'}} />
          <Route path="/dashboard" components = {{main: 'UserDashBoard'}} />
        </Route>
      </Router>
    );
  }
} 



ReactDOM.render(<AppRoutes />, document.getElementById('app'));