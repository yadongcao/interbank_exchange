import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import UserGroupRecords from './models/UserGroupRecords.js'
import { setGroupIdSelected } from './reducers/action.js'

import Typography from '@material-ui/core/Typography';
import {createGroup} from './userGroup/userGroup.js'
import { UserGroup,GroupInvitation,User,getConfig } from 'radiks-gavin-test';
import {connect} from "react-redux"

const styles = {
  formControl: {
    minWidth: 300,
    margin: "20px auto"
  },
  selectEmpty: {
  },
};



class UserGroupList extends Component {

  constructor(props) {
  	super(props);
    this.state = {
      groupName : "",
      inviteId: "",
      groupList :[],
      isLoading : true,
      groupSelected : 0,
      invitationID: "",
      invitationInfo:"",
      isVerbose:true
    }
  }

  async createUserGroup() {
    this.setState({isLoading:true})
    const group = new UserGroup({ name: this.state.groupName });
    const groupCreate = await group.create();
    console.log(groupCreate)
    await this.saveUserGroup(groupCreate)
  }

  async getMyGroups() {
    const groups = await UserGroup.myGroups();
    console.log(groups);
    console.log(UserGroup);
  }

  async inviteToGroup() {
    /*
    const groups = await UserGroup.myGroups();
    console.log(groups)

    const group = groups[0]
    console.log(group)
    group.privateKey = "50bb7dfd3d6c87d7f308e7d42ce7a996d9629673658cb2a4e20219889f766b30"
    const usernameToInvite = 'gavingao.id.blockstack'
    const invitation = await group.makeGroupMembership(usernameToInvite);
    console.log(invitation); // the ID used to later activate an invitation
    */
    const groupRecord = this.state.groupList[this.state.groupSelected];
    console.log(groupRecord)
    const group = await UserGroup.findById(groupRecord.id);

    group.privateKey = groupRecord.Key
    console.log(group)
    const invitation = await group.makeGroupMembership(this.state.inviteId)
    console.log(invitation)
    this.setState({invitationID:invitation._id})
    /*
    const group = await UserGroup.findById("5db432a9b4f5-41d8-b7f5-4d329e1940a5");
    console.log(group);
    const invitation = await group.makeGroupMembership("the11011.id.blockstack");
    console.log(invitation);
    */
  }

  async inviteUserToGroup() {
    const group = new UserGroup({ name: 'testGroup' });
    group.create().then(grp => {
      console.log(grp);
      group.makeGroupMembership("yadongcao.id.blockstack").then(invitation => {
        console.log(invitation);
      });

    })
  }

  async inviteActivate() {
    console.log(GroupInvitation)
    const invitation = await GroupInvitation.findById(this.state.invitationInfo);
    console.log(invitation)
    const succ = await invitation.activate().catch(err => console.log(err));
    console.log(succ)
    if (succ){
      console.log(invitation.attrs.userGroupId)
      const group = await UserGroup.findById(invitation.attrs.userGroupId);
      group.privateKey = invitation.attrs.signingKeyPrivateKey
      console.log(group)
      this.saveUserGroup(group)
    }
  }

  getInfo(){
    console.log(User.currentUser());
  }

  async saveUserGroup(userGroupItem){
    const groupRecord = new UserGroupRecords({
      id: userGroupItem._id,
      KeyId: userGroupItem.attrs.signingKeyId,
      Key: userGroupItem.privateKey,
      name: userGroupItem.attrs.name
    });
    console.log(groupRecord)
    await groupRecord.save()
    await this.handleQueryUserGroup()
  }

  async getGroupRecord(){
    const fetchMessages = await UserGroupRecords.fetchList();
    console.log(fetchMessages)
  }

  async signOut() {
    const {userSession} = await getConfig()
    userSession.signUserOut(window.location.origin);
  }

  handleChangeGroupName = (event) => {
    this.setState({groupName: event.target.value});
    //this.props.store.dispatch(setGroupIdSelected(this.state.groupList[event.target.value].id))
  }

  handleChangeInviteId = (event) => {
    this.setState({inviteId: event.target.value});
  }

  handleChangeInvitationInfo = (event) => {
    this.setState({invitationInfo: event.target.value});
  }

