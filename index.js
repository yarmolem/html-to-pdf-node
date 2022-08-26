"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const app = (0, express_1.default)();
app.get('/', (_req, res) => res.json({ ok: true }));
app.get('/pdf', (_req, res) => {
    const html = fs_1.default.readFileSync('print.html', 'utf-8');
    const newHtml = replacerHtml(html, { name: 'Cristian', lastname: 'Gonzalez' });
    res.send(newHtml);
});
app.get('/download/pdf/:id', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: Consulta a la api :id
    const html = fs_1.default.readFileSync('print.html', 'utf-8');
    const newHtml = replacerHtml(html, { name: 'Cristian', lastname: 'Gonzalez', more: { age: 24 } });
    const pdfBuffer = yield printPDF(newHtml);
    res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfBuffer.length
    });
    res.send(pdfBuffer);
}));
app.listen(8080, () => console.log('http://localhost:8080'));
function printPDF(html) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_1.default.launch();
        const page = yield browser.newPage();
        yield page.setContent(html, { waitUntil: 'domcontentloaded' });
        yield page.emulateMediaType('screen');
        const pdf = yield page.pdf({ format: 'A4' });
        yield browser.close();
        return pdf;
    });
}
const regexp = /{{([^{]+)}}/g;
function replacerHtml(str, o) {
    return str.replace(regexp, (_, key) => {
        if (key.includes('.')) {
            // @ts-ignore
            return (key = o[key.split('.')[0]][key.split('.')[1]]) === null ? '' : key;
        }
        // @ts-ignore
        return (key = o[key]) === null ? '' : key;
    });
}
