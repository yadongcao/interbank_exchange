import { UserGroup } from 'radiks-gavin-test';



export async function createGroup(groupName){
  const group = new UserGroup({ name: groupName });
  await group.create();
}
