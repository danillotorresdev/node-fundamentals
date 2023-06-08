// Streamings são fluxos de dados que são enviados de forma contínua. Ou seja, os dados são enviados aos poucos, aos pedaços, aos fragmentos.
// Por exemplo, quando você está assistindo um vídeo no YouTube, o vídeo é enviado para o seu computador aos poucos, aos pedaços, aos fragmentos. O vídeo não é enviado de uma vez só.

// Temos 4 tipos de Streamings:
// Readable -> É um fluxo de dados que pode ser lido. Ou seja, é um fluxo de dados que pode ser consumido aos poucos. EX: Quando você está assistindo um vídeo no YouTube, o vídeo é um fluxo de dados que pode ser consumido.
// Writable -> É um fluxo de dados que pode ser escrito. Ou seja, é um fluxo de dados que pode ser enviado aos poucos para algum lugar. EX: Quando você está fazendo um upload de um vídeo para o YouTube, o vídeo é um fluxo de dados que pode ser enviado para o YouTube.
// Duplex -> É um fluxo de dados que pode ser lido e escrito ao mesmo tempo. Ou seja, é um fluxo de dados que pode ser consumido e enviado aos poucos ao mesmo tempo. EX: Quando você está assistindo um vídeo no YouTube, o vídeo é um fluxo de dados que pode ser consumido e enviado para o seu computador ao mesmo tempo.
// Transform -> É um fluxo de dados que pode ser lido e escrito ao mesmo tempo, mas os dados são transformados durante o processo. Ou seja, é um fluxo de dados que pode ser consumido e enviado aos poucos ao mesmo tempo, mas os dados são transformados durante o processo. EX: Quando você está assistindo um vídeo no YouTube, o vídeo é um fluxo de dados que pode ser consumido e enviado para o seu computador ao mesmo tempo, mas os dados são transformados durante o processo. Por exemplo, o vídeo é comprimido durante o processo.

// No node todas as requisições HTTP são Streamings. Ou seja, todas as requisições HTTP são fluxos de dados que podem ser consumidos aos poucos.

// process.stdin // O objeto process.stdin é um fluxo de dados que pode ser consumido aos poucos.
//   .pipe(process.stdout); // O método pipe() é usado para enviar os dados de um fluxo de dados para outro fluxo de dados.

import { Readable, Writable, Transform } from "node:stream";

// Essa classe é um fluxo de dados que pode ser consumido aos poucos. Ou seja, é um fluxo de dados que pode ser lido.
class OneToHundredStream extends Readable {
  constructor() {
    super();
    this.index = 0;
  }

  // O método _read() é chamado quando o fluxo de dados está pronto para ser consumido.
  _read() {
    this.index++;

    setTimeout(() => {
      if (this.index > 100) {
        // Quando o método push() recebe null como argumento, significa que não tem mais dados para serem enviados.
        this.push(null);
        return;
      }
      // O método Buffer.from() é usado para criar um buffer a partir de uma string. Um buffer é um pedaço de memória que armazena dados. O buffer é usado para armazenar os dados que serão enviados para o fluxo de dados.
      const buf = Buffer.from(`${this.index}\n`);
      // O método push() é usado para enviar os dados para o fluxo de dados.
      this.push(buf);
    }, 1000);
  }
}

// Essa classe é um fluxo de dados que pode ser escrito. Ou seja, é um fluxo de dados que pode ser enviado aos poucos para algum lugar equanto os dados são lidos.
class MultiplyByTwoStream extends Writable {
  // O método _write() é chamado quando o fluxo de dados está pronto para receber dados.
  // O método _write() recebe 3 argumentos:
  // chunk -> É o dado que está sendo enviado para o fluxo de dados.
  // encoding -> É o tipo de codificação do dado que está sendo enviado para o fluxo de dados.
  // callback -> É uma função que deve ser chamada quando o dado for enviado para o fluxo de dados.
  _write(chunk, encoding, callback) {
    const number = Number(chunk.toString());
    const result = number * 10;
    console.log(result);
    callback();
  }
}
// Essa classe é um fluxo de dados que pode ser lido e escrito ao mesmo tempo, mas os dados são transformados durante o processo. Ou seja, é um fluxo de dados que pode ser consumido e enviado aos poucos ao mesmo tempo, mas os dados são transformados durante o processo.
class InverseNumberStream extends Transform {
  _transform(chunk, encoding, callback) {
    const number = Number(chunk.toString());
    const result = number * -1;
    // O método callback() é usado para enviar os dados para o fluxo de dados. O método callback() recebe 2 argumentos:
    // error -> É um erro que ocorreu durante o processo.
    // chunk -> É o dado que está sendo enviado para o fluxo de dados.
    callback(null, Buffer.from(`${result}\n`));
  }
}

new OneToHundredStream()
  .pipe(new InverseNumberStream())
  .pipe(new MultiplyByTwoStream());
