import React, { Component } from 'react';
import {
  Person,
} from 'blockstack';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class Profile extends Component {
  constructor(props) {
  	super(props);

  	this.state = {
  	  person: {
  	  	name() {
          return 'Anonymous';
        },
  	  	avatarUrl() {
  	  	  return avatarFallbackImage;
  	  	},
  	  },
      newStatus:"",
      status:""
  	};
  }
  saveNewStatus(statusText) {
     const { userSession } = this.props

     let status = {
       text: statusText.trim(),
       created_at: Date.now()
     }

     const options = { encrypt: false }
     userSession.putFile('status.json', JSON.stringify(status), options)
       .then(() => {
         this.setState({
           newStatus: status.text
         })
       })
  }
  fetchData() {
   const { userSession } = this.props
   const options = { decrypt: false }
   userSession.getFile('status.json', options)
     .then((file) => {
       var status = JSON.parse(file || '[]')
       console.log(status)
       this.setState({
         status:status
       })
     })
     .finally(() => {
       console.log("read over")
     })
  }
  handleNewStatusChange(event) {
    this.setState({newStatus: event.target.value})
  }

  handleNewStatusSubmit(event) {
    this.saveNewStatus(this.state.newStatus)
    this.setState({
      newStatus: ""
    })
  }
  render() {
    const { handleSignOut, userSession } = this.props;
    const { person } = this.state;
    console.log(person)
    return (
      !userSession.isSignInPending() ?
      <div className="panel-welcome" id="section-2">
        <div className="avatar-section">
          <img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } className="img-rounded avatar" id="avatar-image" alt=""/>
        </div>
        <p>Hello, <span id="heading-name">{ person.name() ? person.name() : 'Nameless Person' }</span>!</p>
        <p className="lead">
          <button
            className="btn btn-primary btn-lg"
            id="signout-button"
            onClick={ handleSignOut.bind(this) }
          >
            Logout
          </button>
        </p>
        <br/>
        <br/>
        <textarea className="input-status"
                 value={this.state.newStatus}
                 onChange={e => this.handleNewStatusChange(e)}
                 placeholder="输入状态"
               />
        <br/>

        <button
                 className="btn btn-primary btn-lg"
                 onClick={e => this.handleNewStatusSubmit(e)}
                >
                提交
        </button>
        <p>  status is: {this.state.status.text}</p>

      </div> : null
    );
  }
  componentDidMount() {
    this.fetchData()
  }
  componentWillMount() {
    const { userSession } = this.props;
    this.setState({
      person: new Person(userSession.loadUserData().profile),
    });
  }
}
