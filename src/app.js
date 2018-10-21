const prompts = require('prompts');
const { Builder, By, Key, until } = require('selenium-webdriver');
const schedule = require('node-schedule');

const main = async () => {
  const driver = await new Builder().forBrowser('chrome').build();

  const questions = [
    {
      type: 'text',
      name: 'confirmationNumber',
      message: 'Confirmation number?'
    },
    {
      type: 'text',
      name: 'passengerFirstName',
      message: 'First name?'
    },
    {
      type: 'text',
      name: 'passengerLastName',
      message: 'Last name?'
    },
    {
      type: 'text',
      name: 'flightDate',
      message: 'Date of the flight? YYYY/MM/DD'
    },
    {
      type: 'text',
      name: 'flightTime',
      message: 'Time of the flight? HH/MM'
    }
  ];

  const response = await prompts(questions);
  let dates = [];

  response.flightDate.split('/').map(date => dates.push(date));

  response.flightTime.split('/').map(time => dates.push(time));

  const date = new Date(...dates);

  const j = schedule.scheduleJob(date, async () => {
    try {
      await driver.get('http://www.southwest.com/air/check-in');

      await driver
        .findElement(By.id('confirmationNumber'))
        .sendKeys(response.confirmationNumber, Key.TAB);
      await driver
        .findElement(By.id('passengerFirstName'))
        .sendKeys(response.passengerFirstName, Key.TAB);
      await driver
        .findElement(By.id('passengerLastName'))
        .sendKeys(response.passengerLastName, Key.TAB);
      await driver.findElement(By.id('form-mixin--submit-button')).click();
    } finally {
      await driver.quit();
    }
  });
};

module.exports = {
  main
};
