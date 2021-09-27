const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const sequelize = require('./db');
const UserModel = require('./models');

const token = '1977813599:AAHLugqimaeqnNagVf7Jo-5D3wYi6TYR0i0'

const bot = new TelegramApi(token, {polling: true})

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Зараз я загадаю цифру, а ти повинен вгадати`);
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Вгадай', gameOptions);
}

const start = async () => {

    try {
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (e) {
        console.log('Не має підключення до БД', e)
    }

    bot.setMyCommands([
        {command: '/start', description: 'Радо вітаємо!'},
        {command: '/info', description: 'Отримати інформацію про користувача'},
        {command: '/game', description: 'Гра вгадай цифру'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        try {
            if (text === '/start') {
                await UserModel.create({chatId})
                await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp')
                return bot.sendMessage(chatId, `Вітаємо! Ви у телеграм боті Іванни Дубаньовської, здорова спина й правильна осанка`);
            }
            if (text === '/info') {
                const user = await UserModel.findOne({chatId})
                return bot.sendMessage(chatId, `Вас звати ${msg.from.first_name} ${msg.from.last_name}, у Вас правильх відповідей ${user.right}, неправильных ${user.wrong}`);
            }
            if (text === '/game') {
                return startGame(chatId);
            }
            return bot.sendMessage(chatId, 'Нажаль,я Вас не розумію.Спробуйте еще раз!)');
        } catch (e) {
            return bot.sendMessage(chatId, 'Відбулась невідома помилка!)');
        }

    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId)
        }
        const user = await UserModel.findOne({chatId})
        if (data == chats[chatId]) {
            user.right += 1;
            await bot.sendMessage(chatId, `Вітаю, Ви вгадали цифру ${chats[chatId]}`, againOptions);
        } else {
            user.wrong += 1;
            await bot.sendMessage(chatId, `Нажаль, Ви не вгадали цифру, що загадав бот ${chats[chatId]}`, againOptions);
        }
        await user.save();
    })
}

start()
