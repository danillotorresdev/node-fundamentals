import { Readable } from "node:stream";

class OneToHundredStream extends Readable {
  constructor() {
    super();
    this.index = 0;
  }

  _read() {
    this.index++;

    setTimeout(() => {
      if (this.index > 5) {
        this.push(null);
        return;
      }
      const buf = Buffer.from(`${this.index}\n`);
      this.push(buf);
    }, 1000);
  }
}

fetch("http://localhost:3334", {
  method: "POST",
  body: new OneToHundredStream(),
  duplex: "half", // O valor half significa que o corpo da requisição é um fluxo de dados que pode ser lido e escrito ao mesmo tempo.
})
  .then((res) => res.text())
  .then(console.log);
