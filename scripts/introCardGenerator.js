function generateIntroCard(bannerUrl, profilePicUrl, username, badges) {
  const bannerImage = document.querySelector('.bannerImage');
  const profilePic = document.getElementById('profilePic');
  const usernameDisplay = document.querySelector('h2');
  const badgesDisplay = document.querySelector('#badgesDisplay');
  const userInfoSection = document.querySelector('.userInfoSection');

  bannerImage.style.backgroundImage = `url(${bannerUrl})`;
  profilePic.src = profilePicUrl;
  usernameDisplay.textContent = username;

  while (userInfoSection.firstChild) {
    userInfoSection.removeChild(userInfoSection.firstChild);
  }

  badgesDisplay.innerHTML = '';
  const badgesList = badges.split(',');
  badgesList.forEach(badge => {
    const badgeElement = document.createElement('span');
    badgeElement.textContent = badge.trim();
    badgesDisplay.appendChild(badgeElement);

    const userInfoElement = document.createElement('div');
    userInfoElement.textContent = `${badge.trim()} Info`;
    userInfoSection.appendChild(userInfoElement);
  });
}

// Test cases
function testGenerateIntroCard() {
  console.log('Testing generateIntroCard...');

  const testCases = [
    {
      bannerUrl: 'https://example.com/banner.jpg',
      profilePicUrl: 'https://example.com/profile.png', 
      username: 'DiscordUser',
      badges: 'Badge1, Badge2'
    },
    {
      bannerUrl: '',
      profilePicUrl: '', 
      username: 'Guest User',
      badges: ''  
    }
  ];

  testCases.forEach((testCase, index) => {
    console.log(`Test case ${index + 1}:`);
    generateIntroCard(testCase.bannerUrl, testCase.profilePicUrl, testCase.username, testCase.badges);
    console.log('-----');
  });
}

// Test cases with expected and received results
testGenerateIntroCard();
const resultsLog = [];
 
function initializeUser(userProfile) {
  let expectedResult, receivedResult;
  if (!userProfile || !userProfile.id) {
    expectedResult = 'Guest User';
    generateIntroCard('', '', 'Guest User', '');
    receivedResult = document.querySelector('h2').textContent; 
  } else {
    expectedResult = `${userProfile.username}#${userProfile.discriminator}`;
    generateIntroCard(userProfile.banner, userProfile.avatar, `${userProfile.username}#${userProfile.discriminator}`, userProfile.badges.join(', '));
    receivedResult = document.querySelector('h2').textContent;
  }
  resultsLog.push({ expected: expectedResult, received: receivedResult });
}
console.log('Test results:', resultsLog);

window.addEventListener('load', () => initializeUser({}));
function saveState(state) {
  // Implement saving state to local storage or server
}
