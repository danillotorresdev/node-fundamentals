import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  // O # na frente da variável significa que ela é privada
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf-8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist(); // cria o arquivo db.json caso ele não exista
      });
  }

  #persist() {
    return fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  // a função select serve para selecionar os dados de uma tabela
  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        });
      });
    }

    return data;
  }

  insert(table, data) {
    // verifica se a tabela existe
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      // se não existir, cria a tabela e insere o dado
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      // se o id existir
      this.#database[table][rowIndex] = { id, ...data };
      this.#persist();
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      // se o id existir
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }
}
