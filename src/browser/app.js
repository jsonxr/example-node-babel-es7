import foo from './foo';

async function main() {
  let value = await foo();
  console.log(value);
  setTimeout( () => {
    throw new Error('timeout error');
  }, 3000);
}

export default main;
