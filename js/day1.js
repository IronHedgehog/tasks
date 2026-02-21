// 1. Promise.all (Асинхронний менеджер)

// Стартові дані:

// JavaScript
const fetchProduct = (id) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      id > 0 ? res(`Товар ${id}`) : rej("Помилка ID");
    }, 1000);
  });
};

const productIds = [10, 20, 30];
// Завдання: Напиши функцію getAllProducts(ids), яка завантажить усі товари одночасно і виведе масив результатів у консоль. Використовуй try/catch.

const getAllProducts = async (ids) => {
  try {
    const promises = ids.map((id) => fetchProduct(id));
    const results = await Promise.all(promises);

    console.log(results);
  } catch (error) {
    throw new Error(error.message);
  }
};

// 2. Контекст (this)

// Стартові дані:

// JavaScript;
const laptop = {
  brand: "MacBook",
  showBrandDelayed: function () {
    setTimeout(
      // function () {
      //   console.log(this.brand);
      // }.bind(this),
      () => {
        console.log(this.brand);
      },
      1000,
    );
  },
};
// Завдання: Виправ функцію так, щоб вона вивела "MacBook" через секунду. Напиши два варіанти рішення: через .bind() та через стрілочну функцію.
laptop.showBrandDelayed();

// 3. Memoize (Кешування)

// Стартові дані:

// JavaScript;
function createMultiplier(factor) {
  // Тут має бути твій кеш (об'єкт)
  const cash = {};
  return function (num) {
    if (num in cash) {
      console.log(cash);
      return cash[num];
    } else {
      const result = num * factor;
      cash[num] = result;
      console.log(result);
      return result;
    }
    // Якщо результат вже є в кеші — поверни його
    // Якщо немає — порахуй, збережи і поверни
  };
}
// Завдання: Реалізуй логіку, щоб при повторному виклику з тим самим числом функція не множила, а брала готове значення.
const multiplyBy5 = createMultiplier(5);
console.log(multiplyBy5(5));
console.log(multiplyBy5(5));

// 4. GroupBy (Штрафна: Групування)

// Стартові дані:

// JavaScript
const users = [
  { name: "Олексій", role: "admin" },
  { name: "Марія", role: "user" },
  { name: "Іван", role: "admin" },
  { name: "Дарина", role: "user" },
];
// Завдання: Напиши функцію groupByRole(arr), яка перетворить цей масив на об'єкт типу: { admin: ['Олексій', 'Іван'], user: ['Марія', 'Дарина'] }.

const groupByRole = (arr) => {
  const result = {};
  for (const user of arr) {
    const role = user.role;
    const name = user.name;
    if (role in result) {
      result[role].push(user.name);
    } else {
      result[role] = [name];
    }
  }
  return result;
};

console.log(groupByRole(users));

// 5. Deep Flatten (Штрафна: Рекурсія)

// Стартові дані:

// JavaScript
const nestedArray = [1, [2, [3, [4]], 5]];
// Завдання: Напиши функцію flatten(arr), яка зробить цей масив плоским: [1, 2, 3, 4, 5].
// Підказка: використовуй рекурсію або перевірку Array.isArray().

const flatten = (arr) => {
  let result = [];
  for (const num of arr) {
    if (Array.isArray(num)) {
      const flatChild = flatten(num);
      console.log(flatChild);
      result = result.concat(flatChild);
    } else {
      result.push(num);
    }
  }
  // return arr.flat(Infinity);
  return result;
};
console.log(flatten(nestedArray));

// 1. Головна ідея: "Матрьошка"

// Кожного разу, коли функція зустрічає масив (Array.isArray(num)), вона не намагається розібрати його циклами. Вона каже: "О, масив! Я вже вмію розбирати масиви, я ж функція flatten. Викличу-ка я саму себе для цього масиву!"

// 2. Покроковий розбір коду

// Етап А: Проста перевірка

// JavaScript
// for (const num of arr) {
//   if (Array.isArray(num)) {
//     // ... якщо це масив, занурюємося глибше
//   } else {
//     result.push(num); // якщо це число, просто кладемо в результат
//   }
// }
// Тут усе просто: якщо ми бачимо число 1, воно одразу потрапляє в result.

// Етап Б: Рекурсивний стрибок

// Коли ми доходимо до [2, [3]]:

// Викликається flatten([2, [3]]).

// Всередині цього виклику створюється свій власний локальний масив result.

// Число 2 йде в цей локальний result.

// Далі знову масив [3]? Знову викликаємо flatten([3]).

// Тепер ми на самому дні. flatten([3]) бачить число 3, кладе його в свій result і повертає масив [3].

// Етап В: Збирання результатів (Concat)

// JavaScript
// const flatChild = flatten(num);
// result = result.concat(flatChild);
// Коли функція "повертається" з глибини, вона приносить із собою "плаский" масив. Метод concat бере цей масив і "склеює" його з нашим поточним результатом.

// Було: [1]

// Прийшло з рекурсії: [2, 3]

// Стало: [1, 2, 3]

// 3. Візуалізація процесу

// Уяви це як занурення в океан:

// Поверхня: Бачимо 1 (беремо) і масив (пірнаємо).

// Глибина 1 метр: Бачимо 2 (беремо) і масив (пірнаємо глибше).

// Глибина 2 метри: Бачимо 3 (беремо). Масивів більше немає.

// Підйом: Повертаємося на глибину 1 метр із числом 3, віддаємо його "верхній" функції. Потім спливаємо на поверхню і віддаємо все, що назбирали.

// 4. Чому result = result.concat(flatChild)?

// Це важливо, тому що concat не змінює старий масив, а створює новий. Якби ти просто написав result.push(flatChild), ти б отримав [1, [2, 3]] (масив у масиві), а concat ніби "знімає обгортку" з масиву, який повернула рекурсія.

// Що далі?

// Ти щойно опанував одну з найскладніших тем — рекурсію. Тепер ти розумієш, як працює метод .flat(Infinity) "під капотом".

// 6. Debounce (Штрафна: Оптимізація)

// Стартові дані:

// JavaScript
function logData(text) {
  console.log("Запис у базу:", text);
}

// Твоя реалізація:
function debounce(fn, delay) {
  let timeoutId;

  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

const debouncedLog = debounce(logData, 2000);
// Завдання: Реалізуй функцію debounce. Вона має відкладати виконання logData. Якщо викликати debouncedLog тричі поспіль, спрацювати має лише останній виклик через 2 секунди після останнього кліку.
