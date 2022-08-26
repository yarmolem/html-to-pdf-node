import fs from 'fs'
import express from 'express'
import puppeteer from 'puppeteer'

const app = express()

app.get('/', (_req, res) => res.json({ ok: true }))

app.get('/pdf', (_req, res) => {
  const html = fs.readFileSync('print.html', 'utf-8')
  const newHtml = replacerHtml(html, { name: 'Cristian', lastname: 'Gonzalez' })
  res.send(newHtml)
})

app.get('/download/pdf/:id', async (_req, res) => {
  
  // TODO: Consulta a la api :id

  const html = fs.readFileSync('print.html', 'utf-8')
  const newHtml = replacerHtml(html, { name: 'Cristian', lastname: 'Gonzalez', more: { age: 24 } })
  const pdfBuffer = await printPDF(newHtml)
  
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Length': pdfBuffer.length
  })
  res.send(pdfBuffer)
})


app.listen(8080, () => console.log('http://localhost:8080'))

async function printPDF(html: string) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.setContent(html, { waitUntil: 'domcontentloaded' })
  await page.emulateMediaType('screen')

  const pdf = await page.pdf({ format: 'A4' })

  await browser.close()
  return pdf
}

const regexp = /{{([^{]+)}}/g

function replacerHtml(str: string, o: object) {
  return str.replace(regexp, (_, key: string) => {
    if (key.includes('.')) {
      // @ts-ignore
      return (key = o[key.split('.')[0]][key.split('.')[1]]) === null ? '' : key
    }

    // @ts-ignore
    return (key = o[key]) === null ? '' : key
  })
}

