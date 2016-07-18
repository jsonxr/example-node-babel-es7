async function foo() {
  if( Math.round(Math.random()) ) {
    return 'Success1!';
  } else {
    throw 'Failure!';
  }
}

export default foo;
