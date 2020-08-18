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