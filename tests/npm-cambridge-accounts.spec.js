// chromedriver reference: https://www.npmjs.com/package/chromedriver#running-with-selenium-webdriver
require('chromedriver')
const { Builder, By, Key, until } = require('selenium-webdriver')
const { Options } = require('selenium-webdriver/chrome')

// test timeout 5 minutes
jest.setTimeout(300000)

/** Jevielyn Permalino
 * Scenario for Activity No.1:
 *    1.0 Navigate to npm homepage - https://www.cambridge.org/core
 *      1.1 Validate that the title matches expected homepage title "Cambridge"
 *    2.0 click each social media below the page (facebook, twitter, linkedin, youtube and instagram)
 *      2.1 Validate that the title matches expected search page title
 *      2.2 Validate that we have a result that matches our search criteria
 */
describe('npmjs.com package search', () => {
  it('basic package search', async () => {

    // generate options for chrome
    const chromeOptions = new Options()
    // detailed info for these args: https://peter.sh/experiments/chromium-command-line-switches/
    chromeOptions.addArguments('--no-sandbox')
    chromeOptions.addArguments('--disable-gpu')
    chromeOptions.addArguments('--disable-dev-shm-usage')
    // turn off headless by removing this
    // chromeOptions.addArguments('--headless')
    chromeOptions.windowSize({ width: 1920, height: 1080 })

    // selenium webdriver
    const driver = new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .build()


    try {
      // 1.0 Navigate to npm homepage - https://www.cambridge.org/core
      await driver.get(`https://www.cambridge.org/core`)

      // Wait until browser loads completely
      await driver.sleep(2000)
      await driver.wait(() => {
        return driver.executeScript('return document.readyState').then(state => {
          return state === 'complete'
        })
      }, 120000)

      // 1.1 Validate that the title matches expected homepage title "Cambridge"
      const homepageTitle = await driver.getTitle()
      expect(homepageTitle).toEqual('Cambridge Core - Journals & Books Online | Cambridge University Press')

      // 2.0 click each social media below the page (facebook, twitter, linkedin, youtube and instagram)
      // await driver
      //   .wait(until.elementLocated(By.xpath(`//div[@class='social-container']//ul[@class='social']`)))
      //   .sendKeys('selenium bootcamp', Key.ENTER)

      // Wait until browser loads completely
      await driver.sleep(2000)
      await driver.wait(() => {
        return driver.executeScript('return document.readyState').then(state => {
          return state === 'complete'
        })
      }, 120000)

      const socialList= await driver.findElement(By.xpath(`//div[@class='social-container']//ul[@class='social']//li/a[@class='icon fb']`))
      socialList.click()

      await driver.sleep(2000)
      await driver.wait(() => {
        return driver.executeScript('return document.readyState').then(state => {
          return state === 'complete'
        })
      }, 120000)

      driver.executeScript('window.open("newURL");');

      // 2.1 Validate that the title matches expected search page title 'selenium bootcamp - Google Search'
      const searchPageTitle = await driver.getTitle()
      expect(searchPageTitle).toEqual('selenium bootcamp - Google Search')

      // 2.2 Validate that we have a result that matches our search criteria : "selenium“ or "bootcamp“
      const listingMatch = await driver.findElement(By.xpath(`//div//a[.//h3[contains(.,'selenium') or contains(.,'bootcamp')]]`))
      expect(listingMatch).toBeTruthy()

    } finally {
      await driver.quit()
    }
  })
})
