global.fetch = jest.fn();

fetch.mockResponseSuccess = body => {
  fetch.mockImplementation(() =>
    Promise.resolve(Object.assign(JSON.parse(body), {
      json: () => {
        return JSON.parse(body)
      }
    }))
  );
};

fetch.mockResponseFailure = error => {
  fetch.mockImplementation(() => Promise.reject(error));
};

fetch.mockErrorStatusCode = status => {
  fetch.mockImplementation({ status });
};

fetch.reset = () => {
  fetch.mockReset();
};
