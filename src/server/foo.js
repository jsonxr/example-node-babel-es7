async function foo() {
  throw new Error("inside bar");
  if( Math.round(Math.random()) ) {
    return 'Success1!';
  } else {
    throw 'Failure!';
  }
}

export default foo;
