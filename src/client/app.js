import foo from './foo';

async function main() {
  try {
    let value = await foo();
    console.log(value);
  } catch(err) {
    console.log('received error');
  }
}

export default main;
