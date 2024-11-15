import { Account } from '../models';


const getAccountByUsername = async (username: string) => {
  return await Account.findOne({
    where: {
      username
    },
  });
};


export  {
  getAccountByUsername
}