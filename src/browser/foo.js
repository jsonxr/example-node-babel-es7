async function foo() {
  if( Math.round(Math.random()) ) {
    return 'Success1!';
  } else {
    throw new Error('Failure!');
  }
}

export default foo;
