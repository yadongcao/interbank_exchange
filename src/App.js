import React, { Component } from 'react';
import Profile from './Profile.js';
import Signin from './Signin.js';
import Message from './MessageList.js'
import {createGroup} from './userGroup/userGroup.js'
import { UserGroup } from 'radiks';
import Button from '@material-ui/core/Button';

import {
  UserSession,
  AppConfig
} from 'blockstack';

import { configure} from 'radiks';
import { User, getConfig } from 'radiks';
const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig: appConfig })
console.log(userSession)
configure({
  apiServer: 'http://localhost:1260',
  userSession
});


export default class App extends Component {

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

  createUserGroup() {
    const group = new UserGroup({ name: 'yadongcao' });
    group.create().then(x => console.log('user group', x));
  }

  async getMyGroups() {
    const groups = await UserGroup.myGroups();
    console.log(groups);
  }

  async inviteToGroup() {
    const groups = await UserGroup.myGroups();
    console.log(groups)
    const group = await UserGroup.findById(groups[0]._id);
    console.log(group)
    const usernameToInvite = 'yadongcao.id.blockstack'
    const invitation = await group.makeGroupMembership(usernameToInvite);
    console.log(invitation); // the ID used to later activate an invitation
    /*
    const group = await UserGroup.findById("5db432a9b4f5-41d8-b7f5-4d329e1940a5");
    console.log(group);
    const invitation = await group.makeGroupMembership("the11011.id.blockstack");
    console.log(invitation);
    */
    
  }

  async inviteUserToGroup() {
    const group = new UserGroup({ name: 'testing' });
    group.create().then(grp => {
      console.log(grp);
      group.makeGroupMembership("gavin.id.blockstack").then(invitation => {
        console.log(invitation);
      });

    })
  }
  getInfo(){
    console.log(User.currentUser());
  }

  render() {
    return (
      <div className="site-wrapper">
        <div className="site-wrapper-inner">
          { !userSession.isUserSignedIn() ?
            <Signin userSession={userSession} handleSignIn={ this.handleSignIn } />
            : <div>

                  <Message/>
              </div>

              //<Profile userSession={userSession} handleSignOut={ this.handleSignOut } />
          }

        </div>
        <br/>
        <div>
          <p>Debug tag</p>
          <Button onClick={() => this.signIn()}>SignIn</Button>

          <Button onClick={() => this.signOut()}>SignOut</Button>

          <Button onClick={() => this.createUserGroup()}>createUserGroup</Button>

          <Button onClick={() => this.inviteToGroup()}>inviteToGroup</Button>

          <Button onClick={() => this.inviteUserToGroup()}>inviteUserToGroup</Button>

          <Button onClick={() => this.getMyGroups()}>getMyGroups</Button>

          <Button onClick={() => this.getInfo()}>getUserInfo</Button>
        </div>
      </div>
    );
  }

  async componentDidMount() {
    const { userSession } = getConfig();
    console.log(userSession)
    if (userSession.isSignInPending()) {
      console.log("in")
      await userSession.handlePendingSignIn().then((userData) => {
        window.history.replaceState({}, document.title, "/")
        this.setState({ userData: userData})
      });
      const currentUser = await User.createWithCurrentUser();
      console.log(currentUser)
    }

  }
}
