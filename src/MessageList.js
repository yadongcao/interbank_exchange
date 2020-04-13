import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Message from './models/Message.js'
import Test from './models/Test.js'
import TextField from '@material-ui/core/TextField';
import { User, UserGroup, getConfig } from 'radiks-gavin-test';
import {connect} from 'react-redux'
import UserGroupRecords from './models/UserGroupRecords.js'


const styles = {
  center:{
    margin:"100px"
  },
  root: {
    width: 300,
    height: 150,
    margin: '10px auto'
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  former:{
    width: 500,
    margin: '10px auto'
  }
};

let groupSelectedId = ""


class MessageList extends Component {

  constructor(props) {
  	super(props);
    this.state = {
      groupName : "",
      value:"",
      messageList:[],
      isLoading:true,
      verbose:true
    }
  }

  handleSubmit = async (event) => {
    const attributes = {
      from: User.currentUser()._id,
      content: this.state.value,
      userGroupId: groupSelectedId,
      groupName: ""
    }
    const fetchMessages = await UserGroupRecords.fetchList();
      console.log("cyd fetchMessages")
      console.log(fetchMessages)
      fetchMessages.forEach((item) => {
          console.log(item)
          if (item.attrs != undefined){
            if (typeof(item.attrs.id)=="string" &&  item.attrs.id == groupSelectedId){//明文数据
              attributes.groupName = item.attrs.name
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
    

    console.log("cyd attributes")
    console.log(attributes)
    const message = new Message(attributes);
    await message.save()
    this.setState({isLoading:true})
    await this.handleQuery()
    this.setState({isLoading:false})
  }

  handleChange = (event) => {
    this.setState({value: event.target.value});
  }

  handleQuery = async () =>{
      console.log("in")
      this.state.messageList = []
      //const debugMessage = await Message.findById('2f8e22079444-454b-9e77-5e461232cdd9');
      //{userGroupId : "a41d22cdac15-47fa-80d1-5c382325c35a"}
      const fetchMessages = await Message.fetchList({});
      console.log(fetchMessages)
      fetchMessages.forEach((item) => {
          console.log(item)
          if (item.attrs != undefined){
            console.log(typeof(item.attrs.content))
            console.log("yadong test"+item.attrs.groupName)
            if (typeof(item.attrs.content)=="string"){//明文数据
              
              this.state.messageList.push({
                  from: item.attrs.from,
                  content: item.attrs.content,
                  userGroupId: item.attrs.userGroupId,
                  groupName: item.attrs.groupName
              })
            }else {//密文数据
              this.state.messageList.push({
                  from: item.attrs.from.cipherText,
                  content: item.attrs.content.cipherText,
                  userGroupId:item.attrs.userGroupId,
                  groupName: item.attrs.groupName
              })
            }
          }

      })
      console.log(this.state.messageList)
      this.setState({isLoading:false})
  }

  render() {
    const { classes } = this.props;

    const test = new Test({
      content : "学习区块链",
      flag : false
    });
    const handleQuery = async() =>{
      console.log("in1")
      //const fetchMessage = await Message.findById("f3734d92afe7-4a85-afab-ba0c9db01fc3")
      const fetchMessages = await Message.fetchList({flag : false});
      //console.log(fetchMessage)
      console.log(fetchMessages)
    }
    const handleSave = async () =>{
      await test.save()
    }
    const handleUpdate = async() =>{
      const newAttributes = {
        from: "yadongcao.id.blockstack",
        content: "努力学习，努力赚钱"
      }
      await test.update(newAttributes)
    }

    const handleUserGroupRecordsUpdate = async() =>{
      //const fetchMessage = await Message.findById("f3734d92afe7-4a85-afab-ba0c9db01fc3")
      const fetchMessages = await UserGroupRecords.fetchList();
      //console.log(fetchMessage)
      console.log(fetchMessages)
    }

    return (
      <div>

        <div className={classes.center }>
          <form  noValidate autoComplete="off">
            <TextField className={classes.former} id="outlined-basic" label="留言框" variant="outlined"
              value = {this.state.value}
              onChange={this.handleChange}
            />
          </form>
          <Button  variant="contained" color="primary" onClick={this.handleSubmit}>
              提交
          </Button>
        </div>
        {this.state.isLoading?<div></div>:
          <div className={classes.center}>
            {this.state.messageList.map((message,i) =>{
              return(
                <Card key = {i} className={classes.root}>
                  <CardContent>
                    <Typography variant="textSecondary" gutterBottom>
                     用户组： {message.groupName}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                     用户： {message.from}
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {message.content}
                    </Typography>
                  </CardContent>
                </Card>)
            })}
          </div>
        }
        { this.state.verbose?
        <div>
          <p>radiks db operation</p>
          <Button  variant="contained" onClick={handleQuery}>
              query
          </Button>
          <Button  variant="contained" onClick={handleSave}>
              save
          </Button>
          <Button  variant="contained" onClick={handleUpdate}>
              update
          </Button>
          <Button  variant="contained" onClick={handleUserGroupRecordsUpdate}>
              UserGroupUpdate
          </Button>
        </div> : <div></div>
        }
      </div>
  );
  }
  async componentDidMount() {
    this.handleQuery()
  }
}

function getVal(state){
  console.log("cyd state")
  console.log(state)
  groupSelectedId = state.groupIdSelectedVal
  console.log(groupSelectedId)
  return{}
}

export default connect(getVal)(withStyles(styles)(MessageList));
