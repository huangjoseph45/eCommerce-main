const getCookie = (name) => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
};

const isLoggedIn = (retryInterval = 500, maxRetries = 10) => {
  return new Promise((resolve, reject) => {
    let retries = 0;
    const interval = setInterval(() => {
      const sessionId = getCookie("sessionId");
      if (sessionId !== null) {
        clearInterval(interval);
        resolve(true);
      } else if (retries >= maxRetries) {
        clearInterval(interval);
        resolve(false);
      }
      retries++;
    }, retryInterval);
  });
};

export default isLoggedIn;
