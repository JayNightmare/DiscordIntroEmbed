const loginScenarios = [
    {
      description: 'User is not logged in',
      setup: () => {
        localStorage.removeItem('discordAccessToken');
      },
      expectedResult: 'Not Logged In'
    },
    {
      description: 'User is logged in',
      setup: () => {
        localStorage.setItem('discordAccessToken', 'validToken');
      },
      expectedResult: 'Logged In'
    }
  ];
  
  loginScenarios.forEach(scenario => {
    describe(scenario.description, () => {
      beforeEach(scenario.setup);
      
      it('should display correct login status', () => {
        const loginStatus = document.getElementById('loginStatus').textContent;
        expect(loginStatus).toBe(scenario.expectedResult);
      });
    });
  });
  