/**
 * DCCAI provider boundary. This code runs only on the server.
 * A production API adapter belongs here after its documented request/response
 * contract has been confirmed. Never expose DCCAI_API_KEY to the browser.
 */
export const createDccaiProvider = ({ apiUrl, apiKey } = {}) => {
  if (apiUrl || apiKey) {
    return {
      async reply() {
        throw new Error('DCCAI API adapter has not been configured from a confirmed API specification.');
      },
    };
  }

  return null;
};
