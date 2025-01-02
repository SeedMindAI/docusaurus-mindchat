# Docusaurus AI assisstance
This is a simple AI assistance for Docusaurus generated documentation. It is a simple chatbot that can answer questions about your docs.

## Screenshots
![Screenshot](./assets/screenshots/demo.png)


## Architecture
![Architecture](./assets/architecture.png)

## Usage
Add @ahelmy/docusaurus-ai to `docusarus.config.js` plugins array.

```js
themes: [
    [
    "@ahelmy/docusaurus-ai", {
      chatUrl: "/api/predict",
    }
    ],
    ...
  ],
```