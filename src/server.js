import app from './app.js'

const port = process.env.port || 8080;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});