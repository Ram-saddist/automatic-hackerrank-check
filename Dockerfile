FROM mcr.microsoft.com/playwright:v1.63.0-noble

WORKDIR /app

ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

COPY package*.json ./

RUN npm ci

RUN npx playwright install chromium

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]