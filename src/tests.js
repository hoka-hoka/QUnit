QUnit.test('Тестирование асинхронного кода', function(assert) {
  let fixture = document.querySelector('#qunit-fixture');
  let element = fixture.firstElementChild;
  assert.expect(1);
  assert.ok(
    element.className === "promo",
    'ok'
  );
});