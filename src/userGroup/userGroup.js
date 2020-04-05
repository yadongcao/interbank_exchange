import { UserGroup } from 'radiks';



export async function createGroup(groupName){
  const group = new UserGroup({ name: groupName });
  await group.create();
}
