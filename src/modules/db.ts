import { join } from 'path';
import { promises } from 'fs';
import * as lowdb from 'lowdb';
import { homedir } from 'os';

/**
 * fix this it really sucks at doing its job
 * @returns db: LowDB
 */
export const initDb = async () => {
  const dbFile = join(homedir(), '/.quickcrypt/db.json');
  try {
    await promises.access(dbFile);
    const adapter = new lowdb.JSONFile(dbFile);
    const db = new lowdb.Low(adapter);
    await db.read();
    return db;
  } catch (err) {
    console.error('failed to access home dir')
    console.error(err);
    await createAppFolder();
    const adapter = new lowdb.JSONFile(dbFile);
    const db = new lowdb.Low(adapter);
    await db.read();
    return db;
  }
};

/**
 * if there is not a home folder, create one.
 * also creates an empty db.json file
 */
const createAppFolder = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const appDir = join(homedir(), '/.quickcrypt/');
      try{
        await promises.access(appDir)
      } catch(err){ 
       await promises.mkdir(appDir); 
      }
      await promises.open(join(appDir, './db.json'), 'w');
      await promises.appendFile(join(appDir, './db.json'), '{"meta": {}, "passwords": []}')
      return resolve('file created')
    } catch (err) {
      console.error('failed to create home dir');
      return reject(err);
    }
  })
};
