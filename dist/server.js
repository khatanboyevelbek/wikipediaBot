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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const telegraf_1 = require("telegraf");
const wikipedia_1 = __importDefault(require("wikipedia"));
const token = (process.env.TOKEN);
const bot = new telegraf_1.Telegraf(token);
const start = () => {
    // Keyboards
    const keyboards = telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.callbackButton('🇺🇿 Uzbek', 'uzbek'),
        telegraf_1.Markup.callbackButton(' 🇷🇺 Russian', 'russian'),
        telegraf_1.Markup.callbackButton('🇺🇸 English', 'english')
    ]);
    // Start bot
    bot.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const firstName = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.first_name;
        return yield ctx.replyWithHTML(`<b>Welcome ${firstName}. Enter some keyword to find out more about that.</b> \n Choose a language`, {
            reply_markup: keyboards
        });
    }));
    // Bot info
    bot.command('info', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        return yield ctx.replyWithHTML(`<b>👨‍💻 This bot was created by Elbek Khatanboyev. If you find out bot errors, please reach me out.</b> @Elbek_Egamberdiyevich`);
    }));
    // Change a language 
    bot.command('language', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const chat_id = (_b = ctx.chat) === null || _b === void 0 ? void 0 : _b.id;
        return yield ctx.telegram.sendMessage(chat_id, 'Change a language', {
            reply_markup: keyboards
        });
    }));
    // when entered uzbek button
    bot.action('uzbek', ctx => {
        wikipedia_1.default.setLang('uz');
        ctx.editMessageText('O\'zbekcha so\'z kiriting:');
        bot.on('message', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const message = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
            const chatId = (_b = ctx.chat) === null || _b === void 0 ? void 0 : _b.id;
            try {
                const page = yield wikipedia_1.default.page(`${message}`);
                const summary = yield page.summary();
                const contentUrl = (summary.content_urls.mobile.page).toLowerCase();
                return yield ctx.telegram.sendMessage(chatId, `${summary.extract} \n \n Batafsil: ${contentUrl}`);
            }
            catch (error) {
                yield ctx.reply('Bu mavzuga oid maqola topilmadi');
            }
        }));
    });
    // when entered russian button
    bot.action('russian', ctx => {
        wikipedia_1.default.setLang('ru');
        ctx.editMessageText('Bведите русское слово');
        bot.on('message', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const message = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
            const chatId = (_b = ctx.chat) === null || _b === void 0 ? void 0 : _b.id;
            try {
                const page = yield wikipedia_1.default.page(`${message}`);
                const summary = yield page.summary();
                const contentUrl = (summary.content_urls.mobile.page).toLowerCase();
                return yield ctx.telegram.sendMessage(chatId, `${summary.extract} \n \n подробнoe: ${contentUrl}`);
            }
            catch (error) {
                yield ctx.reply('Статья не найдена');
            }
        }));
    });
    // when entered english button
    bot.action('english', ctx => {
        wikipedia_1.default.setLang('en');
        ctx.editMessageText('Enter a keyword');
        bot.on('message', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const message = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
            const chatId = (_b = ctx.chat) === null || _b === void 0 ? void 0 : _b.id;
            try {
                const page = yield wikipedia_1.default.page(`${message}`);
                const summary = yield page.summary();
                const contentUrl = (summary.content_urls.mobile.page).toLowerCase();
                return yield ctx.telegram.sendMessage(chatId, `${summary.extract} \n \n More: ${contentUrl}`);
            }
            catch (error) {
                yield ctx.reply('Article not found');
            }
        }));
    });
    // Run bot using polling
    bot.launch();
};
start();
