import { Telegraf, Markup, Context } from 'telegraf';
import axios, { AxiosError } from 'axios';
import { Update } from 'telegraf/types';
import * as Types from 'telegraf/types';
import dotenv from 'dotenv';
dotenv.config();

// Интерфейсы для типизации
interface UserState {
  state: string;
  email?: string;
  isAdmin?: boolean;
  step?: string;
  material_data?: any;
  material_id?: string;
}

interface BotContext extends Context {
  userData?: {
    token?: string;
    role?: string;
    email?: string;
  };
}

const userSessions = new Map<number, BotContext['userData']>();

// Конфигурация
const API_BASE_URL = 'http://localhost:4000';
const AUTH_URL = `${API_BASE_URL}/api/auth`;
const MATERIALS_URL = `${API_BASE_URL}/api/materials`;

// Состояния пользователей
const userStates: Record<number, UserState> = {};

// Инициализация бота


const bot = new Telegraf<BotContext>(process.env.TELEGRAM_BOT_TOKEN!);

// Класс для ошибок API
class APIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APIError';
  }
}

// Универсальный метод для запросов к API
async function makeApiRequest(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  token?: string,
  data?: any
): Promise<any> {
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  try {
    const response = await axios({
      method,
      url,
      data,
      headers,
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMsg = error.response?.data?.message || 'Unknown error';
      throw new APIError(`API Error ${error.response?.status}: ${errorMsg}`);
    }
    throw new APIError('Request failed');
  }
}

// Команда /start
bot.start(async (ctx) => {
  if (!ctx.from) return;

  let welcomeText = `Привет, ${ctx.from.first_name}!\n\nЯ бот для работы с учебными материалами.\n\nДоступные команды:\n/login - Войти в систему\n/register - Зарегистрироваться\n/materials - Просмотр учебных материалов\n`;

  if (ctx.userData?.token) {
    const role = ctx.userData.role || 'user';
    welcomeText += `\nВы вошли как ${role}. `;
    if (role === 'admin') {
      welcomeText += '\n/admin - Панель администратора';
    }
  }

  await ctx.reply(welcomeText);
});

// Команда /register
bot.command('register', (ctx) => {
  if (!ctx.from) return;

  userStates[ctx.from.id] = { state: 'awaiting_email_for_register' };
  return ctx.reply(
    'Введите ваш email для регистрации:',
    Markup.inlineKeyboard([Markup.button.callback('Отмена', 'cancel_operation')])
  );
});

// Команда /login
bot.command('login', (ctx) => {
  if (!ctx.from) return;

  userStates[ctx.from.id] = { state: 'awaiting_email_for_login' };
  return ctx.reply(
    'Введите ваш email для входа:',
    Markup.inlineKeyboard([Markup.button.callback('Отмена', 'cancel_operation')])
  );
});

// Команда /materials
bot.command('materials', async (ctx) => {
  try {
    const materials = await makeApiRequest('GET', MATERIALS_URL);
    
    if (!materials || materials.length === 0) {
      return ctx.reply('Нет доступных материалов.');
    }

    for (const material of materials) {
      // Форматируем даты
      const lectureDate = new Date(material.date).toLocaleDateString();
      const dueDate = new Date(material.homework_due).toLocaleDateString();
      
      // Создаем отформатированное сообщение с сохранением переносов строк
      const messageText = [
        `📚 Предмет: ${material.subject}`,
        `👨‍🏫 Преподаватель: ${material.lecturer}`,
        `📖 Тема: ${material.title}`,
        `📅 Дата лекции: ${lectureDate}`,
        '',
        `📝 Содержание:`,
        material.content.replace(/\\n/g, '\n'), 
        '',
        `📋 Домашнее задание:`,
        material.homework.replace(/\\n/g, '\n'), 
        `⏳ Срок сдачи: ${dueDate}`
      ].join('\n');

      const buttons = [];
      if (ctx.userData?.role === 'admin') {
        buttons.push([
          Markup.button.callback('✏️ Редактировать', `edit_${material.id}`),
          Markup.button.callback('🗑 Удалить', `delete_${material.id}`)
        ]);
      }

      await ctx.reply(messageText, {
        parse_mode: 'Markdown', // Для лучшего форматирования
        ...Markup.inlineKeyboard(buttons)
      });
    }
  } catch (error) {
    console.error('Error fetching materials:', error);
    await ctx.reply('Произошла ошибка при получении материалов.');
  }
});

// Команда /admin
bot.command('admin', async (ctx) => {
  if (!ctx.from) return;
  console.error('User role:', ctx.userData?.role);
  if (ctx.userData?.role !== 'admin') {
    return ctx.reply('У вас нет прав доступа к этой команде.');
  }
  
  return ctx.reply(
    'Панель администратора:',
    Markup.inlineKeyboard([
      [Markup.button.callback('➕ Добавить материал', 'add_material')],
      [Markup.button.callback('📋 Список материалов', 'list_materials')]
    ])
  );
});

// Обработчик текстовых сообщений
bot.on('text', async (ctx) => {
  if (!ctx.from) return;

  const userId = ctx.from.id;
  const userState = userStates[userId];
  const currentState = userState?.state;
  const text = ctx.message.text;

  if (!currentState) {
    return ctx.reply('Я не понимаю эту команду. Введите /start для списка команд.');
  }

  if (currentState === 'awaiting_email_for_register') {
  // Базовая проверка email
  if (!text.includes('@') || !text.includes('.')) {
    return ctx.reply('❌ Неверный формат email. Попробуйте снова:');
  }

  userStates[userId] = {
    state: 'awaiting_password_for_register',
    email: text,
    isAdmin: text.startsWith('admin@') // Определяем роль по префиксу email
  };
  return ctx.reply('Введите пароль для регистрации:');
}

if (currentState === 'awaiting_password_for_register') {
  const email = userState.email;
  const password = text;
  const isAdmin = userState.isAdmin; // Получаем флаг админа

  try {
    // Отправляем запрос с автоматически определенной ролью
    const response = await makeApiRequest('POST', `${AUTH_URL}/register`, undefined, {
      email,
      password,
      role: isAdmin ? 'admin' : 'user' // Автоматическое назначение роли
    });

    if (isAdmin) {
      await ctx.replyWithMarkdown(`
      🎉 *Вы зарегистрированы как АДМИНИСТРАТОР!*
      
      Теперь войдите в систему /login 

      Ваши привилегии:
      • Доступ к панели /admin
      • Управление учебными материалами
      • Редактирование контента
      `);
    } else {
      await ctx.reply('✅ Вы успешно зарегистрированы как пользователь');
    }
  } catch (error) {
    console.error('Registration error:', error);
    await ctx.reply('❌ Ошибка регистрации: ');
  } finally {
    delete userStates[userId];
  }
}

  if (currentState === 'awaiting_email_for_login') {
    userStates[userId] = {
      state: 'awaiting_password_for_login',
      email: text,
    };
    return ctx.reply('Введите пароль:');
  }

  if (currentState === 'awaiting_password_for_login') {
    const email = userState.email;
    const password = text;

    try {
      const response = await makeApiRequest('POST', `${AUTH_URL}/login`, undefined, {
        email,
        password,
      });

      if (!ctx.userData) ctx.userData = {};
      ctx.userData.token = response.token;
      ctx.userData.role = response.role || 'user';
      ctx.userData.email = email;
      let answText =`Вход успешен! Ваша роль: ${ctx.userData.role}\n` +
        'Теперь вы можете просматривать материалы с помощью /materials';
      if (ctx.userData.role=== 'admin'){
        answText += '\n/admin - Панель администратора';
      }
      return ctx.reply(
        answText
      );
    } catch (error) {
      console.error('Login error:', error);
      return ctx.reply('Ошибка входа. Проверьте email и пароль.');
    } finally {
      delete userStates[userId];
    }
  }

  if (currentState === 'adding_material') {
    const step = userState.step;
    const materialData = userState.material_data || {};

    if (step === 'subject') {
      materialData.subject = text;
      userStates[userId].step = 'lecturer';
      userStates[userId].material_data = materialData;
      return ctx.reply('Введите ФИО преподавателя:');
    }

    if (step === 'lecturer') {
      materialData.lecturer = text;
      userStates[userId].step = 'title';
      return ctx.reply('Введите название лекции:');
    }

    if (step === 'title') {
      materialData.title = text;
      userStates[userId].step = 'content';
      return ctx.reply('Введите текст лекции:');
    }

    if (step === 'content') {
      materialData.content = text;
      userStates[userId].step = 'homework';
      return ctx.reply('Введите домашнее задание:');
    }

    if (step === 'homework') {
      materialData.homework = text;
      userStates[userId].step = 'date';
      return ctx.reply('Введите дату лекции (в формате ГГГГ-ММ-ДД):');
    }

    if (step === 'date') {
      materialData.date = text;
      userStates[userId].step = 'homework_due';
      return ctx.reply('Введите срок сдачи ДЗ (в формате ГГГГ-ММ-ДД):');
    }

    if (step === 'homework_due') {
      materialData.homework_due = text;

      try {
        if (!ctx.userData?.token) {
          throw new APIError('Необходимо войти в систему');
        }

        await makeApiRequest('POST', MATERIALS_URL, ctx.userData.token, materialData);
        return ctx.reply('Материал успешно добавлен!');
      } catch (error) {
        console.error('Error adding material:', error);
        return ctx.reply('Произошла ошибка при добавлении материала.');
      } finally {
        delete userStates[userId];
      }
    }
  }

  if (currentState === 'editing_material') {
    const step = userState.step;
    const materialId = userState.material_id;
    const materialData = userState.material_data || {};

    if (step === 'subject' && text !== '-') {
      materialData.subject = text;
    }

    if (step === 'subject') {
      userStates[userId].step = 'lecturer';
      return ctx.reply(
        `Текущее ФИО преподавателя: ${materialData.lecturer}\n` +
        'Введите новое ФИО или отправьте "-" чтобы оставить без изменений:'
      );
    }

    if (step === 'lecturer' && text !== '-') {
      materialData.lecturer = text;
    }

    if (step === 'lecturer') {
      userStates[userId].step = 'title';
      return ctx.reply(
        `Текущее название лекции: ${materialData.title}\n` +
        'Введите новое название или отправьте "-" чтобы оставить без изменений:'
      );
    }

    if (step === 'title' && text !== '-') {
      materialData.title = text;
    }

    if (step === 'title') {
      userStates[userId].step = 'content';
      return ctx.reply(
        `Текущий текст лекции: ${materialData.content}\n` +
        'Введите новый текст или отправьте "-" чтобы оставить без изменений:'
      );
    }

    if (step === 'content' && text !== '-') {
      materialData.content = text;
    }

    if (step === 'content') {
      userStates[userId].step = 'homework';
      return ctx.reply(
        `Текущее домашнее задание: ${materialData.homework}\n` +
        'Введите новое задание или отправьте "-" чтобы оставить без изменений:'
      );
    }

    if (step === 'homework' && text !== '-') {
      materialData.homework = text;
    }

    if (step === 'homework') {
      userStates[userId].step = 'date';
      return ctx.reply(
        `Текущая дата лекции: ${materialData.date}\n` +
        'Введите новую дату (ГГГГ-ММ-ДД) или отправьте "-" чтобы оставить без изменений:'
      );
    }

    if (step === 'date' && text !== '-') {
      materialData.date = text;
    }

    if (step === 'date') {
      userStates[userId].step = 'homework_due';
      return ctx.reply(
        `Текущий срок сдачи ДЗ: ${materialData.homework_due}\n` +
        'Введите новый срок (ГГГГ-ММ-ДД) или отправьте "-" чтобы оставить без изменений:'
      );
    }

    if (step === 'homework_due') {
      if (text !== '-') {
        materialData.homework_due = text;
      }

      try {
        if (!ctx.userData?.token) {
          throw new APIError('Необходимо войти в систему');
        }

        await makeApiRequest(
          'PUT',
          `${MATERIALS_URL}/${materialId}`,
          ctx.userData.token,
          materialData
        );
        return ctx.reply('Материал успешно обновлен!');
      } catch (error) {
        console.error('Error updating material:', error);
        return ctx.reply('Произошла ошибка при обновлении материала.');
      } finally {
        delete userStates[userId];
      }
    }
  }
});

// Обработчик callback-запросов
bot.action(/.*/, async (ctx) => {
  if (!ctx.from || !ctx.match) return;

  const data = ctx.match[0];
  
  if (data === 'cancel_operation') {
    delete userStates[ctx.from.id];
    return ctx.editMessageText('Операция отменена.');
  }

  if (data === 'add_material') {
    return addMaterialStart(ctx);
  }

  if (data === 'list_materials') {
    return ctx.editMessageText('Используйте команду /materials для просмотра материалов');
  }

  if (data.startsWith('edit_')) {
    const materialId = data.split('_')[1];
    return editMaterialStart(ctx, materialId);
  }

  if (data.startsWith('delete_')) {
    const materialId = data.split('_')[1];
    return deleteMaterial(ctx, materialId);
  }
});

// Запуск бота
bot.launch().then(() => {
  console.log('Bot started');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Вспомогательные функции
async function addMaterialStart(ctx: BotContext) {
  if (!ctx.from) return;
  if (ctx.userData?.role !== 'admin') {
    return ctx.editMessageText('У вас нет прав доступа к этой команде.');
  }

  userStates[ctx.from.id] = {
    state: 'adding_material',
    step: 'subject',
    material_data: {},
  };

  return ctx.editMessageText('Введите название предмета:');
}

async function editMaterialStart(ctx: BotContext, materialId: string) {
  if (!ctx.from) return;

  try {
    const material = await makeApiRequest('GET', `${MATERIALS_URL}/${materialId}`);
    
    userStates[ctx.from.id] = {
      state: 'editing_material',
      material_id: materialId,
      material_data: material,
      step: 'subject',
    };

    return ctx.editMessageText(
      `Редактирование материала. Текущее название предмета: ${material.subject}\n` +
      'Введите новое название предмета или отправьте "-" чтобы оставить без изменений:'
    );
  } catch (error) {
    console.error('Error fetching material:', error);
    return ctx.editMessageText('Произошла ошибка при получении материала.');
  }
}

async function deleteMaterial(ctx: BotContext, materialId: string) {
  if (!ctx.from) return;

  try {
    if (!ctx.userData?.token) {
      throw new APIError('Необходимо войти в систему');
    }

    await makeApiRequest(
      'DELETE',
      `${MATERIALS_URL}/${materialId}`,
      ctx.userData.token
    );
    return ctx.editMessageText('Материал успешно удален!');
  } catch (error) {
    console.error('Error deleting material:', error);
    return ctx.editMessageText('Произошла ошибка при удалении материала.');
  }
}