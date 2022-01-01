//@ts-check
import * as playwright from 'playwright'
import Context from '@/models/Context'

const browserType = 'chromium'

export default async function handleAttack(ctx: Context, message = '') {
  const msgArray = message.split(' ')
  if (msgArray[0] === 'Attack') {
    const phone = msgArray[1].toString()
    await ctx.reply('Starting an attack!')
    const browser = await playwright[browserType].launch({
      headless: false,
      args: ['--disable-setuid-sandbox'],
    })
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto('https://www.kamaze.co.il/')
    await page.locator('section.services ul li.mobile').hover()

    await page
      .locator('section.services ul li.mobile a[href="/Compare/1/Cellular"]')
      .first()
      .click()

    await page.locator('.company_box a').first().click()
    await page.locator('.plan_box .blue_button').first().click()
    await page.fill('.popup_div_box #Name', 'שלום')
    await page.fill('.popup_div_box #Phone', phone)
    await page.locator('.popup_div_box .form_send').first().click()

    setTimeout(async () => {
      const array = page.locator(
        '.contact_form_success_text .comp_checkbox input'
      )
      const elementsCount = await array.count()
      for (let i = 0; i < elementsCount; i++) {
        const element = await array.nth(i)
        await element.click()
      }

      await page
        .locator('.contact_form_success_text .form_send')
        .first()
        .click()

      setTimeout(async () => {
        const sendResponse = await page.textContent('.text16.grayFont')
        if (sendResponse === 'נציג מטעם החברה יחזור אליך בהקדם') {
          await browser.close()
          void ctx.reply('Success!')
        }
      }, 15000)
    }, 15000)
  }
}
