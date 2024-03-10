# Fillout Filtered Responses Microservice

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
# test localhost curl request
curl http://localhost:3000/cLZojxk94ous/filteredResponses?filters=%5B%7B%22id%22:%22ShortAnswer%22,%22condition%22:%22equals%22,%22value%22:%22Test%22%7D%5D
```

## 🧪 Demo scenarios:

### [One Filter; One Result](https://fillout-mvoh.onrender.com/cLZojxk94ous/filteredResponses?filters=[{"id":"ShortAnswer","condition":"equals","value":"Johnny"}])

```json
[
  {
    "id": "ShortAnswer",
    "condition": "equals",
    "value": "Johnny"
  }
]
```

### [Two Filters; Three Results](https://fillout-mvoh.onrender.com/cLZojxk94ous/filteredResponses?filters=[{"id":"DatePicker","condition":"less_than","value":"2024-03-01"},{"id":"DatePicker","condition":"greater_than","value":"2024-01-01"}])

```json
[
  {
    "id": "DatePicker",
    "condition": "less_than",
    "value": "2024-03-01"
  },
  {
    "id": "DatePicker",
    "condition": "greater_than",
    "value": "2024-01-01"
  }
]
```

### [Three Filters; Two Results](https://fillout-mvoh.onrender.com/cLZojxk94ous/filteredResponses?filters=[{"id":"DatePicker","condition":"less_than","value":"2024-03-01"},{"id":"DatePicker","condition":"greater_than","value":"2024-01-01"},{"id":"EmailInput","condition":"does_not_equal","value":"tom@fillout.com"}])

```json
[
  {
    "id": "DatePicker",
    "condition": "less_than",
    "value": "2024-03-01"
  },
  {
    "id": "DatePicker",
    "condition": "greater_than",
    "value": "2024-01-01"
  },
  {
    "id": "EmailInput",
    "condition": "does_not_equal",
    "value": "tom@fillout.com"
  }
]
```

## 🏌️ Notes

I spent way too much time golfing on this, but it was fun! ⛳
