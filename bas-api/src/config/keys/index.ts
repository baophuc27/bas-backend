import fs from 'fs';

export const getPem = () => {
  return fs.readFileSync(__dirname + '/public-key.pem', 'utf8');
};

export const getPemPri = () => {
  return fs.readFileSync(__dirname + '/private-key.pem', 'utf8');
};
