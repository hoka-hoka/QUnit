# Тестирование с QUnit
### Содержание
1. [Установка](#Установка-QUnit)
2. [Настройка](#Настройка-QUnit)
3. [Создание тестов](#Создание-тестов)
4. [Утверждения](#Утверждения)
5. [Асинхронные задачи](#Асинхронные-задачи)

1. [Тестирование из командной строки](#Тестирование-из-командной-строки)
2. [Статистика покрытия тестов](#Статистика-покрытия-тестов)
3. [Travis CI](#Travis-CI)
4. [Codecov](#Codecov)

### Установка QUnit
Создание проекта
`npm i`

Установка фреймворка
`npm install --save-dev qunit`

### Настройка QUnit
1. Перенести файлы модуля теста (qunit.js) и стили фреймворка (style.css) из node_modules/qunit/... в папку с проектом и подключить их.
2. Добавить <div id = "qunit"></div>div> для вывода тестов и <div id="qunit-fixture"></div>
3. Открыть index.html.

Если установлен первый флажок, то QUnit будет скрывать успешные тесты.
Второй флаг проверяет было ли добавлено новой свойство в объект window, сравнивая его до и после каждого теста.
Последний флажок используется для проверки, выбрасывает ли код исключение, когда команда тестирования запускаестя вне try-catch.

В самом низу отображается время, затраченное на совершение теста

Перед запуском нужно добавить тестируемый js файл, а также файл с тестами.

```
<script src="code.js"></script>
<script src="qunit.js"></script>
<script src="tests.js"></script>
```

### Создание тестов

QUnit.test(name, test) - добавляет тест для запуска.

`QUnit.test('Мой первый тест', funciton(assert) { ... })`
assert предоставляет все методы утверждения.

При создании тестов создаются утверждения, которые нужно выполнить с помощью метода параметра assert.
expect(total) - создаёт утверждения, где total есть количество утверждений, которые нужно выполнить.

`QUnit.test('Мой первый тест', function(assert) { assert.expect(0); })`

### Утверждения

* equal(value, expected[, message]) - проверяет равенство параметра value параметру expected, используя нестрогое сравнение (==).
* strictEqual(value, expected[, message]) - осуществляет строгое сравнение.
* notEqual - отрицание equal;
* notStrictEqual - отрицание notStrictEqual;

```
function sum(a, b) {
  return a + b;
}
```
Теперь, например, нужно проверить её работоспособность.
```
QUnit.test('Мой первый тест', function(assert) {
  assert.expect(2);
  assert.equal(sum(2,2), 4, 'Сумма двух положительны чисел');
  assert.equal(sum(-2,-2), -4, 'Сумма двух отрицательных чисел');
})
```

```
ok(value[, message])` - утверждение проходит, если первый аргумент истинный.
`assert.ok(
  isEven(4), 
  '4 - чётное число');
```

* deepEqual - рекурсивное строгое сравнение value и expected. Успешно, если value === expected, а также общий прототип.
* notDeepEqual - отрицание deepEqual.
* propEqual - рекурсивное строгое сравнение value и expected. Успешно, если value === expected, но могут быть разные прототипы.
* notPropEqual - отрицание propEqual.

Например:
```
function Person(fullName) {
  this.fullName = fullName;
}
var human = {
  fullName: null,
}
QUnit.test('Тестирование propEqual() и deepEqual()', function(assert) {
  assert.expect(2);
  var person = new Person('Vasia');
  human.fullName = 'Vasia';
  assert.propEqual(person, human, 'Тест пройден');
  assert.deepEqual(person, human, 'Ошибка');
});
```

### Асинхронные задачи

async() - инструктирует QUnit ждать завершения асинхранных операций

```
function isEven(number) {
  return number % 2 === 0;
}
QUnit.test('Тестирование асинхронного кода',
  function(assets) {
    var $fixtures = $('#quinit-fixture');
    assert.expect(4);
    assert.strictEqual(
      $fixtures.children().lenght, 0, 'Потоков qunit-fixtures 0'
    );
    var firstCallback = assert.async();
    window.setTimeout(function() {
      assert.ok(isEven(4), '4 - четное число');
      firstCallback();
    }, 500);
    var secondCallback = assert.async();
    $fixtures.load('test.1.html #qunit', function() {
      assert.ok(true, 'Файл test.1.html успешно загружен');
      assert.strictEqual(
        $fixtures.children().lenght, 1, 'Элементов, присоединённых к qunit-fixtures, 1'
      );
      secondCallback();
    });
  }
);
```
Если не ввыполнить функцию assert.async(), то модуль запуска теста будет неопределённое время ждать вызова функции, блокируя тем самым прохождение всех остальных тестов.

### Тестирование из командной строки

`npm install -g qunit`
Теперь станет доступным интерфейс командной строки qunit -h.
При выполнениие команды qunit будет ошибка, так как тестовый код не знает о функционале основного. Для этого их нужно объединить.

Например, есть функция, которую мы хотим протестировать

Подключаем её к test.js
```
if  ( typeof(require) !== 'undefined' )  {
   isEven = require('./code.js').isEven;
}
```
Помимо импорта нужно экспортировать нужные функции из index.js:
```
function isEven(number) {
  return number % 2 === 0;
}
if (typeof module !== 'undefined' && module.exports) {
  exports.isEven = isEven;
}
```
Создадим задачу в package.json:
```
"scripts": {
  "test": "qunit \"src/tests.js\""
}
```
При тестировании через командную строку html файл будет недоступен, а тесты по работе с DOM не выполнятся. Для решения этой проблемы можно воспользоваться браузером для командной строки (безголовым браузером) PhantomJS, но тк как он имеет плохую поддержку и не работает с кодом ES6, лучше использовать node-qunit-puppeteer.

`npm install node-qunit-puppeteer --save-dev` - локально

Затем нужно создать файл с настройками плагина, где указывается обрабатываемый html, а также параметры (находится в src).
После чего можно добавить сценарий запуска:
```
"scripts": {
  "test": "node ./src/fileConfig.js"
}
```
### Статистика покрытия тестов

Покрытие кода тестами или Code Coverage собирает статистику о глубине тестирования.

На портале QUnit есть свои js-плагины, например:
* node-qunit-puppeteer - для тестирования DOM с использованием браузера Хромиума и вывода результата в командную строку.
* qunit-puppeteer-reporter - тот же, что и node-qunit-puppeteer, но выдаёт гораздо меньше информации.
* qunit-reporter-lcov - создаёт отчеты о тестировании в формате lcov для интегрирования в другие системы для анализа.
qunit-reporter-lcov у меня не заработал, поэтому я использовал альтернативу в виде плагина nyk (Noo-York), но есть ещё istanbul.
`npm isntall --save-dev nyc`
У плагина много настроект, которые записываются либо в его конфигурационный файл, либо в package.json.
```
"scripts": {
  "test": "node ./src/phant.js",
  "coverage": "nyc npm run test"
},
```
После выполнения в корне создаётся папка .nyc_output с необработанной информацией о покрытии, результаты покрытия выводятся в командной строке в виде таблицы.
Также флагом --reporter можно установить формат вывода отчётов, а словом report указать, что их несколько, например:
`nyc report --reporter=lcov --reporter=text-lcov`

### Travis CI

Travis CI - распределённый веб-сервис для сборки и тестирования программного обеспечения, использующий gitHub в качестве хостинга исходного кода.

Сперва нужно зайти на сервис, авторизироваться через gitHub. Затем создать файл .travis.yml.
В файле настроек узказывается то, что должно выполнится на удалённой машине, а именно: установка сбощика, притягивание зависимостей, а также в script записываем то, что нужно выполнить для развёртывания приложения, обычно это `npm run build`.
Travis сам найдёт твои тесты плюс проведёт свои. Это он будет делать при каждом комите и при pull Request.

```
language: nodejs
env:
  SKIP_SASS_BINARY_DOWNLOAD_FOR_CI=true
node_js:
- '14'
- '13'
- '12'
before_script:
- npm install -g npm@'>=3'
script:
- npm run test
```
Далее делаем комит и отправляем в репозиторий. Заходим на Travis -> Dashboard и включаем Trigger a Build, если репозиторий не отслеживается.
Смотрим результаты тестирования. Там же можно и ссылку на значёк взять, а затем вставить в README, как:

```
![Build Status](https://travis-ci.com/hoka-hoka/Tests.svg?token=rPeHhNRUaxGqgNsvpyrM&branch=master)
```

### Codecov

Ещё одна непрерывная распределённая система интегрирования, задачей которой служит сборка и обработка тестовой информации о покрытии. На вход требует файл формата .icov (вроде, работает и с другими).
`npm install --save-dev codecov`
Далее переходим на сам сервис Codecov авторизируемся через gitHub, добавляем наш репозиторий.
После чего нужно передать информацию о покрытии на портал. Для этого система требует аутентификации, через токен, который можно найти при добавлении проекта, либо потом в настройках.

Перед передачей токена нужно создать отчёты и вывести их уже не в командную строку, а в файлы:
```
 "scripts": {
    "test": "node ./src/phant.js",
    "coverage": "nyc report --reporter=lcov --reporter=text-lcov > coverage.lcov && codecov"
  },
```
где `--reporter=text-lcov > coverage.lcov` создаёт отчет и выводит его в файл coverage.lcov в корень проекта.
Вообще для codecov есть флаг который принимает значение переменной окружения, в которой прописывается токен, но я не нашёл пока, как это сделать. В результате, запускать `npm range coverage` лучше без codecov, а иначе попросит токен, который не указан.

Далее, после того, как мы получили отчёты, для передачи токена нужно выполнить команду:
`./node_modules/.bin/codecov --token="12342-432..."`
acac013b-bd9b-47a9-a0e0-0158572826ad
После чего статистика отобразится на сайте в личном кабинете.
Чтобы добавить значёк, нужно вставить вот это:


```
[![Codecov Coverage](https://img.shields.io/codecov/c/github/<Github Username>/<Repository Name>/&lt;Branch Name>.svg?style=flat-square)](https://codecov.io/gh/<Github Username>/<Repository Name>/)
```

  Например

```
[![Known Vulnerabilities](https://snyk.io/test/github/hoka-hoka/multirange/badge.svg?targetFile=package.json)](https://snyk.io/test/github/hoka-hoka/multirange?targetFile=package.json)
```

  
