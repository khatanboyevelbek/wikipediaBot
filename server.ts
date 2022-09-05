import dotenv from "dotenv";
dotenv.config();
import {Telegraf, Markup, Composer} from "telegraf";
import wikipedia from "wikipedia";
const token = (process.env.TOKEN) as string;
const bot = new Telegraf(token);

const start = () => {
    // Keyboards
    const keyboards = Markup.inlineKeyboard([
        Markup.callbackButton('🇺🇿 Uzbek', 'uzbek'),
        Markup.callbackButton(' 🇷🇺 Russian', 'russian'),
        Markup.callbackButton('🇺🇸 English', 'english')
    ]);
    // Start bot
    bot.start(async ctx => {
        const firstName = ctx.from?.first_name as string;
        return await ctx.reply(`Welcome ${firstName}. Enter some keyword to find out more about that \n Choose a language`, {
            reply_markup: keyboards
        });
    });
    // Change a language 
    bot.command('language', async ctx => {
        return await ctx.reply('Change a language', {
            reply_markup: keyboards
        });
    })
    // Bot info
    bot.command('info', async ctx => {
        return await ctx.reply(`This bot was created by Elbek Khatanboyev. If you find out bot errors, please reach me out. @Elbek_Egamberdiyevich`);
    });
    // Entered uzbek button
    bot.action('uzbek', async ctx => {
        ctx.editMessageText('O\'zbekcha so\'z kiriting:');
        await wikipedia.setLang('uz');
        bot.on('message', async ctx => {
            const message = ctx.message?.text as string;
            const chatId = ctx.chat?.id as number;
            try {
                const page = await wikipedia.page(`${message}`);
                const summary = await page.summary();
                const contentUrl = (summary.content_urls.mobile.page).toLowerCase();
                return await ctx.telegram.sendMessage(chatId, `${summary.extract} \n \n Batafsil: ${contentUrl}`);
            } catch (error) {
                await ctx.reply('Bu mavzuga oid maqola topilmadi');
            }
        })
    });
     // Entered russian button
    bot.action('russian', async ctx => {
        ctx.editMessageText('Bведите русское слово');
        await wikipedia.setLang('ru');
        bot.on('message', async ctx => {
            const message = ctx.message?.text as string;
            const chatId = ctx.chat?.id as number;
            try {
                const page = await wikipedia.page(`${message}`);
                const summary = await page.summary();
                const contentUrl = (summary.content_urls.mobile.page).toLowerCase();
                return await ctx.telegram.sendMessage(chatId, `${summary.extract} \n \n подробнoe: ${contentUrl}`);
            } catch (error) {
                await ctx.reply('Статья не найдена');
            }
        })
    });
    // Entered english button
    bot.action('english', async ctx => {
        ctx.editMessageText('Enter a keyword');
        await wikipedia.setLang('en');
        bot.on('message', async ctx => {
            const message = ctx.message?.text as string;
            const chatId = ctx.chat?.id as number;
            try {
                const page = await wikipedia.page(`${message}`);
                const summary = await page.summary();
                const contentUrl = (summary.content_urls.mobile.page).toLowerCase();
                return await ctx.telegram.sendMessage(chatId, `${summary.extract} \n \n More: ${contentUrl}`);
            } catch (error) {
                await ctx.reply('Article not found');
            }
        });
    });
   // Run bot using polling
    bot.launch();
};
start();
