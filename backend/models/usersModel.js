const pool = require("../../../backend/db");
const bcrypt = require("bcrypt");

class User {
  constructor(firstName, lastName, email, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }

  static async findByEmail(email) {
    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      return result.rows[0];
    } catch (error) {
      return error;
    }
  }

  static async findById(id) {
    try {
      const result = await pool.query("SELECT * FROM users WHERE id = $1", [
        id,
      ]);
      return result.rows[0];
    } catch (error) {
      return error;
    }
  }

  async save() {
    this.password = await bcrypt.hash(this.password, 10);
    const result = await pool.query(
      "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [this.firstName, this.lastName, this.email, this.password]
    );
    this.id = result.rows[0].id;
  }

  static async comparePasswords(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

module.exports = User;
