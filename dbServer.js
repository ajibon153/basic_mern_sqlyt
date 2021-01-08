const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

let instance = null;

const conn = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

conn.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  console.log('db ' + conn.state);
});

class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }
  async getAllData() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = 'Select * FROM names;';
        conn.query(query, (err, res) => {
          if (err) reject(new Error(err.message));
          resolve(res);
        });
      });
      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  async insertNewName(name) {
    try {
      const dateAdded = new Date();
      const insertRes = await new Promise((resolve, reject) => {
        const query = 'INSERT INTO names (name, date_added) VALUES (?,?);';
        conn.query(query, [name, dateAdded], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
      return insertRes;
    } catch (error) {
      console.log(error);
    }
  }
  async deleteById(id) {
    try {
      id = parseInt(id, 10);
      const deleteRes = await new Promise((resolve, reject) => {
        const query = 'DELETE FROM names WHERE id = ?';
        conn.query(query, [id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.affectedRows);
        });
      });
      return deleteRes === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateById(id, name) {
    try {
      id = parseInt(id, 10);
      const updateRes = await new Promise((resolve, reject) => {
        const query = 'UPDATE names SET name = ? WHERE id = ?';
        conn.query(query, [name, id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.affectedRows);
        });
      });
      console.log('updateRes', updateRes);
      return updateRes === 1 ? true : false;
    } catch (error) {
      return false;
    }
  }

  async searchByValue(name) {
    console.log('searchByValue', name);
    try {
      const searchRes = await new Promise((resolve, reject) => {
        const query = 'SELECT * FROM names WHERE name = ?';
        conn.query(query, [name], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
      console.log('searchRes', searchRes);
      return searchRes;
    } catch (error) {
      return false;
    }
  }
}

module.exports = DbService;
