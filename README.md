[//]: # (# = h1)
[//]: # (`...` = code)
[//]: # (> = цитата)
[//]: # (*,-,+ Ненумерованный список)
# Тестирование с QUnit

### Установка
Создание проекта
```npm i```

Установка фреймворка
```npm install --save-dev qunit```

### Настройка QUnit
1. Перенести файлы модуля теста (qunit.js) и стили фреймворка (style.css) из node_modules/qunit/... в папку с проектом и подключить их.
2. Добавить <div id = "qunit"></div>div> для вывода тестов и <div id="qunit-fixture"></div>
3. Открыть index.html.

Если установлен первый флажок, то QUnit будет скрывать успешные тесты.
Второй флаг проверяет было ли добавлено новой свойство в объект window, сравнивая его до и после каждого теста.
Последний флажок используется для проверки, выбрасывает ли код исключение, когда команда тестирования запускаестя вне try-catch.

В самом низу отображается время, затраченное на совершение теста

Перед запуском нужно добавить тестируемый js файл, а также файл с тестами.

`<script src="code.js"></script>
<script src="qunit.js"></script>
<script src="tests.js"></script>`

### Создание тестов

QUnit.test(name, test) - добавляет тест для запуска.

`QUnit.test('Мой первый тест', funciton(assert) {
  ...
})`
assert предоставляет все методы утверждения.

При создании тестов создаются утверждения, которые нужно выполнить с помощью метода параметра assert.
expect(total) - создаёт утверждения, где total есть количество утверждений, которые нужно выполнить.

`QUnit.test('Мой первый тест', function(assert) {
  assert.expect(0);
})`

### Тестирование кода при помощи утверждений

* equal(value, expected[, message]) - проверяет равенство параметра value параметру expected, используя нестрогое сравнение (==).
* strictEqual(value, expected[, message]) - осуществляет строгое сравнение.
* notEqual - отрицание equal;
* notStrictEqual - отрицание notStrictEqual;

`function sum(a, b) {
  return a + b;
}`
Теперь, например, нужно проверить её работоспособность.
`QUnit.test('Мой первый тест', function(assert) {
  assert.expect(2);
  assert.equal(sum(2,2), 4, 'Сумма двух положительны чисел');
  assert.equal(sum(-2,-2), -4, 'Сумма двух отрицательных чисел');
})`

ok(value[, message]) - утверждение проходит, если первый аргумент истинный.
`assert.ok(isEven(4), '4 - чётное число');`

deepEqual - рекурсивное строгое сравнение value и expected. Успешно, если value === expected, а также общий прототип.
notDeepEqual - отрицание deepEqual.
propEqual - рекурсивное строгое сравнение value и expected. Успешно, если value === expected, но могут быть разные прототипы.
notPropEqual - отрицание propEqual.

Например:
`function Person(fullName) {
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
`

### Тестирование асинхранных задач

async() - инструктирует QUnit ждать завершения асинхранных операций

`
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
`
Если не ввыполнить функцию assert.async(), то модуль запуска теста будет неопределённое время ждать вызова функции, блокируя тем самым прохождение всех остальных тестов.