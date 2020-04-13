import React, { Component } from 'react';
import Profile from './Profile.js';
import Signin from './Signin.js';
import Message from './MessageList.js'
import UserGroupList from './UserGroupList.js'
import Button from '@material-ui/core/Button';
import {connect} from 'react-redux'
import {
  UserSession,
  AppConfig
} from 'blockstack';

import { configure,User, getConfig} from 'radiks-gavin-test';


const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig: appConfig })
console.log(userSession)
configure({
  apiServer: 'http://localhost:1260',
  userSession
});


class App extends Component {

  constructor(){
    super()

  }

  handleSignIn(e){
    e.preventDefault();
    userSession.redirectToSignIn();
  }

  handleSignOut(e) {
    e.preventDefault();
    userSession.signUserOut(window.location.origin);
  }

  signIn() {
    userSession.redirectToSignIn();
  }
  signOut() {
    userSession.signUserOut(window.location.origin);
  }


  render() {
    return (
      <div className="site-wrapper">

          { !userSession.isUserSignedIn() ?
            <div className="site-wrapper-inner">
              <Signin userSession={userSession} handleSignIn={ this.handleSignIn } />
            </div>
            :
            <div className="site-wrapper-inner">
              <UserGroupList />
              <Message />
            </div>
              //<Profile userSession={userSession} handleSignOut={ this.handleSignOut } />
          }
        <br/>
        <div>
          <p>Debug tag</p>
          <Button onClick={() => this.signIn()}>SignIn</Button>

          <Button onClick={() => this.signOut()}>SignOut</Button>

        </div>
      </div>
    );
  }

  async componentDidMount() {
    const { userSession } = getConfig();
    console.log(userSession)
    if (userSession.isSignInPending()) {
      console.log("in 1")
      await userSession.handlePendingSignIn().then((userData) => {
        window.history.replaceState({}, document.title, "/")
        this.setState({ userData: userData})
      });
      const currentUser = await User.createWithCurrentUser();
      console.log("1",currentUser)
    }
    /*
    else if(userSession.isUserSignedIn()){
      console.log("in 2")
      const currentUser = await User.createWithCurrentUser();
      console.log("2",currentUser)
    }
    */
    console.log(this.props)
  }
}


export default connect()(App)
