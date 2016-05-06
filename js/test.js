  function randomState1() {
      let random = Math.floor(Math.random() * 2);

      if (random === 1) {
          return Math.floor(Math.random() * 2);
      } else {
          return random;
      }
  }

   // returns 1 1/3 of the time
  let randomState = () => Math.round(Math.random()) ? Math.round(Math.random()) : 0;


  for (var i = 0; i < 10; i++) {
      console.log(randomState());

  }