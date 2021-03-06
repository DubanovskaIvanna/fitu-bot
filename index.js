const TelegramApi = require('node-telegram-bot-api')
const sequelize = require('./db');
const UserModel = require('./models/UserModels');
const QuestionModel = require('./models/QuestionModels');
const ExerciseModel = require('./models/ExerciseModels');
require('dotenv').config();

const token = '1977813599:AAHLugqimaeqnNagVf7Jo-5D3wYi6TYR0i0'

const bot = new TelegramApi(token, {polling: true})

const findUser = async (chatId) => {
    return UserModel.findOne({where: {ChatId: chatId}});
}

const SendExercise = async(chatId, ID) => {
    const exercise = await ExerciseModel.findOne({where: {ID}});
    if (exercise.Exercise != null) {
        await bot.sendMessage(chatId, exercise.Exercise);
    }
    if (exercise.ImageURL != null) {
        const url = MakeSASURL(exercise.ImageURL);
        await bot.sendAnimation(chatId, url, {caption: "Cхема"});
    }

}
const updateUserData = async (chatId, Identity) => {
    const user = await findUser(chatId)
    const question = await QuestionModel.findOne({where: {Identity}});

    if (question.TypeOfSet != null) user.TypeOfSet = question.TypeOfSet;
    if (question.AdditionSet != null) user.AdditionSet = question.AdditionSet;
    if (question.WorkType != null) user.WorkType = question.WorkType;
    if (question.AgeRange != null) user.AgeRange = question.AgeRange;
    if (question.Intensity != null) user.Intensity = question.Intensity;
    if (question.Iterations != null) user.Iterations = question.Iterations;
    if (question.Sex != null) user.Sex = question.Sex;
    if (question.Times != null) user.Times = question.Times;
    if (question.ImageURL != null) user.ImageURL = question.ImageURL;
    if (question.SpineDepartment != null) user.SpineDepartment = question.SpineDepartment;


    user.LastQuestionId = question.Identity;
    
    await user.save();
    return question.ID;
}

const dropUserData = async (chatId) => {
    const user = await findUser(chatId)

    user.TypeOfSet = null;
    user.AdditionSet = null;
    user.WorkType = null;
    user.AgeRange = null;
    user.Intensity = null;
    user.Iterations = null;
    user.Sex = null;
    user.Times = null;
    user.ImageURL = null;
    user.SpineDepartment = null;
    user.LastQuestionId =  null;
    
    return user.save();
} 

const buildOptions = (questions) => {
    return { 
        reply_markup: JSON.stringify({
            inline_keyboard: buildQuestions(questions)
        })
    }
}
const buildQuestions = (questions) => {
    let options = [];
    for(let i = 0; i< questions.length; i++) {
        let lineoptions = [];
        lineoptions.push({text: questions[i].Question, callback_data: questions[i].Identity});
        options.push(lineoptions);
    }
    return options;
}

const MakeSASURL = (ImageUrl) => {
    return ImageUrl + '?' + process.env.SA_SAS.toString();
}

const showQuestion = async (chatId, ParentID) => {
    const question = await QuestionModel.findOne({where: {ParentID: ParentID}})
    if (question == null) {
        return showLastQuestion(chatId);
    }

    const questions = await QuestionModel.findAll({
        where: {
            ParentID : question.ID
        }
    });
    if (questions.length === 0) {        
        await updateUserData(chatId, question.Identity);
        return showLastQuestion(chatId);
    } else {
        const options = buildOptions(questions);
        if (question.ImageURL != null) {
            const url = MakeSASURL(question.ImageURL);
            await bot.sendPhoto(chatId, url, {caption: "Cхема"});
        }
        return bot.sendMessage(chatId, question.Question, options);        
    }    
}

const buildQuestionMessage = (question, user) => {
    let Sex = 'Sex';
    let AgeRange = 'AgeRange';
    let TypeOfSet = 'TypeOfSet';    
    let AdditionSet = 'AdditionSet';
    let Iterations = 'Iterations';
    let SpineDepartment = 'SpineDepartment';
    let Intensity = 'Intensity';
    let WorkType = 'WorkType';
    let Times = 'Times';
    return question.replace(Sex, user.Sex)
    .replace(AgeRange, user.AgeRange)
    .replace(TypeOfSet, user.TypeOfSet)
    .replace(AdditionSet, user.AdditionSet)
    .replace(Iterations, user.Iterations)
    .replace(SpineDepartment, user.SpineDepartment)
    .replace(WorkType, user.WorkType)
    .replace(Times, user.Times)
    .replace(Intensity, user.Intensity);
}

const showLastQuestion = async (chatId) => {
    const user = await findUser(chatId);
    const Identity  = user.LastQuestionId;
    const question = await QuestionModel.findOne({where: {Identity}})
    const message = buildQuestionMessage(question.Question, user);
    await bot.sendMessage(chatId, message);
    if (user.TypeOfSet != null) {
        await SendExercise(chatId, user.TypeOfSet);
    }
    if (user.AdditionSet != null) {
        await SendExercise(chatId, user.AdditionSet );
    }
}


const start = async () => {

    try {
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (e) {
        console.log('Не має підключення до БД', e)
    }

    await bot.setMyCommands([
        {command: '/start', description: 'Радо вітаємо!'},
        {command: '/continue', description: 'Бажаєте продовжити опитування?'},
        {command: '/info', description: 'Отримати інформацію про користувача'}
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        try {
            if (text === '/start') {                
                const user = await findUser(chatId);
                if (user === null) {
                    await UserModel.create({ChatId: chatId});                
                } else {
                    await dropUserData(chatId);
                }
                await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp');
                await bot.sendMessage(chatId, `Вітаємо! Ви у телеграм боті Іванни Дубаньовської, здорова спина й правильна осанка`);
                return showQuestion(chatId, null);
            }
            if (text === '/continue') {
                const user = await findUser(chatId);
                if (user === null)
                    return bot.sendMessage(chatId, 'Вибачте. Ви поки-що ще не проходили оитування і мені нічого показати.');
                
                const Identity  = user.LastQuestionId;
                if (Identity === null) {
                    return showQuestion(chatId, null);
                }
                const question = await QuestionModel.findOne({where: {Identity}})
                const ID = question.ID;
                return showQuestion(chatId, ID);
            }
            if (text === '/info') {
                const user = await findUser(chatId);
                if (user === null ||  user.LastQuestionId === null)
                    return bot.sendMessage(chatId, 'Вибачте. Ви поки-що ще не проходили оитування і мені нічого показати.');

                return showLastQuestion(chatId);
            }
            return bot.sendMessage(chatId, 'Нажаль,я Вас не розумію.Спробуйте еще раз!)');
        } catch (e) {
            return bot.sendMessage(chatId, 'Відбулась невідома помилка!)');
        }

    })

    bot.on('callback_query', async msg => {
        try {
            const Identity = parseInt(msg.data);
            const chatId = msg.message.chat.id;
            
            const ID = await updateUserData(chatId, Identity);
            return showQuestion(chatId, ID);
        } catch (e) {
            return bot.sendMessage(chatId, 'Відбулась невідома помилка!)');
        }
    })
}

start()
