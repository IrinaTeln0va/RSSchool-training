function checkResponseStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.json();
  }

  if (response.status === 403 || response.status === 401) {
    throw new Error('Status 401. Try another API key');
  }

  throw new Error(`Server error: ${response.status} ${response.statusText}`);
}

test('should return value if response status OK', () => {
  expect(checkResponseStatus({ json: () => 'DataString', status: '200' })).toEqual('DataString');
});

test('should handle broken api key error', () => {
  expect(() => {
    checkResponseStatus({ json: () => 'DataString', status: 403 });
  }).toThrowError(new Error('Status 401. Try another API key'));
});

test('should throw error if unknown responce status', () => {
  expect(() => {
    checkResponseStatus({ json: () => 'DataString', status: 500 });
  }).toThrow();
});