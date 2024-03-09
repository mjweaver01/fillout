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

```bash
# demo localhost request
curl http://localhost:3000/cLZojxk94ous/filteredResponses?filters=%5B%7B%22id%22:%22shortAnswer%22,%22condition%22:%22equals%22,%22value%22:%22Test%22%7D%5D
```

## Demo scenarios:

### One Filter; One Result

[1for1 Live Demo Link](https://fillout-mvoh.onrender.com/cLZojxk94ous/filteredResponses?filters=%5B%7B%22id%22:%22shortAnswer%22,%22condition%22:%22equals%22,%22value%22:%22Johnny%22%7D%5D)

#### Payload

```json
[
  {
    "id": "shortAnswer",
    "condition": "equals",
    "value": "Johnny"
  }
]
```

## Demo scenarios:

### Two Filters; One Result

[2for1 Live Demo Link](https://fillout-mvoh.onrender.com/cLZojxk94ous/filteredResponses?filters=%5B%7B%22id%22:%22shortAnswer%22,%22condition%22:%22equals%22,%22value%22:%22Johnny%22%7D%5D)

#### Payload

```json
[
  {
    "id": "shortAnswer",
    "condition": "equals",
    "value": "Test"
  },
  {
    "id": "DatePicker",
    "condition": "greater_than",
    "value": "2024-02-29"
  }
]
```

[Live Demo Link](https://fillout-mvoh.onrender.com/cLZojxk94ous/filteredResponses?filters=%5B%7B%22id%22%3A%22shortAnswer%22%2C%22condition%22%3A%22equals%22%2C%22value%22%3A%22Test%22%7D%2C%7B%22id%22%3A%22DatePicker%22%2C%22condition%22%3A%22greater_than%22%2C%22value%22%3A%222024-02-29%22%7D%5D)