  handleQueryUserGroup = async () =>{
      console.log("in handleQueryUserGroup")
      this.state.groupList = []
      //const debugMessage = await Message.findById('2f8e22079444-454b-9e77-5e461232cdd9');
      const fetchMessages = await UserGroupRecords.fetchList();
      console.log("fetchMessages")
      console.log(fetchMessages)
      fetchMessages.forEach((item) => {
          console.log(item)
          if (item.attrs != undefined){
            if (typeof(item.attrs.id)=="string"){//明文数据
              console.log("in")
              this.state.groupList.push({
                id: item.attrs.id,
                KeyId: item.attrs.KeyId,
                Key: item.attrs.Key,
                name: item.attrs.name
              })
            }
            /*
            else {//密文数据
              this.state.groupList.push({
                  id: item.attrs.id.cipherText,
                  KeyId: item.attrs.KeyId.cipherText,
                  Key: item.attrs.Key.cipherText,
                  name: item.attrs.name.cipherText
              })
            }
            */
          }
      })
      console.log(this.state.groupList)
      this.setState({isLoading:false})
  }

  handleChangeGroupSelected = (event) => {
      console.log(event)
      this.setState({groupSelected:event.target.value})
      //console.log(typeof(event.target.value))
      this.props.dispatch(setGroupIdSelected(this.state.groupList[event.target.value].id))
      
  }

  handleUpdateLocalStorage(){
      if (localStorage){
        console.log("in localStorage：",localStorage,typeof(localStorage), localStorage.getItem("GROUP_MEMBERSHIPS_STORAGE_KEY"))
        let item = JSON.parse(localStorage.getItem("GROUP_MEMBERSHIPS_STORAGE_KEY"))
        console.log("in localStorage item：",item)
        //console.log(item.userGroups)
        //console.log(item.signingKeys)
        //console.log(this.state.groupList)
        this.state.groupList.map((groupInfo,i)=>{
          if (typeof(groupInfo.id) == "string"){
            if (item.userGroups == null){
              item.userGroups = {}
              item.signingKeys = {}
            }
            item.userGroups[groupInfo.id] = groupInfo.KeyId
            item.signingKeys[groupInfo.KeyId] = groupInfo.Key
            console.log(i,item)
          }
        })
        console.log("finally:",item)

        localStorage.setItem("GROUP_MEMBERSHIPS_STORAGE_KEY",JSON.stringify(item))
      }
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
          <FormControl className = {classes.formControl}>
            <InputLabel id="demo-simple-select-label">用户群组选择</InputLabel>

              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={this.state.groupSelected}
                onChange={this.handleChangeGroupSelected}
              >
                  { this.state.isLoading? <div></div> :
                      this.state.groupList.map((item, i)=>{
                          return(
                              <MenuItem key={i} value={i}> {item.name} </MenuItem>
                          )
                      })
                  }
              </Select>

          </FormControl>
          <div>


            <div>
              <form  noValidate autoComplete="off">
                <TextField className={classes.former}  size="small" id="outlined-basic" label="群组名称" variant="outlined"
                  value = {this.state.groupName}
                  onChange={this.handleChangeGroupName}
                />
                <Button  color="primary" onClick={() => this.createUserGroup()}>创建群组</Button>
              </form>

            </div>



            <div>
              <form  noValidate autoComplete="off">
                <TextField className={classes.former} size="small" id="outlined-basic" label="邀请人ID" variant="outlined"
                  value = {this.state.inviteId}
                  onChange={this.handleChangeInviteId}
                />
                <Button  color="primary" onClick={() => this.inviteToGroup()}>邀请至群组</Button>
                <p>邀请码生成 ：{this.state.invitationID}</p>
              </form>


            </div>






            <div>
              <form  noValidate autoComplete="off">
                <TextField className={classes.former} size="small" id="outlined-basic" label="输入邀请函ID" variant="outlined"
                  value = {this.state.invitationInfo}
                  onChange={this.handleChangeInvitationInfo}
                />
                <Button  color="primary" onClick={() => this.inviteActivate()}>激活邀请码</Button>
              </form>
            </div>
            {!this.state.isVerbose?
              <div>
                <Button onClick={() => this.inviteUserToGroup()}>inviteUserToGroup</Button>

                <Button onClick={() => this.getMyGroups()}>getMyGroups</Button>

                <Button onClick={() => this.getInfo()}>getUserInfo</Button>

                <Button onClick={() => this.getGroupRecord()}>getGroupRecord</Button>
              </div>
              : <div></div>
            }


            <Button color="primary" onClick={() => this.signOut()}>登出</Button>
          </div>
      </div>
  );
  }
  async componentWillMount() {
      await this.handleQueryUserGroup()
      await this.handleUpdateLocalStorage()
  }
}

function getVal(state){
  console.log(state)
  return{}
}

export default connect(getVal)(withStyles(styles)(UserGroupList));
