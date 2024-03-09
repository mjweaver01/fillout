# Fillout Engineering Screen

## 💻 Dev server

```bash
## one-liner
nvm use && yarn && yarn dev
```

## 🟢 Live server

```bash
yarn start
```

## 🐋 Docker

```bash
# Build the image
yarn docker:build

# Run the image
yarn docker:compose
```

## Endpoints

### **Request:**

- Path: `/ping`
- Method: `GET`

### **Request:**

- Path: `/{formId}/filteredResponses`
- Method: `GET`
- Query parameters: same as our [responses endpoint](https://www.fillout.com/help/fillout-rest-api#d8b24260dddd4aaa955f85e54f4ddb4d), except for a new `filters` parameter (JSON stringified):
